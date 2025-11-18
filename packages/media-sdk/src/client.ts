/**
 * Media Server SDK Client
 * Comprehensive TypeScript client for GPU Media Server API
 */

import FormData from 'form-data';
import * as types from './types';

export interface MediaServerConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class MediaServerClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(config?: Partial<MediaServerConfig>) {
    this.baseUrl = config?.baseUrl || process.env.MEDIA_SERVER_URL || '';
    this.timeout = config?.timeout || 300000; // 5 minutes default
    this.headers = config?.headers || {};
  }

  /**
   * Generic request handler with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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
        throw new types.MediaServerError(
          `HTTP ${response.status}: ${errorText}`,
          response.status,
          errorText
        );
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return (await response.json()) as T;
      }

      // Return as any for binary/file responses
      return response as any;
    } catch (error) {
      if (error instanceof types.MediaServerError) {
        throw error;
      }
      throw new types.MediaServerError(
        `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Helper to create FormData from params
   */
  private createFormData(params: Record<string, any>): FormData {
    const formData = new FormData();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        if (value instanceof Buffer || value instanceof Blob) {
          formData.append(key, value, 'file');
        } else if (typeof value === 'object' && value.name) {
          // File object
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    }

    return formData;
  }

  /**
   * Helper to create URLSearchParams
   */
  private createURLParams(params: Record<string, any>): URLSearchParams {
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
    upload: async (params: types.UploadFileParams): Promise<types.MediaServerResponse> => {
      const formData = this.createFormData(params as any);
      return this.request('/api/v1/media/storage', {
        method: 'POST',
        body: formData as any,
      });
    },

    /**
     * Download a file by its ID
     */
    download: async (fileId: string): Promise<Response> => {
      return this.request(`/api/v1/media/storage/${fileId}`, {
        method: 'GET',
      });
    },

    /**
     * Delete a file by its ID
     */
    delete: async (fileId: string): Promise<types.MediaServerResponse> => {
      return this.request(`/api/v1/media/storage/${fileId}`, {
        method: 'DELETE',
      });
    },

    /**
     * Check file status
     */
    status: async (fileId: string): Promise<types.FileStatus> => {
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
    transcribe: async (params: types.TranscribeParams): Promise<types.TranscriptionResult> => {
      const formData = this.createFormData(params as any);
      return this.request('/api/v1/media/audio-tools/transcribe', {
        method: 'POST',
        body: formData as any,
      });
    },

    /**
     * Get audio file information
     */
    info: async (fileId: string): Promise<any> => {
      return this.request(`/api/v1/media/audio-tools/info/${fileId}`, {
        method: 'GET',
      });
    },

    /**
     * Merge multiple audio files
     */
    merge: async (params: types.MergeAudiosParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/audio-tools/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Extend audio to specified duration
     */
    extend: async (params: types.ExtendAudioParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/audio-tools/extend-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Align script to audio and return word timings
     */
    alignScript: async (params: types.AlignScriptParams): Promise<types.AlignScriptResult> => {
      const urlParams = this.createURLParams(params as any);
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
      getKokoroVoices: async (): Promise<string[]> => {
        return this.request('/api/v1/media/audio-tools/tts/kokoro/voices', {
          method: 'GET',
        });
      },

      /**
       * Generate audio using Kokoro TTS
       */
      kokoro: async (params: types.KokoroTTSParams): Promise<types.MediaServerResponse> => {
        const urlParams = this.createURLParams(params as any);
        return this.request('/api/v1/media/audio-tools/tts/kokoro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: urlParams,
        });
      },

      /**
       * Get available Chatterbox TTS languages
       */
      getChatterboxLanguages: async (): Promise<string[]> => {
        return this.request('/api/v1/media/audio-tools/tts/chatterbox/languages', {
          method: 'GET',
        });
      },

      /**
       * Generate audio using Chatterbox TTS (voice cloning)
       */
      chatterbox: async (params: types.ChatterboxTTSParams): Promise<types.MediaServerResponse> => {
        const formData = this.createFormData(params as any);
        return this.request('/api/v1/media/audio-tools/tts/chatterbox', {
          method: 'POST',
          body: formData as any,
        });
      },
    },
  };

  // ==================== VIDEO TOOLS ====================

  video = {
    /**
     * Merge multiple videos
     */
    merge: async (params: types.MergeVideosParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/video-tools/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Transcode video to different format/quality
     */
    transcode: async (params: types.TranscodeVideoParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/video-tools/transcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Get video file information
     */
    info: async (fileId: string): Promise<any> => {
      return this.request(`/api/v1/media/video-tools/info/${fileId}`, {
        method: 'GET',
      });
    },

    /**
     * Extract single frame from video
     */
    extractFrame: async (videoId: string, timestamp?: number): Promise<types.MediaServerResponse> => {
      const url = `/api/v1/media/video-tools/extract-frame/${videoId}${
        timestamp !== undefined ? `?timestamp=${timestamp}` : ''
      }`;
      return this.request(url, { method: 'GET' });
    },

    /**
     * Extract multiple frames from video URL
     */
    extractFrames: async (params: types.ExtractFramesParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/video-tools/extract-frames', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Match video duration to target or audio
     */
    matchDuration: async (params: types.MatchDurationParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/video-tools/match-duration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Add overlay to video
     */
    addOverlay: async (params: types.AddOverlayParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/video-tools/add-overlay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Generate GIF preview from video
     */
    generateGif: async (videoId: string, startTime?: number, duration?: number): Promise<types.MediaServerResponse> => {
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
    generateCaptionedVideo: async (
      params: types.GenerateCaptionedVideoParams
    ): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/video-tools/generate/tts-captioned-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Create looping video
     */
    createLoopingVideo: async (videoId: string): Promise<types.MediaServerResponse> => {
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
    generateLongFormAmbient: async (params: any): Promise<types.MediaServerResponse> => {
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
    normalizeTrack: async (params: types.NormalizeTrackParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/music-tools/normalize-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Analyze track for BPM, key, etc.
     */
    analyzeTrack: async (params: types.AnalyzeTrackParams): Promise<any> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/music-tools/analyze-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Create music video
     */
    createMusicVideo: async (params: types.CreateMusicVideoParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/music-tools/create-music-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Create music thumbnail
     */
    createThumbnail: async (params: types.CreateMusicThumbnailParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/media/music-tools/create-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Create playlist from audio IDs
     */
    createPlaylist: async (audioIds: string, includeAnalysis?: boolean): Promise<types.MediaServerResponse> => {
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
    createMix: async (audioIds: string, durationMinutes?: number): Promise<types.MediaServerResponse> => {
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
    getFonts: async (): Promise<string[]> => {
      return this.request('/api/v1/media/fonts', {
        method: 'GET',
      });
    },

    /**
     * Render HTML to image
     */
    renderHTML: async (params: types.RenderHTMLParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/utils/render-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Stitch images together
     */
    stitchImages: async (params: types.StitchImagesParams): Promise<types.MediaServerResponse> => {
      const urlParams = this.createURLParams(params as any);
      return this.request('/api/v1/utils/stitch-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams,
      });
    },

    /**
     * Get YouTube transcript
     */
    getYouTubeTranscript: async (videoId: string): Promise<any> => {
      return this.request(`/api/v1/utils/youtube-transcript?video_id=${videoId}`, {
        method: 'GET',
      });
    },

    /**
     * Make image imperfect (remove AI artifacts)
     */
    makeImageImperfect: async (imageId: string, options?: {
      enhance_color?: number;
      enhance_contrast?: number;
      noise_strength?: number;
    }): Promise<types.MediaServerResponse> => {
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
  health = async (): Promise<any> => {
    return this.request('/health', {
      method: 'GET',
    });
  };
}

export default MediaServerClient;
