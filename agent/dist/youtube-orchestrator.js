"use strict";
/**
 * YouTube Video Generation Orchestrator
 * Creates complete storyline videos from queries
 *
 * Pipeline:
 * 1. Query → Script Generation (LLM)
 * 2. Script → Chunking (sentence/scene based)
 * 3. Chunks → Image Prompts (LLM)
 * 4. Image Prompts → Image Generation (Modal)
 * 5. Images → AI Validation/Editing
 * 6. Images → Video Generation (Image-to-Video)
 * 7. Videos → Final Assembly (storyline)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeVideoOrchestrator = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("./utils");
const youtube_1 = require("./skills/youtube");
class YouTubeVideoOrchestrator {
    jobState;
    logger;
    constructor(jobId) {
        const id = jobId || (0, uuid_1.v4)();
        this.jobState = new utils_1.JobStateManager(id);
        this.logger = new utils_1.Logger(id);
    }
    /**
     * Run the complete YouTube video generation pipeline
     */
    async run(input) {
        const jobId = this.jobState.getJobId();
        this.logger.info('Starting YouTube video generation pipeline', { jobId, input });
        try {
            this.jobState.updateStatus('processing');
            this.jobState.updateProgress(5);
            await this.jobState.save();
            // Step 1: Generate Script
            this.logger.info('=== Step 1: Script Generation ===');
            this.jobState.addStep('script_generation', 'in_progress');
            await this.jobState.save();
            const scriptGenerator = new youtube_1.ScriptGeneratorSkill(this.logger);
            const scriptResult = await scriptGenerator.run({
                query: input.query,
                style: input.videoStyle || 'educational',
                targetDuration: input.duration || 60
            });
            this.jobState.completeStep('script_generation', scriptResult);
            this.jobState.addOutput('script', scriptResult);
            this.jobState.updateProgress(15);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 2: Chunk Script into Scenes
            this.logger.info('=== Step 2: Script Chunking ===');
            this.jobState.addStep('script_chunking', 'in_progress');
            await this.jobState.save();
            const scriptChunker = new youtube_1.ScriptChunkerSkill(this.logger);
            const chunks = await scriptChunker.run({
                script: scriptResult.script,
                targetScenes: scriptResult.suggestedSceneCount || 6,
                maxWordsPerScene: 50
            });
            this.jobState.completeStep('script_chunking', chunks);
            this.jobState.addOutput('chunks', chunks);
            this.jobState.updateProgress(25);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 3: Generate Image Prompts
            this.logger.info('=== Step 3: Image Prompt Generation ===');
            this.jobState.addStep('image_prompt_generation', 'in_progress');
            await this.jobState.save();
            const imagePromptGenerator = new youtube_1.ImagePromptGeneratorSkill(this.logger);
            const imagePrompts = await imagePromptGenerator.run({
                scenes: chunks.scenes,
                style: input.videoStyle || 'educational',
                aspectRatio: input.aspectRatio || '16:9'
            });
            this.jobState.completeStep('image_prompt_generation', imagePrompts);
            this.jobState.addOutput('imagePrompts', imagePrompts);
            this.jobState.updateProgress(35);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 4: Generate Images
            this.logger.info('=== Step 4: Image Generation ===');
            this.jobState.addStep('image_generation', 'in_progress');
            await this.jobState.save();
            const imageGenerator = new youtube_1.ImageGeneratorSkill(this.logger);
            const images = await imageGenerator.run({
                prompts: imagePrompts.prompts,
                aspectRatio: input.aspectRatio || '16:9',
                style: input.videoStyle || 'educational'
            });
            this.jobState.completeStep('image_generation', images);
            this.jobState.addOutput('images', images);
            this.jobState.updateProgress(50);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 5: Validate and Edit Images
            this.logger.info('=== Step 5: Image Validation ===');
            this.jobState.addStep('image_validation', 'in_progress');
            await this.jobState.save();
            const imageValidator = new youtube_1.ImageValidatorSkill(this.logger);
            const validatedImages = await imageValidator.run({
                images: images.images,
                prompts: imagePrompts.prompts,
                autoFix: true
            });
            this.jobState.completeStep('image_validation', validatedImages);
            this.jobState.addOutput('validatedImages', validatedImages);
            this.jobState.updateProgress(65);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 6: Generate Videos from Images
            this.logger.info('=== Step 6: Image-to-Video Generation ===');
            this.jobState.addStep('video_generation', 'in_progress');
            await this.jobState.save();
            const imageToVideo = new youtube_1.ImageToVideoSkill(this.logger);
            const videos = await imageToVideo.run({
                images: validatedImages.images,
                prompts: imagePrompts.prompts.map(p => p.videoMotion),
                duration: 5 // seconds per clip
            });
            this.jobState.completeStep('video_generation', videos);
            this.jobState.addOutput('videos', videos);
            this.jobState.updateProgress(80);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 7: Assemble Final Video
            this.logger.info('=== Step 7: Video Assembly ===');
            this.jobState.addStep('video_assembly', 'in_progress');
            await this.jobState.save();
            const videoAssembler = new youtube_1.VideoAssemblerSkill(this.logger);
            const finalVideo = await videoAssembler.run({
                videos: videos.videos,
                script: scriptResult.script,
                chunks: chunks.scenes,
                voiceOver: input.voiceOver,
                backgroundMusic: input.backgroundMusic,
                transitions: true
            });
            this.jobState.completeStep('video_assembly', finalVideo);
            this.jobState.addOutput('finalVideo', finalVideo);
            this.jobState.updateProgress(95);
            await this.jobState.save();
            await this.logger.saveLogs();
            // Step 8: Generate Metadata
            this.logger.info('=== Step 8: Metadata Generation ===');
            const metadata = await this.generateMetadata(scriptResult.script, input.query);
            this.jobState.updateProgress(100);
            this.jobState.updateStatus('completed');
            await this.jobState.save();
            await this.logger.saveLogs();
            this.logger.success('YouTube video generation completed!', {
                jobId,
                finalVideoUrl: finalVideo.videoUrl
            });
            // Prepare output
            const scenes = chunks.scenes.map((scene, idx) => ({
                text: scene.text,
                imagePrompt: imagePrompts.prompts[idx].prompt,
                imageUrl: validatedImages.images[idx].url,
                videoUrl: videos.videos[idx].url,
                duration: videos.videos[idx].duration
            }));
            return {
                jobId,
                script: scriptResult.script,
                scenes,
                finalVideoUrl: finalVideo.videoUrl,
                metadata,
                success: true
            };
        }
        catch (error) {
            this.logger.error('YouTube video generation failed', {
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
     * Generate video metadata for YouTube
     */
    async generateMetadata(script, query) {
        // In production, use LLM to generate optimized metadata
        const words = script.split(' ');
        const title = query.slice(0, 100);
        const description = words.slice(0, 50).join(' ') + '...';
        const tags = query.split(' ').filter(w => w.length > 3).slice(0, 10);
        return {
            title,
            description,
            tags,
            thumbnail: '' // Will be first scene image
        };
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
exports.YouTubeVideoOrchestrator = YouTubeVideoOrchestrator;
exports.default = YouTubeVideoOrchestrator;
//# sourceMappingURL=youtube-orchestrator.js.map