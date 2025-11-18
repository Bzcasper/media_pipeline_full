/**
 * GCS Upload Skill
 * Uploads assets to Google Cloud Storage and generates signed URLs
 */
import { z } from "zod";
import { Logger } from "../utils";
export declare const GCSUploadInput: z.ZodObject<{
    files: z.ZodArray<z.ZodObject<{
        localPath: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodAny>;
        filename: z.ZodString;
        contentType: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        contentType?: string;
        url?: string;
        localPath?: string;
        content?: any;
        filename?: string;
    }, {
        contentType?: string;
        url?: string;
        localPath?: string;
        content?: any;
        filename?: string;
    }>, "many">;
    bucketName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    files?: {
        contentType?: string;
        url?: string;
        localPath?: string;
        content?: any;
        filename?: string;
    }[];
    bucketName?: string;
}, {
    files?: {
        contentType?: string;
        url?: string;
        localPath?: string;
        content?: any;
        filename?: string;
    }[];
    bucketName?: string;
}>;
export declare const GCSUploadOutput: z.ZodObject<{
    uploads: z.ZodRecord<z.ZodString, z.ZodObject<{
        url: z.ZodString;
        signedUrl: z.ZodString;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path?: string;
        signedUrl?: string;
        url?: string;
    }, {
        path?: string;
        signedUrl?: string;
        url?: string;
    }>>;
    bucketName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    bucketName?: string;
    uploads?: Record<string, {
        path?: string;
        signedUrl?: string;
        url?: string;
    }>;
}, {
    bucketName?: string;
    uploads?: Record<string, {
        path?: string;
        signedUrl?: string;
        url?: string;
    }>;
}>;
export type GCSUploadInputType = z.infer<typeof GCSUploadInput>;
export type GCSUploadOutputType = z.infer<typeof GCSUploadOutput>;
export declare class GCSWorker {
    private logger;
    private storage;
    private bucketName;
    constructor(logger: Logger, bucketName?: string);
    run(input: GCSUploadInputType): Promise<GCSUploadOutputType>;
    runWithRetry(input: GCSUploadInputType, maxAttempts?: number): Promise<GCSUploadOutputType>;
}
export default GCSWorker;
