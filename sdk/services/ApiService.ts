/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_add_colorkey_overlay_api_v1_media_video_tools_add_colorkey_overlay_post } from '../models/Body_add_colorkey_overlay_api_v1_media_video_tools_add_colorkey_overlay_post';
import type { Body_add_overlay_api_v1_media_video_tools_add_overlay_post } from '../models/Body_add_overlay_api_v1_media_video_tools_add_overlay_post';
import type { Body_align_script_api_v1_media_audio_tools_align_script_post } from '../models/Body_align_script_api_v1_media_audio_tools_align_script_post';
import type { Body_analyze_track_handler_api_v1_media_music_tools_analyze_track_post } from '../models/Body_analyze_track_handler_api_v1_media_music_tools_analyze_track_post';
import type { Body_clean_audio_pauses_handler_api_v1_media_audio_tools_trim_pauses_post } from '../models/Body_clean_audio_pauses_handler_api_v1_media_audio_tools_trim_pauses_post';
import type { Body_convert_pcm_to_wav_api_v1_utils_convert_pcm_wav_post } from '../models/Body_convert_pcm_to_wav_api_v1_utils_convert_pcm_wav_post';
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
import type { Body_image_unaize_api_v1_utils_make_image_imperfect_post } from '../models/Body_image_unaize_api_v1_utils_make_image_imperfect_post';
import type { Body_match_duration_api_v1_media_video_tools_match_duration_post } from '../models/Body_match_duration_api_v1_media_video_tools_match_duration_post';
import type { Body_merge_audios_api_v1_media_audio_tools_merge_post } from '../models/Body_merge_audios_api_v1_media_audio_tools_merge_post';
import type { Body_merge_videos_api_v1_media_video_tools_merge_post } from '../models/Body_merge_videos_api_v1_media_video_tools_merge_post';
import type { Body_normalize_track_handler_api_v1_media_music_tools_normalize_track_post } from '../models/Body_normalize_track_handler_api_v1_media_music_tools_normalize_track_post';
import type { Body_render_html_single_threaded_api_v1_utils_render_html_post } from '../models/Body_render_html_single_threaded_api_v1_utils_render_html_post';
import type { Body_stitch_images_api_v1_utils_stitch_images_post } from '../models/Body_stitch_images_api_v1_utils_stitch_images_post';
import type { Body_transcode_video_api_v1_media_video_tools_transcode_post } from '../models/Body_transcode_video_api_v1_media_video_tools_transcode_post';
import type { Body_transcribe_api_v1_media_audio_tools_transcribe_post } from '../models/Body_transcribe_api_v1_media_audio_tools_transcribe_post';
import type { Body_upload_file_api_v1_media_storage_post } from '../models/Body_upload_file_api_v1_media_storage_post';
import type { RevengeStoryVideoRequest } from '../models/RevengeStoryVideoRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApiService {
    /**
     * Transcribe
     * Transcribe audio file to text.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static transcribeApiV1MediaAudioToolsTranscribePost(
        formData: Body_transcribe_api_v1_media_audio_tools_transcribe_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/transcribe',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Kokoro Voices
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getKokoroVoicesApiV1MediaAudioToolsTtsKokoroVoicesGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/audio-tools/tts/kokoro/voices',
        });
    }
    /**
     * Generate Kokoro Tts
     * Generate audio from text using specified TTS engine.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateKokoroTtsApiV1MediaAudioToolsTtsKokoroPost(
        formData: Body_generate_kokoro_tts_api_v1_media_audio_tools_tts_kokoro_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/tts/kokoro',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Chatterbox Languages
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getChatterboxLanguagesApiV1MediaAudioToolsTtsChatterboxLanguagesGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/audio-tools/tts/chatterbox/languages',
        });
    }
    /**
     * Generate Chatterbox Tts
     * Generate audio from text using Chatterbox TTS.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateChatterboxTtsApiV1MediaAudioToolsTtsChatterboxPost(
        formData: Body_generate_chatterbox_tts_api_v1_media_audio_tools_tts_chatterbox_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/tts/chatterbox',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Merge Audios
     * Merge multiple audio files into one.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mergeAudiosApiV1MediaAudioToolsMergePost(
        formData: Body_merge_audios_api_v1_media_audio_tools_merge_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/merge',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Clean Audio Pauses Handler
     * Clean long pauses from the audio based on the provided script.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static cleanAudioPausesHandlerApiV1MediaAudioToolsTrimPausesPost(
        formData: Body_clean_audio_pauses_handler_api_v1_media_audio_tools_trim_pauses_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/trim-pauses',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload File
     * Upload a file and return its ID.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadFileApiV1MediaStoragePost(
        formData: Body_upload_file_api_v1_media_storage_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/storage',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Download File
     * Download a file by its ID.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadFileApiV1MediaStorageFileIdGet(
        fileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/storage/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete File
     * Delete a file by its
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteFileApiV1MediaStorageFileIdDelete(
        fileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/media/storage/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * File Status
     * Check the status of a file by its ID.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static fileStatusApiV1MediaStorageFileIdStatusGet(
        fileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/storage/{file_id}/status',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Merge Videos
     * Merge multiple videos into one.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mergeVideosApiV1MediaVideoToolsMergePost(
        formData: Body_merge_videos_api_v1_media_video_tools_merge_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/merge',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
    public static transcodeVideoApiV1MediaVideoToolsTranscodePost(
        formData: Body_transcode_video_api_v1_media_video_tools_transcode_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/transcode',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Gif Preview
     * Generate a GIF preview from a video.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateGifPreviewApiV1MediaVideoToolsGifPreviewPost(
        formData: Body_generate_gif_preview_api_v1_media_video_tools_gif_preview_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/gif-preview',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Match Duration
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static matchDurationApiV1MediaVideoToolsMatchDurationPost(
        formData: Body_match_duration_api_v1_media_video_tools_match_duration_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/match-duration',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Fonts
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listFontsApiV1MediaFontsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/fonts',
        });
    }
    /**
     * Generate Captioned Video
     * Generate a captioned video from text and background image.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateCaptionedVideoApiV1MediaVideoToolsGenerateTtsCaptionedVideoPost(
        formData: Body_generate_captioned_video_api_v1_media_video_tools_generate_tts_captioned_video_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/generate/tts-captioned-video',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Colorkey Overlay
     * ⚠️ Depcreated - use the generic /video-tools/add-overlay endpoint instead.
     * Overlay a video on a video with the specified colorkey and intensity
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addColorkeyOverlayApiV1MediaVideoToolsAddColorkeyOverlayPost(
        formData: Body_add_colorkey_overlay_api_v1_media_video_tools_add_colorkey_overlay_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/add-colorkey-overlay',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Overlay
     * Add an image or video overlay to a video with specified opacity.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addOverlayApiV1MediaVideoToolsAddOverlayPost(
        formData: Body_add_overlay_api_v1_media_video_tools_add_overlay_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/add-overlay',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
    public static extractFrameApiV1MediaVideoToolsExtractFrameVideoIdGet(
        videoId: string,
        timestamp?: (number | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/video-tools/extract-frame/{video_id}',
            path: {
                'video_id': videoId,
            },
            query: {
                'timestamp': timestamp,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Extract Frame From Url
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static extractFrameFromUrlApiV1MediaVideoToolsExtractFramesPost(
        formData: Body_extract_frame_from_url_api_v1_media_video_tools_extract_frames_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/extract-frames',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Video Info
     * Get information about a video file.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getVideoInfoApiV1MediaVideoToolsInfoFileIdGet(
        fileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/video-tools/info/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Audio Info
     * Get information about an audio file.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAudioInfoApiV1MediaAudioToolsInfoFileIdGet(
        fileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/audio-tools/info/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Long Form Ambient Video
     * Generate a long-form ambient video
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateLongFormAmbientVideoApiV1MediaVideoToolsLongFormAmbientPost(
        formData: Body_generate_long_form_ambient_video_api_v1_media_video_tools_long_form_ambient_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/long-form-ambient',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Extend Audio
     * Extend an audio file to a specified duration.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static extendAudioApiV1MediaAudioToolsExtendAudioPost(
        formData: Body_extend_audio_api_v1_media_audio_tools_extend_audio_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/extend-audio',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Align Script
     * Align a script to an audio file and return word timings and segmented chunks.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static alignScriptApiV1MediaAudioToolsAlignScriptPost(
        formData: Body_align_script_api_v1_media_audio_tools_align_script_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/align-script',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
    public static generateRevengeStoryVideoJsonApiV1MediaVideoToolsRevengeStoryPost(
        requestBody: RevengeStoryVideoRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/revenge-story',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Looping Video
     * Create a looping video from an input video.
     * This will analyze the input video to find a good loop point and create a seamless looping video.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createLoopingVideoApiV1MediaVideoToolsCreateLoopingVideoPost(
        formData: Body_create_looping_video_api_v1_media_video_tools_create_looping_video_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/create-looping-video',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Normalize Track Handler
     * Normalize an audio track to a standard loudness level.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static normalizeTrackHandlerApiV1MediaMusicToolsNormalizeTrackPost(
        formData: Body_normalize_track_handler_api_v1_media_music_tools_normalize_track_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/normalize-track',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Playlist Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createPlaylistHandlerApiV1MediaMusicToolsCreatePlaylistPost(
        formData: Body_create_playlist_handler_api_v1_media_music_tools_create_playlist_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/create-playlist',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Analyze Track Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeTrackHandlerApiV1MediaMusicToolsAnalyzeTrackPost(
        formData: Body_analyze_track_handler_api_v1_media_music_tools_analyze_track_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/analyze-track',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Mix Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createMixHandlerApiV1MediaMusicToolsCreateMixPost(
        formData: Body_create_mix_handler_api_v1_media_music_tools_create_mix_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/create-mix',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Music Video Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createMusicVideoHandlerApiV1MediaMusicToolsCreateMusicVideoPost(
        formData: Body_create_music_video_handler_api_v1_media_music_tools_create_music_video_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/create-music-video',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Music Thumbnail Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createMusicThumbnailHandlerApiV1MediaMusicToolsCreateThumbnailPost(
        formData: Body_create_music_thumbnail_handler_api_v1_media_music_tools_create_thumbnail_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/create-thumbnail',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Youtube Transcript
     * Get YouTube video transcript by video ID.
     * @param videoId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getYoutubeTranscriptApiV1UtilsYoutubeTranscriptGet(
        videoId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/utils/youtube-transcript',
            query: {
                'video_id': videoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Stitch Images
     * Stitch multiple images into one.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static stitchImagesApiV1UtilsStitchImagesPost(
        formData: Body_stitch_images_api_v1_utils_stitch_images_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/utils/stitch-images',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Image Unaize
     * Remove AI-generated artifacts from an image.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static imageUnaizeApiV1UtilsMakeImageImperfectPost(
        formData: Body_image_unaize_api_v1_utils_make_image_imperfect_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/utils/make-image-imperfect',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Convert Pcm To Wav
     * Convert PCM audio to WAV format.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static convertPcmToWavApiV1UtilsConvertPcmWavPost(
        formData: Body_convert_pcm_to_wav_api_v1_utils_convert_pcm_wav_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/utils/convert/pcm/wav',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Render Html Single Threaded
     * Render HTML content to an image.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static renderHtmlSingleThreadedApiV1UtilsRenderHtmlPost(
        formData: Body_render_html_single_threaded_api_v1_utils_render_html_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/utils/render-html',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
