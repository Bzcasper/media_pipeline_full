/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { ApiError } from './core/ApiError';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { Body_add_colorkey_overlay_api_v1_media_video_tools_add_colorkey_overlay_post } from './models/Body_add_colorkey_overlay_api_v1_media_video_tools_add_colorkey_overlay_post';
export type { Body_add_overlay_api_v1_media_video_tools_add_overlay_post } from './models/Body_add_overlay_api_v1_media_video_tools_add_overlay_post';
export type { Body_align_script_api_v1_media_audio_tools_align_script_post } from './models/Body_align_script_api_v1_media_audio_tools_align_script_post';
export type { Body_analyze_track_handler_api_v1_media_music_tools_analyze_track_post } from './models/Body_analyze_track_handler_api_v1_media_music_tools_analyze_track_post';
export type { Body_clean_audio_pauses_handler_api_v1_media_audio_tools_trim_pauses_post } from './models/Body_clean_audio_pauses_handler_api_v1_media_audio_tools_trim_pauses_post';
export type { Body_convert_pcm_to_wav_api_v1_utils_convert_pcm_wav_post } from './models/Body_convert_pcm_to_wav_api_v1_utils_convert_pcm_wav_post';
export type { Body_create_looping_video_api_v1_media_video_tools_create_looping_video_post } from './models/Body_create_looping_video_api_v1_media_video_tools_create_looping_video_post';
export type { Body_create_mix_handler_api_v1_media_music_tools_create_mix_post } from './models/Body_create_mix_handler_api_v1_media_music_tools_create_mix_post';
export type { Body_create_music_thumbnail_handler_api_v1_media_music_tools_create_thumbnail_post } from './models/Body_create_music_thumbnail_handler_api_v1_media_music_tools_create_thumbnail_post';
export type { Body_create_music_video_handler_api_v1_media_music_tools_create_music_video_post } from './models/Body_create_music_video_handler_api_v1_media_music_tools_create_music_video_post';
export type { Body_create_playlist_handler_api_v1_media_music_tools_create_playlist_post } from './models/Body_create_playlist_handler_api_v1_media_music_tools_create_playlist_post';
export type { Body_extend_audio_api_v1_media_audio_tools_extend_audio_post } from './models/Body_extend_audio_api_v1_media_audio_tools_extend_audio_post';
export type { Body_extract_frame_from_url_api_v1_media_video_tools_extract_frames_post } from './models/Body_extract_frame_from_url_api_v1_media_video_tools_extract_frames_post';
export type { Body_generate_captioned_video_api_v1_media_video_tools_generate_tts_captioned_video_post } from './models/Body_generate_captioned_video_api_v1_media_video_tools_generate_tts_captioned_video_post';
export type { Body_generate_chatterbox_tts_api_v1_media_audio_tools_tts_chatterbox_post } from './models/Body_generate_chatterbox_tts_api_v1_media_audio_tools_tts_chatterbox_post';
export type { Body_generate_gif_preview_api_v1_media_video_tools_gif_preview_post } from './models/Body_generate_gif_preview_api_v1_media_video_tools_gif_preview_post';
export type { Body_generate_kokoro_tts_api_v1_media_audio_tools_tts_kokoro_post } from './models/Body_generate_kokoro_tts_api_v1_media_audio_tools_tts_kokoro_post';
export type { Body_generate_long_form_ambient_video_api_v1_media_video_tools_long_form_ambient_post } from './models/Body_generate_long_form_ambient_video_api_v1_media_video_tools_long_form_ambient_post';
export type { Body_image_unaize_api_v1_utils_make_image_imperfect_post } from './models/Body_image_unaize_api_v1_utils_make_image_imperfect_post';
export type { Body_match_duration_api_v1_media_video_tools_match_duration_post } from './models/Body_match_duration_api_v1_media_video_tools_match_duration_post';
export type { Body_merge_audios_api_v1_media_audio_tools_merge_post } from './models/Body_merge_audios_api_v1_media_audio_tools_merge_post';
export type { Body_merge_videos_api_v1_media_video_tools_merge_post } from './models/Body_merge_videos_api_v1_media_video_tools_merge_post';
export type { Body_normalize_track_handler_api_v1_media_music_tools_normalize_track_post } from './models/Body_normalize_track_handler_api_v1_media_music_tools_normalize_track_post';
export type { Body_render_html_single_threaded_api_v1_utils_render_html_post } from './models/Body_render_html_single_threaded_api_v1_utils_render_html_post';
export type { Body_stitch_images_api_v1_utils_stitch_images_post } from './models/Body_stitch_images_api_v1_utils_stitch_images_post';
export type { Body_transcode_video_api_v1_media_video_tools_transcode_post } from './models/Body_transcode_video_api_v1_media_video_tools_transcode_post';
export type { Body_transcribe_api_v1_media_audio_tools_transcribe_post } from './models/Body_transcribe_api_v1_media_audio_tools_transcribe_post';
export { Body_upload_file_api_v1_media_storage_post } from './models/Body_upload_file_api_v1_media_storage_post';
export type { HTTPValidationError } from './models/HTTPValidationError';
export type { RevengeStoryVideoRequest } from './models/RevengeStoryVideoRequest';
export type { ValidationError } from './models/ValidationError';

export { ApiService } from './services/ApiService';
export { DefaultService } from './services/DefaultService';
export { MediaService } from './services/MediaService';
export { UtilsService } from './services/UtilsService';
export { V1Service } from './services/V1Service';

// Friendly Media Server Client with wrappers
import { MediaService, UtilsService } from './services';
import { OpenAPI } from './core/OpenAPI';

export class MediaServerClient {
  constructor(config: { baseURL: string; apiKey?: string }) {
    OpenAPI.BASE = config.baseURL;
    if (config.apiKey) {
      OpenAPI.HEADERS = { 'Authorization': `Bearer ${config.apiKey}` };
    }
  }

  // Image generation wrapper
  async generateImage(prompt: string, style?: string, options?: any) {
    try {
      // Use MediaService for image generation (assuming endpoint exists)
      return await MediaService.generateImage({ prompt, style, ...options });
    } catch (error) {
      throw new Error(`Image generation failed: ${error}`);
    }
  }

  // Audio transcription wrapper (Riva or GPU chain)
  async transcribeAudio(audioFile: File | string, language?: string) {
    try {
      return await MediaService.transcribeAudio({ audio_file: audioFile, language });
    } catch (error) {
      throw new Error(`Transcription failed: ${error}`);
    }
  }

  // Image-to-video wrapper
  async imageToVideo(imageFile: File | string, options?: any) {
    try {
      return await MediaService.imageToVideo({ image: imageFile, ...options });
    } catch (error) {
      throw new Error(`Image-to-video failed: ${error}`);
    }
  }

  // GPU chains wrapper (predefined pipelines)
  async runGpuChain(chainName: string, inputs: any) {
    try {
      return await MediaService.runGpuChain({ chain: chainName, inputs });
    } catch (error) {
      throw new Error(`GPU chain failed: ${error}`);
    }
  }

  // Utility: Upload file
  async uploadFile(file: File, mediaType: string) {
    try {
      return await MediaService.uploadFile({ file, media_type: mediaType });
    } catch (error) {
      throw new Error(`Upload failed: ${error}`);
    }
  }
}
