/**
 * Image-to-Video Skill
 * Converts static images into animated video clips
 */
import { z } from 'zod';
import { Logger } from '../../utils';
export declare const ImageToVideoInput: z.ZodObject<{
    images: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        index: number;
    }, {
        url: string;
        index: number;
    }>, "many">;
    prompts: z.ZodArray<z.ZodString, "many">;
    duration: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    duration: number;
    prompts: string[];
    images: {
        url: string;
        index: number;
    }[];
}, {
    prompts: string[];
    images: {
        url: string;
        index: number;
    }[];
    duration?: number | undefined;
}>;
export declare const ImageToVideoOutput: z.ZodObject<{
    videos: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        url: z.ZodString;
        duration: z.ZodNumber;
        status: z.ZodEnum<["success", "failed"]>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        duration: number;
        status: "failed" | "success";
        index: number;
        metadata?: Record<string, any> | undefined;
    }, {
        url: string;
        duration: number;
        status: "failed" | "success";
        index: number;
        metadata?: Record<string, any> | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    videos: {
        url: string;
        duration: number;
        status: "failed" | "success";
        index: number;
        metadata?: Record<string, any> | undefined;
    }[];
}, {
    videos: {
        url: string;
        duration: number;
        status: "failed" | "success";
        index: number;
        metadata?: Record<string, any> | undefined;
    }[];
}>;
export type ImageToVideoInputType = z.infer<typeof ImageToVideoInput>;
export type ImageToVideoOutputType = z.infer<typeof ImageToVideoOutput>;
export declare class ImageToVideoSkill {
    private logger;
    constructor(logger: Logger);
    run(input: ImageToVideoInputType): Promise<ImageToVideoOutputType>;
    private convertSingleImage;
    private callLTXVideo;
}
export default ImageToVideoSkill;
//# sourceMappingURL=imageToVideo.d.ts.map