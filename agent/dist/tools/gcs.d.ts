/**
 * Google Cloud Storage Tool
 * Handles file uploads and signed URL generation
 */
export declare const gcs: {
    /**
     * Upload a file to GCS
     */
    uploadFile: (fileContent: Buffer, fileName: string, metadata?: Record<string, any>) => Promise<{
        url: string;
        signedUrl: string;
        path: string;
    }>;
    /**
     * Upload from URL to GCS
     */
    uploadFromURL: (url: string, fileName?: string) => Promise<{
        url: string;
        signedUrl: string;
        path: string;
    }>;
    /**
     * Generate signed URL for existing file
     */
    getSignedUrl: (filePath: string, expiresInDays?: number) => Promise<string>;
    /**
     * List files with prefix
     */
    listFiles: (prefix?: string) => Promise<string[]>;
    /**
     * Delete file
     */
    deleteFile: (filePath: string) => Promise<void>;
    /**
     * Download file
     */
    downloadFile: (filePath: string) => Promise<Buffer>;
    /**
     * Upload job results
     */
    uploadJobResults: (jobId: string, results: Record<string, Buffer>, metadata?: Record<string, any>) => Promise<Record<string, {
        url: string;
        signedUrl: string;
        path: string;
    }>>;
};
export default gcs;
//# sourceMappingURL=gcs.d.ts.map