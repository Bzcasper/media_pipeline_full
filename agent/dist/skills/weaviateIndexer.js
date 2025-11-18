"use strict";
/**
 * Weaviate Indexer Skill
 * Indexes processed media in Weaviate for semantic search
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeaviateIndexerSkill = exports.WeaviateIndexerOutput = exports.WeaviateIndexerInput = void 0;
const zod_1 = require("zod");
const tools_1 = require("../tools");
exports.WeaviateIndexerInput = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    artist: zod_1.z.string().optional(),
    album: zod_1.z.string().optional(),
    genre: zod_1.z.string().optional(),
    mood: zod_1.z.string().optional(),
    lyrics: zod_1.z.string().optional(),
    transcription: zod_1.z.string().optional(),
    bpm: zod_1.z.number().optional(),
    key: zod_1.z.string().optional(),
    audioUrl: zod_1.z.string().optional(),
    coverUrl: zod_1.z.string().optional(),
    videoUrl: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional()
});
exports.WeaviateIndexerOutput = zod_1.z.object({
    indexed: zod_1.z.boolean(),
    documentId: zod_1.z.string()
});
class WeaviateIndexerSkill {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async run(input) {
        const validInput = exports.WeaviateIndexerInput.parse(input);
        this.logger.info('Indexing document in Weaviate', {
            id: validInput.id,
            title: validInput.title
        });
        try {
            await tools_1.weaviate.indexDocument({
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
        }
        catch (error) {
            this.logger.error('Failed to index document', {
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }
}
exports.WeaviateIndexerSkill = WeaviateIndexerSkill;
exports.default = WeaviateIndexerSkill;
//# sourceMappingURL=weaviateIndexer.js.map