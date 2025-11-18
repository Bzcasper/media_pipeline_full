/**
 * GCS Upload Skill
 * Uploads generated assets to Google Cloud Storage
 */

import { z } from 'zod';
import { gcs, mediaServer } from '../tools';
import { Logger } from '../utils';

export const GCSUploadInput = z.object({
  jobId: z.string(),
  files: z.record(z.object({
    fileId: z.string().optional(),
    url: z.string().optional(),
    name: z.string()
  }))
});

export const GCSUploadOutput = z.object({
  uploads: z.record(z.object({
    url: z.string(),
    signedUrl: z.string(),
    path: z.string()
  }))
});

export type GCSUploadInputType = z.infer<typeof GCSUploadInput>;
export type GCSUploadOutputType = z.infer<typeof GCSUploadOutput>;

export class GCSUploadSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async run(input: GCSUploadInputType): Promise<GCSUploadOutputType> {
    const validInput = GCSUploadInput.parse(input);
    this.logger.info('Uploading files to GCS', {
      jobId: validInput.jobId,
      fileCount: Object.keys(validInput.files).length
    });

    const uploads: Record<string, { url: string; signedUrl: string; path: string }> = {};

    for (const [key, fileInfo] of Object.entries(validInput.files)) {
      this.logger.info(`Uploading ${key}`, { name: fileInfo.name });

      try {
        let uploadResult;

        if (fileInfo.fileId) {
          // Download from media server and upload to GCS
          this.logger.debug(`Downloading ${key} from media server`);
          const response = await mediaServer.downloadFile(fileInfo.fileId);
          const buffer = Buffer.from(await response.arrayBuffer());

          uploadResult = await gcs.uploadFile(
            buffer,
            `${validInput.jobId}/${fileInfo.name}`,
            {
              contentType: response.headers.get('content-type') || 'application/octet-stream'
            }
          );
        } else if (fileInfo.url) {
          // Upload from URL
          uploadResult = await gcs.uploadFromURL(
            fileInfo.url,
            `${validInput.jobId}/${fileInfo.name}`
          );
        } else {
          throw new Error(`No source specified for ${key}`);
        }

        uploads[key] = uploadResult;
        this.logger.success(`Uploaded ${key}`, { url: uploadResult.signedUrl });
      } catch (error) {
        this.logger.error(`Failed to upload ${key}`, {
          error: error instanceof Error ? error.message : String(error)
        });
        throw error;
      }
    }

    this.logger.success('All files uploaded to GCS', {
      uploadCount: Object.keys(uploads).length
    });

    return { uploads };
  }
}

export default GCSUploadSkill;
