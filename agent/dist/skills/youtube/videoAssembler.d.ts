/**
 * Video Assembler Skill
 * Combines video clips into a complete storyline with voiceover and music
 */
import { z } from 'zod';
import { Logger } from '../../utils';
export declare const VideoAssemblerInput: z.ZodObject<{
    videos: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        url: z.ZodString;
        duration: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        duration?: number;
        url?: string;
        index?: number;
    }, {
        duration?: number;
        url?: string;
        index?: number;
    }>, "many">;
    script: z.ZodString;
    chunks: z.ZodArray<z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text?: string;
    }, {
        text?: string;
    }>, "many">;
    voiceOver: z.ZodDefault<z.ZodBoolean>;
    backgroundMusic: z.ZodDefault<z.ZodBoolean>;
    transitions: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    script?: string;
    videos?: {
        duration?: number;
        url?: string;
        index?: number;
    }[];
    chunks?: {
        text?: string;
    }[];
    voiceOver?: boolean;
    backgroundMusic?: boolean;
    transitions?: boolean;
}, {
    script?: string;
    videos?: {
        duration?: number;
        url?: string;
        index?: number;
    }[];
    chunks?: {
        text?: string;
    }[];
    voiceOver?: boolean;
    backgroundMusic?: boolean;
    transitions?: boolean;
}>;
export declare const VideoAssemblerOutput: z.ZodObject<{
    videoUrl: z.ZodString;
    videoFileId: z.ZodString;
    duration: z.ZodNumber;
    gcsUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    duration?: number;
    videoFileId?: string;
    videoUrl?: string;
    gcsUrl?: string;
}, {
    duration?: number;
    videoFileId?: string;
    videoUrl?: string;
    gcsUrl?: string;
}>;
export type VideoAssemblerInputType = z.infer<typeof VideoAssemblerInput>;
export type VideoAssemblerOutputType = z.infer<typeof VideoAssemblerOutput>;
export declare class VideoAssemblerSkill {
    private logger;
    constructor(logger: Logger);
    run(input: VideoAssemblerInputType): Promise<VideoAssemblerOutputType>;
    private uploadVideoClips;
    private generateVoiceOver;
    private mergeVideos;
    private uploadToGCS;
}
export default VideoAssemblerSkill;
