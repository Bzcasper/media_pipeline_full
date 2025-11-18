/**
 * Google Cloud Storage Tool
 * Handles file uploads and signed URL generation
 */

import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

// Initialize GCS client
let storage: Storage;

const getStorage = () => {
  if (!storage) {
    storage = new Storage({
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

export const gcs = {
  /**
   * Upload a file to GCS
   */
  uploadFile: async (
    fileContent: Buffer,
    fileName: string,
    metadata?: Record<string, any>
  ): Promise<{
    url: string;
    signedUrl: string;
    path: string;
  }> => {
    const bucket = getBucket();
    const uniqueFileName = `${uuidv4()}-${fileName}`;
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
  uploadFromURL: async (
    url: string,
    fileName?: string
  ): Promise<{
    url: string;
    signedUrl: string;
    path: string;
  }> => {
    // Fetch the file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from ${url}: ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    const finalFileName = fileName || url.split('/').pop() || 'file';

    return gcs.uploadFile(buffer, finalFileName, { contentType });
  },

  /**
   * Generate signed URL for existing file
   */
  getSignedUrl: async (
    filePath: string,
    expiresInDays: number = 7
  ): Promise<string> => {
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
  listFiles: async (prefix?: string): Promise<string[]> => {
    const bucket = getBucket();
    const [files] = await bucket.getFiles({ prefix });
    return files.map(file => file.name);
  },

  /**
   * Delete file
   */
  deleteFile: async (filePath: string): Promise<void> => {
    const bucket = getBucket();
    await bucket.file(filePath).delete();
  },

  /**
   * Download file
   */
  downloadFile: async (filePath: string): Promise<Buffer> => {
    const bucket = getBucket();
    const file = bucket.file(filePath);
    const [contents] = await file.download();
    return contents;
  },

  /**
   * Upload job results
   */
  uploadJobResults: async (
    jobId: string,
    results: Record<string, Buffer>,
    metadata?: Record<string, any>
  ): Promise<Record<string, { url: string; signedUrl: string; path: string }>> => {
    const uploads: Record<string, { url: string; signedUrl: string; path: string }> = {};

    for (const [key, buffer] of Object.entries(results)) {
      const fileName = `jobs/${jobId}/${key}`;
      uploads[key] = await gcs.uploadFile(buffer, fileName, metadata);
    }

    return uploads;
  }
};

export default gcs;
