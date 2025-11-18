/**
 * Media Server SDK Client
 * Comprehensive TypeScript client for GPU Media Server API
 */
import * as types from './types';
export interface MediaServerConfig {
    baseUrl: string;
    timeout?: number;
    headers?: Record<string, string>;
}
export declare class MediaServerClient {
    private baseUrl;
    private timeout;
    private headers;
    constructor(config?: Partial<MediaServerConfig>);
    /**
     * Generic request handler with error handling
     */
    private request;
    /**
     * Helper to create FormData from params
     */
    private createFormData;
    /**
     * Helper to create URLSearchParams
     */
    private createURLParams;
    storage: {
        /**
         * Upload a file to the media server
         */
        upload: (params: types.UploadFileParams) => Promise<types.MediaServerResponse>;
        /**
         * Download a file by its ID
         */
        download: (fileId: string) => Promise<Response>;
        /**
         * Delete a file by its ID
         */
        delete: (fileId: string) => Promise<types.MediaServerResponse>;
        /**
         * Check file status
         */
        status: (fileId: string) => Promise<types.FileStatus>;
    };
    audio: {
        /**
         * Transcribe audio file to text using Riva ASR
         */
        transcribe: (params: types.TranscribeParams) => Promise<types.TranscriptionResult>;
        /**
         * Get audio file information
         */
        info: (fileId: string) => Promise<any>;
        /**
         * Merge multiple audio files
         */
        merge: (params: types.MergeAudiosParams) => Promise<types.MediaServerResponse>;
        /**
         * Extend audio to specified duration
         */
        extend: (params: types.ExtendAudioParams) => Promise<types.MediaServerResponse>;
        /**
         * Align script to audio and return word timings
         */
        alignScript: (params: types.AlignScriptParams) => Promise<types.AlignScriptResult>;
        /**
         * TTS Services
         */
        tts: {
            /**
             * Get available Kokoro TTS voices
             */
            getKokoroVoices: () => Promise<string[]>;
            /**
             * Generate audio using Kokoro TTS
             */
            kokoro: (params: types.KokoroTTSParams) => Promise<types.MediaServerResponse>;
            /**
             * Get available Chatterbox TTS languages
             */
            getChatterboxLanguages: () => Promise<string[]>;
            /**
             * Generate audio using Chatterbox TTS (voice cloning)
             */
            chatterbox: (params: types.ChatterboxTTSParams) => Promise<types.MediaServerResponse>;
        };
    };
    video: {
        /**
         * Merge multiple videos
         */
        merge: (params: types.MergeVideosParams) => Promise<types.MediaServerResponse>;
        /**
         * Transcode video to different format/quality
         */
        transcode: (params: types.TranscodeVideoParams) => Promise<types.MediaServerResponse>;
        /**
         * Get video file information
         */
        info: (fileId: string) => Promise<any>;
        /**
         * Extract single frame from video
         */
        extractFrame: (videoId: string, timestamp?: number) => Promise<types.MediaServerResponse>;
        /**
         * Extract multiple frames from video URL
         */
        extractFrames: (params: types.ExtractFramesParams) => Promise<types.MediaServerResponse>;
        /**
         * Match video duration to target or audio
         */
        matchDuration: (params: types.MatchDurationParams) => Promise<types.MediaServerResponse>;
        /**
         * Add overlay to video
         */
        addOverlay: (params: types.AddOverlayParams) => Promise<types.MediaServerResponse>;
        /**
         * Generate GIF preview from video
         */
        generateGif: (videoId: string, startTime?: number, duration?: number) => Promise<types.MediaServerResponse>;
        /**
         * Generate captioned video with TTS
         */
        generateCaptionedVideo: (params: types.GenerateCaptionedVideoParams) => Promise<types.MediaServerResponse>;
        /**
         * Create looping video
         */
        createLoopingVideo: (videoId: string) => Promise<types.MediaServerResponse>;
        /**
         * Generate long-form ambient video
         */
        generateLongFormAmbient: (params: any) => Promise<types.MediaServerResponse>;
    };
    music: {
        /**
         * Normalize audio track
         */
        normalizeTrack: (params: types.NormalizeTrackParams) => Promise<types.MediaServerResponse>;
        /**
         * Analyze track for BPM, key, etc.
         */
        analyzeTrack: (params: types.AnalyzeTrackParams) => Promise<any>;
        /**
         * Create music video
         */
        createMusicVideo: (params: types.CreateMusicVideoParams) => Promise<types.MediaServerResponse>;
        /**
         * Create music thumbnail
         */
        createThumbnail: (params: types.CreateMusicThumbnailParams) => Promise<types.MediaServerResponse>;
        /**
         * Create playlist from audio IDs
         */
        createPlaylist: (audioIds: string, includeAnalysis?: boolean) => Promise<types.MediaServerResponse>;
        /**
         * Create mix from multiple tracks
         */
        createMix: (audioIds: string, durationMinutes?: number) => Promise<types.MediaServerResponse>;
    };
    utils: {
        /**
         * Get available fonts
         */
        getFonts: () => Promise<string[]>;
        /**
         * Render HTML to image
         */
        renderHTML: (params: types.RenderHTMLParams) => Promise<types.MediaServerResponse>;
        /**
         * Stitch images together
         */
        stitchImages: (params: types.StitchImagesParams) => Promise<types.MediaServerResponse>;
        /**
         * Get YouTube transcript
         */
        getYouTubeTranscript: (videoId: string) => Promise<any>;
        /**
         * Make image imperfect (remove AI artifacts)
         */
        makeImageImperfect: (imageId: string, options?: {
            enhance_color?: number;
            enhance_contrast?: number;
            noise_strength?: number;
        }) => Promise<types.MediaServerResponse>;
    };
    /**
     * Health check endpoint
     */
    health: () => Promise<any>;
}
export default MediaServerClient;
//# sourceMappingURL=client.d.ts.map