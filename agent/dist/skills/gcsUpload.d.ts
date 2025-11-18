/**
 * GCS Upload Skill
 * Uploads generated assets to Google Cloud Storage
 */
import { z } from 'zod';
import { Logger } from '../utils';
export declare const GCSUploadInput: z.ZodObject<{
    jobId: z.ZodString;
    files: z.ZodRecord<z.ZodString, z.ZodObject<{
        fileId: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        url?: string | undefined;
        fileId?: string | undefined;
    }, {
        name: string;
        url?: string | undefined;
        fileId?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    files: Record<string, {
        name: string;
        url?: string | undefined;
        fileId?: string | undefined;
    }>;
    jobId: string;
}, {
    files: Record<string, {
        name: string;
        url?: string | undefined;
        fileId?: string | undefined;
    }>;
    jobId: string;
}>;
export declare const GCSUploadOutput: z.ZodObject<{
    uploads: z.ZodRecord<z.ZodString, z.ZodObject<{
        url: z.ZodString;
        signedUrl: z.ZodString;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        signedUrl: string;
        url: string;
        path: string;
    }, {
        signedUrl: string;
        url: string;
        path: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    uploads: Record<string, {
        signedUrl: string;
        url: string;
        path: string;
    }>;
}, {
    uploads: Record<string, {
        signedUrl: string;
        url: string;
        path: string;
    }>;
}>;
export type GCSUploadInputType = z.infer<typeof GCSUploadInput>;
export type GCSUploadOutputType = z.infer<typeof GCSUploadOutput>;
export declare class GCSUploadSkill {
    private logger;
    constructor(logger: Logger);
    run(input: GCSUploadInputType): Promise<GCSUploadOutputType>;
}
export default GCSUploadSkill;
//# sourceMappingURL=gcsUpload.d.ts.map