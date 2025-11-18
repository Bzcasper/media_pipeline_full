/**
 * Script Chunker Skill
 * Breaks scripts into scenes for visualization
 */
import { z } from 'zod';
import { Logger } from '../../utils';
export declare const ScriptChunkerInput: z.ZodObject<{
    script: z.ZodString;
    targetScenes: z.ZodDefault<z.ZodNumber>;
    maxWordsPerScene: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    script?: string;
    targetScenes?: number;
    maxWordsPerScene?: number;
}, {
    script?: string;
    targetScenes?: number;
    maxWordsPerScene?: number;
}>;
export declare const ScriptChunkerOutput: z.ZodObject<{
    scenes: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        text: z.ZodString;
        wordCount: z.ZodNumber;
        estimatedDuration: z.ZodNumber;
        visualDescription: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text?: string;
        estimatedDuration?: number;
        index?: number;
        wordCount?: number;
        visualDescription?: string;
    }, {
        text?: string;
        estimatedDuration?: number;
        index?: number;
        wordCount?: number;
        visualDescription?: string;
    }>, "many">;
    totalScenes: z.ZodNumber;
    totalDuration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    scenes?: {
        text?: string;
        estimatedDuration?: number;
        index?: number;
        wordCount?: number;
        visualDescription?: string;
    }[];
    totalScenes?: number;
    totalDuration?: number;
}, {
    scenes?: {
        text?: string;
        estimatedDuration?: number;
        index?: number;
        wordCount?: number;
        visualDescription?: string;
    }[];
    totalScenes?: number;
    totalDuration?: number;
}>;
export type ScriptChunkerInputType = z.infer<typeof ScriptChunkerInput>;
export type ScriptChunkerOutputType = z.infer<typeof ScriptChunkerOutput>;
export declare class ScriptChunkerSkill {
    private logger;
    constructor(logger: Logger);
    run(input: ScriptChunkerInputType): Promise<ScriptChunkerOutputType>;
    private splitBySentences;
    private estimateDuration;
    private generateVisualDescription;
}
export default ScriptChunkerSkill;
