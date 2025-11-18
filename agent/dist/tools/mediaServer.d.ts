type Uploadable = Buffer | Blob | File | ArrayBuffer | Uint8Array;
export declare const mediaServer: {
    /**
     * Upload a file to the media server
     */
    uploadFile: (file: Uploadable, mediaType?: "audio" | "video" | "image" | "tmp") => Promise<any>;
    /**
     * Upload from URL
     */
    uploadFromURL: (url: string, mediaType?: "audio" | "video" | "image" | "tmp") => Promise<{
        file_id: string;
        url: string;
    }>;
    /**
     * Transcribe audio using Riva ASR
     */
    transcribeAudio: (audioFile: Uploadable, language?: string) => Promise<{
        text: string;
        segments: any[];
        language: string;
        method: string;
    }>;
    /**
     * Generate image
     */
    generateImage: (prompt: string, style?: string, options?: any) => Promise<{
        imageFileId: string;
        imageUrl: string;
    }>;
    /**
     * Convert image to video
     */
    imageToVideo: (imageFile: Uploadable, options?: any) => Promise<{
        videoFileId: string;
        videoUrl: string;
    }>;
    /**
     * Download file
     */
    downloadFile: (fileId: string) => Promise<Response>;
    /**
     * Match video duration to audio
     */
    matchDuration: (videoId: string, audioId: string) => Promise<{
        file_id: string;
        url: string;
    }>;
    client: {
        utils: {
            renderHTML: (options: any) => Promise<{
                file_id: string;
                url: string;
            }>;
        };
        video: {
            generateCaptionedVideo: (options: any) => Promise<{
                file_id: string;
                url: string;
            }>;
        };
    };
};
export default mediaServer;
