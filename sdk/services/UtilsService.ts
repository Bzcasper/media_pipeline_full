/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_convert_pcm_to_wav_api_v1_utils_convert_pcm_wav_post } from '../models/Body_convert_pcm_to_wav_api_v1_utils_convert_pcm_wav_post';
import type { Body_image_unaize_api_v1_utils_make_image_imperfect_post } from '../models/Body_image_unaize_api_v1_utils_make_image_imperfect_post';
import type { Body_render_html_single_threaded_api_v1_utils_render_html_post } from '../models/Body_render_html_single_threaded_api_v1_utils_render_html_post';
import type { Body_stitch_images_api_v1_utils_stitch_images_post } from '../models/Body_stitch_images_api_v1_utils_stitch_images_post';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UtilsService {
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
