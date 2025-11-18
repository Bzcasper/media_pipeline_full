"use strict";
/**
 * Media Pipeline AI Agent - TypeScript Fixed
 * Simplified version with proper types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaPipelineAgent = exports.MediaPipelineInput = exports.MediaPipelineResult = void 0;
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
// Media pipeline input schema
exports.MediaPipelineInput = zod_1.z.object({
    audioFileId: zod_1.z.string().optional(),
    audioBuffer: zod_1.z.any().optional(),
    audioUrl: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
    artist: zod_1.z.string().optional(),
    album: zod_1.z.string().optional(),
    language: zod_1.z.string().optional(),
});
// Media Pipeline Agent using standard patterns
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
            const transcriptionSkill = new skills_1.TranscriptionSkill(this.logger);
            const transcriptionResult = await transcriptionSkill.run(input);
            processingSteps[0].status = "completed";
            processingSteps[0].output = transcriptionResult;
            finalResult.transcription = transcriptionResult;
            // Step 2: Metadata Extraction
            processingSteps.push({
                name: "metadata_extraction",
                status: "in_progress",
            });
            const metadataSkill = new skills_1.MetadataSkill(this.logger);
            const metadataResult = await metadataSkill.run({
                lyrics: finalResult.transcription.text,
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
            const albumCoverSkill = new skills_1.AlbumCoverSkill(this.logger);
            const coverResult = await albumCoverSkill.run({
                title: finalResult.metadata.title || input.title || "Untitled",
                artist: finalResult.metadata.artist || input.artist,
                genre: finalResult.metadata.genre,
                mood: finalResult.metadata.mood,
                lyrics: finalResult.transcription.text,
            });
            processingSteps[2].status = "completed";
            processingSteps[2].output = coverResult;
            finalResult.assets.coverImageUrl = coverResult.imageUrl;
            // Step 4: Video Generation
            processingSteps.push({
                name: "video_generation",
                status: "in_progress",
            });
            const videoSkill = new skills_1.VideoGeneratorSkill(this.logger);
            const videoResult = await videoSkill.run({
                audioFileId: input.audioFileId,
                coverImageFileId: coverResult.imageFileId,
                title: finalResult.metadata.title,
                artist: finalResult.metadata.artist,
            });
            processingSteps[3].status = "completed";
            processingSteps[3].output = videoResult;
            finalResult.assets.videoUrl = videoResult.videoUrl;
            // Step 5: GCS Upload
            processingSteps.push({
                name: "gcs_upload",
                status: "in_progress",
            });
            const gcsSkill = new skills_1.GCSUploadSkill(this.logger);
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
            const weaviateSkill = new skills_1.WeaviateIndexerSkill(this.logger);
            const weaviateResult = await weaviateSkill.run({
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
            });
            processingSteps[5].status = "completed";
            processingSteps[5].output = weaviateResult;
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
}
exports.MediaPipelineAgent = MediaPipelineAgent;
// Export the agent and utilities
exports.default = MediaPipelineAgent;
//# sourceMappingURL=ai-agent.js.map