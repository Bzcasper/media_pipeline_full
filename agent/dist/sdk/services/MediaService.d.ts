import type { Body_add_colorkey_overlay_api_v1_media_video_tools_add_colorkey_overlay_post } from '../models/Body_add_colorkey_overlay_api_v1_media_video_tools_add_colorkey_overlay_post';
import type { Body_add_overlay_api_v1_media_video_tools_add_overlay_post } from '../models/Body_add_overlay_api_v1_media_video_tools_add_overlay_post';
import type { Body_align_script_api_v1_media_audio_tools_align_script_post } from '../models/Body_align_script_api_v1_media_audio_tools_align_script_post';
import type { Body_analyze_track_handler_api_v1_media_music_tools_analyze_track_post } from '../models/Body_analyze_track_handler_api_v1_media_music_tools_analyze_track_post';
import type { Body_clean_audio_pauses_handler_api_v1_media_audio_tools_trim_pauses_post } from '../models/Body_clean_audio_pauses_handler_api_v1_media_audio_tools_trim_pauses_post';
import type { Body_create_looping_video_api_v1_media_video_tools_create_looping_video_post } from '../models/Body_create_looping_video_api_v1_media_video_tools_create_looping_video_post';
import type { Body_create_mix_handler_api_v1_media_music_tools_create_mix_post } from '../models/Body_create_mix_handler_api_v1_media_music_tools_create_mix_post';
import type { Body_create_music_thumbnail_handler_api_v1_media_music_tools_create_thumbnail_post } from '../models/Body_create_music_thumbnail_handler_api_v1_media_music_tools_create_thumbnail_post';
import type { Body_create_music_video_handler_api_v1_media_music_tools_create_music_video_post } from '../models/Body_create_music_video_handler_api_v1_media_music_tools_create_music_video_post';
import type { Body_create_playlist_handler_api_v1_media_music_tools_create_playlist_post } from '../models/Body_create_playlist_handler_api_v1_media_music_tools_create_playlist_post';
import type { Body_extend_audio_api_v1_media_audio_tools_extend_audio_post } from '../models/Body_extend_audio_api_v1_media_audio_tools_extend_audio_post';
import type { Body_extract_frame_from_url_api_v1_media_video_tools_extract_frames_post } from '../models/Body_extract_frame_from_url_api_v1_media_video_tools_extract_frames_post';
import type { Body_generate_captioned_video_api_v1_media_video_tools_generate_tts_captioned_video_post } from '../models/Body_generate_captioned_video_api_v1_media_video_tools_generate_tts_captioned_video_post';
import type { Body_generate_chatterbox_tts_api_v1_media_audio_tools_tts_chatterbox_post } from '../models/Body_generate_chatterbox_tts_api_v1_media_audio_tools_tts_chatterbox_post';
import type { Body_generate_gif_preview_api_v1_media_video_tools_gif_preview_post } from '../models/Body_generate_gif_preview_api_v1_media_video_tools_gif_preview_post';
import type { Body_generate_kokoro_tts_api_v1_media_audio_tools_tts_kokoro_post } from '../models/Body_generate_kokoro_tts_api_v1_media_audio_tools_tts_kokoro_post';
import type { Body_generate_long_form_ambient_video_api_v1_media_video_tools_long_form_ambient_post } from '../models/Body_generate_long_form_ambient_video_api_v1_media_video_tools_long_form_ambient_post';
import type { Body_match_duration_api_v1_media_video_tools_match_duration_post } from '../models/Body_match_duration_api_v1_media_video_tools_match_duration_post';
import type { Body_merge_audios_api_v1_media_audio_tools_merge_post } from '../models/Body_merge_audios_api_v1_media_audio_tools_merge_post';
import type { Body_merge_videos_api_v1_media_video_tools_merge_post } from '../models/Body_merge_videos_api_v1_media_video_tools_merge_post';
import type { Body_normalize_track_handler_api_v1_media_music_tools_normalize_track_post } from '../models/Body_normalize_track_handler_api_v1_media_music_tools_normalize_track_post';
import type { Body_transcode_video_api_v1_media_video_tools_transcode_post } from '../models/Body_transcode_video_api_v1_media_video_tools_transcode_post';
import type { Body_transcribe_api_v1_media_audio_tools_transcribe_post } from '../models/Body_transcribe_api_v1_media_audio_tools_transcribe_post';
import type { Body_upload_file_api_v1_media_storage_post } from '../models/Body_upload_file_api_v1_media_storage_post';
import type { RevengeStoryVideoRequest } from '../models/RevengeStoryVideoRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class MediaService {
    /**
     * Transcribe
     * Transcribe audio file to text.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static transcribeApiV1MediaAudioToolsTranscribePost(formData: Body_transcribe_api_v1_media_audio_tools_transcribe_post): CancelablePromise<any>;
    /**
     * Get Kokoro Voices
     * @returns any Successful Response
     * @throws ApiError
     */
    static getKokoroVoicesApiV1MediaAudioToolsTtsKokoroVoicesGet(): CancelablePromise<any>;
    /**
     * Generate Kokoro Tts
     * Generate audio from text using specified TTS engine.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static generateKokoroTtsApiV1MediaAudioToolsTtsKokoroPost(formData: Body_generate_kokoro_tts_api_v1_media_audio_tools_tts_kokoro_post): CancelablePromise<any>;
    /**
     * Get Chatterbox Languages
     * @returns any Successful Response
     * @throws ApiError
     */
    static getChatterboxLanguagesApiV1MediaAudioToolsTtsChatterboxLanguagesGet(): CancelablePromise<any>;
    /**
     * Generate Chatterbox Tts
     * Generate audio from text using Chatterbox TTS.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static generateChatterboxTtsApiV1MediaAudioToolsTtsChatterboxPost(formData: Body_generate_chatterbox_tts_api_v1_media_audio_tools_tts_chatterbox_post): CancelablePromise<any>;
    /**
     * Merge Audios
     * Merge multiple audio files into one.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static mergeAudiosApiV1MediaAudioToolsMergePost(formData: Body_merge_audios_api_v1_media_audio_tools_merge_post): CancelablePromise<any>;
    /**
     * Clean Audio Pauses Handler
     * Clean long pauses from the audio based on the provided script.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static cleanAudioPausesHandlerApiV1MediaAudioToolsTrimPausesPost(formData: Body_clean_audio_pauses_handler_api_v1_media_audio_tools_trim_pauses_post): CancelablePromise<any>;
    /**
     * Upload File
     * Upload a file and return its ID.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static uploadFileApiV1MediaStoragePost(formData: Body_upload_file_api_v1_media_storage_post): CancelablePromise<any>;
    /**
     * Download File
     * Download a file by its ID.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    static downloadFileApiV1MediaStorageFileIdGet(fileId: string): CancelablePromise<any>;
    /**
     * Delete File
     * Delete a file by its
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    static deleteFileApiV1MediaStorageFileIdDelete(fileId: string): CancelablePromise<any>;
    /**
     * File Status
     * Check the status of a file by its ID.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    static fileStatusApiV1MediaStorageFileIdStatusGet(fileId: string): CancelablePromise<any>;
    /**
     * Merge Videos
     * Merge multiple videos into one.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static mergeVideosApiV1MediaVideoToolsMergePost(formData: Body_merge_videos_api_v1_media_video_tools_merge_post): CancelablePromise<any>;
    /**
     * Transcode Video
     * Transcode a video to a different format, codec, quality, or resolution.
     *
     * Supports hardware acceleration with CUDA when available.
     * Quality levels: 1-3 (low quality/smaller file size), 4-7 (medium quality), 8-10 (high quality/larger file size)
     *
     * For precise file size control, use the bitrate parameter instead of quality.
     * Example bitrates: '500k' (low quality), '2M' (medium quality), '5M' (high quality)
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static transcodeVideoApiV1MediaVideoToolsTranscodePost(formData: Body_transcode_video_api_v1_media_video_tools_transcode_post): CancelablePromise<any>;
    /**
     * Generate Gif Preview
     * Generate a GIF preview from a video.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static generateGifPreviewApiV1MediaVideoToolsGifPreviewPost(formData: Body_generate_gif_preview_api_v1_media_video_tools_gif_preview_post): CancelablePromise<any>;
    /**
     * Match Duration
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static matchDurationApiV1MediaVideoToolsMatchDurationPost(formData: Body_match_duration_api_v1_media_video_tools_match_duration_post): CancelablePromise<any>;
    /**
     * List Fonts
     * @returns any Successful Response
     * @throws ApiError
     */
    static listFontsApiV1MediaFontsGet(): CancelablePromise<any>;
    /**
     * Generate Captioned Video
     * Generate a captioned video from text and background image.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static generateCaptionedVideoApiV1MediaVideoToolsGenerateTtsCaptionedVideoPost(formData: Body_generate_captioned_video_api_v1_media_video_tools_generate_tts_captioned_video_post): CancelablePromise<any>;
    /**
     * Add Colorkey Overlay
     * ⚠️ Depcreated - use the generic /video-tools/add-overlay endpoint instead.
     * Overlay a video on a video with the specified colorkey and intensity
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static addColorkeyOverlayApiV1MediaVideoToolsAddColorkeyOverlayPost(formData: Body_add_colorkey_overlay_api_v1_media_video_tools_add_colorkey_overlay_post): CancelablePromise<any>;
    /**
     * Add Overlay
     * Add an image or video overlay to a video with specified opacity.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static addOverlayApiV1MediaVideoToolsAddOverlayPost(formData: Body_add_overlay_api_v1_media_video_tools_add_overlay_post): CancelablePromise<any>;
    /**
     * Extract Frame
     * Extract a frame from a video at a specified timestamp.
     *
     * Args:
     * video_id: Video ID to extract frame from
     * timestamp: Optional timestamp in seconds to extract frame from (default: first frame)
     * @param videoId
     * @param timestamp Timestamp in seconds to extract frame from (default: 1.0)
     * @returns any Successful Response
     * @throws ApiError
     */
    static extractFrameApiV1MediaVideoToolsExtractFrameVideoIdGet(videoId: string, timestamp?: (number | null)): CancelablePromise<any>;
    /**
     * Extract Frame From Url
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static extractFrameFromUrlApiV1MediaVideoToolsExtractFramesPost(formData: Body_extract_frame_from_url_api_v1_media_video_tools_extract_frames_post): CancelablePromise<any>;
    /**
     * Get Video Info
     * Get information about a video file.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    static getVideoInfoApiV1MediaVideoToolsInfoFileIdGet(fileId: string): CancelablePromise<any>;
    /**
     * Get Audio Info
     * Get information about an audio file.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    static getAudioInfoApiV1MediaAudioToolsInfoFileIdGet(fileId: string): CancelablePromise<any>;
    /**
     * Generate Long Form Ambient Video
     * Generate a long-form ambient video
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static generateLongFormAmbientVideoApiV1MediaVideoToolsLongFormAmbientPost(formData: Body_generate_long_form_ambient_video_api_v1_media_video_tools_long_form_ambient_post): CancelablePromise<any>;
    /**
     * Extend Audio
     * Extend an audio file to a specified duration.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static extendAudioApiV1MediaAudioToolsExtendAudioPost(formData: Body_extend_audio_api_v1_media_audio_tools_extend_audio_post): CancelablePromise<any>;
    /**
     * Align Script
     * Align a script to an audio file and return word timings and segmented chunks.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static alignScriptApiV1MediaAudioToolsAlignScriptPost(formData: Body_align_script_api_v1_media_audio_tools_align_script_post): CancelablePromise<any>;
    /**
     * Generate Revenge Story Video Json
     * Generate a revenge story video with TTS audio, captions, and character overlay.
     * This endpoint accepts JSON body instead of form data.
     *
     * This endpoint:
     * 1. Generates audio using Kokoro TTS
     * 2. Creates word timings (with alignment for international languages)
     * 3. Generates subtitles
     * 4. Creates character overlay image
     * 5. Generates final revenge video with all components
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    static generateRevengeStoryVideoJsonApiV1MediaVideoToolsRevengeStoryPost(requestBody: RevengeStoryVideoRequest): CancelablePromise<any>;
    /**
     * Create Looping Video
     * Create a looping video from an input video.
     * This will analyze the input video to find a good loop point and create a seamless looping video.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static createLoopingVideoApiV1MediaVideoToolsCreateLoopingVideoPost(formData: Body_create_looping_video_api_v1_media_video_tools_create_looping_video_post): CancelablePromise<any>;
    /**
     * Normalize Track Handler
     * Normalize an audio track to a standard loudness level.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static normalizeTrackHandlerApiV1MediaMusicToolsNormalizeTrackPost(formData: Body_normalize_track_handler_api_v1_media_music_tools_normalize_track_post): CancelablePromise<any>;
    /**
     * Create Playlist Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static createPlaylistHandlerApiV1MediaMusicToolsCreatePlaylistPost(formData: Body_create_playlist_handler_api_v1_media_music_tools_create_playlist_post): CancelablePromise<any>;
    /**
     * Analyze Track Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static analyzeTrackHandlerApiV1MediaMusicToolsAnalyzeTrackPost(formData: Body_analyze_track_handler_api_v1_media_music_tools_analyze_track_post): CancelablePromise<any>;
    /**
     * Create Mix Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static createMixHandlerApiV1MediaMusicToolsCreateMixPost(formData: Body_create_mix_handler_api_v1_media_music_tools_create_mix_post): CancelablePromise<any>;
    /**
     * Create Music Video Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static createMusicVideoHandlerApiV1MediaMusicToolsCreateMusicVideoPost(formData: Body_create_music_video_handler_api_v1_media_music_tools_create_music_video_post): CancelablePromise<any>;
    /**
     * Create Music Thumbnail Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    static createMusicThumbnailHandlerApiV1MediaMusicToolsCreateThumbnailPost(formData: Body_create_music_thumbnail_handler_api_v1_media_music_tools_create_thumbnail_post): CancelablePromise<any>;
}
