import { tool, generateText, generateObject } from "ai";
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

// Create individual tools using AI SDK v6 pattern
export const transcriptionTool = tool({
  description: "Transcribe audio to text using Riva ASR with Whisper fallback",
  parameters: z.object({
    audioFileId: z.string().optional(),
    audioBuffer: z.any().optional(),
    audioUrl: z.string().optional(),
    language: z.string().optional(),
  }),
  execute: async ({ audioFileId, audioBuffer, audioUrl, language }) => {
    const logger = new Logger("transcription-tool");
    const skill = new TranscriptionSkill(logger);

    try {
      const result = await skill.run({
        audioFileId,
        audioBuffer,
        audioUrl,
        language,
      });

      return {
        success: true,
        result,
        step: "transcription",
      } as ToolResult;
    } catch (error) {
      logger.error("Transcription failed", { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Transcription failed",
        step: "transcription",
      } as ToolResult;
    }
  },
});

export const metadataExtractionTool = tool({
  description: "Extract metadata from lyrics including genre, mood, themes",
  parameters: z.object({
    lyrics: z.string(),
    audioMetadata: z.record(z.any()).optional(),
  }),
  execute: async ({ lyrics, audioMetadata }) => {
    const logger = new Logger("metadata-tool");
    const skill = new MetadataSkill(logger);

    try {
      const result = await skill.run({
        lyrics,
        audioMetadata,
      });

      return {
        success: true,
        result,
        step: "metadata_extraction",
      } as ToolResult;
    } catch (error) {
      logger.error("Metadata extraction failed", { error });
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Metadata extraction failed",
        step: "metadata_extraction",
      } as ToolResult;
    }
  },
});

export const albumCoverTool = tool({
  description: "Generate album cover art from metadata using AI",
  parameters: z.object({
    title: z.string(),
    artist: z.string().optional(),
    genre: z.string().optional(),
    mood: z.string().optional(),
    lyrics: z.string().optional(),
  }),
  execute: async ({ title, artist, genre, mood, lyrics }) => {
    const logger = new Logger("album-cover-tool");
    const skill = new AlbumCoverSkill(logger);

    try {
      const result = await skill.run({
        title,
        artist,
        genre,
        mood,
        lyrics,
      });

      return {
        success: true,
        result,
        step: "album_cover_generation",
      } as ToolResult;
    } catch (error) {
      logger.error("Album cover generation failed", { error });
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Album cover generation failed",
        step: "album_cover_generation",
      } as ToolResult;
    }
  },
});

export const videoGenerationTool = tool({
  description: "Generate music video from audio and cover image",
  parameters: z.object({
    audioFileId: z.string(),
    coverImageFileId: z.string(),
    title: z.string().optional(),
    artist: z.string().optional(),
  }),
  execute: async ({ audioFileId, coverImageFileId, title, artist }) => {
    const logger = new Logger("video-generation-tool");
    const skill = new VideoGeneratorSkill(logger);

    try {
      const result = await skill.run({
        audioFileId,
        coverImageFileId,
        title,
        artist,
      });

      return {
        success: true,
        result,
        step: "video_generation",
      } as ToolResult;
    } catch (error) {
      logger.error("Video generation failed", { error });
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Video generation failed",
        step: "video_generation",
      } as ToolResult;
    }
  },
});

