"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaPipelineAgent = exports.weaviateIndexTool = exports.gcsUploadTool = exports.videoGenerationTool = exports.albumCoverTool = exports.metadataExtractionTool = exports.transcriptionTool = exports.MediaPipelineResult = void 0;
const ai_1 = require("ai");
const zod_1 = require("zod");
// Import existing skills and tools
const skills_1 = require("./skills");
const utils_1 = require("./utils");
// Define structured output schema
exports.MediaPipelineResult = zod_1.z.object({
    success: zod_1.z.boolean(),
    jobId: zod_1.z.string(),
    transcription: zod_1.z
        .object({
        text: zod_1.z.string(),
        language: zod_1.z.string().optional(),
        method: zod_1.z.enum(["riva", "whisper"]),
        segments: zod_1.z
            .array(zod_1.z.object({
            text: zod_1.z.string(),
            start: zod_1.z.number(),
            end: zod_1.z.number(),
            confidence: zod_1.z.number().optional(),
        }))
            .optional(),
    })
        .optional(),
    metadata: zod_1.z
        .object({
        title: zod_1.z.string().optional(),
        artist: zod_1.z.string().optional(),
        album: zod_1.z.string().optional(),
        genre: zod_1.z.string().optional(),
        mood: zod_1.z.string().optional(),
        themes: zod_1.z.array(zod_1.z.string()).optional(),
        bpm: zod_1.z.number().optional(),
        key: zod_1.z.string().optional(),
    })
        .optional(),
    assets: zod_1.z
        .object({
        coverImageUrl: zod_1.z.string().optional(),
        videoUrl: zod_1.z.string().optional(),
        gcsUrls: zod_1.z.record(zod_1.z.string()).optional(),
    })
        .optional(),
    processingSteps: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        status: zod_1.z.enum(["pending", "in_progress", "completed", "failed"]),
        output: zod_1.z.any().optional(),
        error: zod_1.z.string().optional(),
    })),
    totalDuration: zod_1.z.number().optional(),
});
// Create individual tools using AI SDK v6 pattern
exports.transcriptionTool = (0, ai_1.tool)({
    description: "Transcribe audio to text using Riva ASR with Whisper fallback",
    parameters: zod_1.z.object({
        audioFileId: zod_1.z.string().optional(),
        audioBuffer: zod_1.z.any().optional(),
        audioUrl: zod_1.z.string().optional(),
        language: zod_1.z.string().optional(),
    }),
    execute: async ({ audioFileId, audioBuffer, audioUrl, language }) => {
        const logger = new utils_1.Logger("transcription-tool");
        const skill = new skills_1.TranscriptionSkill(logger);
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
            };
        }
        catch (error) {
            logger.error("Transcription failed", { error });
            return {
                success: false,
                error: error instanceof Error ? error.message : "Transcription failed",
                step: "transcription",
            };
        }
    },
});
exports.metadataExtractionTool = (0, ai_1.tool)({
    description: "Extract metadata from lyrics including genre, mood, themes",
    parameters: zod_1.z.object({
        lyrics: zod_1.z.string(),
        audioMetadata: zod_1.z.record(zod_1.z.any()).optional(),
    }),
    execute: async ({ lyrics, audioMetadata }) => {
        const logger = new utils_1.Logger("metadata-tool");
        const skill = new skills_1.MetadataSkill(logger);
        try {
            const result = await skill.run({
                lyrics,
                audioMetadata,
            });
            return {
                success: true,
                result,
                step: "metadata_extraction",
            };
        }
        catch (error) {
            logger.error("Metadata extraction failed", { error });
            return {
                success: false,
                error: error instanceof Error ? error.message : "Metadata extraction failed",
                step: "metadata_extraction",
            };
        }
    },
});
exports.albumCoverTool = (0, ai_1.tool)({
    description: "Generate album cover art from metadata using AI",
    parameters: zod_1.z.object({
        title: zod_1.z.string(),
        artist: zod_1.z.string().optional(),
        genre: zod_1.z.string().optional(),
        mood: zod_1.z.string().optional(),
        lyrics: zod_1.z.string().optional(),
    }),
    execute: async ({ title, artist, genre, mood, lyrics }) => {
        const logger = new utils_1.Logger("album-cover-tool");
        const skill = new skills_1.AlbumCoverSkill(logger);
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
            };
        }
        catch (error) {
            logger.error("Album cover generation failed", { error });
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Album cover generation failed",
                step: "album_cover_generation",
            };
        }
    },
});
exports.videoGenerationTool = (0, ai_1.tool)({
    description: "Generate music video from audio and cover image",
    parameters: zod_1.z.object({
        audioFileId: zod_1.z.string(),
        coverImageFileId: zod_1.z.string(),
        title: zod_1.z.string().optional(),
        artist: zod_1.z.string().optional(),
    }),
    execute: async ({ audioFileId, coverImageFileId, title, artist }) => {
        const logger = new utils_1.Logger("video-generation-tool");
        const skill = new skills_1.VideoGeneratorSkill(logger);
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
            };
        }
        catch (error) {
            logger.error("Video generation failed", { error });
            return {
                success: false,
                error: error instanceof Error ? error.message : "Video generation failed",
                step: "video_generation",
            };
        }
    },
});
exports.gcsUploadTool = (0, ai_1.tool)({
    description: "Upload assets to Google Cloud Storage",
    parameters: zod_1.z.object({
        jobId: zod_1.z.string(),
        files: zod_1.z.record(zod_1.z.object({
            fileId: zod_1.z.string().optional(),
            url: zod_1.z.string().optional(),
            name: zod_1.z.string(),
        })),
    }),
    execute: async ({ jobId, files }) => {
        const logger = new utils_1.Logger("gcs-upload-tool");
        const skill = new skills_1.GCSUploadSkill(logger);
        try {
            const result = await skill.run({
                jobId,
                files,
            });
            return {
                success: true,
                result,
                step: "gcs_upload",
            };
        }
        catch (error) {
            logger.error("GCS upload failed", { error });
            return {
                success: false,
                error: error instanceof Error ? error.message : "GCS upload failed",
                step: "gcs_upload",
            };
        }
    },
});
exports.weaviateIndexTool = (0, ai_1.tool)({
    description: "Index processed media in Weaviate vector database",
    parameters: zod_1.z.object({
        id: zod_1.z.string(),
        title: zod_1.z.string(),
        artist: zod_1.z.string().optional(),
        album: zod_1.z.string().optional(),
        genre: zod_1.z.string().optional(),
        lyrics: zod_1.z.string(),
        audioUrl: zod_1.z.string().optional(),
        coverUrl: zod_1.z.string().optional(),
        videoUrl: zod_1.z.string().optional(),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    }),
    execute: async (input) => {
        const logger = new utils_1.Logger("weaviate-index-tool");
        const skill = new skills_1.WeaviateIndexerSkill(logger);
        try {
            const result = await skill.run(input);
            return {
                success: true,
                result,
                step: "weaviate_indexing",
            };
        }
        catch (error) {
            logger.error("Weaviate indexing failed", { error });
            return {
                success: false,
                error: error instanceof Error ? error.message : "Weaviate indexing failed",
                step: "weaviate_indexing",
            };
        }
    },
});
// Media Pipeline Orchestrator using AI SDK v6 patterns
class MediaPipelineAgent {
    logger;
    constructor() {
        this.logger = new utils_1.Logger("media-pipeline-agent");
    }
    /**
     * Process audio file through complete pipeline
     */
    async processAudio(input) {
        const jobId = `job_${Date.now()}`;
        this.logger.info("Starting media pipeline processing", { jobId, input });
        const processingSteps = [];
        let finalResult = {
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
            const transcriptionResult = (await exports.transcriptionTool.execute({
                audioFileId: input.audioFileId,
                audioBuffer: input.audioBuffer,
                audioUrl: input.audioUrl,
                language: input.language,
            }));
            if (transcriptionResult.success) {
                processingSteps[0].status = "completed";
                processingSteps[0].output = transcriptionResult.result;
                finalResult.transcription = transcriptionResult.result;
            }
            else {
                processingSteps[0].status = "failed";
                processingSteps[0].error = transcriptionResult.error;
                throw new Error(`Transcription failed: ${transcriptionResult.error}`);
            }
            // Step 2: Metadata Extraction
            processingSteps.push({
                name: "metadata_extraction",
                status: "in_progress",
            });
            const metadataResult = (await exports.metadataExtractionTool.execute({
                lyrics: finalResult.transcription.text,
                audioMetadata: {
                    title: input.title,
                    artist: input.artist,
                    album: input.album,
                },
            }));
            if (metadataResult.success) {
                processingSteps[1].status = "completed";
                processingSteps[1].output = metadataResult.result;
                finalResult.metadata = metadataResult.result;
            }
            else {
                processingSteps[1].status = "failed";
                processingSteps[1].error = metadataResult.error;
                throw new Error(`Metadata extraction failed: ${metadataResult.error}`);
            }
            // Step 3: Album Cover Generation
            processingSteps.push({
                name: "album_cover_generation",
                status: "in_progress",
            });
            const coverResult = (await exports.albumCoverTool.execute({
                title: finalResult.metadata.title || input.title || "Untitled",
                artist: finalResult.metadata.artist || input.artist,
                genre: finalResult.metadata.genre,
                mood: finalResult.metadata.mood,
                lyrics: finalResult.transcription.text,
            }));
            if (coverResult.success && coverResult.result) {
                processingSteps[2].status = "completed";
                processingSteps[2].output = coverResult.result;
                finalResult.assets.coverImageUrl = coverResult.result.imageUrl;
            }
            else {
                processingSteps[2].status = "failed";
                processingSteps[2].error = coverResult.error;
                throw new Error(`Album cover generation failed: ${coverResult.error}`);
            }
            // Step 4: Video Generation
            processingSteps.push({
                name: "video_generation",
                status: "in_progress",
            });
            const videoResult = (await exports.videoGenerationTool.execute({
                audioFileId: input.audioFileId,
                coverImageFileId: coverResult.result.imageFileId,
                title: finalResult.metadata.title,
                artist: finalResult.metadata.artist,
            }));
            if (videoResult.success && videoResult.result) {
                processingSteps[3].status = "completed";
                processingSteps[3].output = videoResult.result;
                finalResult.assets.videoUrl = videoResult.result.videoUrl;
            }
            else {
                processingSteps[3].status = "failed";
                processingSteps[3].error = videoResult.error;
                throw new Error(`Video generation failed: ${videoResult.error}`);
            }
            // Step 5: GCS Upload
            processingSteps.push({
                name: "gcs_upload",
                status: "in_progress",
            });
            const gcsResult = (await exports.gcsUploadTool.execute({
                jobId,
                files: {
                    cover: {
                        fileId: coverResult.result.imageFileId,
                        name: "cover.png",
                    },
                    video: {
                        fileId: videoResult.result.videoFileId,
                        name: "video.mp4",
                    },
                    ...(input.audioFileId && {
                        audio: {
                            fileId: input.audioFileId,
                            name: "audio.mp3",
                        },
                    }),
                },
            }));
            if (gcsResult.success && gcsResult.result) {
                processingSteps[4].status = "completed";
                processingSteps[4].output = gcsResult.result;
                finalResult.assets.gcsUrls = gcsResult.result.uploads;
            }
            else {
                processingSteps[4].status = "failed";
                processingSteps[4].error = gcsResult.error;
                throw new Error(`GCS upload failed: ${gcsResult.error}`);
            }
            // Step 6: Weaviate Indexing
            processingSteps.push({
                name: "weaviate_indexing",
                status: "in_progress",
            });
            const weaviateResult = (await exports.weaviateIndexTool.execute({
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
            }));
            if (weaviateResult.success) {
                processingSteps[5].status = "completed";
                processingSteps[5].output = weaviateResult.result;
            }
            else {
                processingSteps[5].status = "failed";
                processingSteps[5].error = weaviateResult.error;
                // Continue even if indexing fails
            }
            finalResult.success = true;
            this.logger.success("Media pipeline completed successfully", { jobId });
            return finalResult;
        }
        catch (error) {
            this.logger.error("Media pipeline failed", { jobId, error });
            finalResult.success = false;
            // Mark current step as failed
            const currentStep = processingSteps.find((step) => step.status === "in_progress");
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
    async *streamProcessing(input) {
        const jobId = `stream_${Date.now()}`;
        try {
            yield { type: "status", jobId, message: "Starting media pipeline..." };
            // Stream transcription
            yield { type: "status", jobId, message: "Transcribing audio to text..." };
            const transcriptionResult = (await exports.transcriptionTool.execute({
                audioFileId: input.audioFileId,
                audioBuffer: input.audioBuffer,
                audioUrl: input.audioUrl,
                language: input.language,
            }));
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
            const metadataResult = (await exports.metadataExtractionTool.execute({
                lyrics: transcriptionResult.result.text,
                audioMetadata: {
                    title: input.title,
                    artist: input.artist,
                    album: input.album,
                },
            }));
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
        }
        catch (error) {
            yield {
                type: "error",
                jobId,
                message: error instanceof Error ? error.message : "Processing failed",
            };
        }
    }
}
exports.MediaPipelineAgent = MediaPipelineAgent;
// Export the agent and utilities
exports.default = MediaPipelineAgent;
//# sourceMappingURL=ai-agent-backup.js.map