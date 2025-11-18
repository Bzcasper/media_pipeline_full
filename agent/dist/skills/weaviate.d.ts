/**
 * Weaviate Indexer Skill
 * Indexes metadata and assets into Weaviate vector database
 */
import { z } from "zod";
import { Logger } from "../utils";
export declare const WeaviateIndexerInput: z.ZodObject<{
    jobId: z.ZodString;
    metadata: z.ZodRecord<z.ZodString, z.ZodAny>;
    assets: z.ZodRecord<z.ZodString, z.ZodAny>;
    transcription: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    metadata?: Record<string, any>;
    jobId?: string;
    assets?: Record<string, any>;
    transcription?: Record<string, any>;
}, {
    metadata?: Record<string, any>;
    jobId?: string;
    assets?: Record<string, any>;
    transcription?: Record<string, any>;
}>;
export declare const WeaviateIndexerOutput: z.ZodObject<{
    indexedIds: z.ZodRecord<z.ZodString, z.ZodString>;
    className: z.ZodString;
}, "strip", z.ZodTypeAny, {
    indexedIds?: Record<string, string>;
    className?: string;
}, {
    indexedIds?: Record<string, string>;
    className?: string;
}>;
export type WeaviateIndexerInputType = z.infer<typeof WeaviateIndexerInput>;
export type WeaviateIndexerOutputType = z.infer<typeof WeaviateIndexerOutput>;
export declare class WeaviateIndexerSkill {
    private logger;
    private client;
    private className;
    constructor(logger: Logger, className?: string);
    run(input: WeaviateIndexerInputType): Promise<WeaviateIndexerOutputType>;
    private ensureClass;
    runWithRetry(input: WeaviateIndexerInputType, maxAttempts?: number): Promise<WeaviateIndexerOutputType>;
}
export default WeaviateIndexerSkill;
