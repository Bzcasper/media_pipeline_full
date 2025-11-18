"use strict";
/**
 * Metadata Extraction Skill
 * Extracts metadata from lyrics using LLM analysis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataSkill = exports.MetadataOutput = exports.MetadataInput = void 0;
const zod_1 = require("zod");
exports.MetadataInput = zod_1.z.object({
    lyrics: zod_1.z.string(),
    audioMetadata: zod_1.z.record(zod_1.z.any()).optional()
});
exports.MetadataOutput = zod_1.z.object({
    title: zod_1.z.string().optional(),
    artist: zod_1.z.string().optional(),
    album: zod_1.z.string().optional(),
    genre: zod_1.z.string().optional(),
    mood: zod_1.z.string().optional(),
    themes: zod_1.z.array(zod_1.z.string()).optional(),
    language: zod_1.z.string().optional(),
    bpm: zod_1.z.number().optional(),
    key: zod_1.z.string().optional(),
    summary: zod_1.z.string().optional()
});
class MetadataSkill {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async run(input) {
        const validInput = exports.MetadataInput.parse(input);
        this.logger.info('Extracting metadata from lyrics');
        // In a production system, this would call an LLM API to analyze the lyrics
        // For now, we'll extract basic metadata patterns
        const metadata = {
            ...this.extractBasicMetadata(validInput.lyrics),
            ...validInput.audioMetadata
        };
        this.logger.success('Metadata extracted', metadata);
        return metadata;
    }
    extractBasicMetadata(lyrics) {
        const metadata = {};
        // Extract genre keywords
        const genreKeywords = {
            'rock': ['guitar', 'drums', 'rock', 'band'],
            'pop': ['love', 'heart', 'dance', 'baby'],
            'hip-hop': ['rap', 'flow', 'beat', 'street'],
            'electronic': ['synth', 'beat', 'bass', 'drop'],
            'country': ['road', 'truck', 'home', 'dirt']
        };
        const lyricsLower = lyrics.toLowerCase();
        for (const [genre, keywords] of Object.entries(genreKeywords)) {
            if (keywords.some(kw => lyricsLower.includes(kw))) {
                metadata.genre = genre;
                break;
            }
        }
        // Extract mood
        const moodKeywords = {
            'happy': ['happy', 'joy', 'smile', 'celebrate'],
            'sad': ['sad', 'cry', 'tears', 'lonely'],
            'angry': ['angry', 'rage', 'hate', 'fight'],
            'romantic': ['love', 'heart', 'together', 'kiss'],
            'energetic': ['energy', 'power', 'strong', 'go']
        };
        for (const [mood, keywords] of Object.entries(moodKeywords)) {
            if (keywords.some(kw => lyricsLower.includes(kw))) {
                metadata.mood = mood;
                break;
            }
        }
        // Extract themes
        const themes = [];
        if (lyricsLower.includes('love'))
            themes.push('love');
        if (lyricsLower.includes('life'))
            themes.push('life');
        if (lyricsLower.includes('dream'))
            themes.push('dreams');
        metadata.themes = themes;
        // Create summary (first 2 lines)
        const lines = lyrics.split('\n').filter(l => l.trim());
        metadata.summary = lines.slice(0, 2).join(' ').slice(0, 200);
        return metadata;
    }
}
exports.MetadataSkill = MetadataSkill;
exports.default = MetadataSkill;
//# sourceMappingURL=metadata.js.map