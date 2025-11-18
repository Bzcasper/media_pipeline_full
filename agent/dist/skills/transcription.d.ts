/**
 * Transcription Skill
 * Handles audio transcription with Riva (primary) and Whisper (fallback)
 */
import { z } from "zod";
import { Logger } from "../utils";
export declare const TranscriptionInput: z.ZodEffects<z.ZodObject<{
    audioFileId: z.ZodOptional<z.ZodString>;
    audioBuffer: z.ZodOptional<z.ZodAny>;
    audioUrl: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    audioFileId?: string;
    audioBuffer?: any;
    audioUrl?: string;
    language?: string;
}, {
    audioFileId?: string;
    audioBuffer?: any;
    audioUrl?: string;
    language?: string;
}>, {
    audioFileId?: string;
    audioBuffer?: any;
    audioUrl?: string;
    language?: string;
}, {
    audioFileId?: string;
    audioBuffer?: any;
    audioUrl?: string;
    language?: string;
}>;
export declare const TranscriptionOutput: z.ZodObject<{
    text: z.ZodString;
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
    language: z.ZodOptional<z.ZodString>;
    method: z.ZodEnum<["riva", "whisper"]>;
    duration: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    duration?: number;
    language?: string;
    text?: string;
    segments?: {
        text?: string;
        start?: number;
        end?: number;
        confidence?: number;
    }[];
    method?: "riva" | "whisper";
}, {
    duration?: number;
    language?: string;
    text?: string;
    segments?: {
        text?: string;
        start?: number;
        end?: number;
        confidence?: number;
    }[];
    method?: "riva" | "whisper";
}>;
export type TranscriptionInputType = z.infer<typeof TranscriptionInput>;
export type TranscriptionOutputType = z.infer<typeof TranscriptionOutput>;
/**
 * Transcription Skill
 */
export declare class TranscriptionSkill {
    private logger;
    constructor(logger: Logger);
    /**
     * Run transcription with automatic fallback
     */
    run(input: TranscriptionInputType): Promise<TranscriptionOutputType>;
    /**
     * Transcribe using Riva ASR via Media Server
     */
    private transcribeWithRiva;
    /**
     * Transcribe using Whisper via Modal
     */
    private transcribeWithWhisper;
    /**
     * Retry wrapper
     */
    runWithRetry(input: TranscriptionInputType, maxAttempts?: number): Promise<TranscriptionOutputType>;
}
export default TranscriptionSkill;
