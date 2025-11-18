/**
 * YouTube Video Generation Orchestrator
 * Creates complete storyline videos from queries
 *
 * Pipeline:
 * 1. Query → Script Generation (LLM)
 * 2. Script → Chunking (sentence/scene based)
 * 3. Chunks → Image Prompts (LLM)
 * 4. Image Prompts → Image Generation (Modal)
 * 5. Images → AI Validation/Editing
 * 6. Images → Video Generation (Image-to-Video)
 * 7. Videos → Final Assembly (storyline)
 */
export interface YouTubeVideoInput {
    jobId?: string;
    query: string;
    videoStyle?: 'documentary' | 'narrative' | 'educational' | 'entertainment';
    duration?: number;
    aspectRatio?: '16:9' | '9:16' | '1:1';
    voiceOver?: boolean;
    backgroundMusic?: boolean;
}
export interface YouTubeVideoOutput {
    jobId: string;
    script: string;
    scenes: Array<{
        text: string;
        imagePrompt: string;
        imageUrl: string;
        videoUrl: string;
        duration: number;
    }>;
    finalVideoUrl: string;
    metadata: {
        title: string;
        description: string;
        tags: string[];
        thumbnail: string;
    };
    success: boolean;
}
export declare class YouTubeVideoOrchestrator {
    private jobState;
    private logger;
    constructor(jobId?: string);
    /**
     * Run the complete YouTube video generation pipeline
     */
    run(input: YouTubeVideoInput): Promise<YouTubeVideoOutput>;
    /**
     * Generate video metadata for YouTube
     */
    private generateMetadata;
    /**
     * Get current job state
     */
    getState(): import("./utils").JobState;
    /**
     * Get job logs
     */
    getLogs(): import("./utils").LogEntry[];
}
export default YouTubeVideoOrchestrator;
//# sourceMappingURL=youtube-orchestrator.d.ts.map