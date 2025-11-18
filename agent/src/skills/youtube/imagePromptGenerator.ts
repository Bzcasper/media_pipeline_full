/**
 * Image Prompt Generator Skill
 * Creates detailed image generation prompts from script scenes
 */

import { z } from 'zod';
import { Logger } from '../../utils';

export const ImagePromptGeneratorInput = z.object({
  scenes: z.array(z.object({
    index: z.number(),
    text: z.string(),
    visualDescription: z.string()
  })),
  style: z.enum(['documentary', 'narrative', 'educational', 'entertainment']),
  aspectRatio: z.enum(['16:9', '9:16', '1:1']).default('16:9')
});

export const ImagePromptGeneratorOutput = z.object({
  prompts: z.array(z.object({
    index: z.number(),
    prompt: z.string(),
    negativePrompt: z.string(),
    videoMotion: z.string(),
    style: z.string()
  }))
});

export type ImagePromptGeneratorInputType = z.infer<typeof ImagePromptGeneratorInput>;
export type ImagePromptGeneratorOutputType = z.infer<typeof ImagePromptGeneratorOutput>;

export class ImagePromptGeneratorSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async run(input: ImagePromptGeneratorInputType): Promise<ImagePromptGeneratorOutputType> {
    const validInput = ImagePromptGeneratorInput.parse(input);
    this.logger.info('Generating image prompts', {
      sceneCount: validInput.scenes.length
    });

    const prompts = await Promise.all(
      validInput.scenes.map((scene) => this.generatePromptForScene(scene, validInput))
    );

    this.logger.success('Image prompts generated', {
      count: prompts.length
    });

    return { prompts };
  }

  private async generatePromptForScene(
    scene: { index: number; text: string; visualDescription: string },
    config: ImagePromptGeneratorInputType
  ) {
    // In production, use LLM to generate detailed, optimized prompts
    const basePrompt = await this.createDetailedPrompt(scene.text, scene.visualDescription, config.style);
    const styleModifiers = this.getStyleModifiers(config.style);
    const qualityTags = this.getQualityTags(config.aspectRatio);

    const prompt = `${basePrompt}, ${styleModifiers}, ${qualityTags}`;
    const negativePrompt = this.getNegativePrompt();
    const videoMotion = this.generateVideoMotion(scene.text);

    return {
      index: scene.index,
      prompt,
      negativePrompt,
      videoMotion,
      style: config.style
    };
  }

  private async createDetailedPrompt(text: string, visualDesc: string, style: string): Promise<string> {
    // Extract key subjects and actions
    const subjects = this.extractSubjects(text);
    const actions = this.extractActions(text);
    const setting = this.extractSetting(text);

    let prompt = '';

    if (setting) {
      prompt += `${setting}, `;
    }

    if (subjects.length > 0) {
      prompt += `featuring ${subjects.join(', ')}, `;
    }

    if (actions.length > 0) {
      prompt += `${actions.join(', ')}, `;
    }

    prompt += visualDesc;

    return prompt.trim();
  }

  private extractSubjects(text: string): string[] {
    // Simple subject extraction (in production, use NLP)
    const commonSubjects = ['person', 'people', 'man', 'woman', 'child', 'animal', 'object', 'building', 'landscape'];
    return commonSubjects.filter(s => text.toLowerCase().includes(s));
  }

  private extractActions(text: string): string[] {
    // Simple action extraction
    const commonActions = ['walking', 'running', 'talking', 'working', 'studying', 'playing', 'showing', 'demonstrating'];
    return commonActions.filter(a => text.toLowerCase().includes(a));
  }

  private extractSetting(text: string): string {
    const settings = {
      'outdoor': ['outside', 'park', 'street', 'nature', 'outdoor'],
      'indoor': ['inside', 'room', 'office', 'home', 'indoor'],
      'urban': ['city', 'urban', 'building', 'downtown'],
      'natural': ['forest', 'mountain', 'beach', 'nature', 'landscape']
    };

    for (const [setting, keywords] of Object.entries(settings)) {
      if (keywords.some(k => text.toLowerCase().includes(k))) {
        return setting;
      }
    }

    return 'cinematic scene';
  }

  private getStyleModifiers(style: string): string {
    const modifiers = {
      documentary: 'photorealistic, documentary style, natural lighting, authentic',
      narrative: 'cinematic, dramatic lighting, storytelling composition',
      educational: 'clean, clear, well-lit, professional, informative',
      entertainment: 'vibrant, energetic, engaging, dynamic composition'
    };

    return modifiers[style] || modifiers.educational;
  }

  private getQualityTags(aspectRatio: string): string {
    const baseTags = 'high quality, detailed, professional, 4k, sharp focus';
    const ratioTags = {
      '16:9': 'widescreen composition',
      '9:16': 'vertical composition, mobile-optimized',
      '1:1': 'square composition, balanced framing'
    };

    return `${baseTags}, ${ratioTags[aspectRatio]}`;
  }

  private getNegativePrompt(): string {
    return 'blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, text, signature, amateur';
  }

  private generateVideoMotion(text: string): string {
    // Determine camera motion based on scene context
    const motionKeywords = {
      'zoom in': ['close', 'detail', 'focus'],
      'zoom out': ['reveal', 'wide', 'panorama'],
      'pan right': ['across', 'move', 'sweep'],
      'tilt up': ['rise', 'ascend', 'upward'],
      'static': ['still', 'stable', 'steady']
    };

    for (const [motion, keywords] of Object.entries(motionKeywords)) {
      if (keywords.some(k => text.toLowerCase().includes(k))) {
        return `${motion}, smooth camera movement, professional cinematography`;
      }
    }

    return 'subtle camera movement, dynamic composition, cinematic motion';
  }
}

export default ImagePromptGeneratorSkill;
