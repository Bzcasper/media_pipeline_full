import { MediaServerClient } from "../../../sdk";
type Uploadable = Buffer | Blob | File | ArrayBuffer | Uint8Array;
export declare const mediaServer: {
    /**
     * Upload a file to the media server
     */
    uploadFile: (file: Uploadable, mediaType?: "audio" | "video" | "image" | "tmp") => Promise<any>;
    /**
     * Transcribe audio using Riva ASR
     */
    transcribeAudio: (audioFile: Uploadable, language?: string) => Promise<any>;
    /**
     * Generate image
     */
    generateImage: (prompt: string, style?: string, options?: any) => Promise<any>;
    /**
     * Convert image to video
     */
    imageToVideo: (imageFile: Uploadable, options?: any) => Promise<any>;
    /**
     * Run GPU chain
     */
    runGpuChain: (chainName: string, inputs: any) => Promise<any>;
    /**
     * Upload from URL
     */
    uploadFromURL: (url: string, mediaType?: "audio" | "video" | "image" | "tmp") => Promise<never>;
    /**
     * Download file
     */
    downloadFile: (fileId: string) => Promise<never>;
    /**
     * Match video duration to audio
     */
    matchDuration: (videoId: string, audioId: string) => Promise<never>;
    client: MediaServerClient;
};
export default mediaServer;
