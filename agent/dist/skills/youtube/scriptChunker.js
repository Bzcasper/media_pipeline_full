"use strict";
/**
 * Script Chunker Skill
 * Breaks scripts into scenes for visualization
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptChunkerSkill = exports.ScriptChunkerOutput = exports.ScriptChunkerInput = void 0;
const zod_1 = require("zod");
exports.ScriptChunkerInput = zod_1.z.object({
    script: zod_1.z.string(),
    targetScenes: zod_1.z.number().default(6),
    maxWordsPerScene: zod_1.z.number().default(50)
});
exports.ScriptChunkerOutput = zod_1.z.object({
    scenes: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        text: zod_1.z.string(),
        wordCount: zod_1.z.number(),
        estimatedDuration: zod_1.z.number(),
        visualDescription: zod_1.z.string()
    })),
    totalScenes: zod_1.z.number(),
    totalDuration: zod_1.z.number()
});
class ScriptChunkerSkill {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async run(input) {
        const validInput = exports.ScriptChunkerInput.parse(input);
        this.logger.info('Chunking script into scenes', {
            targetScenes: validInput.targetScenes
        });
        // Split by [SCENE] markers first
        const rawChunks = validInput.script.split(/\[SCENE\]/i).filter(s => s.trim());
        // If no markers, split by sentences
        const chunks = rawChunks.length > 1
            ? rawChunks
            : this.splitBySentences(validInput.script, validInput.targetScenes);
        // Process each chunk
        const scenes = chunks.map((chunk, index) => {
            const text = chunk.trim();
            const wordCount = text.split(/\s+/).length;
            const estimatedDuration = this.estimateDuration(wordCount);
            const visualDescription = this.generateVisualDescription(text);
            return {
                index,
                text,
                wordCount,
                estimatedDuration,
                visualDescription
            };
        });
        const totalDuration = scenes.reduce((sum, s) => sum + s.estimatedDuration, 0);
        this.logger.success('Script chunked into scenes', {
            sceneCount: scenes.length,
            totalDuration
        });
        return {
            scenes,
            totalScenes: scenes.length,
            totalDuration
        };
    }
    splitBySentences(text, targetScenes) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const sentencesPerChunk = Math.ceil(sentences.length / targetScenes);
        const chunks = [];
        for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
            chunks.push(sentences.slice(i, i + sentencesPerChunk).join(' '));
        }
        return chunks;
    }
    estimateDuration(wordCount) {
        // Average speaking rate: 150 words per minute
        // Add 2 seconds buffer for visuals
        return Math.ceil((wordCount / 150) * 60) + 2;
    }
    generateVisualDescription(text) {
        // Extract key visual elements from the text
        // In production, use LLM to generate detailed visual descriptions
        const keywords = text
            .toLowerCase()
            .match(/\b(show|see|look|watch|view|image|picture|scene|visual)\s+([^\s,]+(?:\s+[^\s,]+)?)/gi);
        if (keywords && keywords.length > 0) {
            return keywords[0];
        }
        // Extract first meaningful phrase
        const words = text.split(/\s+/).slice(0, 10).join(' ');
        return `Visual representation of: ${words}`;
    }
}
exports.ScriptChunkerSkill = ScriptChunkerSkill;
exports.default = ScriptChunkerSkill;
//# sourceMappingURL=scriptChunker.js.map