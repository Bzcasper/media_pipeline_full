/**
 * Album Cover Generation Skill
 * Generates album cover art from metadata and lyrics
 */
import { z } from 'zod';
import { Logger } from '../utils';
export declare const AlbumCoverInput: z.ZodObject<{
    title: z.ZodString;
    artist: z.ZodOptional<z.ZodString>;
    genre: z.ZodOptional<z.ZodString>;
    mood: z.ZodOptional<z.ZodString>;
    lyrics: z.ZodOptional<z.ZodString>;
    style: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    lyrics?: string;
    title?: string;
    artist?: string;
    genre?: string;
    mood?: string;
    style?: string;
}, {
    lyrics?: string;
    title?: string;
    artist?: string;
    genre?: string;
    mood?: string;
    style?: string;
}>;
export declare const AlbumCoverOutput: z.ZodObject<{
    imageFileId: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodString>;
    prompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    imageFileId?: string;
    imageUrl?: string;
    prompt?: string;
}, {
    imageFileId?: string;
    imageUrl?: string;
    prompt?: string;
}>;
export type AlbumCoverInputType = z.infer<typeof AlbumCoverInput>;
export type AlbumCoverOutputType = z.infer<typeof AlbumCoverOutput>;
export declare class AlbumCoverSkill {
    private logger;
    constructor(logger: Logger);
    run(input: AlbumCoverInputType): Promise<AlbumCoverOutputType>;
    private generatePrompt;
    private generateHTMLCover;
    private escapeHtml;
}
export default AlbumCoverSkill;
