// Universal file type for cross-environment compatibility
type Uploadable = Buffer | Blob | File | ArrayBuffer | Uint8Array;

const getBaseUrl = () => process.env.MEDIA_SERVER_URL || "https://2281a5a294754c19f8c9e2df0be013fb-bobby-casper-4235.aiagentsaz.com";
const getQwenImageUrl = () => process.env.QWEN_IMAGE_URL || "https://ai-tool-pool--nunchaku-qwen-image-fastapi-fastapi-app.modal.run";
const getChatUrl = () => process.env.CHAT_API_URL || "https://chatmock-79551411518.us-central1.run.app";

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
   * Generate storyline video from multiple AI-generated images
   * Creates images in sequence, animates each, and merges into final video
   */
  generateStorylineVideo: async (options: {
    prompts: string[];
    negativePrompt?: string;
    width?: number;
    height?: number;
    imageDuration?: number; // seconds per image
    audioId?: string; // optional background audio
  }) => {
    const results: { imageId: string; videoId: string }[] = [];

    console.log(`Generating ${options.prompts.length} images for storyline...`);

    // Generate images in sequence
    for (let i = 0; i < options.prompts.length; i++) {
      const prompt = options.prompts[i];
      console.log(`[${i + 1}/${options.prompts.length}] Generating: ${prompt.substring(0, 50)}...`);

      // Generate AI image
      const imageResult = await mediaServer.generateAIImage({
        prompt,
        negativePrompt: options.negativePrompt,
        width: options.width || 1024,
        height: options.height || 1024,
        seed: Date.now() + i, // Different seed for each
      });

      // Convert to video using ken burns effect
      const videoResult = await mediaServer.imageToVideo(
        imageResult.imageFileId,
        options.imageDuration || 5
      );

      results.push({
        imageId: imageResult.imageFileId,
        videoId: videoResult.videoFileId,
      });
    }

    // Merge all videos
    const videoIds = results.map(r => r.videoId).join(',');
    const mergeUrl = `${getBaseUrl()}/api/v1/media/video-tools/merge`;

    const params = new URLSearchParams();
    params.append('video_ids', videoIds);
    if (options.audioId) {
      params.append('background_music_id', options.audioId);
      params.append('background_music_volume', '0.3');
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

    return {
      finalVideoId: mergeResult.file_id,
      finalVideoUrl: `${getBaseUrl()}/api/v1/media/storage/${mergeResult.file_id}`,
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
    const url = `${getChatUrl()}/v1/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model || 'gpt-4',
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens || 2048,
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
   * Generate storyline prompts using AI chat
   */
  generateStorylinePrompts: async (options: {
    topic: string;
    numScenes?: number;
    style?: string;
  }) => {
    const numScenes = options.numScenes || 5;
    const style = options.style || 'cinematic, highly detailed, dramatic lighting';

    const systemPrompt = `You are an expert visual storyteller. Generate ${numScenes} detailed image prompts that tell a compelling visual story. Each prompt should be a single scene description suitable for AI image generation.

Return ONLY a JSON array of strings, each being a detailed prompt. No explanation, just the JSON array.

Example format:
["Scene 1 description with visual details...", "Scene 2 description...", ...]`;

    const userPrompt = `Create ${numScenes} sequential image prompts for a story about: ${options.topic}

Style requirements: ${style}

Make each scene visually distinct and progressively build the narrative. Include specific visual details like lighting, colors, composition, and mood.`;

    const result = await mediaServer.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
    });

    try {
      // Parse the JSON array from the response
      const prompts = JSON.parse(result.content);
      return Array.isArray(prompts) ? prompts : [result.content];
    } catch {
      // If parsing fails, split by newlines or return as single prompt
      return result.content.split('\n').filter((p: string) => p.trim().length > 0);
    }
  },

  /**
   * Full AI-powered storyline video generation
   * Uses AI to generate prompts, then creates images and assembles video
   */
  generateAIStorylineVideo: async (options: {
    topic: string;
    numScenes?: number;
    style?: string;
    imageDuration?: number;
    audioId?: string;
    width?: number;
    height?: number;
  }) => {
    console.log('🎬 Generating AI storyline video...');
    console.log(`Topic: ${options.topic}`);

    // Step 1: Generate prompts using AI
    console.log('📝 Generating scene prompts with AI...');
    const prompts = await mediaServer.generateStorylinePrompts({
      topic: options.topic,
      numScenes: options.numScenes || 5,
      style: options.style,
    });
    console.log(`Generated ${prompts.length} scene prompts`);

    // Step 2: Generate storyline video from prompts
    const result = await mediaServer.generateStorylineVideo({
      prompts,
      width: options.width || 1024,
      height: options.height || 1024,
      imageDuration: options.imageDuration || 5,
      audioId: options.audioId,
    });

    return {
      ...result,
      prompts,
    };
  },
};

export default mediaServer;
