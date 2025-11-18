import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { mediaServer, PipelineOrchestrator } from "@trapgod/agent";

// Enhanced validation schema
const uploadSchema = z.object({
  file: z
    .custom<File>((file) => file instanceof File, "File must be a File object")
    .refine((file) => {
      const allowedTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/flac",
        "audio/mp4",
        "audio/ogg",
        "audio/m4a",
      ];
      return (
        allowedTypes.includes(file.type) ||
        file.name.match(/\.(mp3|wav|flac|m4a|ogg)$/i)
      );
    }, "Unsupported audio format. Please upload MP3, WAV, FLAC, M4A, or OGG files.")
    .refine(
      (file) => file.size <= 100 * 1024 * 1024,
      "File size must be less than 100MB"
    ),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  artist: z
    .string()
    .max(100, "Artist name must be less than 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  album: z
    .string()
    .max(100, "Album name must be less than 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

// Simple logger replacement for upload route
const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[UPLOAD] ${message}`, data || "");
    }
  },
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[UPLOAD] ${message}`, data || "");
    }
  },
  error: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.error(`[UPLOAD] ${message}`, data || "");
    }
  },
};

// Rate limiting (simple in-memory for demo)
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // Max 10 uploads per minute

  const record = rateLimiter.get(ip);

  if (!record || now > record.resetTime) {
    rateLimiter.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Request timeout wrapper
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let jobId: string | null = null;

  try {
    // Rate limiting
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(clientIP)) {
      logger.warn("Rate limit exceeded", { clientIP });
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: 60,
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(Date.now() / 1000 + 60).toString(),
          },
        }
      );
    }

    // Parse form data with timeout
    const formData = await withTimeout(request.formData(), 10000); // 10s timeout

    // Validate input data
    const inputData = {
      file: formData.get("file") as File | null,
      title: (formData.get("title") as string | null) || "",
      artist: (formData.get("artist") as string | null) || "",
      album: (formData.get("album") as string | null) || "",
    };

    // Enhanced validation
    const validatedData = uploadSchema.parse(inputData);

    // Generate job ID early for logging
    jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    logger.info("Upload request started", {
      jobId,
      clientIP,
      fileName: validatedData.file.name,
      fileSize: validatedData.file.size,
      fileType: validatedData.file.type,
      title: validatedData.title,
      artist: validatedData.artist,
      album: validatedData.album,
      duration: Date.now() - startTime,
    });

    // Upload to media server
    const buffer = Buffer.from(await validatedData.file.arrayBuffer());
    const uploadResult = await withTimeout(
      mediaServer.uploadFile(buffer, "audio"),
      30000 // 30s timeout for upload
    ) as { file_id: string; url?: string; size?: number };

    // Validate upload result
    if (!uploadResult.file_id) {
      logger.error("Media server upload failed", {
        jobId,
        error: "No file ID returned",
      });
      throw new Error("Failed to upload audio file to media server");
    }

    // Start pipeline orchestrator
    const orchestrator = new PipelineOrchestrator();
    const pipelineJobId = orchestrator.getJobId();

    // Run pipeline asynchronously
    orchestrator
      .run({
        audioFileId: uploadResult.file_id,
        title: validatedData.title,
        artist: validatedData.artist || undefined,
        album: validatedData.album || undefined,
      })
      .catch((error: any) => {
        logger.error(`Pipeline failed for job ${pipelineJobId}:`, error);
      });

    const pipelineResult = { jobId: pipelineJobId, status: "started" };

    logger.info("Pipeline started successfully", {
      jobId,
      pipelineJobId: pipelineResult.jobId,
      duration: Date.now() - startTime,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        jobId: pipelineResult.jobId,
        message: "Job started successfully",
        data: {
          fileName: validatedData.file.name,
          fileSize: validatedData.file.size,
          fileType: validatedData.file.type,
          uploadedUrl: uploadResult.url,
          title: validatedData.title,
          artist: validatedData.artist,
          album: validatedData.album,
        },
        metadata: {
          processingStarted: new Date().toISOString(),
          estimatedProcessingTime: "2-5 minutes",
          rateLimitInfo: {
            remaining: 9, // Mock remaining requests
            resetIn: 60,
          },
        },
      },
      {
        status: 201,
        headers: {
          "X-Request-ID": jobId,
          "X-Processing-Mode": "async",
        },
      }
    );
  } catch (error) {
    const duration = Date.now() - startTime;

    // Enhanced error classification and logging
    let errorType = "internal";
    let statusCode = 500;
    let errorMessage = "Upload failed";

    if (error instanceof z.ZodError) {
      errorType = "validation";
      statusCode = 400;
      errorMessage = error.errors.map((e) => e.message).join(", ");
      logger.warn("Validation error", {
        jobId,
        errors: error.errors,
        duration,
      });
    } else if (error instanceof Error) {
      if (error.message.includes("timed out")) {
        errorType = "timeout";
        statusCode = 408;
        errorMessage = "Request timed out. Please try again.";
      } else if (
        error.message.includes("required") ||
        error.message.includes("Unsupported")
      ) {
        errorType = "validation";
        statusCode = 400;
        errorMessage = error.message;
      } else if (error.message.includes("rate limit")) {
        errorType = "rate_limit";
        statusCode = 429;
        errorMessage = "Too many requests. Please slow down.";
      }

      logger.error("Upload route error", {
        jobId,
        errorType,
        errorMessage: error.message,
        stack: error.stack,
        duration,
        clientIP: request.headers.get("x-forwarded-for") || "unknown",
      });
    }

    // Enhanced error response
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        errorType,
        timestamp: new Date().toISOString(),
        requestId: jobId,
        duration,
        ...(process.env.NODE_ENV === "development" && {
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },
      {
        status: statusCode,
        headers: {
          "X-Error-Type": errorType,
          "X-Request-ID": jobId || "unknown",
          ...(statusCode === 429 && {
            "Retry-After": "60",
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
          }),
        },
      }
    );
  }
}