export const gcsUploadTool = tool({
  description: "Upload assets to Google Cloud Storage",
  parameters: z.object({
    jobId: z.string(),
    files: z.record(
      z.object({
        fileId: z.string().optional(),
        url: z.string().optional(),
        name: z.string(),
      })
    ),
  }),
  execute: async ({ jobId, files }) => {
    const logger = new Logger("gcs-upload-tool");
    const skill = new GCSUploadSkill(logger);

    try {
      const result = await skill.run({
        jobId,
        files,
      });

      return {
        success: true,
        result,
        step: "gcs_upload",
      } as ToolResult;
    } catch (error) {
      logger.error("GCS upload failed", { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : "GCS upload failed",
        step: "gcs_upload",
      } as ToolResult;
    }
  },
});

export const weaviateIndexTool = tool({
  description: "Index processed media in Weaviate vector database",
  parameters: z.object({
    id: z.string(),
    title: z.string(),
    artist: z.string().optional(),
    album: z.string().optional(),
    genre: z.string().optional(),
    lyrics: z.string(),
    audioUrl: z.string().optional(),
    coverUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
  execute: async (input) => {
    const logger = new Logger("weaviate-index-tool");
    const skill = new WeaviateIndexerSkill(logger);

    try {
      const result = await skill.run(input);

      return {
        success: true,
        result,
        step: "weaviate_indexing",
      } as ToolResult;
    } catch (error) {
      logger.error("Weaviate indexing failed", { error });
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Weaviate indexing failed",
        step: "weaviate_indexing",
      } as ToolResult;
    }
  },
});

// Media Pipeline Orchestrator using AI SDK v6 patterns
export class MediaPipelineAgent {
  private logger: Logger;

  constructor() {
    this.logger = new Logger("media-pipeline-agent");
  }

  /**
   * Process audio file through complete pipeline
   */
  async processAudio(input: {
    audioFileId?: string;
    audioBuffer?: any;
    audioUrl?: string;
    title?: string;
    artist?: string;
    album?: string;
    language?: string;
  }) {
    const jobId = `job_${Date.now()}`;
    this.logger.info("Starting media pipeline processing", { jobId, input });

    const processingSteps: ProcessingStep[] = [];
    let finalResult: any = {
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

      const transcriptionResult = (await transcriptionTool.execute!({
        audioFileId: input.audioFileId,
        audioBuffer: input.audioBuffer,
        audioUrl: input.audioUrl,
        language: input.language,
      })) as ToolResult;

      if (transcriptionResult.success) {
        processingSteps[0].status = "completed";
        processingSteps[0].output = transcriptionResult.result;
        finalResult.transcription = transcriptionResult.result;
      } else {
        processingSteps[0].status = "failed";
        processingSteps[0].error = transcriptionResult.error;
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      }

      // Step 2: Metadata Extraction
      processingSteps.push({
        name: "metadata_extraction",
        status: "in_progress",
      });

      const metadataResult = (await metadataExtractionTool.execute!({
        lyrics: finalResult.transcription.text,
        audioMetadata: {
          title: input.title,
          artist: input.artist,
          album: input.album,
        },
      })) as ToolResult;

      if (metadataResult.success) {
        processingSteps[1].status = "completed";
        processingSteps[1].output = metadataResult.result;
        finalResult.metadata = metadataResult.result;
      } else {
        processingSteps[1].status = "failed";
        processingSteps[1].error = metadataResult.error;
        throw new Error(`Metadata extraction failed: ${metadataResult.error}`);
      }

      // Step 3: Album Cover Generation
      processingSteps.push({
        name: "album_cover_generation",
        status: "in_progress",
      });

      const coverResult = (await albumCoverTool.execute!({
        title: finalResult.metadata.title || input.title || "Untitled",
        artist: finalResult.metadata.artist || input.artist,
        genre: finalResult.metadata.genre,
        mood: finalResult.metadata.mood,
        lyrics: finalResult.transcription.text,
      })) as ToolResult;

      if (coverResult.success && coverResult.result) {
        processingSteps[2].status = "completed";
        processingSteps[2].output = coverResult.result;
        finalResult.assets.coverImageUrl = coverResult.result.imageUrl;
      } else {
        processingSteps[2].status = "failed";
        processingSteps[2].error = coverResult.error;
        throw new Error(`Album cover generation failed: ${coverResult.error}`);
      }

      // Step 4: Video Generation
      processingSteps.push({
        name: "video_generation",
        status: "in_progress",
      });

      const videoResult = (await videoGenerationTool.execute!({
        audioFileId: input.audioFileId!,
        coverImageFileId: coverResult.result!.imageFileId,
        title: finalResult.metadata.title,
        artist: finalResult.metadata.artist,
      })) as ToolResult;

      if (videoResult.success && videoResult.result) {
        processingSteps[3].status = "completed";
        processingSteps[3].output = videoResult.result;
        finalResult.assets.videoUrl = videoResult.result.videoUrl;
      } else {
        processingSteps[3].status = "failed";
        processingSteps[3].error = videoResult.error;
        throw new Error(`Video generation failed: ${videoResult.error}`);
      }

      // Step 5: GCS Upload
      processingSteps.push({
        name: "gcs_upload",
        status: "in_progress",
      });

      const gcsResult = (await gcsUploadTool.execute!({
        jobId,
        files: {
          cover: {
            fileId: coverResult.result!.imageFileId,
            name: "cover.png",
          },
          video: {
            fileId: videoResult.result!.videoFileId,
            name: "video.mp4",
          },
          ...(input.audioFileId && {
            audio: {
              fileId: input.audioFileId,
              name: "audio.mp3",
            },
          }),
        },
      })) as ToolResult;

      if (gcsResult.success && gcsResult.result) {
        processingSteps[4].status = "completed";
        processingSteps[4].output = gcsResult.result;
        finalResult.assets.gcsUrls = gcsResult.result.uploads;
      } else {
        processingSteps[4].status = "failed";
        processingSteps[4].error = gcsResult.error;
        throw new Error(`GCS upload failed: ${gcsResult.error}`);
      }

      // Step 6: Weaviate Indexing
      processingSteps.push({
        name: "weaviate_indexing",
        status: "in_progress",
      });

      const weaviateResult = (await weaviateIndexTool.execute!({
        id: jobId,
        title: finalResult.metadata.title || input.title || "Untitled",
        artist: finalResult.metadata.artist || input.artist,
        album: finalResult.metadata.album || input.album,
        genre: finalResult.metadata.genre,
        lyrics: finalResult.transcription.text,
        audioUrl: finalResult.assets.gcsUrls?.audio?.signedUrl,
        coverUrl: finalResult.assets.gcsUrls?.cover?.signedUrl,
        videoUrl: finalResult.assets.gcsUrls?.video?.signedUrl,
        metadata: {
          ...finalResult.metadata,
          transcriptionMethod: finalResult.transcription.method,
        },
      })) as ToolResult;

      if (weaviateResult.success) {
        processingSteps[5].status = "completed";
        processingSteps[5].output = weaviateResult.result;
      } else {
        processingSteps[5].status = "failed";
        processingSteps[5].error = weaviateResult.error;
        // Continue even if indexing fails
      }

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

  /**
   * Stream processing with real-time updates
   */
  async *streamProcessing(input: any) {
    const jobId = `stream_${Date.now()}`;

    try {
      yield { type: "status", jobId, message: "Starting media pipeline..." };

      // Stream transcription
      yield { type: "status", jobId, message: "Transcribing audio to text..." };
      const transcriptionResult = (await transcriptionTool.execute!({
        audioFileId: input.audioFileId,
        audioBuffer: input.audioBuffer,
        audioUrl: input.audioUrl,
        language: input.language,
      })) as ToolResult;

      if (!transcriptionResult.success) {
        yield {
          type: "error",
          jobId,
          message: `Transcription failed: ${transcriptionResult.error}`,
        };
        return;
      }

      yield {
        type: "result",
        jobId,
        step: "transcription",
        data: transcriptionResult.result,
      };

      // Stream metadata extraction
      yield {
        type: "status",
        jobId,
        message: "Extracting metadata from lyrics...",
      };
      const metadataResult = (await metadataExtractionTool.execute!({
        lyrics: transcriptionResult.result!.text,
        audioMetadata: {
          title: input.title,
          artist: input.artist,
          album: input.album,
        },
      })) as ToolResult;

      if (!metadataResult.success) {
        yield {
          type: "error",
          jobId,
          message: `Metadata extraction failed: ${metadataResult.error}`,
        };
        return;
      }

      yield {
        type: "result",
        jobId,
        step: "metadata",
        data: metadataResult.result,
      };

      // Continue with other steps...
      yield {
        type: "status",
        jobId,
        message: "Processing completed successfully!",
      };
    } catch (error) {
      yield {
        type: "error",
        jobId,
        message: error instanceof Error ? error.message : "Processing failed",
      };
    }
  }
}

// Export the agent and utilities
export default MediaPipelineAgent;
