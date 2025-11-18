/**
 * Transcription Skill
 * Handles audio transcription with Riva (primary) and Whisper (fallback)
 */

import { z } from "zod";
import { mediaServer, modal } from "../tools";
import { Logger } from "../utils";
import { env } from "../utils/env";

// Input/Output Schemas
export const TranscriptionInput = z
  .object({
    audioFileId: z.string().optional(),
    audioBuffer: z.any().optional(),
    audioUrl: z.string().optional(),
    language: z.string().optional(),
  })
  .refine(
    (data: any) => data.audioFileId || data.audioBuffer || data.audioUrl,
    { message: "One of audioFileId, audioBuffer, or audioUrl must be provided" }
  );

export const TranscriptionOutput = z.object({
  text: z.string(),
  segments: z
    .array(
      z.object({
        text: z.string(),
        start: z.number(),
        end: z.number(),
        confidence: z.number().optional(),
      })
    )
    .optional(),
  language: z.string().optional(),
  method: z.enum(["riva", "whisper"]),
  duration: z.number().optional(),
});

export type TranscriptionInputType = z.infer<typeof TranscriptionInput>;
export type TranscriptionOutputType = z.infer<typeof TranscriptionOutput>;

/**
 * Transcription Skill
 */
export class TranscriptionSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Run transcription with automatic fallback
   */
  async run(input: TranscriptionInputType): Promise<TranscriptionOutputType> {
    // Validate input
    const validInput = TranscriptionInput.parse(input);

    this.logger.info("Starting transcription", { input: validInput });

    try {
      // Try Riva first
      return await this.transcribeWithRiva(validInput);
    } catch (rivaError) {
      this.logger.warn("Riva transcription failed, falling back to Whisper", {
        error:
          rivaError instanceof Error ? rivaError.message : String(rivaError),
      });

      try {
        // Fallback to Whisper via Modal
        return await this.transcribeWithWhisper(validInput);
      } catch (whisperError) {
        this.logger.error("Both Riva and Whisper transcription failed", {
          rivaError:
            rivaError instanceof Error ? rivaError.message : String(rivaError),
          whisperError:
            whisperError instanceof Error
              ? whisperError.message
              : String(whisperError),
        });
        throw new Error(
          "Transcription failed: Both Riva and Whisper methods failed"
        );
      }
    }
  }

  /**
   * Transcribe using Riva ASR via Media Server
   */
  private async transcribeWithRiva(
    input: TranscriptionInputType
  ): Promise<TranscriptionOutputType> {
    this.logger.info("Attempting transcription with Riva ASR");

    let audioBuffer: any;

    // Get audio buffer
    if (input.audioBuffer) {
      audioBuffer = input.audioBuffer;
    } else if (input.audioFileId) {
      this.logger.info("Downloading audio file from media server");
      const response = await mediaServer.downloadFile(input.audioFileId);
      audioBuffer = Buffer.from(await response.arrayBuffer());
    } else if (input.audioUrl) {
      this.logger.info("Downloading audio from URL");
      const response = await fetch(input.audioUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch audio from URL: ${response.statusText}`
        );
      }
      audioBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      throw new Error("No audio source provided");
    }

    // Call Riva transcription
    const result = await mediaServer.transcribeAudio(
      audioBuffer,
      input.language
    );

    // Check for failure indicators
    if (!result || !result.text || result.text.trim() === "") {
      throw new Error("Riva returned empty transcription");
    }

    if (
      (result as any).error ||
      (result.text && result.text.toLowerCase().includes("riva failed"))
    ) {
      throw new Error("Riva transcription failed");
    }

    this.logger.success("Riva transcription completed", {
      textLength: result.text.length,
      segmentCount: result.segments?.length || 0,
    });

    return {
      text: result.text,
      segments: result.segments,
      language: result.language || input.language,
      method: "riva",
    };
  }

  /**
   * Transcribe using Whisper via Modal
   */
  private async transcribeWithWhisper(
    input: TranscriptionInputType
  ): Promise<TranscriptionOutputType> {
    this.logger.info("Attempting transcription with Whisper (Modal)");

    let audioUrl: string;

    // Get audio URL (upload if needed)
    if (input.audioUrl) {
      audioUrl = input.audioUrl;
    } else if (input.audioFileId) {
      // Use media server URL
      audioUrl = `${env.MEDIA_SERVER_URL}/api/v1/media/storage/${input.audioFileId}`;
    } else if (input.audioBuffer) {
      // Upload to media server first
      this.logger.info(
        "Uploading audio to media server for Whisper processing"
      );
      const uploadResult = await mediaServer.uploadFile(
        input.audioBuffer,
        "audio"
      );
      audioUrl = `${env.MEDIA_SERVER_URL}/api/v1/media/storage/${uploadResult.file_id}`;
    } else {
      throw new Error("No audio source provided");
    }

    // Run Whisper transcription via Modal
    const result = await modal.runAndWait("whisper", {
      audioUrl,
      model: "large-v3",
      language: input.language,
    });

    if (!result || !result.text) {
      throw new Error("Whisper returned empty result");
    }

    this.logger.success("Whisper transcription completed", {
      textLength: result.text.length,
      segmentCount: result.segments?.length || 0,
    });

    return {
      text: result.text,
      segments: result.segments,
      language: result.language || input.language,
      method: "whisper",
      duration: result.duration,
    };
  }

  /**
   * Retry wrapper
   */
  async runWithRetry(
    input: TranscriptionInputType,
    maxAttempts: number = 2
  ): Promise<TranscriptionOutputType> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.info(`Transcription attempt ${attempt}/${maxAttempts}`);
        return await this.run(input);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.warn(`Transcription attempt ${attempt} failed`, {
          error: lastError.message,
        });

        if (attempt < maxAttempts) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          this.logger.info(`Retrying in ${delay}ms...`);
          await new Promise((resolve: any) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error("Transcription failed after all retries");
  }
}

export default TranscriptionSkill;
