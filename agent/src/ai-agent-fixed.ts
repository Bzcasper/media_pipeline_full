/**
 * Media Pipeline AI Agent - TypeScript Fixed
 * Simplified version with proper types
 */

import { z } from "zod";

// Import existing skills and tools
import {
  TranscriptionSkill,
  MetadataSkill,
  AlbumCoverSkill,
  VideoGeneratorSkill,
  GCSUploadSkill,
  WeaviateIndexerSkill,
} from "./skills";
import { Logger } from "./utils";
import { env } from "./utils/env";

// Define structured output schema
export const MediaPipelineResult = z.object({
  success: z.boolean(),
  jobId: z.string(),
  transcription: z
    .object({
      text: z.string(),
      language: z.string().optional(),
      method: z.enum(["riva", "whisper"]),
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
    })
    .optional(),
  metadata: z
    .object({
      title: z.string().optional(),
      artist: z.string().optional(),
      album: z.string().optional(),
      genre: z.string().optional(),
      mood: z.string().optional(),
      themes: z.array(z.string()).optional(),
      bpm: z.number().optional(),
      key: z.string().optional(),
    })
    .optional(),
  assets: z
    .object({
      coverImageUrl: z.string().optional(),
      videoUrl: z.string().optional(),
      gcsUrls: z.record(z.string()).optional(),
    })
    .optional(),
  processingSteps: z.array(
    z.object({
      name: z.string(),
      status: z.enum(["pending", "in_progress", "completed", "failed"]),
      output: z.any().optional(),
      error: z.string().optional(),
    })
  ),
  totalDuration: z.number().optional(),
});

// Processing step interface
interface ProcessingStep {
  name: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  output?: any;
  error?: string;
}

// Tool result interface
interface ToolResult {
  success: boolean;
  result?: any;
  error?: string;
  step: string;
}

// Media pipeline input schema
export const MediaPipelineInput = z.object({
  audioFileId: z.string().optional(),
  audioBuffer: z.any().optional(),
  audioUrl: z.string().optional(),
  title: z.string().optional(),
  artist: z.string().optional(),
  album: z.string().optional(),
  language: z.string().optional(),
});

// Media Pipeline Agent using standard patterns
export class MediaPipelineAgent {
  private logger: Logger;

  constructor() {
    this.logger = new Logger("media-pipeline-agent");
  }

  /**
   * Process audio file through complete pipeline
   */
  async processAudio(
    input: z.infer<typeof MediaPipelineInput>
  ): Promise<z.infer<typeof MediaPipelineResult>> {
    const jobId = `job_${Date.now()}`;
    this.logger.info("Starting media pipeline processing", { jobId, input });

    const processingSteps: ProcessingStep[] = [];
    let finalResult: z.infer<typeof MediaPipelineResult> = {
      success: false,
      jobId,
      processingSteps,
      transcription: null,
      metadata: null,
      assets: {},
    };

    try {
      // Step 1: Transcription
      processingSteps.push({
        name: "transcription",
        status: "in_progress",
      });

      const transcriptionSkill = new TranscriptionSkill(this.logger);
      const transcriptionResult = await transcriptionSkill.run(input);

      processingSteps[0].status = "completed";
      processingSteps[0].output = transcriptionResult;
      finalResult.transcription = transcriptionResult;

      // Step 2: Metadata Extraction
      processingSteps.push({
        name: "metadata_extraction",
        status: "in_progress",
      });

      const metadataSkill = new MetadataSkill(this.logger);
      const metadataResult = await metadataSkill.run({
        lyrics: finalResult.transcription!.text,
        audioMetadata: {
          title: input.title,
          artist: input.artist,
          album: input.album,
        },
      });

      processingSteps[1].status = "completed";
      processingSteps[1].output = metadataResult;
      finalResult.metadata = metadataResult;

      // Step 3: Album Cover Generation
      processingSteps.push({
        name: "album_cover_generation",
        status: "in_progress",
      });

      const albumCoverSkill = new AlbumCoverSkill(this.logger);
      const coverResult = await albumCoverSkill.run({
        title: finalResult.metadata!.title || input.title || "Untitled",
        artist: finalResult.metadata!.artist || input.artist,
        genre: finalResult.metadata!.genre,
        mood: finalResult.metadata!.mood,
        lyrics: finalResult.transcription!.text,
      });

      processingSteps[2].status = "completed";
      processingSteps[2].output = coverResult;
      finalResult.assets.coverImageUrl = coverResult.imageUrl;

      // Step 4: Video Generation
      processingSteps.push({
        name: "video_generation",
        status: "in_progress",
      });

      const videoSkill = new VideoGeneratorSkill(this.logger);
      const videoResult = await videoSkill.run({
        audioFileId: input.audioFileId!,
        coverImageFileId: coverResult.imageFileId,
        title: finalResult.metadata!.title,
        artist: finalResult.metadata!.artist,
      });

      processingSteps[3].status = "completed";
      processingSteps[3].output = videoResult;
      finalResult.assets.videoUrl = videoResult.videoUrl;

      // Step 5: GCS Upload
      processingSteps.push({
        name: "gcs_upload",
        status: "in_progress",
      });

      const gcsSkill = new GCSUploadSkill(this.logger);
      const gcsResult = await gcsSkill.run({
        jobId,
        files: {
          cover: {
            fileId: coverResult.imageFileId,
            name: "cover.png",
          },
          video: {
            fileId: videoResult.videoFileId,
            name: "video.mp4",
          },
          ...(input.audioFileId && {
            audio: {
              fileId: input.audioFileId,
              name: "audio.mp3",
            },
          }),
        },
      });

      processingSteps[4].status = "completed";
      processingSteps[4].output = gcsResult;
      finalResult.assets.gcsUrls = gcsResult.uploads;

      // Step 6: Weaviate Indexing
      processingSteps.push({
        name: "weaviate_indexing",
        status: "in_progress",
      });

      const weaviateSkill = new WeaviateIndexerSkill(this.logger);
      const weaviateResult = await weaviateSkill.run({
        id: jobId,
        title: finalResult.metadata!.title || input.title || "Untitled",
        artist: finalResult.metadata!.artist || input.artist,
        album: finalResult.metadata!.album || input.album,
        genre: finalResult.metadata!.genre,
        lyrics: finalResult.transcription!.text,
        audioUrl: finalResult.assets.gcsUrls?.audio?.signedUrl,
        coverUrl: finalResult.assets.gcsUrls?.cover?.signedUrl,
        videoUrl: finalResult.assets.gcsUrls?.video?.signedUrl,
        metadata: {
          ...finalResult.metadata,
          transcriptionMethod: finalResult.transcription!.method,
        },
      });

      processingSteps[5].status = "completed";
      processingSteps[5].output = weaviateResult;

      finalResult.success = true;
      this.logger.success("Media pipeline completed successfully", { jobId });

      return finalResult;
    } catch (error) {
      this.logger.error("Media pipeline failed", { jobId, error });
      finalResult.success = false;

      // Mark current step as failed
      const currentStep = processingSteps.find(
        (step) => step.status === "in_progress"
      );
      if (currentStep) {
        currentStep.status = "failed";
        currentStep.error =
          error instanceof Error ? error.message : "Unknown error";
      }

      throw error;
    }
  }
}

// Export the agent and utilities
export default MediaPipelineAgent;
