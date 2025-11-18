// Universal file type for cross-environment compatibility
type Uploadable = Buffer | Blob | File | ArrayBuffer | Uint8Array;

const getBaseUrl = () => process.env.MEDIA_SERVER_URL || "https://2281a5a294754c19f8c9e2df0be013fb-bobby-casper-4235.aiagentsaz.com";

export const mediaServer = {
  /**
   * Upload a file to the media server
   */
  uploadFile: async (
    file: Uploadable,
    mediaType: "audio" | "video" | "image" | "tmp" = "tmp"
  ) => {
    const url = `${getBaseUrl()}/api/v1/media/storage`;

    // Convert to Buffer if needed
    let buffer: Buffer;
    if (Buffer.isBuffer(file)) {
      buffer = file;
    } else if (file instanceof ArrayBuffer || file instanceof Uint8Array) {
      buffer = Buffer.from(file);
    } else {
      // Handle Blob/File types (browser environment)
      const arrayBuffer = await (file as Blob).arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('file', buffer, { filename: `upload.${mediaType}` });
    formData.append('media_type', mediaType);

    const response = await fetch(url, {
      method: 'POST',
      body: formData as any,
      headers: formData.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${await response.text()}`);
    }

    return response.json();
  },

  /**
   * Upload from URL
   */
  uploadFromURL: async (
    sourceUrl: string,
    mediaType: "audio" | "video" | "image" | "tmp" = "tmp"
  ) => {
    const url = `${getBaseUrl()}/api/v1/media/storage`;

    const params = new URLSearchParams();
    params.append('url', sourceUrl);
    params.append('media_type', mediaType);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Upload from URL failed: ${response.status} ${await response.text()}`);
    }

    return response.json();
  },

  /**
   * Transcribe audio using Riva ASR
   */
  transcribeAudio: async (audioFile: Uploadable, language?: string) => {
    const url = `${getBaseUrl()}/api/v1/media/audio-tools/transcribe`;

    // Convert to Buffer if needed
    let buffer: Buffer;
    if (Buffer.isBuffer(audioFile)) {
      buffer = audioFile;
    } else if (audioFile instanceof ArrayBuffer || audioFile instanceof Uint8Array) {
      buffer = Buffer.from(audioFile);
    } else {
      const arrayBuffer = await (audioFile as Blob).arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('audio_file', buffer, { filename: 'audio.wav' });
    if (language) {
      formData.append('language', language);
    }

    const response = await fetch(url, {
      method: 'POST',
      body: formData as any,
      headers: formData.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Transcription failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return {
      text: result.text || result.transcript || "",
      segments: result.segments || [],
      language: result.language || language || "en",
      method: "riva"
    };
  },

  /**
   * Generate image using HTML rendering
   */
  generateImage: async (htmlContent: string, width = 1024, height = 768) => {
    const url = `${getBaseUrl()}/api/v1/utils/render-html`;

    const params = new URLSearchParams();
    params.append('html_content', htmlContent);
    params.append('width', width.toString());
    params.append('height', height.toString());

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      imageFileId: result.file_id,
      imageUrl: result.url || `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`
    };
  },

  /**
   * Convert image to video using match-duration
   */
  imageToVideo: async (imageFileId: string, durationSeconds: number = 5) => {
    // For image-to-video, we use the captioned video endpoint with no text
    const url = `${getBaseUrl()}/api/v1/media/video-tools/generate/tts-captioned-video`;

    const params = new URLSearchParams();
    params.append('background_id', imageFileId);
    params.append('caption_on', 'false');
    params.append('image_effect', 'ken_burns');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Image to video failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      videoFileId: result.file_id,
      videoUrl: result.url || `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`
    };
  },

  /**
   * Download file by ID
   */
  downloadFile: async (fileId: string) => {
    const url = `${getBaseUrl()}/api/v1/media/storage/${fileId}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${await response.text()}`);
    }

    return response;
  },

  /**
   * Match video duration to audio
   */
  matchDuration: async (videoId: string, audioId: string, targetDurationSeconds?: number) => {
    const url = `${getBaseUrl()}/api/v1/media/video-tools/match-duration`;

    const params = new URLSearchParams();
    params.append('video_id', videoId);
    if (audioId) {
      params.append('audio_id', audioId);
    }
    if (targetDurationSeconds) {
      params.append('target_duration_seconds', targetDurationSeconds.toString());
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Match duration failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      file_id: result.file_id,
      url: result.url || `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`
    };
  },

  /**
   * Get audio info
   */
  getAudioInfo: async (fileId: string) => {
    const url = `${getBaseUrl()}/api/v1/media/audio-tools/info/${fileId}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Get audio info failed: ${response.status} ${await response.text()}`);
    }

    return response.json();
  },

  /**
   * Get video info
   */
  getVideoInfo: async (fileId: string) => {
    const url = `${getBaseUrl()}/api/v1/media/video-tools/info/${fileId}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Get video info failed: ${response.status} ${await response.text()}`);
    }

    return response.json();
  },

  // Client for compatibility with existing code
  client: {
    utils: {
      renderHTML: async (options: { html_content: string; width?: number; height?: number }) => {
        const result = await mediaServer.generateImage(
          options.html_content,
          options.width || 1024,
          options.height || 768
        );
        return { file_id: result.imageFileId, url: result.imageUrl };
      },
    },
    video: {
      generateCaptionedVideo: async (options: {
        background_id: string;
        text?: string;
        audio_id?: string;
        width?: number;
        height?: number;
        kokoro_voice?: string;
        caption_on?: boolean;
      }) => {
        const url = `${getBaseUrl()}/api/v1/media/video-tools/generate/tts-captioned-video`;

        const params = new URLSearchParams();
        params.append('background_id', options.background_id);
        if (options.text) params.append('text', options.text);
        if (options.audio_id) params.append('audio_id', options.audio_id);
        if (options.width) params.append('width', options.width.toString());
        if (options.height) params.append('height', options.height.toString());
        if (options.kokoro_voice) params.append('kokoro_voice', options.kokoro_voice);
        params.append('caption_on', (options.caption_on ?? true).toString());

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params,
        });

        if (!response.ok) {
          throw new Error(`Generate captioned video failed: ${response.status} ${await response.text()}`);
        }

        const result = await response.json();
        return {
          file_id: result.file_id,
          url: result.url || `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`
        };
      },
    }
  },
};

export default mediaServer;
