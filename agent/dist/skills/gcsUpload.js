"use strict";
/**
 * GCS Upload Skill
 * Uploads generated assets to Google Cloud Storage
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCSUploadSkill = exports.GCSUploadOutput = exports.GCSUploadInput = void 0;
const zod_1 = require("zod");
const tools_1 = require("../tools");
exports.GCSUploadInput = zod_1.z.object({
    jobId: zod_1.z.string(),
    files: zod_1.z.record(zod_1.z.object({
        fileId: zod_1.z.string().optional(),
        url: zod_1.z.string().optional(),
        name: zod_1.z.string()
    }))
});
exports.GCSUploadOutput = zod_1.z.object({
    uploads: zod_1.z.record(zod_1.z.object({
        url: zod_1.z.string(),
        signedUrl: zod_1.z.string(),
        path: zod_1.z.string()
    }))
});
class GCSUploadSkill {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async run(input) {
        const validInput = exports.GCSUploadInput.parse(input);
        this.logger.info('Uploading files to GCS', {
            jobId: validInput.jobId,
            fileCount: Object.keys(validInput.files).length
        });
        const uploads = {};
        for (const [key, fileInfo] of Object.entries(validInput.files)) {
            this.logger.info(`Uploading ${key}`, { name: fileInfo.name });
            try {
                let uploadResult;
                if (fileInfo.fileId) {
                    // Download from media server and upload to GCS
                    this.logger.debug(`Downloading ${key} from media server`);
                    const response = await tools_1.mediaServer.downloadFile(fileInfo.fileId);
                    const buffer = Buffer.from(await response.arrayBuffer());
                    uploadResult = await tools_1.gcs.uploadFile(buffer, `${validInput.jobId}/${fileInfo.name}`, {
                        contentType: response.headers.get('content-type') || 'application/octet-stream'
                    });
                }
                else if (fileInfo.url) {
                    // Upload from URL
                    uploadResult = await tools_1.gcs.uploadFromURL(fileInfo.url, `${validInput.jobId}/${fileInfo.name}`);
                }
                else {
                    throw new Error(`No source specified for ${key}`);
                }
                uploads[key] = uploadResult;
                this.logger.success(`Uploaded ${key}`, { url: uploadResult.signedUrl });
            }
            catch (error) {
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
exports.GCSUploadSkill = GCSUploadSkill;
exports.default = GCSUploadSkill;
//# sourceMappingURL=gcsUpload.js.map