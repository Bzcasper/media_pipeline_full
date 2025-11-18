"use strict";
/**
 * Environment Configuration Validation
 * Uses Zod to validate all environment variables at startup
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.validateEnv = void 0;
var zod_1 = require("zod");
var envSchema = zod_1.z.object({
    // Media Server Configuration
    MEDIA_SERVER_URL: zod_1.z.string().url().optional(),
    // Modal Labs Configuration
    MODAL_JOB_URL: zod_1.z.string().url().optional(),
    MODAL_POLL_URL: zod_1.z.string().url().optional(),
    MODAL_TOKEN_ID: zod_1.z.string().optional(),
    MODAL_TOKEN_SECRET: zod_1.z.string().optional(),
    // Google Cloud Configuration
    GOOGLE_CLOUD_PROJECT: zod_1.z.string().optional(),
    GCS_BUCKET: zod_1.z.string().optional(),
    GCS_PROJECT_ID: zod_1.z.string().optional(),
    GCS_KEYFILE_PATH: zod_1.z.string().optional(),
    GCP_SERVICE_ACCOUNT_KEY: zod_1.z.string().optional(),
    // Weaviate Configuration
    WEAVIATE_URL: zod_1.z.string().url().optional(),
    WEAVIATE_API_KEY: zod_1.z.string().optional(),
    // Replicate API
    REPLICATE_API_TOKEN: zod_1.z.string().optional(),
    // AI Model APIs
    ANTHROPIC_API_KEY: zod_1.z.string().optional(),
    OPENAI_API_KEY: zod_1.z.string().optional(),
    // Next.js Configuration
    NEXT_PUBLIC_API_URL: zod_1.z.string().url().optional(),
});
var validateEnv = function () {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            var missingVars = error.errors.map(function (err) { return "".concat(err.path.join("."), ": ").concat(err.message); });
            throw new Error("Environment validation failed:\n".concat(missingVars.join("\n")));
        }
        throw error;
    }
};
exports.validateEnv = validateEnv;
// Export validated environment variables
exports.env = (0, exports.validateEnv)();
exports.default = exports.env;
