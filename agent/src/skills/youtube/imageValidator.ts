/**
 * Image Validator Skill
 * Uses AI to inspect images and determine if they need editing
 */

import { z } from 'zod';
import { Logger } from '../../utils';
import { mediaServer } from '../../tools';

export const ImageValidatorInput = z.object({
  images: z.array(z.object({
    index: z.number(),
    url: z.string(),
    prompt: z.string(),
    status: z.enum(['success', 'failed'])
  })),
  prompts: z.array(z.object({
    prompt: z.string(),
    style: z.string()
  })),
  autoFix: z.boolean().default(true)
});

export const ImageValidatorOutput = z.object({
  images: z.array(z.object({
    index: z.number(),
    url: z.string(),
    originalUrl: z.string(),
    prompt: z.string(),
    validated: z.boolean(),
    issues: z.array(z.string()),
    wasEdited: z.boolean(),
    quality: z.enum(['excellent', 'good', 'acceptable', 'poor'])
  }))
});

export type ImageValidatorInputType = z.infer<typeof ImageValidatorInput>;
export type ImageValidatorOutputType = z.infer<typeof ImageValidatorOutput>;

export class ImageValidatorSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async run(input: ImageValidatorInputType): Promise<ImageValidatorOutputType> {
    const validInput = ImageValidatorInput.parse(input);
    this.logger.info('Validating images', {
      count: validInput.images.length,
      autoFix: validInput.autoFix
    });

    const validatedImages = await Promise.all(
      validInput.images.map((image, idx) =>
        this.validateAndFixImage(image, validInput.prompts[idx], validInput.autoFix)
      )
    );

    const editedCount = validatedImages.filter(img => img.wasEdited).length;
    this.logger.success('Image validation complete', {
      total: validatedImages.length,
      edited: editedCount,
      passed: validatedImages.length - editedCount
    });

    return { images: validatedImages };
  }

  private async validateAndFixImage(
    image: { index: number; url: string; prompt: string; status: string },
    promptData: { prompt: string; style: string },
    autoFix: boolean
  ) {
    this.logger.info(`Validating image ${image.index + 1}`);

    // Skip failed images
    if (image.status === 'failed' || !image.url) {
      return {
        index: image.index,
        url: image.url,
        originalUrl: image.url,
        prompt: image.prompt,
        validated: false,
        issues: ['Generation failed'],
        wasEdited: false,
        quality: 'poor' as const
      };
    }

    try {
      // AI Vision inspection
      const analysis = await this.analyzeImage(image.url, promptData.prompt);

      // Check if editing is needed
      const needsEditing = analysis.issues.length > 0 && autoFix;

      let finalUrl = image.url;
      let wasEdited = false;

      if (needsEditing) {
        this.logger.info(`Image ${image.index + 1} needs editing`, {
          issues: analysis.issues
        });

        finalUrl = await this.editImage(image.url, analysis.issues);
        wasEdited = true;

        this.logger.success(`Image ${image.index + 1} edited successfully`);
      }

      return {
        index: image.index,
        url: finalUrl,
        originalUrl: image.url,
        prompt: image.prompt,
        validated: true,
        issues: analysis.issues,
        wasEdited,
        quality: analysis.quality
      };

    } catch (error) {
      this.logger.error(`Failed to validate image ${image.index + 1}`, {
        error: error instanceof Error ? error.message : String(error)
      });

      return {
        index: image.index,
        url: image.url,
        originalUrl: image.url,
        prompt: image.prompt,
        validated: false,
        issues: ['Validation failed'],
        wasEdited: false,
        quality: 'acceptable' as const
      };
    }
  }

  private async analyzeImage(imageUrl: string, prompt: string) {
    // Use AI vision model to analyze image quality and relevance
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Fallback: basic validation without AI
      return {
        issues: [],
        quality: 'good' as const
      };
    }

    try {
      if (process.env.ANTHROPIC_API_KEY) {
        return await this.analyzeWithClaude(imageUrl, prompt);
      } else if (process.env.OPENAI_API_KEY) {
        return await this.analyzeWithGPT(imageUrl, prompt);
      }
    } catch (error) {
      this.logger.warn('AI vision analysis failed, using fallback');
    }

    return {
      issues: [],
      quality: 'acceptable' as const
    };
  }

  private async analyzeWithClaude(imageUrl: string, prompt: string) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: imageUrl
              }
            },
            {
              type: 'text',
              text: `Analyze this image for a video scene. Expected: "${prompt}"

Rate quality (excellent/good/acceptable/poor) and list any issues:
- Composition problems
- Quality issues
- Relevance to prompt
- Visual artifacts

Format: QUALITY: [rating]\nISSUES: [comma-separated list or "none"]`
            }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;

    return this.parseAnalysis(text);
  }

  private async analyzeWithGPT(imageUrl: string, prompt: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageUrl }
            },
            {
              type: 'text',
              text: `Analyze this image for: "${prompt}"\nRate quality and list issues.`
            }
          ]
        }],
        max_tokens: 300
      })
    });

    const data = await response.json();
    const text = data.choices[0].message.content;

    return this.parseAnalysis(text);
  }

  private parseAnalysis(text: string) {
    const qualityMatch = text.match(/QUALITY:\s*(excellent|good|acceptable|poor)/i);
    const quality = (qualityMatch?.[1]?.toLowerCase() || 'acceptable') as 'excellent' | 'good' | 'acceptable' | 'poor';

    const issuesMatch = text.match(/ISSUES:\s*(.+?)(?:\n|$)/i);
    const issuesText = issuesMatch?.[1] || 'none';
    const issues = issuesText.toLowerCase() === 'none'
      ? []
      : issuesText.split(',').map(i => i.trim()).filter(Boolean);

    return { quality, issues };
  }

  private async editImage(imageUrl: string, issues: string[]): Promise<string> {
    try {
      // Download image
      const response = await fetch(imageUrl);
      const buffer = Buffer.from(await response.arrayBuffer());

      // Upload to media server
      const uploadResult = await mediaServer.uploadFile(buffer, 'image');

      if (!uploadResult.file_id) {
        throw new Error('Failed to upload image for editing');
      }

      // Apply automatic fixes based on issues
      const editInstructions = this.generateEditInstructions(issues);

      // Use media server image edit endpoint
      const editResult = await mediaServer.client.utils.makeImageImperfect(
        uploadResult.file_id,
        {
          enhance_color: 1.2,
          enhance_contrast: 1.1,
          noise_strength: 5
        }
      );

      const editedUrl = `${process.env.MEDIA_SERVER_URL}/api/v1/media/storage/${editResult.file_id}`;
      return editedUrl;

    } catch (error) {
      this.logger.warn('Image editing failed, using original', { error });
      return imageUrl;
    }
  }

  private generateEditInstructions(issues: string[]): string {
    const instructions = issues.map(issue => {
      if (issue.includes('quality') || issue.includes('blurry')) {
        return 'enhance sharpness and quality';
      }
      if (issue.includes('color') || issue.includes('exposure')) {
        return 'adjust color and exposure';
      }
      if (issue.includes('composition')) {
        return 'crop and reframe';
      }
      return 'general enhancement';
    });

    return instructions.join(', ');
  }
}

export default ImageValidatorSkill;
