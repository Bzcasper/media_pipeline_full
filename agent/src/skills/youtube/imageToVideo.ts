/**
 * Image-to-Video Skill
 * Converts static images into animated video clips
 */

import { z } from 'zod';
import { Logger } from '../../utils';
import { modal } from '../../tools';

export const ImageToVideoInput = z.object({
  images: z.array(z.object({
    index: z.number(),
    url: z.string()
  })),
  prompts: z.array(z.string()),
  duration: z.number().default(5)
});

export const ImageToVideoOutput = z.object({
  videos: z.array(z.object({
    index: z.number(),
    url: z.string(),
    duration: z.number(),
    status: z.enum(['success', 'failed']),
    metadata: z.record(z.any()).optional()
  }))
});

export type ImageToVideoInputType = z.infer<typeof ImageToVideoInput>;
export type ImageToVideoOutputType = z.infer<typeof ImageToVideoOutput>;

export class ImageToVideoSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async run(input: ImageToVideoInputType): Promise<ImageToVideoOutputType> {
    const validInput = ImageToVideoInput.parse(input);
    this.logger.info('Converting images to videos', {
      count: validInput.images.length,
      duration: validInput.duration
    });

    const videos = [];

    // Process images in batches (2 at a time for i2v which is compute-intensive)
    const batchSize = 2;
    for (let i = 0; i < validInput.images.length; i += batchSize) {
      const batch = validInput.images.slice(i, i + batchSize);

      this.logger.info(`Processing video batch ${Math.floor(i / batchSize) + 1}`, {
        batchStart: i,
        batchSize: batch.length
      });

      const batchResults = await Promise.all(
        batch.map((image, batchIdx) =>
          this.convertSingleImage(
            image,
            validInput.prompts[i + batchIdx],
            validInput.duration
          )
        )
      );

      videos.push(...batchResults);

      // Delay between batches
      if (i + batchSize < validInput.images.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const successCount = videos.filter(v => v.status === 'success').length;
    this.logger.success('Image-to-video conversion complete', {
      total: videos.length,
      successful: successCount,
      failed: videos.length - successCount
    });

    return { videos };
  }

  private async convertSingleImage(
    image: { index: number; url: string },
    motionPrompt: string,
    duration: number
  ) {
    try {
      this.logger.info(`Converting image ${image.index + 1} to video`);

      // Try Wan2.2 via Modal first
      let result;
      try {
        result = await modal.runWan22(image.url, motionPrompt);
        result = await modal.pollJob(result.job_id);
      } catch (error) {
        this.logger.warn('Wan2.2 failed, trying LTX-Video');
        result = await this.callLTXVideo(image.url, motionPrompt, duration);
      }

      if (!result || !result.video_url) {
        throw new Error('No video URL returned');
      }

      this.logger.success(`Video ${image.index + 1} generated`);

      return {
        index: image.index,
        url: result.video_url,
        duration: result.duration || duration,
        status: 'success' as const,
        metadata: {
          model: result.model || 'wan2.2',
          generationTime: result.generation_time
        }
      };

    } catch (error) {
      this.logger.error(`Failed to convert image ${image.index + 1}`, {
        error: error instanceof Error ? error.message : String(error)
      });

      // Fallback: Use static image as video
      return {
        index: image.index,
        url: image.url,
        duration: duration,
        status: 'failed' as const,
        metadata: {
          error: error instanceof Error ? error.message : String(error),
          fallback: 'static_image'
        }
      };
    }
  }

  private async callLTXVideo(imageUrl: string, prompt: string, duration: number) {
    const modalJobUrl = process.env.MODAL_JOB_URL;

    if (!modalJobUrl) {
      throw new Error('Modal endpoint not configured');
    }

    const response = await fetch(`${modalJobUrl}/ltx-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt: prompt,
        duration: duration,
        fps: 24
      })
    });

    if (!response.ok) {
      throw new Error(`LTX-Video API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Poll if job_id returned
    if (data.job_id) {
      return await modal.pollJob(data.job_id, 120, 5000);
    }

    return data;
  }
}

export default ImageToVideoSkill;
