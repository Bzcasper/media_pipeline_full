/**
 * Metadata Extraction Skill
 * Extracts metadata from lyrics using LLM analysis
 */

import { z } from 'zod';
import { Logger } from '../utils';

export const MetadataInput = z.object({
  lyrics: z.string(),
  audioMetadata: z.record(z.any()).optional()
});

export const MetadataOutput = z.object({
  title: z.string().optional(),
  artist: z.string().optional(),
  album: z.string().optional(),
  genre: z.string().optional(),
  mood: z.string().optional(),
  themes: z.array(z.string()).optional(),
  language: z.string().optional(),
  bpm: z.number().optional(),
  key: z.string().optional(),
  summary: z.string().optional()
});

export type MetadataInputType = z.infer<typeof MetadataInput>;
export type MetadataOutputType = z.infer<typeof MetadataOutput>;

export class MetadataSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async run(input: MetadataInputType): Promise<MetadataOutputType> {
    const validInput = MetadataInput.parse(input);
    this.logger.info('Extracting metadata from lyrics');

    // In a production system, this would call an LLM API to analyze the lyrics
    // For now, we'll extract basic metadata patterns

    const metadata: MetadataOutputType = {
      ...this.extractBasicMetadata(validInput.lyrics),
      ...validInput.audioMetadata
    };

    this.logger.success('Metadata extracted', metadata);
    return metadata;
  }

  private extractBasicMetadata(lyrics: string): Partial<MetadataOutputType> {
    const metadata: Partial<MetadataOutputType> = {};

    // Extract genre keywords
    const genreKeywords: Record<string, string[]> = {
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
    const moodKeywords: Record<string, string[]> = {
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
    const themes: string[] = [];
    if (lyricsLower.includes('love')) themes.push('love');
    if (lyricsLower.includes('life')) themes.push('life');
    if (lyricsLower.includes('dream')) themes.push('dreams');
    metadata.themes = themes;

    // Create summary (first 2 lines)
    const lines = lyrics.split('\n').filter(l => l.trim());
    metadata.summary = lines.slice(0, 2).join(' ').slice(0, 200);

    return metadata;
  }
}

export default MetadataSkill;
