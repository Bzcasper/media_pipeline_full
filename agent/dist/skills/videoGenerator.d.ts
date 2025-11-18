/**
 * Video Generator Skill
 * Creates music videos from album covers and audio
 */
import { z } from "zod";
import { Logger } from "../utils";
export declare const VideoGeneratorInput: z.ZodObject<{
    audioFileId: z.ZodString;
    coverImageFileId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    artist: z.ZodOptional<z.ZodString>;
    method: z.ZodOptional<z.ZodEnum<["media_server", "modal_wan22"]>>;
}, "strip", z.ZodTypeAny, {
    audioFileId: string;
    coverImageFileId: string;
    method?: "media_server" | "modal_wan22" | undefined;
    title?: string | undefined;
    artist?: string | undefined;
}, {
    audioFileId: string;
    coverImageFileId: string;
    method?: "media_server" | "modal_wan22" | undefined;
    title?: string | undefined;
    artist?: string | undefined;
}>;
export declare const VideoGeneratorOutput: z.ZodObject<{
    videoFileId: z.ZodString;
    videoUrl: z.ZodOptional<z.ZodString>;
    duration: z.ZodOptional<z.ZodNumber>;
    method: z.ZodString;
}, "strip", z.ZodTypeAny, {
    method: string;
    videoFileId: string;
    duration?: number | undefined;
    videoUrl?: string | undefined;
}, {
    method: string;
    videoFileId: string;
    duration?: number | undefined;
    videoUrl?: string | undefined;
}>;
export type VideoGeneratorInputType = z.infer<typeof VideoGeneratorInput>;
export type VideoGeneratorOutputType = z.infer<typeof VideoGeneratorOutput>;
export declare class VideoGeneratorSkill {
    private logger;
    constructor(logger: Logger);
    run(input: VideoGeneratorInputType): Promise<VideoGeneratorOutputType>;
    /**
     * Generate video using Media Server music tools
     */
    private generateWithMediaServer;
    /**
     * Generate video using Modal Wan2.2 (image-to-video)
     */
    private generateWithModal;
    runWithRetry(input: VideoGeneratorInputType, maxAttempts?: number): Promise<VideoGeneratorOutputType>;
}
export default VideoGeneratorSkill;
//# sourceMappingURL=videoGenerator.d.ts.map