// Universal file type for cross-environment compatibility
type Uploadable = Buffer | Blob | File | ArrayBuffer | Uint8Array;

const getBaseUrl = () => process.env.MEDIA_SERVER_URL || "https://2281a5a294754c19f8c9e2df0be013fb-bobby-casper-4235.aiagentsaz.com";
const getQwenImageUrl = () => process.env.QWEN_IMAGE_URL || "https://ai-tool-pool--nunchaku-qwen-image-fastapi-fastapi-app.modal.run";
const getChatUrl = () => process.env.CHAT_API_URL || "https://chatmock-79551411518.us-central1.run.app";
const getSvdUrl = () => process.env.SVD_URL || "https://ai-tool-pool--svd-video-web.modal.run";

// Helper to poll for job completion
const pollForCompletion = async (
  checkFn: () => Promise<{ status: string; result?: any; error?: string }>,
  options?: { maxAttempts?: number; intervalMs?: number; onPoll?: (attempt: number) => void }
): Promise<any> => {
  const maxAttempts = options?.maxAttempts || 120; // 10 minutes at 5s intervals
  const intervalMs = options?.intervalMs || 5000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await checkFn();
    options?.onPoll?.(attempt);

    if (response.status === 'completed' || response.status === 'success') {
      return response.result || response;
    }

    if (response.status === 'failed' || response.status === 'error') {
      throw new Error(response.error || 'Job failed');
    }

    // Still processing, wait before next poll
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Polling timeout after ${maxAttempts} attempts`);
};

// Comprehensive endpoint mapping for dynamic agent selection
export const ENDPOINT_CAPABILITIES = {
  // Audio Processing
  audio: {
    transcribe: { endpoint: 'transcribeAudio', description: 'Convert speech to text using Riva ASR' },
    info: { endpoint: 'getAudioInfo', description: 'Get audio file metadata and properties' },
    merge: { endpoint: 'mergeAudios', description: 'Combine multiple audio files' },
    extend: { endpoint: 'extendAudio', description: 'Lengthen audio to match duration' },
    alignScript: { endpoint: 'alignScript', description: 'Sync script with audio timing' },
    tts: {
      kokoro: { endpoint: 'generateTTS', description: 'Text-to-speech using Kokoro' },
      chatterbox: { endpoint: 'generateTTSChatterbox', description: 'Voice cloning TTS' }
    },
    analyze: { endpoint: 'analyzeAudioTrack', description: 'Extract BPM, key, energy from audio' },
    normalize: { endpoint: 'normalizeTrack', description: 'Balance audio levels' }
  },

  // Video Processing
  video: {
    merge: { endpoint: 'mergeVideos', description: 'Combine multiple video clips' },
    transcode: { endpoint: 'transcodeVideo', description: 'Convert video format/resolution' },
    info: { endpoint: 'getVideoInfo', description: 'Get video file metadata' },
    extractFrame: { endpoint: 'extractFrame', description: 'Capture single frame from video' },
    extractFrames: { endpoint: 'extractFrames', description: 'Capture multiple frames from video' },
    matchDuration: { endpoint: 'matchDuration', description: 'Sync video length with audio' },
    addOverlay: { endpoint: 'addVideoOverlay', description: 'Add logos/watermarks to video' },
    generateGif: { endpoint: 'generateVideoGif', description: 'Create animated GIF from video' },
    generateCaptioned: { endpoint: 'generateCaptionedVideo', description: 'Add TTS narration with captions' },
    createLooping: { endpoint: 'createLoopingVideo', description: 'Make video loop seamlessly' },
    generateAmbient: { endpoint: 'generateLongFormAmbient', description: 'Create long ambient videos' }
  },

  // Music Production
  music: {
    normalize: { endpoint: 'normalizeTrack', description: 'Balance music track levels' },
    analyze: { endpoint: 'analyzeAudioTrack', description: 'Extract musical properties' },
    createVideo: { endpoint: 'createMusicVideo', description: 'Generate music video' },
    createThumbnail: { endpoint: 'createThumbnail', description: 'Create album art' },
    createPlaylist: { endpoint: 'createPlaylist', description: 'Build playlist from tracks' },
    createMix: { endpoint: 'createMusicMix', description: 'Mix multiple tracks together' }
  },

  // Image Processing
  image: {
    generate: { endpoint: 'generateAIImage', description: 'Create images with AI' },
    toVideo: { endpoint: 'imageToVideo', description: 'Convert static image to video' },
    animate: { endpoint: 'animateWithSVD', description: 'Add motion to images' },
    renderHTML: { endpoint: 'renderHTMLToImage', description: 'Convert HTML to image' },

    makeImperfect: { endpoint: 'makeImageImperfect', description: 'Remove AI artifacts' }
  },

  // Utility Functions
  utils: {
    renderHTML: { endpoint: 'renderHTMLToImage', description: 'HTML to image conversion' },
    stitchImages: { endpoint: 'stitchImages', description: 'Image composition' },
    youtubeTranscript: { endpoint: 'getYouTubeTranscript', description: 'Extract video transcripts' },
    makeImperfect: { endpoint: 'makeImageImperfect', description: 'Humanize AI images' }
  },

  // File Operations
  storage: {
    upload: { endpoint: 'uploadFile', description: 'Upload files to media server' },
    download: { endpoint: 'downloadFile', description: 'Download files from media server' },
    delete: { endpoint: 'deleteFile', description: 'Remove files from media server' },
    status: { endpoint: 'getFileStatus', description: 'Check file processing status' }
  },

  // AI Services
  ai: {
    chat: { endpoint: 'chatCompletion', description: 'AI text generation and reasoning' },
    image: { endpoint: 'generateAIImage', description: 'AI-powered image creation' },
    storyline: { endpoint: 'generateStorylinePrompts', description: 'Generate video story concepts' }
  }
};

// Dynamic endpoint selector for agents
export const selectEndpoint = (task: string, context?: any) => {
  const task_lower = task.toLowerCase();

  // Audio processing tasks
  if (task_lower.includes('transcribe') || task_lower.includes('speech to text')) {
    return ENDPOINT_CAPABILITIES.audio.transcribe;
  }
  if (task_lower.includes('analyze audio') || task_lower.includes('bpm') || task_lower.includes('key detection')) {
    return ENDPOINT_CAPABILITIES.audio.analyze;
  }
  if (task_lower.includes('text to speech') || task_lower.includes('tts')) {
    return ENDPOINT_CAPABILITIES.audio.tts.kokoro;
  }
  if (task_lower.includes('merge audio') || task_lower.includes('combine audio')) {
    return ENDPOINT_CAPABILITIES.audio.merge;
  }

  // Video processing tasks
  if (task_lower.includes('generate image') || task_lower.includes('create image') || task_lower.includes('ai image')) {
    return ENDPOINT_CAPABILITIES.image.generate;
  }
  if (task_lower.includes('animate image') || task_lower.includes('image to video') || task_lower.includes('svd animation')) {
    return ENDPOINT_CAPABILITIES.image.animate;
  }
  if (task_lower.includes('add captions') || task_lower.includes('captioned video')) {
    return ENDPOINT_CAPABILITIES.video.generateCaptioned;
  }
  if (task_lower.includes('create gif') || task_lower.includes('gif preview') || task_lower.includes('animated gif')) {
    return ENDPOINT_CAPABILITIES.video.generateGif;
  }
  if (task_lower.includes('add overlay') || task_lower.includes('watermark')) {
    return ENDPOINT_CAPABILITIES.video.addOverlay;
  }
  if (task_lower.includes('transcode') || task_lower.includes('convert video')) {
    return ENDPOINT_CAPABILITIES.video.transcode;
  }
  if (task_lower.includes('merge video') || task_lower.includes('combine video')) {
    return ENDPOINT_CAPABILITIES.video.merge;
  }

  // Music production tasks
  if (task_lower.includes('create mix') || task_lower.includes('mix tracks')) {
    return ENDPOINT_CAPABILITIES.music.createMix;
  }
  if (task_lower.includes('normalize') || task_lower.includes('balance audio')) {
    return ENDPOINT_CAPABILITIES.music.normalize;
  }

  // Utility tasks
  if (task_lower.includes('render html') || task_lower.includes('html to image')) {
    return ENDPOINT_CAPABILITIES.utils.renderHTML;
  }
  if (task_lower.includes('stitch images') || task_lower.includes('combine images')) {
    return ENDPOINT_CAPABILITIES.utils.stitchImages;
  }
  if (task_lower.includes('youtube transcript') || task_lower.includes('get transcript')) {
    return ENDPOINT_CAPABILITIES.utils.youtubeTranscript;
  }

  // AI tasks
  if (task_lower.includes('chat') || task_lower.includes('reasoning') || task_lower.includes('generate text')) {
    return ENDPOINT_CAPABILITIES.ai.chat;
  }
  if (task_lower.includes('storyline') || task_lower.includes('generate prompts')) {
    return ENDPOINT_CAPABILITIES.ai.storyline;
  }

  // Default fallback
  return null;
};

export const mediaServer = {
  /**
   * Upload a file to the media server
   */
  uploadFile: async (
    file: Uploadable,
    mediaType: "audio" | "video" | "image" | "tmp" = "tmp"
  ) => {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    const fs = require('fs/promises');
    const path = require('path');
    const os = require('os');

    // Convert to Buffer if needed
    let buffer: Buffer;
    if (Buffer.isBuffer(file)) {
      buffer = file;
    } else if (file instanceof Uint8Array) {
      buffer = Buffer.from(file);
    } else if (file instanceof ArrayBuffer) {
      buffer = Buffer.from(new Uint8Array(file));
    } else {
      const arrayBuffer = await (file as Blob).arrayBuffer();
      buffer = Buffer.from(new Uint8Array(arrayBuffer));
    }

    const tempDir = os.tmpdir();
    const ext = mediaType === 'image' ? 'png' : mediaType === 'audio' ? 'wav' : mediaType === 'video' ? 'mp4' : 'bin';
    const tempFile = path.join(tempDir, `upload_${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`);

    try {
      await fs.writeFile(tempFile, buffer);
      const url = getBaseUrl();
      const { stdout } = await execAsync(`curl -s -X POST "${url}/api/v1/media/storage" -F "file=@${tempFile}" -F "media_type=${mediaType}"`);
      return JSON.parse(stdout.trim());
    } finally {
      try { await fs.unlink(tempFile); } catch {}
    }
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
    } else if (audioFile instanceof Uint8Array) {
      buffer = Buffer.from(audioFile);
    } else if (audioFile instanceof ArrayBuffer) {
      buffer = Buffer.from(new Uint8Array(audioFile));
    } else {
      const arrayBuffer = await (audioFile as Blob).arrayBuffer();
      buffer = Buffer.from(new Uint8Array(arrayBuffer));
    }

    const { default: FormData } = await import('form-data');
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

    // The render-html endpoint returns raw PNG bytes, so we need to upload it
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const uploadResult = await mediaServer.uploadFile(imageBuffer, 'image');

    return {
      imageFileId: uploadResult.file_id,
      imageUrl: `${getBaseUrl()}/api/v1/media/storage/${uploadResult.file_id}`
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

  /**
   * Check job status (for async operations)
   */
  getJobStatus: async (jobId: string) => {
    const url = `${getBaseUrl()}/api/v1/jobs/${jobId}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Get job status failed: ${response.status} ${await response.text()}`);
    }

    return response.json();
  },

  /**
   * Wait for a job to complete with polling
   */
  waitForJob: async (jobId: string, options?: { maxAttempts?: number; intervalMs?: number }) => {
    return pollForCompletion(
      async () => mediaServer.getJobStatus(jobId),
      {
        ...options,
        onPoll: (attempt) => {
          if (attempt % 6 === 0) { // Log every 30 seconds
            console.log(`⏳ Still waiting for job ${jobId}... (${attempt * 5}s)`);
          }
        }
      }
    );
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

  /**
   * Generate AI image using Qwen model (Modal endpoint)
   */
  generateAIImage: async (options: {
    prompt: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
    cfgScale?: number;
    seed?: number;
  }) => {
    const url = `${getQwenImageUrl()}/generate`;
    const bearerToken = process.env.QWEN_BEARER_TOKEN || process.env.BEARER_TOKEN;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        prompt: options.prompt,
        negative_prompt: options.negativePrompt || "",
        width: options.width || 1024,
        height: options.height || 1024,
        true_cfg_scale: options.cfgScale || 1.0,
        seed: options.seed,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI image generation failed: ${response.status} ${await response.text()}`);
    }

    // Returns raw PNG bytes, upload to media server
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const uploadResult = await mediaServer.uploadFile(imageBuffer, 'image');

    return {
      imageFileId: uploadResult.file_id,
      imageUrl: `${getBaseUrl()}/api/v1/media/storage/${uploadResult.file_id}`
    };
  },

  /**
   * Animate image using SVD (Stable Video Diffusion)
   * Creates smooth video animation from a single image
   */
  animateWithSVD: async (options: {
    imageFileId: string;
    frames?: number; // 14-25, default 25
    steps?: number; // 5-50, default 25
    fps?: number; // 1-30, default 6
    motion?: number; // 1-255, default 127
    seed?: number;
    loopCount?: number; // 1-20, default 1 (15 = ~60s video)
  }) => {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    const fs = require('fs/promises');
    const path = require('path');
    const os = require('os');

    const url = `${getSvdUrl()}/generate`;

    // First download the image from media server
    const imageUrl = `${getBaseUrl()}/api/v1/media/storage/${options.imageFileId}`;
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Save image to temp file for curl
    const tempDir = os.tmpdir();
    const tempImage = path.join(tempDir, `svd_input_${Date.now()}.png`);

    try {
      await fs.writeFile(tempImage, imageBuffer);

      // Use curl to call SVD endpoint
      const curlCmd = `curl -s -X POST "${url}" \
        -F "image=@${tempImage}" \
        -F "frames=${options.frames || 25}" \
        -F "steps=${options.steps || 25}" \
        -F "fps=${options.fps || 6}" \
        -F "motion=${options.motion || 127}" \
        ${options.seed ? `-F "seed=${options.seed}"` : ''} \
        -F "loop_count=${options.loopCount || 1}"`;

      const { stdout } = await execAsync(curlCmd, { maxBuffer: 100 * 1024 * 1024 }); // 100MB buffer for video
      const result = JSON.parse(stdout);

      // Decode base64 video and upload to media server
      const videoBuffer = Buffer.from(result.video, 'base64');
      const uploadResult = await mediaServer.uploadFile(videoBuffer, 'video');

      return {
        videoFileId: uploadResult.file_id,
        videoUrl: `${getBaseUrl()}/api/v1/media/storage/${uploadResult.file_id}`,
        duration: result.duration,
        fps: result.fps,
        frames: result.frames,
        generationTime: result.time,
      };
    } finally {
      try { await fs.unlink(tempImage); } catch {}
    }
  },

  /**
   * Generate TTS audio using Kokoro
   */
  /**
   * Create background music mix from multiple tracks
   */
  createMusicMix: async (audioIds: string[], durationMinutes: number = 5) => {
    const url = `${getBaseUrl()}/api/v1/media/music-tools/create-mix`;

    const params = new URLSearchParams();
    params.append('audio_ids', audioIds.join(','));
    params.append('duration_minutes', durationMinutes.toString());

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Music mix creation failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      mixFileId: result.file_id,
      mixUrl: `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`,
      duration: result.duration,
      tracks: result.tracks,
    };
  },

  /**
   * Analyze audio track for BPM, key, and other properties
   */
  analyzeAudioTrack: async (audioFileId: string) => {
    const url = `${getBaseUrl()}/api/v1/media/music-tools/analyze-track`;

    const params = new URLSearchParams();
    params.append('audio_id', audioFileId);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Audio analysis failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      bpm: result.bpm,
      key: result.key,
      scale: result.scale,
      energy: result.energy,
      danceability: result.danceability,
      analysis: result,
    };
  },

  /**
   * Add overlay to video (logos, watermarks, etc.)
   */
  addVideoOverlay: async (videoId: string, overlayId: string, options?: {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    opacity?: number;
  }) => {
    const url = `${getBaseUrl()}/api/v1/media/video-tools/add-overlay`;

    const params = new URLSearchParams();
    params.append('video_id', videoId);
    params.append('overlay_id', overlayId);

    if (options?.position) params.append('position', options.position);
    if (options?.x !== undefined) params.append('x', options.x.toString());
    if (options?.y !== undefined) params.append('y', options.y.toString());
    if (options?.width) params.append('width', options.width.toString());
    if (options?.height) params.append('height', options.height.toString());
    if (options?.opacity !== undefined) params.append('opacity', options.opacity.toString());

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Video overlay failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      videoFileId: result.file_id,
      videoUrl: `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`,
    };
  },

  /**
   * Generate GIF preview from video
   */
  generateVideoGif: async (videoId: string, options?: {
    startTime?: number;
    duration?: number;
    width?: number;
    height?: number;
  }) => {
    const url = `${getBaseUrl()}/api/v1/media/video-tools/gif-preview`;

    const params = new URLSearchParams();
    params.append('video_id', videoId);

    if (options?.startTime !== undefined) params.append('start_time', options.startTime.toString());
    if (options?.duration) params.append('duration', options.duration.toString());
    if (options?.width) params.append('width', options.width.toString());
    if (options?.height) params.append('height', options.height.toString());

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`GIF generation failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      gifFileId: result.file_id,
      gifUrl: `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`,
    };
  },

  /**
   * Render HTML content to image (for titles, graphics, etc.)
   */
  renderHTMLToImage: async (htmlContent: string, options?: {
    width?: number;
    height?: number;
    backgroundColor?: string;
  }) => {
    const url = `${getBaseUrl()}/api/v1/utils/render-html`;

    const params = new URLSearchParams();
    params.append('html_content', htmlContent);

    if (options?.width) params.append('width', options.width.toString());
    if (options?.height) params.append('height', options.height.toString());
    if (options?.backgroundColor) params.append('background_color', options.backgroundColor);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTML rendering failed: ${response.status} ${errorText}`);
    }

    // Check if response is JSON or binary
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const result = await response.json();
      return {
        imageFileId: result.file_id,
        imageUrl: `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`,
      };
    } else {
      // Handle binary response - upload the image data
      const imageBuffer = Buffer.from(await response.arrayBuffer());
      const uploadResult = await mediaServer.uploadFile(imageBuffer, 'image');
      return {
        imageFileId: uploadResult.file_id,
        imageUrl: `${getBaseUrl()}/api/v1/media/storage/${uploadResult.file_id}`,
      };
    }
  },

  /**
   * Stitch multiple images together (for comparisons, montages, etc.)
   */
  stitchImages: async (imageIds: string[], options?: {
    direction?: 'horizontal' | 'vertical';
    spacing?: number;
    backgroundColor?: string;
  }) => {
    const url = `${getBaseUrl()}/api/v1/utils/stitch-images`;

    const params = new URLSearchParams();
    params.append('image_ids', imageIds.join(','));

    if (options?.direction) params.append('direction', options.direction);
    if (options?.spacing !== undefined) params.append('spacing', options.spacing.toString());
    if (options?.backgroundColor) params.append('background_color', options.backgroundColor);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Image stitching failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      stitchedImageId: result.file_id,
      stitchedImageUrl: `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`,
    };
  },

  /**
   * Extract transcript from YouTube video
   */
  getYouTubeTranscript: async (videoId: string) => {
    const url = `${getBaseUrl()}/api/v1/utils/youtube-transcript`;

    const params = new URLSearchParams();
    params.append('video_id', videoId);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`YouTube transcript extraction failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      transcript: result.transcript,
      language: result.language,
      duration: result.duration,
      segments: result.segments,
    };
  },

  /**
   * Transcode video to different format/resolution
   */
  transcodeVideo: async (videoId: string, options?: {
    format?: string;
    width?: number;
    height?: number;
    bitrate?: number;
    fps?: number;
  }) => {
    const url = `${getBaseUrl()}/api/v1/media/video-tools/transcode`;

    const params = new URLSearchParams();
    params.append('video_id', videoId);

    if (options?.format) params.append('format', options.format);
    if (options?.width) params.append('width', options.width.toString());
    if (options?.height) params.append('height', options.height.toString());
    if (options?.bitrate) params.append('bitrate', options.bitrate.toString());
    if (options?.fps) params.append('fps', options.fps.toString());

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Video transcoding failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      transcodedVideoId: result.file_id,
      transcodedVideoUrl: `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`,
      format: result.format,
      resolution: result.resolution,
    };
  },

  generateTTS: async (text: string, voice?: string) => {
    const url = `${getBaseUrl()}/api/v1/media/audio-tools/tts/kokoro`;

    const params = new URLSearchParams();
    params.append('text', text);
    if (voice) params.append('kokoro_voice', voice);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`TTS generation failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      audioFileId: result.file_id,
      audioUrl: `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`
    };
  },

  /**
   * Generate captioned video from image with TTS voiceover
   */
  generateCaptionedClip: async (options: {
    imageFileId: string;
    narration: string;
    voice?: string;
    captionOn?: boolean;
  }) => {
    const url = `${getBaseUrl()}/api/v1/media/video-tools/generate/tts-captioned-video`;

    const params = new URLSearchParams();
    params.append('background_id', options.imageFileId);
    params.append('text', options.narration);
    params.append('kokoro_voice', options.voice || 'af_sarah');
    params.append('caption_on', (options.captionOn ?? true).toString());
    params.append('image_effect', 'ken_burns');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Captioned video generation failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      videoFileId: result.file_id,
      videoUrl: `${getBaseUrl()}/api/v1/media/storage/${result.file_id}`
    };
  },

  /**
   * Generate storyline video from multiple AI-generated images
   * Creates images in sequence, animates each with voiceover & captions, and merges
   * IMPORTANT: Processes one at a time, waiting for each to complete
   */
  generateStorylineVideo: async (options: {
    prompts: string[];
    narrations?: string[]; // voiceover text for each scene
    negativePrompt?: string;
    width?: number;
    height?: number;
    imageDuration?: number; // seconds per image (used if no narration)
    audioId?: string; // optional background music
    voice?: string; // TTS voice
    captionOn?: boolean; // show captions
    useSVD?: boolean; // use SVD for animation (default true)
    svdLoopCount?: number; // SVD loop count for longer videos (default 3 = ~12s)
    svdMotion?: number; // SVD motion intensity (1-255, default 127)
  }) => {
    const results: { imageId: string; animatedVideoId?: string; videoId: string; prompt: string; narration?: string }[] = [];
    const totalScenes = options.prompts.length;
    const hasNarrations = options.narrations && options.narrations.length === totalScenes;
    const useSVD = options.useSVD ?? true;

    console.log(`\n🎬 Starting storyline generation with ${totalScenes} scenes`);
    if (useSVD) {
      console.log(`🎥 SVD animation enabled (loop: ${options.svdLoopCount || 3}x)`);
    }
    if (hasNarrations) {
      console.log(`🎙️ Voiceover & captions enabled`);
    }
    console.log('━'.repeat(50));

    // Generate images SEQUENTIALLY - one at a time
    for (let i = 0; i < totalScenes; i++) {
      const prompt = options.prompts[i];
      const narration = hasNarrations ? options.narrations![i] : undefined;
      const sceneNum = i + 1;

      console.log(`\n📸 Scene ${sceneNum}/${totalScenes}`);
      console.log(`Prompt: "${prompt.substring(0, 80)}${prompt.length > 80 ? '...' : ''}"`);
      if (narration) {
        console.log(`Narration: "${narration.substring(0, 60)}${narration.length > 60 ? '...' : ''}"`);
      }

      // Step 1: Generate AI image (1024x576 for SVD compatibility)
      console.log(`  → Generating image...`);
      const startTime = Date.now();
      const imageResult = await mediaServer.generateAIImage({
        prompt,
        negativePrompt: options.negativePrompt,
        width: options.width || 1024,
        height: options.height || 576, // SVD format 16:9
        seed: Date.now() + i, // Different seed for each
      });
      const imageTime = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`  ✓ Image generated: ${imageResult.imageFileId} (${imageTime}s)`);

      // Small delay between operations
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Animate with SVD if enabled
      let animatedVideoId: string | undefined;
      if (useSVD) {
        console.log(`  → Animating with SVD...`);
        const svdStartTime = Date.now();
        const svdResult = await mediaServer.animateWithSVD({
          imageFileId: imageResult.imageFileId,
          frames: 25,
          steps: 25,
          fps: 8,
          motion: options.svdMotion || 127,
          loopCount: options.svdLoopCount || 3, // ~12s video
        });
        const svdTime = ((Date.now() - svdStartTime) / 1000).toFixed(1);
        console.log(`  ✓ SVD animation: ${svdResult.videoFileId} (${svdTime}s, ${svdResult.duration}s duration)`);
        animatedVideoId = svdResult.videoFileId;

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Step 3: Add voiceover and captions
      let videoResult: { videoFileId: string; videoUrl: string };

      if (narration) {
        // Use captioned video endpoint which handles TTS + captions together
        const baseVideoId = animatedVideoId || imageResult.imageFileId;
        console.log(`  → Adding voiceover & captions...`);
        const videoStartTime = Date.now();

        // Use the TTS captioned video endpoint with the animated video as background
        const captionUrl = `${getBaseUrl()}/api/v1/media/video-tools/generate/tts-captioned-video`;
        const captionParams = new URLSearchParams();
        captionParams.append('background_id', baseVideoId);
        captionParams.append('text', narration);
        captionParams.append('kokoro_voice', options.voice || 'af_sarah');
        captionParams.append('caption_on', 'true');
        captionParams.append('caption_position', 'bottom');

        // Adjust font size based on video dimensions to prevent distortion
        const videoWidth = options.width || 1024;
        const videoHeight = options.height || 576;
        const isPortrait = videoHeight > videoWidth;
        const fontSize = isPortrait ?
          Math.min(32, Math.floor(videoWidth / 18)) :  // Portrait: smaller font
          Math.min(48, Math.floor(videoWidth / 21));   // Landscape: larger font
        captionParams.append('font_size', fontSize.toString());

        // Add margin to prevent text from being cut off
        captionParams.append('margin_bottom', '20');

        const captionResponse = await fetch(captionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: captionParams,
        });

        if (captionResponse.ok) {
          const captionResult = await captionResponse.json();
          videoResult = {
            videoFileId: captionResult.file_id,
            videoUrl: `${getBaseUrl()}/api/v1/media/storage/${captionResult.file_id}`
          };
        } else {
          // Fallback to animated video without captions
          console.log(`  ⚠ Caption failed: ${captionResponse.status}, using animated video`);
          videoResult = {
            videoFileId: baseVideoId,
            videoUrl: `${getBaseUrl()}/api/v1/media/storage/${baseVideoId}`
          };
        }

        const videoTime = ((Date.now() - videoStartTime) / 1000).toFixed(1);
        console.log(`  ✓ Final video: ${videoResult.videoFileId} (${videoTime}s)`);
      } else if (animatedVideoId) {
        // Just use the SVD animated video
        videoResult = {
          videoFileId: animatedVideoId,
          videoUrl: `${getBaseUrl()}/api/v1/media/storage/${animatedVideoId}`
        };
      } else {
        // Simple image-to-video conversion
        console.log(`  → Converting to video...`);
        const videoStartTime = Date.now();
        const simpleResult = await mediaServer.imageToVideo(
          imageResult.imageFileId,
          options.imageDuration || 5
        );
        const videoTime = ((Date.now() - videoStartTime) / 1000).toFixed(1);
        console.log(`  ✓ Video created: ${simpleResult.videoFileId} (${videoTime}s)`);
        videoResult = simpleResult;
      }

      results.push({
        imageId: imageResult.imageFileId,
        animatedVideoId,
        videoId: videoResult.videoFileId,
        prompt,
        narration,
      });

      console.log(`  ✅ Scene ${sceneNum} complete!`);

      // Delay before next scene to ensure server is ready
      if (i < totalScenes - 1) {
        console.log(`  ⏳ Waiting before next scene...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Wait for videos to be fully processed before merging
    console.log(`\n⏳ Waiting for videos to finalize...`);
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Merge all videos
    console.log(`🔗 Merging ${results.length} video clips...`);
    const mergeStartTime = Date.now();
    const videoIds = results.map(r => r.videoId).join(',');
    const mergeUrl = `${getBaseUrl()}/api/v1/media/video-tools/merge`;

    const params = new URLSearchParams();
    params.append('video_ids', videoIds);
    if (options.audioId) {
      params.append('background_music_id', options.audioId);
      params.append('background_music_volume', '0.3');
      console.log(`  → Adding background audio: ${options.audioId}`);
    }

    const mergeResponse = await fetch(mergeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!mergeResponse.ok) {
      throw new Error(`Video merge failed: ${mergeResponse.status} ${await mergeResponse.text()}`);
    }

    const mergeResult = await mergeResponse.json();
    const mergeTime = ((Date.now() - mergeStartTime) / 1000).toFixed(1);
    const finalVideoUrl = `${getBaseUrl()}/api/v1/media/storage/${mergeResult.file_id}`;

    console.log(`  ✓ Videos merged: ${mergeResult.file_id} (${mergeTime}s)`);

    // Generate thumbnail from first scene's image
    console.log(`\n🖼️ Generating thumbnail...`);
    const thumbnailId = results[0].imageId;
    const thumbnailUrl = `${getBaseUrl()}/api/v1/media/storage/${thumbnailId}`;
    console.log(`  ✓ Thumbnail: ${thumbnailId}`);

    // Generate GIF preview
    console.log(`📹 Generating GIF preview...`);
    const gifUrl = `${getBaseUrl()}/api/v1/media/video-tools/gif-preview`;
    const gifParams = new URLSearchParams();
    gifParams.append('video_id', mergeResult.file_id);
    gifParams.append('start_time', '0');
    gifParams.append('duration', '5');
    gifParams.append('fps', '10');
    gifParams.append('width', '480');

    let gifPreviewId: string | null = null;
    try {
      const gifResponse = await fetch(gifUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: gifParams,
      });
      if (gifResponse.ok) {
        const gifResult = await gifResponse.json();
        gifPreviewId = gifResult.file_id;
        console.log(`  ✓ GIF preview: ${gifPreviewId}`);
      }
    } catch {
      console.log(`  ⚠ GIF preview generation skipped`);
    }

    // Download final video
    console.log(`\n📥 Downloading final video...`);
    const fs = require('fs/promises');
    const path = require('path');
    const os = require('os');

    const downloadResponse = await fetch(finalVideoUrl);
    if (downloadResponse.ok) {
      const videoBuffer = Buffer.from(await downloadResponse.arrayBuffer());
      const outputDir = process.env.OUTPUT_DIR || path.join(os.tmpdir(), 'storyline-videos');
      await fs.mkdir(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, mergeResult.file_id);
      await fs.writeFile(outputPath, videoBuffer);
      console.log(`  ✓ Downloaded to: ${outputPath}`);
      console.log(`  ✓ Size: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    }

    console.log(`\n${'━'.repeat(50)}`);
    console.log(`✅ Storyline video complete!`);
    console.log(`   Final video: ${mergeResult.file_id}`);
    console.log(`   Total scenes: ${results.length}`);

    return {
      finalVideoId: mergeResult.file_id,
      finalVideoUrl,
      thumbnailId,
      thumbnailUrl,
      gifPreviewId,
      gifPreviewUrl: gifPreviewId ? `${getBaseUrl()}/api/v1/media/storage/${gifPreviewId}` : null,
      scenes: results,
    };
  },

  /**
   * OpenAI-compatible chat completion
   */
  chatCompletion: async (options: {
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }) => {
    const url = 'https://api.x.ai/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: options.model || 'grok-4-fast-reasoning',
        messages: options.messages,
        temperature: options.temperature ?? 0,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat completion failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    return {
      content: result.choices?.[0]?.message?.content || '',
      usage: result.usage,
      model: result.model,
    };
  },

  /**
   * Generate storyline prompts and narrations using AI chat
   */
  generateStorylinePrompts: async (options: {
    topic: string;
    numScenes?: number;
    style?: string;
    includeNarrations?: boolean;
  }): Promise<{ prompts: string[]; narrations?: string[] }> => {
    const numScenes = options.numScenes || 5;
    const style = options.style || 'cinematic, highly detailed, dramatic lighting';
    const includeNarrations = options.includeNarrations ?? true;

    const systemPrompt = includeNarrations
      ? `You are an expert visual storyteller and narrator. Generate ${numScenes} scenes for a compelling visual story.

For each scene, provide:
1. An image prompt - detailed visual description for AI image generation
2. A narration - spoken voiceover text (2-3 sentences, engaging and dramatic)

Return ONLY a JSON object with this format:
{
  "prompts": ["Image prompt 1...", "Image prompt 2..."],
  "narrations": ["Voiceover for scene 1...", "Voiceover for scene 2..."]
}

No explanation, just the JSON object.`
      : `You are an expert visual storyteller. Generate ${numScenes} detailed image prompts that tell a compelling visual story.

Return ONLY a JSON array of strings, each being a detailed prompt. No explanation, just the JSON array.

Example format:
["Scene 1 description with visual details...", "Scene 2 description...", ...]`;

    const userPrompt = `Create ${numScenes} sequential scenes for a story about: ${options.topic}

Style requirements: ${style}

Make each scene visually distinct and progressively build the narrative. Include specific visual details like lighting, colors, composition, and mood.${includeNarrations ? ' Write narrations that are engaging and suitable for voiceover.' : ''}`;

    const result = await mediaServer.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
    });

    try {
      const parsed = JSON.parse(result.content);

      if (includeNarrations && parsed.prompts && parsed.narrations) {
        return {
          prompts: parsed.prompts,
          narrations: parsed.narrations
        };
      } else if (Array.isArray(parsed)) {
        return { prompts: parsed };
      } else if (parsed.prompts) {
        return { prompts: parsed.prompts, narrations: parsed.narrations };
      }

      return { prompts: [result.content] };
    } catch {
      // If parsing fails, split by newlines
      const lines = result.content.split('\n').filter((p: string) => p.trim().length > 0);
      return { prompts: lines };
    }
  },

  /**
   * Full AI-powered storyline video generation
   * Uses AI to generate script, prompts, and narrations, then creates video with voiceover
   */
   generateAIStorylineVideo: async (options: {
     topic: string;
     numScenes?: number;
     style?: string;
     imageDuration?: number;
     audioId?: string;
     width?: number;
     height?: number;
     voice?: string;
     captionOn?: boolean;
     captionFont?: string;
     useSVD?: boolean;
     svdLoopCount?: number;
     svdMotion?: number;
   }) => {
    console.log('🎬 Generating AI storyline video...');
    console.log(`Topic: ${options.topic}`);

    // Step 1: Generate prompts and narrations using AI
    console.log('📝 Generating scene prompts & narrations with AI...');
    const storyData = await mediaServer.generateStorylinePrompts({
      topic: options.topic,
      numScenes: options.numScenes || 5,
      style: options.style,
      includeNarrations: true,
    });
    console.log(`Generated ${storyData.prompts.length} scenes`);
    if (storyData.narrations) {
      console.log(`Generated ${storyData.narrations.length} narrations for voiceover`);
    }

    // Step 2: Generate storyline video from prompts with voiceover & captions
    const result = await mediaServer.generateStorylineVideo({
      prompts: storyData.prompts,
      narrations: storyData.narrations,
      width: options.width || 1024,
      height: options.height || 1024,
      imageDuration: options.imageDuration || 5,
      audioId: options.audioId,
      voice: options.voice || 'af_sarah',
      captionOn: options.captionOn ?? true,
      useSVD: options.useSVD ?? true,
      svdLoopCount: options.svdLoopCount ?? 2,
      svdMotion: options.svdMotion ?? 100,
    });

    return {
      ...result,
      prompts: storyData.prompts,
      narrations: storyData.narrations,
    };
  },
};

export default mediaServer;
