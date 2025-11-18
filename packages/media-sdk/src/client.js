"use strict";
/**
 * Media Server SDK Client
 * Comprehensive TypeScript client for GPU Media Server API
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaServerClient = void 0;
const form_data_1 = __importDefault(require("form-data"));
const types = __importStar(require("./types"));
class MediaServerClient {
    baseUrl;
    timeout;
    headers;
    constructor(config) {
        this.baseUrl = config?.baseUrl || process.env.MEDIA_SERVER_URL || '';
        this.timeout = config?.timeout || 300000; // 5 minutes default
        this.headers = config?.headers || {};
    }
    /**
     * Generic request handler with error handling
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.headers,
                    ...options.headers,
                },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorText = await response.text();
                throw new types.MediaServerError(`HTTP ${response.status}: ${errorText}`, response.status, errorText);
            }
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                return await response.json();
            }
            // Return as any for binary/file responses
            return response;
        }
        catch (error) {
            if (error instanceof types.MediaServerError) {
                throw error;
            }
            throw new types.MediaServerError(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Helper to create FormData from params
     */
    createFormData(params) {
        const formData = new form_data_1.default();
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                if (value instanceof Buffer || value instanceof Blob) {
                    formData.append(key, value, 'file');
                }
                else if (typeof value === 'object' && value.name) {
                    // File object
                    formData.append(key, value);
                }
                else {
                    formData.append(key, String(value));
                }
            }
        }
        return formData;
    }
    /**
     * Helper to create URLSearchParams
     */
    createURLParams(params) {
        const urlParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                urlParams.append(key, String(value));
            }
        }
        return urlParams;
    }
    // ==================== STORAGE ====================
    storage = {
        /**
         * Upload a file to the media server
         */
        upload: async (params) => {
            const formData = this.createFormData(params);
            return this.request('/api/v1/media/storage', {
                method: 'POST',
                body: formData,
            });
        },
        /**
         * Download a file by its ID
         */
        download: async (fileId) => {
            return this.request(`/api/v1/media/storage/${fileId}`, {
                method: 'GET',
            });
        },
        /**
         * Delete a file by its ID
         */
        delete: async (fileId) => {
            return this.request(`/api/v1/media/storage/${fileId}`, {
                method: 'DELETE',
            });
        },
        /**
         * Check file status
         */
        status: async (fileId) => {
            return this.request(`/api/v1/media/storage/${fileId}/status`, {
                method: 'GET',
            });
        },
    };
    // ==================== AUDIO TOOLS ====================
    audio = {
        /**
         * Transcribe audio file to text using Riva ASR
         */
        transcribe: async (params) => {
            const formData = this.createFormData(params);
            return this.request('/api/v1/media/audio-tools/transcribe', {
                method: 'POST',
                body: formData,
            });
        },
        /**
         * Get audio file information
         */
        info: async (fileId) => {
            return this.request(`/api/v1/media/audio-tools/info/${fileId}`, {
                method: 'GET',
            });
        },
        /**
         * Merge multiple audio files
         */
        merge: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/audio-tools/merge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Extend audio to specified duration
         */
        extend: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/audio-tools/extend-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Align script to audio and return word timings
         */
        alignScript: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/audio-tools/align-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * TTS Services
         */
        tts: {
            /**
             * Get available Kokoro TTS voices
             */
            getKokoroVoices: async () => {
                return this.request('/api/v1/media/audio-tools/tts/kokoro/voices', {
                    method: 'GET',
                });
            },
            /**
             * Generate audio using Kokoro TTS
             */
            kokoro: async (params) => {
                const urlParams = this.createURLParams(params);
                return this.request('/api/v1/media/audio-tools/tts/kokoro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: urlParams,
                });
            },
            /**
             * Get available Chatterbox TTS languages
             */
            getChatterboxLanguages: async () => {
                return this.request('/api/v1/media/audio-tools/tts/chatterbox/languages', {
                    method: 'GET',
                });
            },
            /**
             * Generate audio using Chatterbox TTS (voice cloning)
             */
            chatterbox: async (params) => {
                const formData = this.createFormData(params);
                return this.request('/api/v1/media/audio-tools/tts/chatterbox', {
                    method: 'POST',
                    body: formData,
                });
            },
        },
    };
    // ==================== VIDEO TOOLS ====================
    video = {
        /**
         * Merge multiple videos
         */
        merge: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/video-tools/merge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Transcode video to different format/quality
         */
        transcode: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/video-tools/transcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Get video file information
         */
        info: async (fileId) => {
            return this.request(`/api/v1/media/video-tools/info/${fileId}`, {
                method: 'GET',
            });
        },
        /**
         * Extract single frame from video
         */
        extractFrame: async (videoId, timestamp) => {
            const url = `/api/v1/media/video-tools/extract-frame/${videoId}${timestamp !== undefined ? `?timestamp=${timestamp}` : ''}`;
            return this.request(url, { method: 'GET' });
        },
        /**
         * Extract multiple frames from video URL
         */
        extractFrames: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/video-tools/extract-frames', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Match video duration to target or audio
         */
        matchDuration: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/video-tools/match-duration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Add overlay to video
         */
        addOverlay: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/video-tools/add-overlay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Generate GIF preview from video
         */
        generateGif: async (videoId, startTime, duration) => {
            const urlParams = this.createURLParams({
                video_id: videoId,
                start_time: startTime,
                duration,
            });
            return this.request('/api/v1/media/video-tools/gif-preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Generate captioned video with TTS
         */
        generateCaptionedVideo: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/video-tools/generate/tts-captioned-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Create looping video
         */
        createLoopingVideo: async (videoId) => {
            const urlParams = this.createURLParams({ video_id: videoId });
            return this.request('/api/v1/media/video-tools/create-looping-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Generate long-form ambient video
         */
        generateLongFormAmbient: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/video-tools/long-form-ambient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
    };
    // ==================== MUSIC TOOLS ====================
    music = {
        /**
         * Normalize audio track
         */
        normalizeTrack: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/music-tools/normalize-track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Analyze track for BPM, key, etc.
         */
        analyzeTrack: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/music-tools/analyze-track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Create music video
         */
        createMusicVideo: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/music-tools/create-music-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Create music thumbnail
         */
        createThumbnail: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/media/music-tools/create-thumbnail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Create playlist from audio IDs
         */
        createPlaylist: async (audioIds, includeAnalysis) => {
            const urlParams = this.createURLParams({
                audio_ids: audioIds,
                analysis_data: includeAnalysis,
            });
            return this.request('/api/v1/media/music-tools/create-playlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Create mix from multiple tracks
         */
        createMix: async (audioIds, durationMinutes) => {
            const urlParams = this.createURLParams({
                audio_ids: audioIds,
                duration_minutes: durationMinutes,
            });
            return this.request('/api/v1/media/music-tools/create-mix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
    };
    // ==================== UTILITIES ====================
    utils = {
        /**
         * Get available fonts
         */
        getFonts: async () => {
            return this.request('/api/v1/media/fonts', {
                method: 'GET',
            });
        },
        /**
         * Render HTML to image
         */
        renderHTML: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/utils/render-html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Stitch images together
         */
        stitchImages: async (params) => {
            const urlParams = this.createURLParams(params);
            return this.request('/api/v1/utils/stitch-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
        /**
         * Get YouTube transcript
         */
        getYouTubeTranscript: async (videoId) => {
            return this.request(`/api/v1/utils/youtube-transcript?video_id=${videoId}`, {
                method: 'GET',
            });
        },
        /**
         * Make image imperfect (remove AI artifacts)
         */
        makeImageImperfect: async (imageId, options) => {
            const urlParams = this.createURLParams({
                image_id: imageId,
                ...options,
            });
            return this.request('/api/v1/utils/make-image-imperfect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlParams,
            });
        },
    };
    // ==================== HEALTH CHECK ====================
    /**
     * Health check endpoint
     */
    health = async () => {
        return this.request('/health', {
            method: 'GET',
        });
    };
}
exports.MediaServerClient = MediaServerClient;
exports.default = MediaServerClient;
//# sourceMappingURL=client.js.map