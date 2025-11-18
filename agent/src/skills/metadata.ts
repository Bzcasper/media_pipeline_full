/**
 * Metadata Extraction Skill
 * Extracts metadata from lyrics using LLM analysis
 */

import { z } from 'zod';
import { Logger } from '../utils';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

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
    this.logger.info('Extracting metadata from lyrics using LLM');

    try {
      // Use LLM for comprehensive metadata extraction
      const llmResult = await this.extractWithLLM(validInput.lyrics);

      // Merge with basic extraction and audio metadata
      const metadata: MetadataOutputType = {
        ...llmResult,
        ...this.extractBasicMetadata(validInput.lyrics),
        ...validInput.audioMetadata
      };

      this.logger.success('Metadata extracted with LLM', metadata);
      return metadata;
    } catch (error) {
      this.logger.warn('LLM metadata extraction failed, falling back to basic extraction', {
        error: error instanceof Error ? error.message : String(error)
      });

      // Fallback to basic extraction
      const metadata: MetadataOutputType = {
        ...this.extractBasicMetadata(validInput.lyrics),
        ...validInput.audioMetadata
      };

      return metadata;
    }
  }

  async runWithRetry(
    input: MetadataInputType,
    maxAttempts: number = 2
  ): Promise<MetadataOutputType> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.info(`Metadata extraction attempt ${attempt}/${maxAttempts}`);
        return await this.run(input);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.warn(`Metadata extraction attempt ${attempt} failed`, {
          error: lastError.message,
        });

        if (attempt < maxAttempts) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          this.logger.info(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error("Metadata extraction failed after all retries");
  }

  private async extractWithLLM(lyrics: string): Promise<Partial<MetadataOutputType>> {
    const prompt = `Analyze these song lyrics and extract structured metadata. Return a JSON object with the following fields (use null for unknown):

{
  "title": "extracted or inferred song title",
  "artist": "extracted or inferred artist name",
  "album": "extracted or inferred album name",
  "genre": "musical genre (rock, pop, hip-hop, electronic, country, etc.)",
  "mood": "emotional mood (happy, sad, angry, romantic, energetic, etc.)",
  "themes": ["array of main themes"],
  "language": "primary language code (en, es, fr, etc.)",
  "bpm": 120,
  "key": "musical key if detectable (C major, A minor, etc.)",
  "summary": "brief 1-2 sentence summary of the song's content and message"
}

Lyrics:
${lyrics}

Respond with only the JSON object, no additional text.`;

    const response = await generateText({
      model: anthropic('claude-3-5-haiku-20241022'),
      prompt,
      system: 'You are a music metadata extraction expert. Analyze lyrics to extract accurate, structured metadata.',
    });

    try {
      const parsed = JSON.parse(response.text.trim());
      return MetadataOutput.partial().parse(parsed);
    } catch (parseError) {
      throw new Error(`Failed to parse LLM response: ${parseError}`);
    }
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
