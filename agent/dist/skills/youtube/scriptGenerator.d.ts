/**
 * Script Generator Skill
 * Generates video scripts from queries using LLM
 */
import { z } from 'zod';
import { Logger } from '../../utils';
export declare const ScriptGeneratorInput: z.ZodObject<{
    query: z.ZodString;
    style: z.ZodEnum<["documentary", "narrative", "educational", "entertainment"]>;
    targetDuration: z.ZodDefault<z.ZodNumber>;
    tone: z.ZodOptional<z.ZodEnum<["formal", "casual", "enthusiastic", "serious"]>>;
}, "strip", z.ZodTypeAny, {
    style: "documentary" | "narrative" | "educational" | "entertainment";
    query: string;
    targetDuration: number;
    tone?: "formal" | "casual" | "enthusiastic" | "serious" | undefined;
}, {
    style: "documentary" | "narrative" | "educational" | "entertainment";
    query: string;
    targetDuration?: number | undefined;
    tone?: "formal" | "casual" | "enthusiastic" | "serious" | undefined;
}>;
export declare const ScriptGeneratorOutput: z.ZodObject<{
    script: z.ZodString;
    title: z.ZodString;
    hook: z.ZodString;
    suggestedSceneCount: z.ZodNumber;
    estimatedDuration: z.ZodNumber;
    keywords: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    keywords: string[];
    script: string;
    hook: string;
    suggestedSceneCount: number;
    estimatedDuration: number;
}, {
    title: string;
    keywords: string[];
    script: string;
    hook: string;
    suggestedSceneCount: number;
    estimatedDuration: number;
}>;
export type ScriptGeneratorInputType = z.infer<typeof ScriptGeneratorInput>;
export type ScriptGeneratorOutputType = z.infer<typeof ScriptGeneratorOutput>;
export declare class ScriptGeneratorSkill {
    private logger;
    constructor(logger: Logger);
    run(input: ScriptGeneratorInputType): Promise<ScriptGeneratorOutputType>;
    private generateScript;
    private generateWithClaude;
    private generateWithGPT;
    private parseScriptResponse;
    private generateTemplateScript;
    private calculateSceneCount;
    private extractKeywords;
}
export default ScriptGeneratorSkill;
//# sourceMappingURL=scriptGenerator.d.ts.map