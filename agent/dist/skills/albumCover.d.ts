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
    title: string;
    lyrics?: string | undefined;
    artist?: string | undefined;
    genre?: string | undefined;
    mood?: string | undefined;
    style?: string | undefined;
}, {
    title: string;
    lyrics?: string | undefined;
    artist?: string | undefined;
    genre?: string | undefined;
    mood?: string | undefined;
    style?: string | undefined;
}>;
export declare const AlbumCoverOutput: z.ZodObject<{
    imageFileId: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodString>;
    prompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    imageFileId: string;
    prompt: string;
    imageUrl?: string | undefined;
}, {
    imageFileId: string;
    prompt: string;
    imageUrl?: string | undefined;
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
//# sourceMappingURL=albumCover.d.ts.map