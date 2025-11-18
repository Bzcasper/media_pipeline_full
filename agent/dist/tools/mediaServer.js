"use strict";
/**
 * Media Server Tool
 * Wraps the Media Server SDK for use in agent skills
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaServer = void 0;
const media_sdk_1 = require("@trapgod/media-sdk");
// Create singleton instance
const client = new media_sdk_1.MediaServerClient({
    baseUrl: process.env.MEDIA_SERVER_URL || 'https://2281a5a294754c19f8c9e2df0be013fb-bobby-casper-4235.aiagentsaz.com'
});
exports.mediaServer = {
    /**
     * Upload a file to the media server
     */
    uploadFile: async (file, mediaType = 'tmp') => {
        return await client.storage.upload({
            file,
            media_type: mediaType
        });
    },
    /**
     * Upload from URL
     */
    uploadFromURL: async (url, mediaType = 'tmp') => {
        return await client.storage.upload({
            url,
            media_type: mediaType
        });
    },
    /**
     * Transcribe audio using Riva ASR
     */
    transcribeAudio: async (audioFile, language) => {
        return await client.audio.transcribe({
            audio_file: audioFile,
            language
        });
    },
    /**
     * Generate audio using Kokoro TTS
     */
    generateTTS: async (text, voice, speed) => {
        return await client.audio.tts.kokoro({
            text,
            voice,
            speed
        });
    },
    /**
     * Align script to audio and get word timings
     */
    alignScript: async (audioId, script, mode) => {
        return await client.audio.alignScript({
            audio_id: audioId,
            script,
            mode
        });
    },
    /**
     * Generate captioned video
     */
    generateCaptionedVideo: async (backgroundId, text, options) => {
        return await client.video.generateCaptionedVideo({
            background_id: backgroundId,
            text,
            ...options
        });
    },
    /**
     * Create music video
     */
    createMusicVideo: async (audioId, loopingVideoId, options) => {
        return await client.music.createMusicVideo({
            audio_id: audioId,
            looping_video_id: loopingVideoId,
            ...options
        });
    },
    /**
     * Merge videos
     */
    mergeVideos: async (videoIds, backgroundMusicId) => {
        return await client.video.merge({
            video_ids: videoIds.join(','),
            background_music_id: backgroundMusicId
        });
    },
    /**
     * Get file status
     */
    getFileStatus: async (fileId) => {
        return await client.storage.status(fileId);
    },
    /**
     * Download file
     */
    downloadFile: async (fileId) => {
        return await client.storage.download(fileId);
    },
    /**
     * Match video duration to audio
     */
    matchDuration: async (videoId, audioId) => {
        const audioInfo = await client.audio.info(audioId);
        return await client.video.matchDuration({
            video_id: videoId,
            audio_id: audioId,
            target_duration_seconds: audioInfo.duration
        });
    },
    // Expose the full client for advanced use cases
    client
};
exports.default = exports.mediaServer;
//# sourceMappingURL=mediaServer.js.map