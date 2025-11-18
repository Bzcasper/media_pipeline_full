/**
 * Image Validator Skill
 * Uses AI to inspect images and determine if they need editing
 */
import { z } from 'zod';
import { Logger } from '../../utils';
export declare const ImageValidatorInput: z.ZodObject<{
    images: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        url: z.ZodString;
        prompt: z.ZodString;
        status: z.ZodEnum<["success", "failed"]>;
    }, "strip", z.ZodTypeAny, {
        status?: "success" | "failed";
        url?: string;
        prompt?: string;
        index?: number;
    }, {
        status?: "success" | "failed";
        url?: string;
        prompt?: string;
        index?: number;
    }>, "many">;
    prompts: z.ZodArray<z.ZodObject<{
        prompt: z.ZodString;
        style: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        style?: string;
        prompt?: string;
    }, {
        style?: string;
        prompt?: string;
    }>, "many">;
    autoFix: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    prompts?: {
        style?: string;
        prompt?: string;
    }[];
    images?: {
        status?: "success" | "failed";
        url?: string;
        prompt?: string;
        index?: number;
    }[];
    autoFix?: boolean;
}, {
    prompts?: {
        style?: string;
        prompt?: string;
    }[];
    images?: {
        status?: "success" | "failed";
        url?: string;
        prompt?: string;
        index?: number;
    }[];
    autoFix?: boolean;
}>;
export declare const ImageValidatorOutput: z.ZodObject<{
    images: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        url: z.ZodString;
        originalUrl: z.ZodString;
        prompt: z.ZodString;
        validated: z.ZodBoolean;
        issues: z.ZodArray<z.ZodString, "many">;
        wasEdited: z.ZodBoolean;
        quality: z.ZodEnum<["excellent", "good", "acceptable", "poor"]>;
    }, "strip", z.ZodTypeAny, {
        url?: string;
        issues?: string[];
        prompt?: string;
        index?: number;
        originalUrl?: string;
        validated?: boolean;
        wasEdited?: boolean;
        quality?: "excellent" | "good" | "acceptable" | "poor";
    }, {
        url?: string;
        issues?: string[];
        prompt?: string;
        index?: number;
        originalUrl?: string;
        validated?: boolean;
        wasEdited?: boolean;
        quality?: "excellent" | "good" | "acceptable" | "poor";
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    images?: {
        url?: string;
        issues?: string[];
        prompt?: string;
        index?: number;
        originalUrl?: string;
        validated?: boolean;
        wasEdited?: boolean;
        quality?: "excellent" | "good" | "acceptable" | "poor";
    }[];
}, {
    images?: {
        url?: string;
        issues?: string[];
        prompt?: string;
        index?: number;
        originalUrl?: string;
        validated?: boolean;
        wasEdited?: boolean;
        quality?: "excellent" | "good" | "acceptable" | "poor";
    }[];
}>;
export type ImageValidatorInputType = z.infer<typeof ImageValidatorInput>;
export type ImageValidatorOutputType = z.infer<typeof ImageValidatorOutput>;
export declare class ImageValidatorSkill {
    private logger;
    constructor(logger: Logger);
    run(input: ImageValidatorInputType): Promise<ImageValidatorOutputType>;
    private validateAndFixImage;
    private analyzeImage;
    private analyzeWithClaude;
    private analyzeWithGPT;
    private parseAnalysis;
    private editImage;
    private generateEditInstructions;
}
export default ImageValidatorSkill;
