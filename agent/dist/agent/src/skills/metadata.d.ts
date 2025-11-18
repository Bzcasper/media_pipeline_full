/**
 * Metadata Extraction Skill
 * Extracts metadata from lyrics using LLM analysis
 */
import { z } from 'zod';
import { Logger } from '../utils';
export declare const MetadataInput: z.ZodObject<{
    lyrics: z.ZodString;
    audioMetadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    lyrics?: string;
    audioMetadata?: Record<string, any>;
}, {
    lyrics?: string;
    audioMetadata?: Record<string, any>;
}>;
export declare const MetadataOutput: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    artist: z.ZodOptional<z.ZodString>;
    album: z.ZodOptional<z.ZodString>;
    genre: z.ZodOptional<z.ZodString>;
    mood: z.ZodOptional<z.ZodString>;
    themes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    language: z.ZodOptional<z.ZodString>;
    bpm: z.ZodOptional<z.ZodNumber>;
    key: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    key?: string;
    language?: string;
    title?: string;
    artist?: string;
    album?: string;
    genre?: string;
    mood?: string;
    themes?: string[];
    bpm?: number;
    summary?: string;
}, {
    key?: string;
    language?: string;
    title?: string;
    artist?: string;
    album?: string;
    genre?: string;
    mood?: string;
    themes?: string[];
    bpm?: number;
    summary?: string;
}>;
export type MetadataInputType = z.infer<typeof MetadataInput>;
export type MetadataOutputType = z.infer<typeof MetadataOutput>;
export declare class MetadataSkill {
    private logger;
    constructor(logger: Logger);
    run(input: MetadataInputType): Promise<MetadataOutputType>;
    private extractBasicMetadata;
}
export default MetadataSkill;
