'use strict';

var buffer = require('buffer');

var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var FormDataImpl;
var FileImpl;
var isNodeJs = false;
try {
  FormDataImpl = FormData;
  FileImpl = File;
} catch (e) {
  FormDataImpl = __require("form-data");
  isNodeJs = true;
}
function isUploadable(value) {
  return Buffer.isBuffer(value) || value instanceof buffer.Blob || value instanceof File || value instanceof Uint8Array || value instanceof ArrayBuffer;
}
function toFormData(obj) {
  const form = new FormDataImpl();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value === void 0 || value === null) {
        continue;
      }
      if (isUploadable(value) || // Uploadable type guard
      typeof value.pipe === "function" && value.readable) {
        if (isNodeJs && Buffer.isBuffer(value)) {
          form.append(key, value, { filename: "upload", contentType: "application/octet-stream" });
        } else {
          form.append(key, value);
        }
        continue;
      }
      if (typeof value === "object" || Array.isArray(value)) {
        form.append(key, JSON.stringify(value));
        continue;
      }
      form.append(key, String(value));
    }
  }
  return form;
}

// src/client.ts
var MediaClient = class {
  baseURL;
  fetch;
  constructor(options) {
    this.baseURL = options.baseURL;
    this.fetch = options.fetch || globalThis.fetch;
  }
  async request(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    if (options.body instanceof FormData && options.headers) {
      delete options.headers["Content-Type"];
    }
    const response = await this.fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
    }
    return response.json();
  }
  // AUDIO TOOLS
  async transcribeAudio(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/audio-tools/transcribe", {
      method: "POST",
      body: form
    });
  }
  async getKokoroVoices() {
    return this.request("/api/v1/media/audio-tools/tts/kokoro/voices");
  }
  async generateKokoroTts(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/audio-tools/tts/kokoro", {
      method: "POST",
      body: form
    });
  }
  async getChatterboxLanguages() {
    return this.request("/api/v1/media/audio-tools/tts/chatterbox/languages");
  }
  async generateChatterboxTts(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/audio-tools/tts/chatterbox", {
      method: "POST",
      body: form
    });
  }
  async mergeAudios(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/audio-tools/merge", {
      method: "POST",
      body: form
    });
  }
  async trimAudioPauses(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/audio-tools/trim-pauses", {
      method: "POST",
      body: form
    });
  }
  async getAudioInfo(file_id) {
    return this.request(`/api/v1/media/audio-tools/info/${file_id}`);
  }
  async extendAudio(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/audio-tools/extend-audio", {
      method: "POST",
      body: form
    });
  }
  async alignScript(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/audio-tools/align-script", {
      method: "POST",
      body: form
    });
  }
  // STORAGE
  async uploadFile(body) {
    const FormData2 = __require("form-data");
    const form = new FormData2();
    if (body.file) {
      form.append("file", body.file, { filename: "upload", contentType: "application/octet-stream" });
    }
    if (body.media_type) {
      form.append("media_type", body.media_type);
    }
    const url = `${this.baseURL}/api/v1/media/storage`;
    const response = await this.fetch(url, {
      method: "POST",
      body: form,
      headers: form.getHeaders ? form.getHeaders() : void 0
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
    }
    return response.json();
  }
  async downloadFile(file_id) {
    return this.request(`/api/v1/media/storage/${file_id}`);
  }
  async deleteFile(file_id) {
    return this.request(`/api/v1/media/storage/${file_id}`, { method: "DELETE" });
  }
  async getFileStatus(file_id) {
    return this.request(`/api/v1/media/storage/${file_id}/status`);
  }
  // VIDEO TOOLS
  async mergeVideos(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/video-tools/merge", {
      method: "POST",
      body: form
    });
  }
  async transcodeVideo(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/video-tools/transcode", {
      method: "POST",
      body: form
    });
  }
  async generateGifPreview(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/video-tools/gif-preview", {
      method: "POST",
      body: form
    });
  }
  async matchDuration(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/video-tools/match-duration", {
      method: "POST",
      body: form
    });
  }
  async listFonts() {
    return this.request("/api/v1/media/fonts");
  }
  async generateCaptionedVideo(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/video-tools/generate/tts-captioned-video", {
      method: "POST",
      body: form
    });
  }
  async addColorkeyOverlay(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/video-tools/add-colorkey-overlay", {
      method: "POST",
      body: form
    });
  }
  async addOverlay(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/video-tools/add-overlay", {
      method: "POST",
      body: form
    });
  }
  async extractFrame(video_id, timestamp) {
    const params = new URLSearchParams();
    if (timestamp) params.append("timestamp", timestamp.toString());
    return this.request(`/api/v1/media/video-tools/extract-frame/${video_id}?${params.toString()}`);
  }
  async extractFrameFromUrl(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/video-tools/extract-frames", {
      method: "POST",
      body: form
    });
  }
  async getVideoInfo(file_id) {
    return this.request(`/api/v1/media/video-tools/info/${file_id}`);
  }
  async generateLongFormAmbientVideo(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/video-tools/long-form-ambient", {
      method: "POST",
      body: form
    });
  }
  async generateRevengeStoryVideo(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/video-tools/revenge-story", {
      method: "POST",
      body: form
    });
  }
  async createLoopingVideo(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/video-tools/create-looping-video", {
      method: "POST",
      body: form
    });
  }
  // MUSIC TOOLS
  async normalizeTrack(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/music-tools/normalize-track", {
      method: "POST",
      body: form
    });
  }
  async createPlaylist(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/music-tools/create-playlist", {
      method: "POST",
      body: form
    });
  }
  async analyzeTrack(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/music-tools/analyze-track", {
      method: "POST",
      body: form
    });
  }
  async createMix(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/music-tools/create-mix", {
      method: "POST",
      body: form
    });
  }
  async createMusicVideo(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/music-tools/create-music-video", {
      method: "POST",
      body: form
    });
  }
  async createMusicThumbnail(body) {
    const form = toFormData(body);
    return this.request("/api/v1/media/music-tools/create-thumbnail", {
      method: "POST",
      body: form
    });
  }
  // UTILS
  async getYoutubeTranscript(video_id) {
    const params = new URLSearchParams({ video_id });
    return this.request(`/api/v1/utils/youtube-transcript?${params.toString()}`);
  }
  async stitchImages(body) {
    const form = toFormData(body);
    return this.request("/api/v1/utils/stitch-images", {
      method: "POST",
      body: form
    });
  }
  async makeImageImperfect(body) {
    const form = toFormData(body);
    return this.request("/api/v1/utils/make-image-imperfect", {
      method: "POST",
      body: form
    });
  }
  async convertPcmToWav(body) {
    const form = toFormData(body);
    return this.request("/api/v1/utils/convert/pcm/wav", {
      method: "POST",
      body: form
    });
  }
  async renderHtml(body) {
    const form = toFormData(body);
    return this.request("/api/v1/utils/render-html", {
      method: "POST",
      body: form
    });
  }
};

exports.MediaClient = MediaClient;
exports.isUploadable = isUploadable;
exports.toFormData = toFormData;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map