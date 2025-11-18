/**
 * GCS Upload Skill
 * Uploads assets to Google Cloud Storage and generates signed URLs
 */

import { z } from "zod";
import { Storage } from "@google-cloud/storage";
import { Logger } from "../utils";

export const GCSUploadInput = z.object({
  files: z.array(z.object({
    localPath: z.string().optional(),
    url: z.string().optional(),
    content: z.any().optional(),
    filename: z.string(),
    contentType: z.string(),
  })),
  bucketName: z.string().optional(),
});

export const GCSUploadOutput = z.object({
  uploads: z.record(z.object({
    url: z.string(),
    signedUrl: z.string(),
    path: z.string(),
  })),
  bucketName: z.string(),
});

export type GCSUploadInputType = z.infer<typeof GCSUploadInput>;
export type GCSUploadOutputType = z.infer<typeof GCSUploadOutput>;

export class GCSWorker {
  private logger: Logger;
  private storage: Storage;
  private bucketName: string;

  constructor(logger: Logger, bucketName?: string) {
    this.logger = logger;
    this.bucketName = bucketName || process.env.GCS_BUCKET || "media-pipeline-assets";

    // Initialize GCS client
    this.storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GCP_SERVICE_ACCOUNT_KEY,
    });
  }

  async run(input: GCSUploadInputType): Promise<GCSUploadOutputType> {
    const validInput = GCSUploadInput.parse(input);
    this.logger.info("Starting GCS upload", { fileCount: validInput.files.length });

    const bucket = this.storage.bucket(this.bucketName);
    const uploads: Record<string, any> = {};

    for (const file of validInput.files) {
      try {
        const fileName = `${Date.now()}_${file.filename}`;
        const fileRef = bucket.file(fileName);

        // Upload based on source
        if (file.localPath) {
          await bucket.upload(file.localPath, {
            destination: fileName,
            metadata: { contentType: file.contentType },
          });
        } else if (file.url) {
          // Download and upload
          const response = await fetch(file.url);
          const buffer = Buffer.from(await response.arrayBuffer());
          await fileRef.save(buffer, { contentType: file.contentType });
        } else if (file.content) {
          // Direct upload
          const buffer = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content);
          await fileRef.save(buffer, { contentType: file.contentType });
        } else {
          throw new Error("No file source provided");
        }

        // Generate signed URL (valid for 7 days)
        const [signedUrl] = await fileRef.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        uploads[file.filename] = {
          url: `https://storage.googleapis.com/${this.bucketName}/${fileName}`,
          signedUrl,
          path: fileName,
        };

        this.logger.success(`Uploaded ${file.filename}`, { path: fileName });
      } catch (error) {
        this.logger.error(`Failed to upload ${file.filename}`, {
          error: error instanceof Error ? error.message : String(error)
        });
        throw error;
      }
    }

    this.logger.success("GCS upload completed", { uploadedCount: Object.keys(uploads).length });

    return {
      uploads,
      bucketName: this.bucketName,
    };
  }

  async runWithRetry(
    input: GCSUploadInputType,
    maxAttempts: number = 3
  ): Promise<GCSUploadOutputType> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.info(`GCS upload attempt ${attempt}/${maxAttempts}`);
        return await this.run(input);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.warn(`GCS upload attempt ${attempt} failed`, {
          error: lastError.message,
        });

        if (attempt < maxAttempts) {
          const delay = Math.min(2000 * Math.pow(2, attempt - 1), 30000);
          this.logger.info(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error("GCS upload failed after all retries");
  }
}

export default GCSWorker;