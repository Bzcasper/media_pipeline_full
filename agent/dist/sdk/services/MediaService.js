"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
var OpenAPI_1 = require("../core/OpenAPI");
var request_1 = require("../core/request");
var MediaService = /** @class */ (function () {
    function MediaService() {
    }
    /**
     * Transcribe
     * Transcribe audio file to text.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.transcribeApiV1MediaAudioToolsTranscribePost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/transcribe',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Get Kokoro Voices
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.getKokoroVoicesApiV1MediaAudioToolsTtsKokoroVoicesGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/audio-tools/tts/kokoro/voices',
        });
    };
    /**
     * Generate Kokoro Tts
     * Generate audio from text using specified TTS engine.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.generateKokoroTtsApiV1MediaAudioToolsTtsKokoroPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/tts/kokoro',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Get Chatterbox Languages
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.getChatterboxLanguagesApiV1MediaAudioToolsTtsChatterboxLanguagesGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/audio-tools/tts/chatterbox/languages',
        });
    };
    /**
     * Generate Chatterbox Tts
     * Generate audio from text using Chatterbox TTS.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.generateChatterboxTtsApiV1MediaAudioToolsTtsChatterboxPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/tts/chatterbox',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Merge Audios
     * Merge multiple audio files into one.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.mergeAudiosApiV1MediaAudioToolsMergePost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/merge',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Clean Audio Pauses Handler
     * Clean long pauses from the audio based on the provided script.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.cleanAudioPausesHandlerApiV1MediaAudioToolsTrimPausesPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/trim-pauses',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Upload File
     * Upload a file and return its ID.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.uploadFileApiV1MediaStoragePost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/storage',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Download File
     * Download a file by its ID.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.downloadFileApiV1MediaStorageFileIdGet = function (fileId) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/storage/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Delete File
     * Delete a file by its
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.deleteFileApiV1MediaStorageFileIdDelete = function (fileId) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/media/storage/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * File Status
     * Check the status of a file by its ID.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.fileStatusApiV1MediaStorageFileIdStatusGet = function (fileId) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/storage/{file_id}/status',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Merge Videos
     * Merge multiple videos into one.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.mergeVideosApiV1MediaVideoToolsMergePost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/merge',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
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
    MediaService.transcodeVideoApiV1MediaVideoToolsTranscodePost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/transcode',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Generate Gif Preview
     * Generate a GIF preview from a video.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.generateGifPreviewApiV1MediaVideoToolsGifPreviewPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/gif-preview',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Match Duration
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.matchDurationApiV1MediaVideoToolsMatchDurationPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/match-duration',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * List Fonts
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.listFontsApiV1MediaFontsGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/fonts',
        });
    };
    /**
     * Generate Captioned Video
     * Generate a captioned video from text and background image.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.generateCaptionedVideoApiV1MediaVideoToolsGenerateTtsCaptionedVideoPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/generate/tts-captioned-video',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Add Colorkey Overlay
     * ⚠️ Depcreated - use the generic /video-tools/add-overlay endpoint instead.
     * Overlay a video on a video with the specified colorkey and intensity
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.addColorkeyOverlayApiV1MediaVideoToolsAddColorkeyOverlayPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/add-colorkey-overlay',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Add Overlay
     * Add an image or video overlay to a video with specified opacity.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.addOverlayApiV1MediaVideoToolsAddOverlayPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/add-overlay',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
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
    MediaService.extractFrameApiV1MediaVideoToolsExtractFrameVideoIdGet = function (videoId, timestamp) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/video-tools/extract-frame/{video_id}',
            path: {
                'video_id': videoId,
            },
            query: {
                'timestamp': timestamp,
            },
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Extract Frame From Url
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.extractFrameFromUrlApiV1MediaVideoToolsExtractFramesPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/extract-frames',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Get Video Info
     * Get information about a video file.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.getVideoInfoApiV1MediaVideoToolsInfoFileIdGet = function (fileId) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/video-tools/info/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Get Audio Info
     * Get information about an audio file.
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.getAudioInfoApiV1MediaAudioToolsInfoFileIdGet = function (fileId) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/audio-tools/info/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Generate Long Form Ambient Video
     * Generate a long-form ambient video
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.generateLongFormAmbientVideoApiV1MediaVideoToolsLongFormAmbientPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/long-form-ambient',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Extend Audio
     * Extend an audio file to a specified duration.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.extendAudioApiV1MediaAudioToolsExtendAudioPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/extend-audio',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Align Script
     * Align a script to an audio file and return word timings and segmented chunks.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.alignScriptApiV1MediaAudioToolsAlignScriptPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/audio-tools/align-script',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
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
    MediaService.generateRevengeStoryVideoJsonApiV1MediaVideoToolsRevengeStoryPost = function (requestBody) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/revenge-story',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Create Looping Video
     * Create a looping video from an input video.
     * This will analyze the input video to find a good loop point and create a seamless looping video.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.createLoopingVideoApiV1MediaVideoToolsCreateLoopingVideoPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/video-tools/create-looping-video',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Normalize Track Handler
     * Normalize an audio track to a standard loudness level.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.normalizeTrackHandlerApiV1MediaMusicToolsNormalizeTrackPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/normalize-track',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Create Playlist Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.createPlaylistHandlerApiV1MediaMusicToolsCreatePlaylistPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/create-playlist',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Analyze Track Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.analyzeTrackHandlerApiV1MediaMusicToolsAnalyzeTrackPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/analyze-track',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Create Mix Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.createMixHandlerApiV1MediaMusicToolsCreateMixPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/create-mix',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Create Music Video Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.createMusicVideoHandlerApiV1MediaMusicToolsCreateMusicVideoPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/create-music-video',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Create Music Thumbnail Handler
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    MediaService.createMusicThumbnailHandlerApiV1MediaMusicToolsCreateThumbnailPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/music-tools/create-thumbnail',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    return MediaService;
}());
exports.MediaService = MediaService;
