/**
 * Pipeline Orchestrator
 * Coordinates all skills to process music files end-to-end
 */
export interface PipelineInput {
    jobId?: string;
    audioFileId?: string;
    audioBuffer?: Buffer;
    audioUrl?: string;
    title?: string;
    artist?: string;
    album?: string;
}
export interface PipelineOutput {
    jobId: string;
    transcription: string;
    metadata: any;
    coverImageUrl: string;
    videoUrl: string;
    gcsUrls: Record<string, string>;
    success: boolean;
}
export declare class PipelineOrchestrator {
    private jobState;
    private logger;
    constructor(jobId?: string);
    getJobId(): string;
    /**
     * Run the complete pipeline
     */
    run(input: PipelineInput): Promise<PipelineOutput>;
    /**
     * Get current job state
     */
    getState(): import("./utils").JobState;
    /**
     * Get job logs
     */
    getLogs(): import("./utils").LogEntry[];
}
export default PipelineOrchestrator;
