"use strict";
/**
 * Pipeline Orchestrator
 * Coordinates all skills to process music files end-to-end
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineOrchestrator = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("./utils");
const skills_1 = require("./skills");
class PipelineOrchestrator {
    jobState;
    logger;
    constructor(jobId) {
        const id = jobId || (0, uuid_1.v4)();
        this.jobState = new utils_1.JobStateManager(id);
        this.logger = new utils_1.Logger(id);
    }
    /**
     * Run the complete pipeline
     */
    async run(input) {
        const jobId = this.jobState.getJobId();
        this.logger.info('Starting pipeline orchestration', { jobId, input });
        try {
            // Update status
            this.jobState.updateStatus('processing');
            this.jobState.updateProgress(5);
            await this.jobState.save();
            // Step 1: Transcription
            this.logger.info('=== Step 1: Transcription ===');
            this.jobState.addStep('transcription', 'in_progress');
            this.jobState.updateStatus('transcribing');
            await this.jobState.save();
            const transcriptionSkill = new skills_1.TranscriptionSkill(this.logger);
            const transcriptionResult = await transcriptionSkill.runWithRetry({
                audioFileId: input.audioFileId,
                audioBuffer: input.audioBuffer,
                audioUrl: input.audioUrl
            });
            this.jobState.completeStep('transcription', transcriptionResult);
            this.jobState.addOutput('transcription', transcriptionResult);
            this.jobState.updateProgress(25);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 2: Metadata Extraction
            this.logger.info('=== Step 2: Metadata Extraction ===');
            this.jobState.addStep('metadata_extraction', 'in_progress');
            this.jobState.updateStatus('generating_metadata');
            await this.jobState.save();
            const metadataSkill = new skills_1.MetadataSkill(this.logger);
            const metadataResult = await metadataSkill.run({
                lyrics: transcriptionResult.text,
                audioMetadata: {
                    title: input.title,
                    artist: input.artist,
                    album: input.album
                }
            });
            this.jobState.completeStep('metadata_extraction', metadataResult);
            this.jobState.addOutput('metadata', metadataResult);
            this.jobState.updateProgress(40);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 3: Album Cover Generation
            this.logger.info('=== Step 3: Album Cover Generation ===');
            this.jobState.addStep('album_cover_generation', 'in_progress');
            this.jobState.updateStatus('generating_visuals');
            await this.jobState.save();
            const albumCoverSkill = new skills_1.AlbumCoverSkill(this.logger);
            const albumCoverResult = await albumCoverSkill.run({
                title: metadataResult.title || input.title || 'Untitled',
                artist: metadataResult.artist || input.artist,
                genre: metadataResult.genre,
                mood: metadataResult.mood,
                lyrics: transcriptionResult.text
            });
            this.jobState.completeStep('album_cover_generation', albumCoverResult);
            this.jobState.addOutput('albumCover', albumCoverResult);
            this.jobState.updateProgress(60);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 4: Video Generation
            this.logger.info('=== Step 4: Video Generation ===');
            this.jobState.addStep('video_generation', 'in_progress');
            this.jobState.updateStatus('creating_video');
            await this.jobState.save();
            const videoGeneratorSkill = new skills_1.VideoGeneratorSkill(this.logger);
            const videoResult = await videoGeneratorSkill.runWithRetry({
                audioFileId: input.audioFileId,
                coverImageFileId: albumCoverResult.imageFileId,
                title: metadataResult.title,
                artist: metadataResult.artist
            });
            this.jobState.completeStep('video_generation', videoResult);
            this.jobState.addOutput('video', videoResult);
            this.jobState.updateProgress(75);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 5: Upload to GCS
            this.logger.info('=== Step 5: GCS Upload ===');
            this.jobState.addStep('gcs_upload', 'in_progress');
            this.jobState.updateStatus('uploading_results');
            await this.jobState.save();
            const gcsUploadSkill = new skills_1.GCSUploadSkill(this.logger);
            const gcsResult = await gcsUploadSkill.run({
                jobId,
                files: {
                    cover: {
                        fileId: albumCoverResult.imageFileId,
                        name: 'cover.png'
                    },
                    video: {
                        fileId: videoResult.videoFileId,
                        name: 'video.mp4'
                    },
                    ...(input.audioFileId && {
                        audio: {
                            fileId: input.audioFileId,
                            name: 'audio.mp3'
                        }
                    })
                }
            });
            this.jobState.completeStep('gcs_upload', gcsResult);
            this.jobState.addOutput('gcsUrls', gcsResult.uploads);
            this.jobState.updateProgress(90);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 6: Index in Weaviate
            this.logger.info('=== Step 6: Weaviate Indexing ===');
            this.jobState.addStep('weaviate_indexing', 'in_progress');
            this.jobState.updateStatus('indexing');
            await this.jobState.save();
            const weaviateIndexerSkill = new skills_1.WeaviateIndexerSkill(this.logger);
            const weaviateResult = await weaviateIndexerSkill.run({
                id: jobId,
                title: metadataResult.title || input.title || 'Untitled',
                artist: metadataResult.artist || input.artist,
                album: metadataResult.album || input.album,
                genre: metadataResult.genre,
                mood: metadataResult.mood,
                lyrics: transcriptionResult.text,
                transcription: transcriptionResult.text,
                bpm: metadataResult.bpm,
                key: metadataResult.key,
                audioUrl: gcsResult.uploads.audio?.signedUrl,
                coverUrl: gcsResult.uploads.cover?.signedUrl,
                videoUrl: gcsResult.uploads.video?.signedUrl,
                metadata: {
                    ...metadataResult,
                    transcriptionMethod: transcriptionResult.method
                }
            });
            this.jobState.completeStep('weaviate_indexing', weaviateResult);
            this.jobState.addOutput('indexed', weaviateResult);
            this.jobState.updateProgress(100);
            this.jobState.updateStatus('completed');
            await this.jobState.save();
            await this.logger.saveLogs();
            this.logger.success('Pipeline completed successfully!', {
                jobId,
                videoUrl: gcsResult.uploads.video.signedUrl
            });
            return {
                jobId,
                transcription: transcriptionResult.text,
                metadata: metadataResult,
                coverImageUrl: gcsResult.uploads.cover.signedUrl,
                videoUrl: gcsResult.uploads.video.signedUrl,
                gcsUrls: Object.fromEntries(Object.entries(gcsResult.uploads).map(([k, v]) => [k, v.signedUrl])),
                success: true
            };
        }
        catch (error) {
            this.logger.error('Pipeline failed', {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            this.jobState.updateStatus('failed');
            this.jobState.addError(error instanceof Error ? error.message : String(error));
            await this.jobState.save();
            await this.logger.saveLogs();
            throw error;
        }
    }
    /**
     * Get current job state
     */
    getState() {
        return this.jobState.getState();
    }
    /**
     * Get job logs
     */
    getLogs() {
        return this.logger.getLogs();
    }
}
exports.PipelineOrchestrator = PipelineOrchestrator;
exports.default = PipelineOrchestrator;
//# sourceMappingURL=orchestrator.js.map