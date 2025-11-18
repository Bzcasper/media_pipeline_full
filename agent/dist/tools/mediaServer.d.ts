/**
 * Media Server Tool
 * Wraps the Media Server SDK for use in agent skills
 */
import { MediaServerClient } from '@trapgod/media-sdk';
export declare const mediaServer: {
    /**
     * Upload a file to the media server
     */
    uploadFile: (file: Buffer | Blob, mediaType?: "audio" | "video" | "image" | "tmp") => Promise<import("@trapgod/media-sdk").MediaServerResponse<any>>;
    /**
     * Upload from URL
     */
    uploadFromURL: (url: string, mediaType?: "audio" | "video" | "image" | "tmp") => Promise<import("@trapgod/media-sdk").MediaServerResponse<any>>;
    /**
     * Transcribe audio using Riva ASR
     */
    transcribeAudio: (audioFile: Buffer, language?: string) => Promise<import("@trapgod/media-sdk").TranscriptionResult>;
    /**
     * Generate audio using Kokoro TTS
     */
    generateTTS: (text: string, voice?: string, speed?: number) => Promise<import("@trapgod/media-sdk").MediaServerResponse<any>>;
    /**
     * Align script to audio and get word timings
     */
    alignScript: (audioId: string, script: string, mode?: "word" | "sentence") => Promise<import("@trapgod/media-sdk").AlignScriptResult>;
    /**
     * Generate captioned video
     */
    generateCaptionedVideo: (backgroundId: string, text: string, options?: any) => Promise<import("@trapgod/media-sdk").MediaServerResponse<any>>;
    /**
     * Create music video
     */
    createMusicVideo: (audioId: string, loopingVideoId: string, options?: any) => Promise<import("@trapgod/media-sdk").MediaServerResponse<any>>;
    /**
     * Merge videos
     */
    mergeVideos: (videoIds: string[], backgroundMusicId?: string) => Promise<import("@trapgod/media-sdk").MediaServerResponse<any>>;
    /**
     * Get file status
     */
    getFileStatus: (fileId: string) => Promise<import("@trapgod/media-sdk").FileStatus>;
    /**
     * Download file
     */
    downloadFile: (fileId: string) => Promise<Response>;
    /**
     * Match video duration to audio
     */
    matchDuration: (videoId: string, audioId: string) => Promise<import("@trapgod/media-sdk").MediaServerResponse<any>>;
    client: MediaServerClient;
};
export default mediaServer;
//# sourceMappingURL=mediaServer.d.ts.map