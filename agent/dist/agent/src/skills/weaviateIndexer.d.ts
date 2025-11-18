/**
 * Weaviate Indexer Skill
 * Indexes processed media in Weaviate for semantic search
 */
import { z } from 'zod';
import { Logger } from '../utils';
export declare const WeaviateIndexerInput: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    artist: z.ZodOptional<z.ZodString>;
    album: z.ZodOptional<z.ZodString>;
    genre: z.ZodOptional<z.ZodString>;
    mood: z.ZodOptional<z.ZodString>;
    lyrics: z.ZodOptional<z.ZodString>;
    transcription: z.ZodOptional<z.ZodString>;
    bpm: z.ZodOptional<z.ZodNumber>;
    key: z.ZodOptional<z.ZodString>;
    audioUrl: z.ZodOptional<z.ZodString>;
    coverUrl: z.ZodOptional<z.ZodString>;
    videoUrl: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    key?: string;
    metadata?: Record<string, any>;
    audioUrl?: string;
    lyrics?: string;
    title?: string;
    artist?: string;
    album?: string;
    genre?: string;
    mood?: string;
    bpm?: number;
    videoUrl?: string;
    id?: string;
    transcription?: string;
    coverUrl?: string;
}, {
    key?: string;
    metadata?: Record<string, any>;
    audioUrl?: string;
    lyrics?: string;
    title?: string;
    artist?: string;
    album?: string;
    genre?: string;
    mood?: string;
    bpm?: number;
    videoUrl?: string;
    id?: string;
    transcription?: string;
    coverUrl?: string;
}>;
export declare const WeaviateIndexerOutput: z.ZodObject<{
    indexed: z.ZodBoolean;
    documentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    indexed?: boolean;
    documentId?: string;
}, {
    indexed?: boolean;
    documentId?: string;
}>;
export type WeaviateIndexerInputType = z.infer<typeof WeaviateIndexerInput>;
export type WeaviateIndexerOutputType = z.infer<typeof WeaviateIndexerOutput>;
export declare class WeaviateIndexerSkill {
    private logger;
    constructor(logger: Logger);
    run(input: WeaviateIndexerInputType): Promise<WeaviateIndexerOutputType>;
}
export default WeaviateIndexerSkill;
