"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsService = void 0;
var OpenAPI_1 = require("../core/OpenAPI");
var request_1 = require("../core/request");
var UtilsService = /** @class */ (function () {
    function UtilsService() {
    }
    /**
     * Get Youtube Transcript
     * Get YouTube video transcript by video ID.
     * @param videoId
     * @returns any Successful Response
     * @throws ApiError
     */
    UtilsService.getYoutubeTranscriptApiV1UtilsYoutubeTranscriptGet = function (videoId) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/v1/utils/youtube-transcript',
            query: {
                'video_id': videoId,
            },
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Stitch Images
     * Stitch multiple images into one.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    UtilsService.stitchImagesApiV1UtilsStitchImagesPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/utils/stitch-images',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Image Unaize
     * Remove AI-generated artifacts from an image.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    UtilsService.imageUnaizeApiV1UtilsMakeImageImperfectPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/utils/make-image-imperfect',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Convert Pcm To Wav
     * Convert PCM audio to WAV format.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    UtilsService.convertPcmToWavApiV1UtilsConvertPcmWavPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/utils/convert/pcm/wav',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Render Html Single Threaded
     * Render HTML content to an image.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    UtilsService.renderHtmlSingleThreadedApiV1UtilsRenderHtmlPost = function (formData) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/utils/render-html',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: "Validation Error",
            },
        });
    };
    return UtilsService;
}());
exports.UtilsService = UtilsService;
