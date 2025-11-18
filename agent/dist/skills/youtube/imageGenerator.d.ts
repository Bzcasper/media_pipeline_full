/**
 * Image Generator Skill
 * Generates images using Modal endpoints
 */
import { z } from 'zod';
import { Logger } from '../../utils';
export declare const ImageGeneratorInput: z.ZodObject<{
    prompts: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        prompt: z.ZodString;
        negativePrompt: z.ZodString;
        style: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        style: string;
        prompt: string;
        index: number;
        negativePrompt: string;
    }, {
        style: string;
        prompt: string;
        index: number;
        negativePrompt: string;
    }>, "many">;
    aspectRatio: z.ZodEnum<["16:9", "9:16", "1:1"]>;
    style: z.ZodString;
    model: z.ZodDefault<z.ZodEnum<["flux-dev", "flux-schnell", "sdxl"]>>;
}, "strip", z.ZodTypeAny, {
    style: string;
    model: "flux-dev" | "flux-schnell" | "sdxl";
    aspectRatio: "16:9" | "9:16" | "1:1";
    prompts: {
        style: string;
        prompt: string;
        index: number;
        negativePrompt: string;
    }[];
}, {
    style: string;
    aspectRatio: "16:9" | "9:16" | "1:1";
    prompts: {
        style: string;
        prompt: string;
        index: number;
        negativePrompt: string;
    }[];
    model?: "flux-dev" | "flux-schnell" | "sdxl" | undefined;
}>;
export declare const ImageGeneratorOutput: z.ZodObject<{
    images: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        url: z.ZodString;
        prompt: z.ZodString;
        status: z.ZodEnum<["success", "failed"]>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        status: "failed" | "success";
        prompt: string;
        index: number;
        metadata?: Record<string, any> | undefined;
    }, {
        url: string;
        status: "failed" | "success";
        prompt: string;
        index: number;
        metadata?: Record<string, any> | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    images: {
        url: string;
        status: "failed" | "success";
        prompt: string;
        index: number;
        metadata?: Record<string, any> | undefined;
    }[];
}, {
    images: {
        url: string;
        status: "failed" | "success";
        prompt: string;
        index: number;
        metadata?: Record<string, any> | undefined;
    }[];
}>;
export type ImageGeneratorInputType = z.infer<typeof ImageGeneratorInput>;
export type ImageGeneratorOutputType = z.infer<typeof ImageGeneratorOutput>;
export declare class ImageGeneratorSkill {
    private logger;
    constructor(logger: Logger);
    run(input: ImageGeneratorInputType): Promise<ImageGeneratorOutputType>;
    private generateSingleImage;
    private callModalImageGen;
    private callReplicateFallback;
    private getDimensions;
}
export default ImageGeneratorSkill;
//# sourceMappingURL=imageGenerator.d.ts.map