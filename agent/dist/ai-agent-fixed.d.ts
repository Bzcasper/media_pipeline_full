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
            text: string;
            start: number;
            end: number;
            confidence?: number | undefined;
        }, {
            text: string;
            start: number;
            end: number;
            confidence?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        method: "whisper" | "riva";
        language?: string | undefined;
        segments?: {
            text: string;
            start: number;
            end: number;
            confidence?: number | undefined;
        }[] | undefined;
    }, {
        text: string;
        method: "whisper" | "riva";
        language?: string | undefined;
        segments?: {
            text: string;
            start: number;
            end: number;
            confidence?: number | undefined;
        }[] | undefined;
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
        key?: string | undefined;
        title?: string | undefined;
        artist?: string | undefined;
        album?: string | undefined;
        genre?: string | undefined;
        mood?: string | undefined;
        themes?: string[] | undefined;
        bpm?: number | undefined;
    }, {
        key?: string | undefined;
        title?: string | undefined;
        artist?: string | undefined;
        album?: string | undefined;
        genre?: string | undefined;
        mood?: string | undefined;
        themes?: string[] | undefined;
        bpm?: number | undefined;
    }>>;
    assets: z.ZodOptional<z.ZodObject<{
        coverImageUrl: z.ZodOptional<z.ZodString>;
        videoUrl: z.ZodOptional<z.ZodString>;
        gcsUrls: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        videoUrl?: string | undefined;
        coverImageUrl?: string | undefined;
        gcsUrls?: Record<string, string> | undefined;
    }, {
        videoUrl?: string | undefined;
        coverImageUrl?: string | undefined;
        gcsUrls?: Record<string, string> | undefined;
    }>>;
    processingSteps: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        status: z.ZodEnum<["pending", "in_progress", "completed", "failed"]>;
        output: z.ZodOptional<z.ZodAny>;
        error: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        status: "completed" | "failed" | "pending" | "in_progress";
        error?: string | undefined;
        output?: any;
    }, {
        name: string;
        status: "completed" | "failed" | "pending" | "in_progress";
        error?: string | undefined;
        output?: any;
    }>, "many">;
    totalDuration: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    jobId: string;
    success: boolean;
    processingSteps: {
        name: string;
        status: "completed" | "failed" | "pending" | "in_progress";
        error?: string | undefined;
        output?: any;
    }[];
    metadata?: {
        key?: string | undefined;
        title?: string | undefined;
        artist?: string | undefined;
        album?: string | undefined;
        genre?: string | undefined;
        mood?: string | undefined;
        themes?: string[] | undefined;
        bpm?: number | undefined;
    } | undefined;
    transcription?: {
        text: string;
        method: "whisper" | "riva";
        language?: string | undefined;
        segments?: {
            text: string;
            start: number;
            end: number;
            confidence?: number | undefined;
        }[] | undefined;
    } | undefined;
    assets?: {
        videoUrl?: string | undefined;
        coverImageUrl?: string | undefined;
        gcsUrls?: Record<string, string> | undefined;
    } | undefined;
    totalDuration?: number | undefined;
}, {
    jobId: string;
    success: boolean;
    processingSteps: {
        name: string;
        status: "completed" | "failed" | "pending" | "in_progress";
        error?: string | undefined;
        output?: any;
    }[];
    metadata?: {
        key?: string | undefined;
        title?: string | undefined;
        artist?: string | undefined;
        album?: string | undefined;
        genre?: string | undefined;
        mood?: string | undefined;
        themes?: string[] | undefined;
        bpm?: number | undefined;
    } | undefined;
    transcription?: {
        text: string;
        method: "whisper" | "riva";
        language?: string | undefined;
        segments?: {
            text: string;
            start: number;
            end: number;
            confidence?: number | undefined;
        }[] | undefined;
    } | undefined;
    assets?: {
        videoUrl?: string | undefined;
        coverImageUrl?: string | undefined;
        gcsUrls?: Record<string, string> | undefined;
    } | undefined;
    totalDuration?: number | undefined;
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
    audioFileId?: string | undefined;
    audioBuffer?: any;
    audioUrl?: string | undefined;
    language?: string | undefined;
    title?: string | undefined;
    artist?: string | undefined;
    album?: string | undefined;
}, {
    audioFileId?: string | undefined;
    audioBuffer?: any;
    audioUrl?: string | undefined;
    language?: string | undefined;
    title?: string | undefined;
    artist?: string | undefined;
    album?: string | undefined;
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
//# sourceMappingURL=ai-agent-fixed.d.ts.map