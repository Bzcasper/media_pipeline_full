/**
 * Media Server Tool
 * Wraps the Media Server SDK for use in agent skills
 */

import { MediaServerClient } from '@trapgod/media-sdk';

// Create singleton instance
const client = new MediaServerClient({
  baseUrl: process.env.MEDIA_SERVER_URL || 'https://2281a5a294754c19f8c9e2df0be013fb-bobby-casper-4235.aiagentsaz.com'
});

export const mediaServer = {
  /**
   * Upload a file to the media server
   */
  uploadFile: async (file: Buffer | Blob, mediaType: 'audio' | 'video' | 'image' | 'tmp' = 'tmp') => {
    return await client.storage.upload({
      file,
      media_type: mediaType
    });
  },

  /**
   * Upload from URL
   */
  uploadFromURL: async (url: string, mediaType: 'audio' | 'video' | 'image' | 'tmp' = 'tmp') => {
    return await client.storage.upload({
      url,
      media_type: mediaType
    });
  },

  /**
   * Transcribe audio using Riva ASR
   */
  transcribeAudio: async (audioFile: Buffer, language?: string) => {
    return await client.audio.transcribe({
      audio_file: audioFile,
      language
    });
  },

  /**
   * Generate audio using Kokoro TTS
   */
  generateTTS: async (text: string, voice?: string, speed?: number) => {
    return await client.audio.tts.kokoro({
      text,
      voice,
      speed
    });
  },

  /**
   * Align script to audio and get word timings
   */
  alignScript: async (audioId: string, script: string, mode?: 'word' | 'sentence') => {
    return await client.audio.alignScript({
      audio_id: audioId,
      script,
      mode
    });
  },

  /**
   * Generate captioned video
   */
  generateCaptionedVideo: async (backgroundId: string, text: string, options?: any) => {
    return await client.video.generateCaptionedVideo({
      background_id: backgroundId,
      text,
      ...options
    });
  },

  /**
   * Create music video
   */
  createMusicVideo: async (audioId: string, loopingVideoId: string, options?: any) => {
    return await client.music.createMusicVideo({
      audio_id: audioId,
      looping_video_id: loopingVideoId,
      ...options
    });
  },

  /**
   * Merge videos
   */
  mergeVideos: async (videoIds: string[], backgroundMusicId?: string) => {
    return await client.video.merge({
      video_ids: videoIds.join(','),
      background_music_id: backgroundMusicId
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
      target_duration_seconds: audioInfo.duration
    });
  },

  // Expose the full client for advanced use cases
  client
};

export default mediaServer;
