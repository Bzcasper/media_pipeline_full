"use strict";
/**
 * Google Cloud Storage Tool
 * Handles file uploads and signed URL generation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gcs = void 0;
const storage_1 = require("@google-cloud/storage");
const uuid_1 = require("uuid");
// Initialize GCS client
let storage;
const getStorage = () => {
    if (!storage) {
        storage = new storage_1.Storage({
            projectId: process.env.GCS_PROJECT_ID,
            // If using service account key file
            ...(process.env.GCS_KEYFILE_PATH && {
                keyFilename: process.env.GCS_KEYFILE_PATH
            })
        });
    }
    return storage;
};
const getBucket = () => {
    const bucketName = process.env.GCS_BUCKET;
    if (!bucketName) {
        throw new Error('GCS_BUCKET environment variable is not set');
    }
    return getStorage().bucket(bucketName);
};
exports.gcs = {
    /**
     * Upload a file to GCS
     */
    uploadFile: async (fileContent, fileName, metadata) => {
        const bucket = getBucket();
        const uniqueFileName = `${(0, uuid_1.v4)()}-${fileName}`;
        const file = bucket.file(uniqueFileName);
        await file.save(fileContent, {
            metadata: {
                contentType: metadata?.contentType || 'application/octet-stream',
                metadata
            }
        });
        // Generate signed URL (valid for 7 days)
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;
        return {
            url: publicUrl,
            signedUrl,
            path: uniqueFileName
        };
    },
    /**
     * Upload from URL to GCS
     */
    uploadFromURL: async (url, fileName) => {
        // Fetch the file
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch file from ${url}: ${response.statusText}`);
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const finalFileName = fileName || url.split('/').pop() || 'file';
        return exports.gcs.uploadFile(buffer, finalFileName, { contentType });
    },
    /**
     * Generate signed URL for existing file
     */
    getSignedUrl: async (filePath, expiresInDays = 7) => {
        const bucket = getBucket();
        const file = bucket.file(filePath);
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + expiresInDays * 24 * 60 * 60 * 1000
        });
        return signedUrl;
    },
    /**
     * List files with prefix
     */
    listFiles: async (prefix) => {
        const bucket = getBucket();
        const [files] = await bucket.getFiles({ prefix });
        return files.map(file => file.name);
    },
    /**
     * Delete file
     */
    deleteFile: async (filePath) => {
        const bucket = getBucket();
        await bucket.file(filePath).delete();
    },
    /**
     * Download file
     */
    downloadFile: async (filePath) => {
        const bucket = getBucket();
        const file = bucket.file(filePath);
        const [contents] = await file.download();
        return contents;
    },
    /**
     * Upload job results
     */
    uploadJobResults: async (jobId, results, metadata) => {
        const uploads = {};
        for (const [key, buffer] of Object.entries(results)) {
            const fileName = `jobs/${jobId}/${key}`;
            uploads[key] = await exports.gcs.uploadFile(buffer, fileName, metadata);
        }
        return uploads;
    }
};
exports.default = exports.gcs;
//# sourceMappingURL=gcs.js.map