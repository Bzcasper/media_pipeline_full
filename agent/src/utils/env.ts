/**
 * Environment Configuration Validation
 * Uses Zod to validate all environment variables at startup
 */

import { z } from "zod";

const envSchema = z.object({
  // Media Server Configuration
  MEDIA_SERVER_URL: z.string().url().optional(),

  // Modal Labs Configuration
  MODAL_JOB_URL: z.string().url().optional(),
  MODAL_POLL_URL: z.string().url().optional(),
  MODAL_TOKEN_ID: z.string().optional(),
  MODAL_TOKEN_SECRET: z.string().optional(),

  // Google Cloud Configuration
  GOOGLE_CLOUD_PROJECT: z.string().optional(),
  GCS_BUCKET: z.string().optional(),
  GCS_PROJECT_ID: z.string().optional(),
  GCS_KEYFILE_PATH: z.string().optional(),
  GCP_SERVICE_ACCOUNT_KEY: z.string().optional(),

  // Weaviate Configuration
  WEAVIATE_URL: z.string().url().optional(),
  WEAVIATE_API_KEY: z.string().optional(),

  // Replicate API
  REPLICATE_API_TOKEN: z.string().optional(),

  // AI Model APIs
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),

  // Next.js Configuration
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (): Env => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(
        `Environment validation failed:\n${missingVars.join("\n")}`
      );
    }
    throw error;
  }
};

// Export validated environment variables
export const env = validateEnv();

export default env;
