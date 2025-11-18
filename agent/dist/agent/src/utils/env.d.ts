/**
 * Environment Configuration Validation
 * Uses Zod to validate all environment variables at startup
 */
import { z } from "zod";
declare const envSchema: z.ZodObject<{
    MEDIA_SERVER_URL: z.ZodOptional<z.ZodString>;
    MODAL_JOB_URL: z.ZodOptional<z.ZodString>;
    MODAL_POLL_URL: z.ZodOptional<z.ZodString>;
    MODAL_TOKEN_ID: z.ZodOptional<z.ZodString>;
    MODAL_TOKEN_SECRET: z.ZodOptional<z.ZodString>;
    GOOGLE_CLOUD_PROJECT: z.ZodOptional<z.ZodString>;
    GCS_BUCKET: z.ZodOptional<z.ZodString>;
    GCS_PROJECT_ID: z.ZodOptional<z.ZodString>;
    GCS_KEYFILE_PATH: z.ZodOptional<z.ZodString>;
    GCP_SERVICE_ACCOUNT_KEY: z.ZodOptional<z.ZodString>;
    WEAVIATE_URL: z.ZodOptional<z.ZodString>;
    WEAVIATE_API_KEY: z.ZodOptional<z.ZodString>;
    REPLICATE_API_TOKEN: z.ZodOptional<z.ZodString>;
    ANTHROPIC_API_KEY: z.ZodOptional<z.ZodString>;
    OPENAI_API_KEY: z.ZodOptional<z.ZodString>;
    NEXT_PUBLIC_API_URL: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    MEDIA_SERVER_URL?: string;
    MODAL_JOB_URL?: string;
    MODAL_POLL_URL?: string;
    GCS_PROJECT_ID?: string;
    GCS_KEYFILE_PATH?: string;
    GCS_BUCKET?: string;
    WEAVIATE_URL?: string;
    WEAVIATE_API_KEY?: string;
    MODAL_TOKEN_ID?: string;
    MODAL_TOKEN_SECRET?: string;
    GOOGLE_CLOUD_PROJECT?: string;
    GCP_SERVICE_ACCOUNT_KEY?: string;
    REPLICATE_API_TOKEN?: string;
    ANTHROPIC_API_KEY?: string;
    OPENAI_API_KEY?: string;
    NEXT_PUBLIC_API_URL?: string;
}, {
    MEDIA_SERVER_URL?: string;
    MODAL_JOB_URL?: string;
    MODAL_POLL_URL?: string;
    GCS_PROJECT_ID?: string;
    GCS_KEYFILE_PATH?: string;
    GCS_BUCKET?: string;
    WEAVIATE_URL?: string;
    WEAVIATE_API_KEY?: string;
    MODAL_TOKEN_ID?: string;
    MODAL_TOKEN_SECRET?: string;
    GOOGLE_CLOUD_PROJECT?: string;
    GCP_SERVICE_ACCOUNT_KEY?: string;
    REPLICATE_API_TOKEN?: string;
    ANTHROPIC_API_KEY?: string;
    OPENAI_API_KEY?: string;
    NEXT_PUBLIC_API_URL?: string;
}>;
export type Env = z.infer<typeof envSchema>;
export declare const validateEnv: () => Env;
export declare const env: {
    MEDIA_SERVER_URL?: string;
    MODAL_JOB_URL?: string;
    MODAL_POLL_URL?: string;
    GCS_PROJECT_ID?: string;
    GCS_KEYFILE_PATH?: string;
    GCS_BUCKET?: string;
    WEAVIATE_URL?: string;
    WEAVIATE_API_KEY?: string;
    MODAL_TOKEN_ID?: string;
    MODAL_TOKEN_SECRET?: string;
    GOOGLE_CLOUD_PROJECT?: string;
    GCP_SERVICE_ACCOUNT_KEY?: string;
    REPLICATE_API_TOKEN?: string;
    ANTHROPIC_API_KEY?: string;
    OPENAI_API_KEY?: string;
    NEXT_PUBLIC_API_URL?: string;
};
export default env;
