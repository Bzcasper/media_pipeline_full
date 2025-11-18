/**
 * Weaviate Indexer Skill
 * Indexes processed media in Weaviate for semantic search
 */

import { z } from 'zod';
import { weaviate } from '../tools';
import { Logger } from '../utils';

export const WeaviateIndexerInput = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string().optional(),
  album: z.string().optional(),
  genre: z.string().optional(),
  mood: z.string().optional(),
  lyrics: z.string().optional(),
  transcription: z.string().optional(),
  bpm: z.number().optional(),
  key: z.string().optional(),
  audioUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const WeaviateIndexerOutput = z.object({
  indexed: z.boolean(),
  documentId: z.string()
});

export type WeaviateIndexerInputType = z.infer<typeof WeaviateIndexerInput>;
export type WeaviateIndexerOutputType = z.infer<typeof WeaviateIndexerOutput>;

export class WeaviateIndexerSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async run(input: WeaviateIndexerInputType): Promise<WeaviateIndexerOutputType> {
    const validInput = WeaviateIndexerInput.parse(input);
    this.logger.info('Indexing document in Weaviate', {
      id: validInput.id,
      title: validInput.title
    });

    try {
      await weaviate.indexDocument({
        id: validInput.id,
        title: validInput.title,
        artist: validInput.artist,
        album: validInput.album,
        genre: validInput.genre,
        mood: validInput.mood,
        lyrics: validInput.lyrics,
        transcription: validInput.transcription,
        bpm: validInput.bpm,
        key: validInput.key,
        audioUrl: validInput.audioUrl,
        coverUrl: validInput.coverUrl,
        videoUrl: validInput.videoUrl,
        metadata: validInput.metadata
      });

      this.logger.success('Document indexed in Weaviate', {
        documentId: validInput.id
      });

      return {
        indexed: true,
        documentId: validInput.id
      };
    } catch (error) {
      this.logger.error('Failed to index document', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}

export default WeaviateIndexerSkill;
