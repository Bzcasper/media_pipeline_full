/**
 * Weaviate Indexer Skill
 * Indexes metadata and assets into Weaviate vector database
 */

import { z } from "zod";
import weaviate, { WeaviateClient } from "weaviate-ts-client";
import { Logger } from "../utils";

export const WeaviateIndexerInput = z.object({
  jobId: z.string(),
  metadata: z.record(z.any()),
  assets: z.record(z.any()),
  transcription: z.record(z.any()).optional(),
});

export const WeaviateIndexerOutput = z.object({
  indexedIds: z.record(z.string()),
  className: z.string(),
});

export type WeaviateIndexerInputType = z.infer<typeof WeaviateIndexerInput>;
export type WeaviateIndexerOutputType = z.infer<typeof WeaviateIndexerOutput>;

export class WeaviateIndexerSkill {
  private logger: Logger;
  private client: WeaviateClient;
  private className: string;

  constructor(logger: Logger, className: string = "MusicAsset") {
    this.logger = logger;
    this.className = className;

    // Initialize Weaviate client
    this.client = weaviate.client({
      scheme: "http",
      host: process.env.WEAVIATE_URL || "localhost:8080",
      apiKey: process.env.WEAVIATE_API_KEY ? {
        apiKey: process.env.WEAVIATE_API_KEY
      } : undefined,
    });
  }

  async run(input: WeaviateIndexerInputType): Promise<WeaviateIndexerOutputType> {
    const validInput = WeaviateIndexerInput.parse(input);
    this.logger.info("Starting Weaviate indexing", { jobId: validInput.jobId });

    try {
      // Ensure class exists
      await this.ensureClass();

      // Create data object for indexing
      const dataObject = {
        jobId: validInput.jobId,
        metadata: validInput.metadata,
        assets: validInput.assets,
        transcription: validInput.transcription,
        indexedAt: new Date().toISOString(),
      };

      // Index the data
      const result = await this.client.data
        .creator()
        .withClassName(this.className)
        .withProperties(dataObject)
        .do();

      const indexedId = result.id;

      this.logger.success("Data indexed in Weaviate", { id: indexedId });

      return {
        indexedIds: { [validInput.jobId]: indexedId },
        className: this.className,
      };
    } catch (error) {
      this.logger.error("Weaviate indexing failed", {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  private async ensureClass() {
    try {
      // Check if class exists
      const schema = await this.client.schema.getter().do();
      const existingClass = schema.classes?.find((c: any) => c.class === this.className);

      if (!existingClass) {
        // Create class
        await this.client.schema
          .classCreator()
          .withClass({
            class: this.className,
            description: "Music assets and metadata for semantic search",
            properties: [
              {
                name: "jobId",
                dataType: ["string"],
                description: "Unique job identifier",
              },
              {
                name: "metadata",
                dataType: ["object"],
                description: "Song metadata (title, artist, genre, etc.)",
              },
              {
                name: "assets",
                dataType: ["object"],
                description: "Asset URLs and references",
              },
              {
                name: "transcription",
                dataType: ["object"],
                description: "Audio transcription data",
              },
              {
                name: "indexedAt",
                dataType: ["date"],
                description: "When this was indexed",
              },
            ],
            vectorizer: "text2vec-openai", // Or another vectorizer
          })
          .do();

        this.logger.info(`Created Weaviate class: ${this.className}`);
      }
    } catch (error) {
      this.logger.error("Failed to ensure Weaviate class", {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async runWithRetry(
    input: WeaviateIndexerInputType,
    maxAttempts: number = 2
  ): Promise<WeaviateIndexerOutputType> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.info(`Weaviate indexing attempt ${attempt}/${maxAttempts}`);
        return await this.run(input);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.warn(`Weaviate indexing attempt ${attempt} failed`, {
          error: lastError.message,
        });

        if (attempt < maxAttempts) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          this.logger.info(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error("Weaviate indexing failed after all retries");
  }
}

export default WeaviateIndexerSkill;