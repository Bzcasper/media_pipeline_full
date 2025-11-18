/**
 * Media Server SDK Types
 * Auto-generated from OpenAPI specification
 */
interface MediaServerResponse<T = any> {
    success?: boolean;
    data?: T;
    error?: string;
    file_id?: string;
    url?: string;
}
type MediaType = 'image' | 'video' | 'audio' | 'font' | 'tmp';
interface UploadFileParams {
    file?: File | Buffer;
    url?: string;
    media_type: MediaType;
}
interface FileStatus {
    file_id: string;
    status: 'pending' | 'processing' | 'ready' | 'error';
    url?: string;
}
interface TranscribeParams {
    audio_file: File | Buffer;
    language?: string;
}
interface TranscriptionSegment {
    text: string;
    start: number;
    end: number;
    confidence?: number;
}
interface TranscriptionResult {
    text: string;
    segments?: TranscriptionSegment[];
    language?: string;
}
interface KokoroTTSParams {
    text: string;
    voice?: string;
    speed?: number;
    reverb_effect?: boolean;
}
interface ChatterboxTTSParams {
    text: string;
    language?: string;
    sample_audio_id?: string;
    sample_audio_file?: File | Buffer;
    exaggeration?: number;
    cfg_weight?: number;
    temperature?: number;
    chunk_silence_ms?: number;
    reverb_effect?: boolean;
}
interface MergeAudiosParams {
    audio_ids: string;
    pause?: number;
}
interface ExtendAudioParams {
    audio_id: string;
    duration_minutes?: number;
}
interface AlignScriptParams {
    audio_id: string;
    script: string;
    mode?: 'word' | 'sentence' | 'sentence_punc' | 'fixed_words' | 'max_chars';
    limit?: number;
    lang_code?: string;
}
interface WordTiming {
    word: string;
    start: number;
    end: number;
}
interface AlignScriptResult {
    segments: Array<{
        text: string;
        start: number;
        end: number;
        words: WordTiming[];
    }>;
}
interface MergeVideosParams {
    video_ids: string;
    background_music_id?: string;
    normalize?: boolean;
    background_music_volume?: number;
}
interface TranscodeVideoParams {
    video_id: string;
    codec?: string;
    quality?: number;
    bitrate?: string;
    resolution?: string;
    fps?: number;
}
interface ExtractFrameParams {
    video_id: string;
    timestamp?: number;
}
interface ExtractFramesParams {
    url: string;
    amount?: number;
    length_seconds?: number;
    stitch?: boolean;
}
interface MatchDurationParams {
    video_id: string;
    audio_id?: string;
    target_duration_seconds: number;
    extend_method?: 'loop' | 'freeze';
    loop_type?: 'normal' | 'pingpong';
    speed_up_limit_percent?: number;
    slow_down_limit_percent?: number;
    remove_audio?: boolean;
}
interface AddOverlayParams {
    video_id: string;
    overlay_id: string;
    opacity?: number;
}
interface CaptionConfig {
    line_count?: number;
    line_max_length?: number;
    font_size?: number;
    font_name?: string;
    font_bold?: boolean;
    font_italic?: boolean;
    font_color?: string;
    subtitle_position?: 'top' | 'center' | 'bottom';
    shadow_color?: string;
    shadow_transparency?: number;
    shadow_blur?: number;
    stroke_color?: string;
    stroke_size?: number;
}
interface GenerateCaptionedVideoParams {
    background_id: string;
    text?: string;
    width?: number;
    height?: number;
    audio_id?: string;
    kokoro_voice?: string;
    kokoro_speed?: number;
    language?: string;
    alignment_language_code?: string;
    font_id?: string;
    image_effect?: 'ken_burns' | 'pan' | 'still';
    caption_on?: boolean;
    caption_config_line_count?: number;
    caption_config_line_max_length?: number;
    caption_config_font_size?: number;
    caption_config_font_name?: string;
    caption_config_font_bold?: boolean;
    caption_config_font_italic?: boolean;
    caption_config_font_color?: string;
    caption_config_subtitle_position?: 'top' | 'center' | 'bottom';
    caption_config_shadow_color?: string;
    caption_config_shadow_transparency?: number;
    caption_config_shadow_blur?: number;
    caption_config_stroke_color?: string;
    caption_config_stroke_size?: number;
}
interface NormalizeTrackParams {
    audio_id: string;
}
interface AnalyzeTrackParams {
    audio_id: string;
}
interface CreateMusicVideoParams {
    audio_id: string;
    looping_video_id: string;
    intro_id?: string;
    zoom_effect?: boolean;
    blur_effect?: boolean;
}
interface CreateMusicThumbnailParams {
    title: string;
    subtitle?: string;
    padding?: number;
    subtitle_gap?: number;
    title_font_size?: number;
    title_font_id?: string;
    subtitle_font_size?: number;
    subtitle_font_id?: string;
    text_color_hex?: string;
    image_id?: string;
    video_id?: string;
}
interface RenderHTMLParams {
    html_content: string;
    width?: number;
    height?: number;
}
interface StitchImagesParams {
    image_urls: string;
    max_width?: number;
    max_height?: number;
}
declare class MediaServerError extends Error {
    statusCode?: number | undefined;
    response?: any | undefined;
    constructor(message: string, statusCode?: number | undefined, response?: any | undefined);
}

/**
 * Media Server SDK Client
 * Comprehensive TypeScript client for GPU Media Server API
 */

