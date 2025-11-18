/**
 * AI SDK Agent Implementation
 * Simplified version for music video generation
 */
/**
 * Music Video Generation Agent
 * Simplified AI agent for processing music files
 */
export declare function musicVideoAgent(input: {
    jobId: string;
    prompt: string;
}): Promise<{
    success: boolean;
    jobId: string;
    plan: string;
    error?: undefined;
} | {
    success: boolean;
    jobId: string;
    error: string;
    plan?: undefined;
}>;
/**
 * YouTube Video Generation Agent
 * Simplified agent for YouTube content creation
 */
export declare function youtubeVideoAgent(input: {
    jobId: string;
    query: string;
    videoStyle?: string;
    duration?: number;
}): Promise<{
    success: boolean;
    jobId: string;
    script: string;
    error?: undefined;
} | {
    success: boolean;
    jobId: string;
    error: string;
    script?: undefined;
}>;
