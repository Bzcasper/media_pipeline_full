/**
 * Script Chunker Skill
 * Breaks scripts into scenes for visualization
 */

import { z } from 'zod';
import { Logger } from '../../utils';

export const ScriptChunkerInput = z.object({
  script: z.string(),
  targetScenes: z.number().default(6),
  maxWordsPerScene: z.number().default(50)
});

export const ScriptChunkerOutput = z.object({
  scenes: z.array(z.object({
    index: z.number(),
    text: z.string(),
    wordCount: z.number(),
    estimatedDuration: z.number(),
    visualDescription: z.string()
  })),
  totalScenes: z.number(),
  totalDuration: z.number()
});

export type ScriptChunkerInputType = z.infer<typeof ScriptChunkerInput>;
export type ScriptChunkerOutputType = z.infer<typeof ScriptChunkerOutput>;

export class ScriptChunkerSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async run(input: ScriptChunkerInputType): Promise<ScriptChunkerOutputType> {
    const validInput = ScriptChunkerInput.parse(input);
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

  private splitBySentences(text: string, targetScenes: number): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const sentencesPerChunk = Math.ceil(sentences.length / targetScenes);

    const chunks: string[] = [];
    for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
      chunks.push(sentences.slice(i, i + sentencesPerChunk).join(' '));
    }

    return chunks;
  }

  private estimateDuration(wordCount: number): number {
    // Average speaking rate: 150 words per minute
    // Add 2 seconds buffer for visuals
    return Math.ceil((wordCount / 150) * 60) + 2;
  }

  private generateVisualDescription(text: string): string {
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

export default ScriptChunkerSkill;
