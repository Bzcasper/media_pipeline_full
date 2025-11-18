/**
 * Media Pipeline AI Agent - TypeScript Fixed
 * Simplified version with proper types
 */
import { z } from "zod";
export declare const MediaPipelineResult: z.ZodObject<{
    success: z.ZodBoolean;
    jobId: z.ZodString;
    transcription: z.ZodOptional<z.ZodObject<{
        text: z.ZodString;
        language: z.ZodOptional<z.ZodString>;
        method: z.ZodEnum<["riva", "whisper"]>;
        segments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            start: z.ZodNumber;
            end: z.ZodNumber;
            confidence: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            text?: string;
            start?: number;
            end?: number;
            confidence?: number;
        }, {
            text?: string;
            start?: number;
            end?: number;
            confidence?: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        language?: string;
        text?: string;
        segments?: {
            text?: string;
            start?: number;
            end?: number;
            confidence?: number;
        }[];
        method?: "whisper" | "riva";
    }, {
        language?: string;
        text?: string;
        segments?: {
            text?: string;
            start?: number;
            end?: number;
            confidence?: number;
        }[];
        method?: "whisper" | "riva";
    }>>;
    metadata: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        artist: z.ZodOptional<z.ZodString>;
        album: z.ZodOptional<z.ZodString>;
        genre: z.ZodOptional<z.ZodString>;
        mood: z.ZodOptional<z.ZodString>;
        themes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        bpm: z.ZodOptional<z.ZodNumber>;
        key: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        key?: string;
        title?: string;
        artist?: string;
        album?: string;
        genre?: string;
        mood?: string;
        themes?: string[];
        bpm?: number;
    }, {
        key?: string;
        title?: string;
        artist?: string;
        album?: string;
        genre?: string;
        mood?: string;
        themes?: string[];
        bpm?: number;
    }>>;
    assets: z.ZodObject<{
        coverImageUrl: z.ZodOptional<z.ZodString>;
        videoUrl: z.ZodOptional<z.ZodString>;
        gcsUrls: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            url: z.ZodString;
            signedUrl: z.ZodString;
            path: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            signedUrl?: string;
            url?: string;
            path?: string;
        }, {
            signedUrl?: string;
            url?: string;
            path?: string;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        videoUrl?: string;
        gcsUrls?: Record<string, {
            signedUrl?: string;
            url?: string;
            path?: string;
        }>;
        coverImageUrl?: string;
    }, {
        videoUrl?: string;
        gcsUrls?: Record<string, {
            signedUrl?: string;
            url?: string;
            path?: string;
        }>;
        coverImageUrl?: string;
    }>;
    processingSteps: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        status: z.ZodEnum<["pending", "in_progress", "completed", "failed"]>;
        output: z.ZodOptional<z.ZodAny>;
        error: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        error?: string;
        name?: string;
        status?: "pending" | "completed" | "failed" | "in_progress";
        output?: any;
    }, {
        error?: string;
        name?: string;
        status?: "pending" | "completed" | "failed" | "in_progress";
        output?: any;
    }>, "many">;
    totalDuration: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    success?: boolean;
    metadata?: {
        key?: string;
        title?: string;
        artist?: string;
        album?: string;
        genre?: string;
        mood?: string;
        themes?: string[];
        bpm?: number;
    };
    jobId?: string;
    transcription?: {
        language?: string;
        text?: string;
        segments?: {
            text?: string;
            start?: number;
            end?: number;
            confidence?: number;
        }[];
        method?: "whisper" | "riva";
    };
    assets?: {
        videoUrl?: string;
        gcsUrls?: Record<string, {
            signedUrl?: string;
            url?: string;
            path?: string;
        }>;
        coverImageUrl?: string;
    };
    processingSteps?: {
        error?: string;
        name?: string;
        status?: "pending" | "completed" | "failed" | "in_progress";
        output?: any;
    }[];
    totalDuration?: number;
}, {
    success?: boolean;
    metadata?: {
        key?: string;
        title?: string;
        artist?: string;
        album?: string;
        genre?: string;
        mood?: string;
        themes?: string[];
        bpm?: number;
    };
    jobId?: string;
    transcription?: {
        language?: string;
        text?: string;
        segments?: {
            text?: string;
            start?: number;
            end?: number;
            confidence?: number;
        }[];
        method?: "whisper" | "riva";
    };
    assets?: {
        videoUrl?: string;
        gcsUrls?: Record<string, {
            signedUrl?: string;
            url?: string;
            path?: string;
        }>;
        coverImageUrl?: string;
    };
    processingSteps?: {
        error?: string;
        name?: string;
        status?: "pending" | "completed" | "failed" | "in_progress";
        output?: any;
    }[];
    totalDuration?: number;
}>;
export declare const MediaPipelineInput: z.ZodObject<{
    audioFileId: z.ZodOptional<z.ZodString>;
    audioBuffer: z.ZodOptional<z.ZodAny>;
    audioUrl: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    artist: z.ZodOptional<z.ZodString>;
    album: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    audioFileId?: string;
    audioBuffer?: any;
    audioUrl?: string;
    language?: string;
    title?: string;
    artist?: string;
    album?: string;
}, {
    audioFileId?: string;
    audioBuffer?: any;
    audioUrl?: string;
    language?: string;
    title?: string;
    artist?: string;
    album?: string;
}>;
export declare class MediaPipelineAgent {
    private logger;
    constructor();
    /**
     * Process audio file through complete pipeline
     */
    processAudio(input: z.infer<typeof MediaPipelineInput>): Promise<z.infer<typeof MediaPipelineResult>>;
}
export default MediaPipelineAgent;
