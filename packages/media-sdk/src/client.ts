// src/client.ts
import type * as types from './types';
import { toFormData } from './core';

export interface MediaClientOptions {
  baseURL: string;
  fetch?: typeof fetch;
}

export class MediaClient {
  private baseURL: string;
  private fetch: typeof fetch;

  constructor(options: MediaClientOptions) {
    this.baseURL = options.baseURL;
    this.fetch = options.fetch || globalThis.fetch;
  }

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${path}`;

    // Let the browser or form-data library set the Content-Type header for multipart requests.
    if (options.body instanceof FormData && options.headers) {
        delete (options.headers as Record<string, string>)['Content-Type'];
    }

    const response = await this.fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
    }
    return response.json();
  }

  // AUDIO TOOLS

  async transcribeAudio(body: types.BodyTranscribeAudio): Promise<any> {
    const form = toFormData(body);
    return this.request('/api/v1/media/audio-tools/transcribe', {
      method: 'POST',
      body: form,
    });
  }

  async getKokoroVoices(): Promise<any> {
    return this.request('/api/v1/media/audio-tools/tts/kokoro/voices');
  }

  async generateKokoroTts(body: types.BodyGenerateKokoroTts): Promise<any> {
    const form = toFormData(body);
    return this.request('/api/v1/media/audio-tools/tts/kokoro', {
      method: 'POST',
      body: form,
    });
  }
  
  async getChatterboxLanguages(): Promise<any> {
    return this.request('/api/v1/media/audio-tools/tts/chatterbox/languages');
  }

  async generateChatterboxTts(body: types.BodyGenerateChatterboxTts): Promise<any> {
    const form = toFormData(body);
    return this.request('/api/v1/media/audio-tools/tts/chatterbox', {
        method: 'POST',
        body: form,
    });
  }

  async mergeAudios(body: types.BodyMergeAudios): Promise<any> {
    const form = toFormData(body);
    return this.request('/api/v1/media/audio-tools/merge', {
      method: 'POST',
      body: form,
    });
  }

  async trimAudioPauses(body: types.BodyCleanAudioPauses): Promise<any> {
    const form = toFormData(body);
    return this.request('/api/v1/media/audio-tools/trim-pauses', {
        method: 'POST',
        body: form,
    });
  }

  async getAudioInfo(file_id: string): Promise<any> {
    return this.request(`/api/v1/media/audio-tools/info/${file_id}`);
  }

  async extendAudio(body: types.BodyExtendAudio): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/audio-tools/extend-audio', {
          method: 'POST',
          body: form,
      });
  }
  
  async alignScript(body: types.BodyAlignScript): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/audio-tools/align-script', {
          method: 'POST',
          body: form,
      });
  }

  // STORAGE

  async uploadFile(body: types.BodyUploadFile): Promise<any> {
    // Direct implementation for Node.js compatibility
    const FormData = require('form-data');
    const form = new FormData();

    if (body.file) {
      form.append('file', body.file, { filename: 'upload', contentType: 'application/octet-stream' });
    }
    if (body.media_type) {
      form.append('media_type', body.media_type);
    }

    const url = `${this.baseURL}/api/v1/media/storage`;
    const response = await this.fetch(url, {
      method: 'POST',
      body: form,
      headers: form.getHeaders ? form.getHeaders() : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
    }
    return response.json();
  }

  async downloadFile(file_id: string): Promise<any> {
    return this.request(`/api/v1/media/storage/${file_id}`);
  }

  async deleteFile(file_id: string): Promise<any> {
    return this.request(`/api/v1/media/storage/${file_id}`, { method: 'DELETE' });
  }

  async getFileStatus(file_id: string): Promise<any> {
    return this.request(`/api/v1/media/storage/${file_id}/status`);
  }

  // VIDEO TOOLS

  async mergeVideos(body: types.BodyMergeVideos): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/video-tools/merge', {
          method: 'POST',
          body: form,
      });
  }

  async transcodeVideo(body: types.BodyTranscodeVideo): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/video-tools/transcode', {
          method: 'POST',
          body: form,
      });
  }
  
  async generateGifPreview(body: types.BodyGenerateGifPreview): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/video-tools/gif-preview', {
          method: 'POST',
          body: form,
      });
  }
  
  async matchDuration(body: types.BodyMatchDuration): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/video-tools/match-duration', {
          method: 'POST',
          body: form,
      });
  }
  
  async listFonts(): Promise<any> {
      return this.request('/api/v1/media/fonts');
  }

  async generateCaptionedVideo(body: types.BodyGenerateCaptionVideo): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/video-tools/generate/tts-captioned-video', {
          method: 'POST',
          body: form,
      });
  }

  async addColorkeyOverlay(body: types.BodyAddColorkeyOverlay): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/video-tools/add-colorkey-overlay', {
          method: 'POST',
          body: form,
      });
  }

  async addOverlay(body: types.BodyAddOverlay): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/video-tools/add-overlay', {
          method: 'POST',
          body: form,
      });
  }

  async extractFrame(video_id: string, timestamp?: number): Promise<any> {
    const params = new URLSearchParams();
    if(timestamp) params.append('timestamp', timestamp.toString());
    return this.request(`/api/v1/media/video-tools/extract-frame/${video_id}?${params.toString()}`);
  }

  async extractFrameFromUrl(body: types.BodyExtractFrameFromUrl): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/video-tools/extract-frames', {
          method: 'POST',
          body: form,
      });
  }
  
  async getVideoInfo(file_id: string): Promise<any> {
      return this.request(`/api/v1/media/video-tools/info/${file_id}`);
  }

  async generateLongFormAmbientVideo(body: types.BodyGenerateLongFormAmbientVideo): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/video-tools/long-form-ambient', {
          method: 'POST',
          body: form,
      });
  }

  async generateRevengeStoryVideo(body: types.RevengeStoryVideoRequest): Promise<any> {
    const form = toFormData(body);
    return this.request('/api/v1/media/video-tools/revenge-story', {
        method: 'POST',
        body: form,
    });
  }

  async createLoopingVideo(body: types.BodyCreateLoopingVideo): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/video-tools/create-looping-video', {
          method: 'POST',
          body: form,
      });
  }

  // MUSIC TOOLS

  async normalizeTrack(body: types.BodyNormalizeTrack): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/music-tools/normalize-track', {
          method: 'POST',
          body: form,
      });
  }

  async createPlaylist(body: types.BodyCreatePlaylist): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/music-tools/create-playlist', {
          method: 'POST',
          body: form,
      });
  }

  async analyzeTrack(body: types.BodyAnalyzeTrack): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/music-tools/analyze-track', {
          method: 'POST',
          body: form,
      });
  }
  
  async createMix(body: types.BodyCreateMix): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/music-tools/create-mix', {
          method: 'POST',
          body: form,
      });
  }

  async createMusicVideo(body: types.BodyCreateMusicVideo): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/music-tools/create-music-video', {
          method: 'POST',
          body: form,
      });
  }

  async createMusicThumbnail(body: types.BodyCreateMusicThumbnail): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/media/music-tools/create-thumbnail', {
          method: 'POST',
          body: form,
      });
  }

  // UTILS
  
  async getYoutubeTranscript(video_id: string): Promise<any> {
    const params = new URLSearchParams({ video_id });
    return this.request(`/api/v1/utils/youtube-transcript?${params.toString()}`);
  }

  async stitchImages(body: types.BodyStitchImages): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/utils/stitch-images', {
          method: 'POST',
          body: form,
      });
  }

  async makeImageImperfect(body: types.BodyImageUnaize): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/utils/make-image-imperfect', {
          method: 'POST',
          body: form,
      });
  }

  async convertPcmToWav(body: types.BodyConvertPcmToWav): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/utils/convert/pcm/wav', {
          method: 'POST',
          body: form,
      });
  }
  
  async renderHtml(body: types.BodyRenderHtml): Promise<any> {
      const form = toFormData(body);
      return this.request('/api/v1/utils/render-html', {
          method: 'POST',
          body: form,
      });
  }
}