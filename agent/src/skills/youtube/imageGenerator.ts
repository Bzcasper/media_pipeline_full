/**
 * Image Generator Skill
 * Generates images using Modal endpoints
 */

import { z } from 'zod';
import { Logger } from '../../utils';
import { modal } from '../../tools';

export const ImageGeneratorInput = z.object({
  prompts: z.array(z.object({
    index: z.number(),
    prompt: z.string(),
    negativePrompt: z.string(),
    style: z.string()
  })),
  aspectRatio: z.enum(['16:9', '9:16', '1:1']),
  style: z.string(),
  model: z.enum(['flux-dev', 'flux-schnell', 'sdxl']).default('flux-dev')
});

export const ImageGeneratorOutput = z.object({
  images: z.array(z.object({
    index: z.number(),
    url: z.string(),
    prompt: z.string(),
    status: z.enum(['success', 'failed']),
    metadata: z.record(z.any()).optional()
  }))
});

export type ImageGeneratorInputType = z.infer<typeof ImageGeneratorInput>;
export type ImageGeneratorOutputType = z.infer<typeof ImageGeneratorOutput>;

export class ImageGeneratorSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async run(input: ImageGeneratorInputType): Promise<ImageGeneratorOutputType> {
    const validInput = ImageGeneratorInput.parse(input);
    this.logger.info('Generating images', {
      count: validInput.prompts.length,
      model: validInput.model
    });

    const images = [];

    // Generate images in parallel (batch of 3 at a time to avoid overwhelming the API)
    const batchSize = 3;
    for (let i = 0; i < validInput.prompts.length; i += batchSize) {
      const batch = validInput.prompts.slice(i, i + batchSize);

      this.logger.info(`Processing image batch ${Math.floor(i / batchSize) + 1}`, {
        batchStart: i,
        batchSize: batch.length
      });

      const batchResults = await Promise.all(
        batch.map(promptData => this.generateSingleImage(promptData, validInput))
      );

      images.push(...batchResults);

      // Small delay between batches
      if (i + batchSize < validInput.prompts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = images.filter(img => img.status === 'success').length;
    this.logger.success('Image generation complete', {
      total: images.length,
      successful: successCount,
      failed: images.length - successCount
    });

    return { images };
  }

  private async generateSingleImage(
    promptData: { index: number; prompt: string; negativePrompt: string; style: string },
    config: ImageGeneratorInputType
  ) {
    try {
      this.logger.info(`Generating image ${promptData.index + 1}`, {
        prompt: promptData.prompt.slice(0, 100)
      });

      // Calculate dimensions based on aspect ratio
      const dimensions = this.getDimensions(config.aspectRatio);

      // Call Modal endpoint for image generation
      const result = await this.callModalImageGen({
        prompt: promptData.prompt,
        negative_prompt: promptData.negativePrompt,
        width: dimensions.width,
        height: dimensions.height,
        model: config.model,
        steps: 25,
        guidance_scale: 7.5
      });

      if (!result || !result.image_url) {
        throw new Error('No image URL returned from Modal');
      }

      this.logger.success(`Image ${promptData.index + 1} generated`);

      return {
        index: promptData.index,
        url: result.image_url,
        prompt: promptData.prompt,
        status: 'success' as const,
        metadata: {
          model: config.model,
          dimensions,
          generationTime: result.generation_time
        }
      };

    } catch (error) {
      this.logger.error(`Failed to generate image ${promptData.index + 1}`, {
        error: error instanceof Error ? error.message : String(error)
      });

      return {
        index: promptData.index,
        url: '',
        prompt: promptData.prompt,
        status: 'failed' as const,
        metadata: {
          error: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  private async callModalImageGen(params: any): Promise<{ image_url: string; generation_time?: number }> {
    const modalJobUrl = process.env.MODAL_JOB_URL;

    if (!modalJobUrl) {
      throw new Error('MODAL_JOB_URL not configured');
    }

    try {
      const response = await fetch(`${modalJobUrl}/image-gen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`Modal API error: ${response.statusText}`);
      }

      const data = await response.json() as { job_id?: string; image_url?: string; generation_time?: number };

      // If Modal returns a job_id, poll for results
      if (data.job_id) {
        const result = await modal.pollJob(data.job_id, 60, 3000);
        return result.output as { image_url: string; generation_time?: number };
      }

      return data as { image_url: string; generation_time?: number };
    } catch (error) {
      this.logger.warn('Modal endpoint failed, trying fallback');
      // Fallback: Try Replicate or other service
      return await this.callReplicateFallback(params);
    }
  }

  private async callReplicateFallback(params: any): Promise<{ image_url: string; generation_time: number }> {
    const apiToken = process.env.REPLICATE_API_TOKEN;

    if (!apiToken) {
      throw new Error('No image generation service available');
    }

    interface ReplicatePrediction {
      id: string;
      status: 'starting' | 'processing' | 'succeeded' | 'failed';
      output?: string[];
    }

    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'black-forest-labs/flux-schnell',
          input: {
            prompt: params.prompt,
            num_outputs: 1,
            aspect_ratio: '16:9',
            output_format: 'jpg',
            output_quality: 90
          }
        })
      });

      const prediction = await response.json() as ReplicatePrediction;

      // Poll for completion
      let result: ReplicatePrediction = prediction;
      while (result.status !== 'succeeded' && result.status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const pollResponse = await fetch(
          `https://api.replicate.com/v1/predictions/${prediction.id}`,
          {
            headers: {
              'Authorization': `Token ${apiToken}`,
            }
          }
        );
        result = await pollResponse.json() as ReplicatePrediction;
      }

      if (result.status === 'failed' || !result.output || result.output.length === 0) {
        throw new Error('Replicate generation failed');
      }

      return {
        image_url: result.output[0],
        generation_time: 0
      };

    } catch (error) {
      throw new Error(`All image generation services failed: ${error}`);
    }
  }

  private getDimensions(aspectRatio: '16:9' | '9:16' | '1:1'): { width: number; height: number } {
    const ratios: Record<'16:9' | '9:16' | '1:1', { width: number; height: number }> = {
      '16:9': { width: 1920, height: 1080 },
      '9:16': { width: 1080, height: 1920 },
      '1:1': { width: 1024, height: 1024 }
    };

    return ratios[aspectRatio];
  }
}

export default ImageGeneratorSkill;
