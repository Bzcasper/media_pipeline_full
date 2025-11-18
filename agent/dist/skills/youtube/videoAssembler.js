"use strict";
/**
 * Video Assembler Skill
 * Combines video clips into a complete storyline with voiceover and music
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoAssemblerSkill = exports.VideoAssemblerOutput = exports.VideoAssemblerInput = void 0;
const zod_1 = require("zod");
const tools_1 = require("../../tools");
exports.VideoAssemblerInput = zod_1.z.object({
    videos: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        url: zod_1.z.string(),
        duration: zod_1.z.number()
    })),
    script: zod_1.z.string(),
    chunks: zod_1.z.array(zod_1.z.object({
        text: zod_1.z.string()
    })),
    voiceOver: zod_1.z.boolean().default(false),
    backgroundMusic: zod_1.z.boolean().default(false),
    transitions: zod_1.z.boolean().default(true)
});
exports.VideoAssemblerOutput = zod_1.z.object({
    videoUrl: zod_1.z.string(),
    videoFileId: zod_1.z.string(),
    duration: zod_1.z.number(),
    gcsUrl: zod_1.z.string().optional()
});
class VideoAssemblerSkill {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async run(input) {
        const validInput = exports.VideoAssemblerInput.parse(input);
        this.logger.info('Assembling final video', {
            clipCount: validInput.videos.length,
            voiceOver: validInput.voiceOver,
            backgroundMusic: validInput.backgroundMusic
        });
        // Step 1: Upload all video clips to media server
        const videoIds = await this.uploadVideoClips(validInput.videos);
        // Step 2: Generate voiceover if requested
        let voiceOverId;
        if (validInput.voiceOver) {
            voiceOverId = await this.generateVoiceOver(validInput.script);
        }
        // Step 3: Merge video clips
        const mergedVideoId = await this.mergeVideos(videoIds, voiceOverId, validInput.backgroundMusic, validInput.transitions);
        // Step 4: Upload to GCS
        const gcsUrl = await this.uploadToGCS(mergedVideoId);
        const totalDuration = validInput.videos.reduce((sum, v) => sum + v.duration, 0);
        const videoUrl = `${process.env.MEDIA_SERVER_URL}/api/v1/media/storage/${mergedVideoId}`;
        this.logger.success('Final video assembled', {
            videoUrl,
            duration: totalDuration
        });
        return {
            videoUrl,
            videoFileId: mergedVideoId,
            duration: totalDuration,
            gcsUrl
        };
    }
    async uploadVideoClips(videos) {
        this.logger.info('Uploading video clips to media server');
        const videoIds = [];
        for (const video of videos) {
            try {
                // Download video
                const response = await fetch(video.url);
                const buffer = Buffer.from(await response.arrayBuffer());
                // Upload to media server
                const uploadResult = await tools_1.mediaServer.uploadFile(buffer, 'video');
                if (!uploadResult.file_id) {
                    throw new Error(`Failed to upload video ${video.index}`);
                }
                videoIds.push(uploadResult.file_id);
                this.logger.info(`Uploaded video ${video.index + 1}/${videos.length}`);
            }
            catch (error) {
                this.logger.error(`Failed to upload video ${video.index}`, { error });
                throw error;
            }
        }
        return videoIds;
    }
    async generateVoiceOver(script) {
        this.logger.info('Generating voiceover');
        try {
            // Use Kokoro TTS for voiceover
            const result = await tools_1.mediaServer.generateTTS(script, 'af_heart', 1.0);
            if (!result.file_id) {
                throw new Error('Failed to generate voiceover');
            }
            this.logger.success('Voiceover generated');
            return result.file_id;
        }
        catch (error) {
            this.logger.warn('Voiceover generation failed', { error });
            throw error;
        }
    }
    async mergeVideos(videoIds, voiceOverId, backgroundMusic, transitions) {
        this.logger.info('Merging video clips');
        try {
            // Use media server video merge endpoint
            const mergeResult = await tools_1.mediaServer.client.video.merge({
                video_ids: videoIds.join(','),
                background_music_id: voiceOverId,
                normalize: true,
                background_music_volume: 0.8
            });
            if (!mergeResult.file_id) {
                throw new Error('Failed to merge videos');
            }
            this.logger.success('Videos merged successfully');
            return mergeResult.file_id;
        }
        catch (error) {
            this.logger.error('Video merging failed', { error });
            throw error;
        }
    }
    async uploadToGCS(videoFileId) {
        this.logger.info('Uploading final video to GCS');
        try {
            // Download video from media server
            const response = await tools_1.mediaServer.downloadFile(videoFileId);
            const buffer = Buffer.from(await response.arrayBuffer());
            // Upload to GCS
            const gcsResult = await tools_1.gcs.uploadFile(buffer, `youtube-video-${Date.now()}.mp4`, {
                contentType: 'video/mp4'
            });
            this.logger.success('Video uploaded to GCS', { url: gcsResult.signedUrl });
            return gcsResult.signedUrl;
        }
        catch (error) {
            this.logger.warn('GCS upload failed', { error });
            return '';
        }
    }
}
exports.VideoAssemblerSkill = VideoAssemblerSkill;
exports.default = VideoAssemblerSkill;
//# sourceMappingURL=videoAssembler.js.map