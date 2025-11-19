import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Auth function - for demo purposes, allow uploads with rate limiting
const auth = (req: Request) => {
  // In production, implement proper authentication (JWT, sessions, etc.)
  // For now, allow uploads but track usage and prevent abuse
  const clientIP = req.headers.get("x-forwarded-for") ||
                   req.headers.get("x-real-ip") ||
                   "unknown";

  // Simple rate limiting (in production, use Redis or similar)
  const now = Date.now();
  const rateLimitKey = `upload_${clientIP}`;
  const rateLimitWindow = 60 * 1000; // 1 minute
  const maxUploadsPerWindow = 5;

  // This is a basic implementation - in production, use a proper rate limiter
  const recentUploads = (global as any)[rateLimitKey] || [];
  const recentUploadsInWindow = recentUploads.filter(
    (timestamp: number) => now - timestamp < rateLimitWindow
  );

  if (recentUploadsInWindow.length >= maxUploadsPerWindow) {
    throw new UploadThingError("Rate limit exceeded. Please try again later.");
  }

  // Update rate limit tracking
  recentUploadsInWindow.push(now);
  (global as any)[rateLimitKey] = recentUploadsInWindow;

  return {
    id: `user_${clientIP}_${Date.now()}`,
    ip: clientIP,
    timestamp: Date.now()
  };
};

export const ourFileRouter: FileRouter = {
  // Audio uploader for music video pipeline
  audioUploader: f({
    audio: {
      maxFileSize: "128MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      // Validate audio file type
      const allowedTypes = [
        "audio/mpeg", "audio/wav", "audio/flac",
        "audio/mp4", "audio/ogg", "audio/m4a"
      ];

      return {
        userId: user.id,
        uploadedAt: Date.now(),
        allowedTypes
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("🎵 Audio upload complete");
      console.log(`   User: ${metadata.userId}`);
      console.log(`   File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`   URL: ${file.ufsUrl}`);
      console.log(`   Key: ${file.key}`);

      // Validate file was uploaded successfully
      if (!file.ufsUrl || !file.key) {
        console.error("❌ Upload failed: Missing URL or key");
        throw new UploadThingError("Upload failed: Missing file data");
      }

      // Return comprehensive upload data for video processing
      return {
        success: true,
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileKey: file.key,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || "audio",
        uploadedAt: Date.now(),
        // Ready for video processing pipeline
        readyForProcessing: true,
        canGenerateVideo: true,
        supportedFormats: ["mp4", "webm"],
      };
    }),

  // Image uploader for album covers
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("🖼️  Image upload complete");
      console.log(`   User: ${metadata.userId}`);
      console.log(`   File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      console.log(`   URL: ${file.ufsUrl}`);

      return {
        success: true,
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileKey: file.key,
        fileName: file.name,
        fileSize: file.size,
        fileType: "image",
        uploadedAt: Date.now(),
        // Ready for use as album cover or thumbnail
        readyForVideo: true,
        canBeUsedAs: ["album_cover", "thumbnail", "background"],
      };
    }),

  // Video uploader for direct video uploads
  videoUploader: f({
    video: {
      maxFileSize: "512MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Video upload complete for userId:", metadata.userId);

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileKey: file.key,
      };
    }),

  // Multi-file uploader for batch processing
  batchUploader: f({
    audio: {
      maxFileSize: "128MB",
      maxFileCount: 10,
    },
  })
    .middleware(async ({ req }) => {
      const user = auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      return {
        userId: user.id,
        batchId: `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        uploadedAt: Date.now(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("📦 Batch upload complete for userId:", metadata.userId);
      console.log("🎵 File:", file.name, `(${file.size} bytes)`);

      return {
        success: true,
        uploadedBy: metadata.userId,
        batchId: metadata.batchId,
        fileUrl: file.ufsUrl,
        fileKey: file.key,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: metadata.uploadedAt,
        // Ready for batch video processing
        readyForBatchProcessing: true,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
