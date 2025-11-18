/**
 * Modal Labs Tool
 * Handles interactions with Modal Labs for Whisper transcription and image-to-video generation
 */
export interface ModalWhisperParams {
    audioUrl: string;
    model?: 'large-v3' | 'large-v2' | 'medium';
    language?: string;
}
export interface ModalJobResponse {
    job_id: string;
    status: 'queued' | 'running' | 'completed' | 'failed';
    output?: any;
    error?: string;
}
export declare const modal: {
    /**
     * Run Whisper transcription via Modal
     */
    runWhisper: (params: ModalWhisperParams) => Promise<ModalJobResponse>;
    /**
     * Run Wan2.2 image-to-video generation via Modal
     */
    runWan22: (imageUrl: string, prompt?: string) => Promise<ModalJobResponse>;
    /**
     * Poll Modal job status
     */
    pollJob: (jobId: string, maxAttempts?: number, intervalMs?: number) => Promise<ModalJobResponse>;
    /**
     * Run and wait for Modal job
     */
    runAndWait: (jobType: "whisper" | "wan22", params: any) => Promise<any>;
};
export default modal;
//# sourceMappingURL=modal.d.ts.map