interface MediaServerConfig {
    baseUrl: string;
    timeout?: number;
    headers?: Record<string, string>;
}
declare class MediaServerClient {
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
        upload: (params: UploadFileParams) => Promise<MediaServerResponse>;
        /**
         * Download a file by its ID
         */
        download: (fileId: string) => Promise<Response>;
        /**
         * Delete a file by its ID
         */
        delete: (fileId: string) => Promise<MediaServerResponse>;
        /**
         * Check file status
         */
        status: (fileId: string) => Promise<FileStatus>;
    };
    audio: {
        /**
         * Transcribe audio file to text using Riva ASR
         */
        transcribe: (params: TranscribeParams) => Promise<TranscriptionResult>;
        /**
         * Get audio file information
         */
        info: (fileId: string) => Promise<any>;
        /**
         * Merge multiple audio files
         */
        merge: (params: MergeAudiosParams) => Promise<MediaServerResponse>;
        /**
         * Extend audio to specified duration
         */
        extend: (params: ExtendAudioParams) => Promise<MediaServerResponse>;
        /**
         * Align script to audio and return word timings
         */
        alignScript: (params: AlignScriptParams) => Promise<AlignScriptResult>;
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
            kokoro: (params: KokoroTTSParams) => Promise<MediaServerResponse>;
            /**
             * Get available Chatterbox TTS languages
             */
            getChatterboxLanguages: () => Promise<string[]>;
            /**
             * Generate audio using Chatterbox TTS (voice cloning)
             */
            chatterbox: (params: ChatterboxTTSParams) => Promise<MediaServerResponse>;
        };
    };
    video: {
        /**
         * Merge multiple videos
         */
        merge: (params: MergeVideosParams) => Promise<MediaServerResponse>;
        /**
         * Transcode video to different format/quality
         */
        transcode: (params: TranscodeVideoParams) => Promise<MediaServerResponse>;
        /**
         * Get video file information
         */
        info: (fileId: string) => Promise<any>;
        /**
         * Extract single frame from video
         */
        extractFrame: (videoId: string, timestamp?: number) => Promise<MediaServerResponse>;
        /**
         * Extract multiple frames from video URL
         */
        extractFrames: (params: ExtractFramesParams) => Promise<MediaServerResponse>;
        /**
         * Match video duration to target or audio
         */
        matchDuration: (params: MatchDurationParams) => Promise<MediaServerResponse>;
        /**
         * Add overlay to video
         */
        addOverlay: (params: AddOverlayParams) => Promise<MediaServerResponse>;
        /**
         * Generate GIF preview from video
         */
        generateGif: (videoId: string, startTime?: number, duration?: number) => Promise<MediaServerResponse>;
        /**
         * Generate captioned video with TTS
         */
        generateCaptionedVideo: (params: GenerateCaptionedVideoParams) => Promise<MediaServerResponse>;
        /**
         * Create looping video
         */
        createLoopingVideo: (videoId: string) => Promise<MediaServerResponse>;
        /**
         * Generate long-form ambient video
         */
        generateLongFormAmbient: (params: any) => Promise<MediaServerResponse>;
    };
    music: {
        /**
         * Normalize audio track
         */
        normalizeTrack: (params: NormalizeTrackParams) => Promise<MediaServerResponse>;
        /**
         * Analyze track for BPM, key, etc.
         */
        analyzeTrack: (params: AnalyzeTrackParams) => Promise<any>;
        /**
         * Create music video
         */
        createMusicVideo: (params: CreateMusicVideoParams) => Promise<MediaServerResponse>;
        /**
         * Create music thumbnail
         */
        createThumbnail: (params: CreateMusicThumbnailParams) => Promise<MediaServerResponse>;
        /**
         * Create playlist from audio IDs
         */
        createPlaylist: (audioIds: string, includeAnalysis?: boolean) => Promise<MediaServerResponse>;
        /**
         * Create mix from multiple tracks
         */
        createMix: (audioIds: string, durationMinutes?: number) => Promise<MediaServerResponse>;
    };
    utils: {
        /**
         * Get available fonts
         */
        getFonts: () => Promise<string[]>;
        /**
         * Render HTML to image
         */
        renderHTML: (params: RenderHTMLParams) => Promise<MediaServerResponse>;
        /**
         * Stitch images together
         */
        stitchImages: (params: StitchImagesParams) => Promise<MediaServerResponse>;
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
        }) => Promise<MediaServerResponse>;
    };
    /**
     * Health check endpoint
     */
    health: () => Promise<any>;
}

export { type AddOverlayParams, type AlignScriptParams, type AlignScriptResult, type AnalyzeTrackParams, type CaptionConfig, type ChatterboxTTSParams, type CreateMusicThumbnailParams, type CreateMusicVideoParams, type ExtendAudioParams, type ExtractFrameParams, type ExtractFramesParams, type FileStatus, type GenerateCaptionedVideoParams, type KokoroTTSParams, type MatchDurationParams, MediaServerClient, type MediaServerConfig, MediaServerError, type MediaServerResponse, type MediaType, type MergeAudiosParams, type MergeVideosParams, type NormalizeTrackParams, type RenderHTMLParams, type StitchImagesParams, type TranscodeVideoParams, type TranscribeParams, type TranscriptionResult, type TranscriptionSegment, type UploadFileParams, type WordTiming, MediaServerClient as default };
