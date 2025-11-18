/**
 * Image Prompt Generator Skill
 * Creates detailed image generation prompts from script scenes
 */
import { z } from 'zod';
import { Logger } from '../../utils';
export declare const ImagePromptGeneratorInput: z.ZodObject<{
    scenes: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        text: z.ZodString;
        visualDescription: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        index: number;
        visualDescription: string;
    }, {
        text: string;
        index: number;
        visualDescription: string;
    }>, "many">;
    style: z.ZodEnum<["documentary", "narrative", "educational", "entertainment"]>;
    aspectRatio: z.ZodDefault<z.ZodEnum<["16:9", "9:16", "1:1"]>>;
}, "strip", z.ZodTypeAny, {
    style: "documentary" | "narrative" | "educational" | "entertainment";
    scenes: {
        text: string;
        index: number;
        visualDescription: string;
    }[];
    aspectRatio: "16:9" | "9:16" | "1:1";
}, {
    style: "documentary" | "narrative" | "educational" | "entertainment";
    scenes: {
        text: string;
        index: number;
        visualDescription: string;
    }[];
    aspectRatio?: "16:9" | "9:16" | "1:1" | undefined;
}>;
export declare const ImagePromptGeneratorOutput: z.ZodObject<{
    prompts: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        prompt: z.ZodString;
        negativePrompt: z.ZodString;
        videoMotion: z.ZodString;
        style: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        style: string;
        prompt: string;
        index: number;
        negativePrompt: string;
        videoMotion: string;
    }, {
        style: string;
        prompt: string;
        index: number;
        negativePrompt: string;
        videoMotion: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    prompts: {
        style: string;
        prompt: string;
        index: number;
        negativePrompt: string;
        videoMotion: string;
    }[];
}, {
    prompts: {
        style: string;
        prompt: string;
        index: number;
        negativePrompt: string;
        videoMotion: string;
    }[];
}>;
export type ImagePromptGeneratorInputType = z.infer<typeof ImagePromptGeneratorInput>;
export type ImagePromptGeneratorOutputType = z.infer<typeof ImagePromptGeneratorOutput>;
export declare class ImagePromptGeneratorSkill {
    private logger;
    constructor(logger: Logger);
    run(input: ImagePromptGeneratorInputType): Promise<ImagePromptGeneratorOutputType>;
    private generatePromptForScene;
    private createDetailedPrompt;
    private extractSubjects;
    private extractActions;
    private extractSetting;
    private getStyleModifiers;
    private getQualityTags;
    private getNegativePrompt;
    private generateVideoMotion;
}
export default ImagePromptGeneratorSkill;
//# sourceMappingURL=imagePromptGenerator.d.ts.map