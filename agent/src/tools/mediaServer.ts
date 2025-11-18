import { MediaServerClient } from "@trapgod/media-sdk";

// Universal file type for cross-environment compatibility
type Uploadable = Buffer | Blob | File | ArrayBuffer | Uint8Array;

// Create singleton instance
const client = new MediaServerClient({
  baseUrl:
    process.env.MEDIA_SERVER_URL ||
    "https://2281a5a294754c19f8c9e2df0be013fb-bobby-casper-4235.aiagentsaz.com",
});

export const mediaServer = {
  /**
   * Upload a file to the media server
   */
  uploadFile: async (
    file: Uploadable,
    mediaType: "audio" | "video" | "image" | "tmp" = "tmp"
  ) => {
    // Use curl subprocess to ensure compatibility with the working curl command
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    // Create temporary file
    const fs = require('fs/promises');
    const path = require('path');
    const os = require('os');

    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `upload_${Date.now()}_${Math.random().toString(36).substring(2)}`);

    try {
      // Write file to temp location
      await fs.writeFile(tempFile, file);

      // Execute curl command
      const url = process.env.MEDIA_SERVER_URL || "https://2281a5a294754c19f8c9e2df0be013fb-bobby-casper-4235.aiagentsaz.com";
      const { stdout } = await execAsync(`curl -s -X POST "${url}/api/v1/media/storage" -F "file=@${tempFile}" -F "media_type=${mediaType}"`);

      const result = JSON.parse(stdout.trim());
      return result;
    } finally {
      // Clean up temp file
      try {
        await fs.unlink(tempFile);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  },

  /**
   * Upload from URL
   */
  uploadFromURL: async (
    url: string,
    mediaType: "audio" | "video" | "image" | "tmp" = "tmp"
  ) => {
    return await client.storage.upload({
      url,
      media_type: mediaType,
    });
  },

  /**
   * Transcribe audio using Riva ASR
   */
  transcribeAudio: async (audioFile: Uploadable, language?: string) => {
    return await client.audio.transcribe({
      audio_file: audioFile as any,
      language,
    });
  },

  /**
   * Generate audio using Kokoro TTS
   */
  generateTTS: async (text: string, voice?: string, speed?: number) => {
    return await client.audio.tts.kokoro({
      text,
      voice,
      speed,
    });
  },

  /**
   * Align script to audio and get word timings
   */
  alignScript: async (
    audioId: string,
    script: string,
    mode?: "word" | "sentence"
  ) => {
    return await client.audio.alignScript({
      audio_id: audioId,
      script,
      mode,
    });
  },

  /**
   * Generate captioned video
   */
  generateCaptionedVideo: async (
    backgroundId: string,
    text: string,
    options?: any
  ) => {
    return await client.video.generateCaptionedVideo({
      background_id: backgroundId,
      text,
      ...options,
    });
  },

  /**
   * Create music video
   */
  createMusicVideo: async (
    audioId: string,
    loopingVideoId: string,
    options?: any
  ) => {
    return await client.music.createMusicVideo({
      audio_id: audioId,
      looping_video_id: loopingVideoId,
      ...options,
    });
  },

  /**
   * Merge videos
   */
  mergeVideos: async (videoIds: string[], backgroundMusicId?: string) => {
    return await client.video.merge({
      video_ids: videoIds.join(","),
      background_music_id: backgroundMusicId,
    });
  },

  /**
   * Get file status
   */
  getFileStatus: async (fileId: string) => {
    return await client.storage.status(fileId);
  },

  /**
   * Download file
   */
  downloadFile: async (fileId: string) => {
    return await client.storage.download(fileId);
  },

  /**
   * Match video duration to audio
   */
  matchDuration: async (videoId: string, audioId: string) => {
    const audioInfo = await client.audio.info(audioId);
    return await client.video.matchDuration({
      video_id: videoId,
      audio_id: audioId,
      target_duration_seconds: audioInfo.duration,
    });
  },

  // Expose the full client for advanced use cases
  client,
};

export default mediaServer;
