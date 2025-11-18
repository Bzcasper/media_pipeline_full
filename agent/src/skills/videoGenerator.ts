/**
 * Video Generator Skill
 * Creates music videos from album covers and audio
 */

import { z } from "zod";
import { mediaServer, modal } from "../tools";
import { Logger } from "../utils";
import { env } from "../utils/env";

export const VideoGeneratorInput = z.object({
  audioFileId: z.string(),
  coverImageFileId: z.string(),
  title: z.string().optional(),
  artist: z.string().optional(),
  method: z.enum(["media_server", "modal_wan22"]).optional(),
});

export const VideoGeneratorOutput = z.object({
  videoFileId: z.string(),
  videoUrl: z.string().optional(),
  duration: z.number().optional(),
  method: z.string(),
});

export type VideoGeneratorInputType = z.infer<typeof VideoGeneratorInput>;
export type VideoGeneratorOutputType = z.infer<typeof VideoGeneratorOutput>;

export class VideoGeneratorSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async run(input: VideoGeneratorInputType): Promise<VideoGeneratorOutputType> {
    const validInput = VideoGeneratorInput.parse(input);
    this.logger.info("Generating music video", {
      audioId: validInput.audioFileId,
      coverId: validInput.coverImageFileId,
    });

    const method = validInput.method || "media_server";

    if (method === "modal_wan22") {
      return await this.generateWithModal(validInput);
    } else {
      return await this.generateWithMediaServer(validInput);
    }
  }

  /**
   * Generate video using Media Server music tools
   */
  private async generateWithMediaServer(
    input: VideoGeneratorInputType
  ): Promise<VideoGeneratorOutputType> {
    this.logger.info("Generating video using Media Server");

    // Step 1: Create a looping video from the cover image
    this.logger.info("Creating looping video from cover image");

    // First, we need to create a simple video from the image
    // Use captioned video generator without text to create a video from image
    const imageVideoResult =
      await mediaServer.client.video.generateCaptionedVideo({
        background_id: input.coverImageFileId,
        audio_id: input.audioFileId,
        caption_on: false,
        image_effect: "ken_burns", // Ken Burns effect for motion
        width: 1920,
        height: 1080,
      });

    if (!imageVideoResult.file_id) {
      throw new Error("Failed to create video from image");
    }

    this.logger.success("Music video generated", {
      videoFileId: imageVideoResult.file_id,
    });

    return {
      videoFileId: imageVideoResult.file_id,
      videoUrl: imageVideoResult.url,
      method: "media_server",
    };
  }

  /**
   * Generate video using Modal Wan2.2 (image-to-video)
   */
  private async generateWithModal(
    input: VideoGeneratorInputType
  ): Promise<VideoGeneratorOutputType> {
    this.logger.info("Generating video using Modal Wan2.2");

    // Get image URL
    const imageUrl = `${env.MEDIA_SERVER_URL}/api/v1/media/storage/${input.coverImageFileId}`;

    // Generate video with Wan2.2
    const prompt = `Animated music video, smooth motion, professional quality`;
    const result = await modal.runAndWait("wan22", { imageUrl, prompt });

    if (!result || !result.video_url) {
      throw new Error("Modal Wan2.2 failed to generate video");
    }

    // Upload the result to media server
    this.logger.info("Uploading generated video to media server");
    const uploadResult = await mediaServer.uploadFromURL(
      result.video_url,
      "video"
    );

    // Match video duration to audio
    this.logger.info("Matching video duration to audio");
    const matchedResult = await mediaServer.matchDuration(
      uploadResult.file_id!,
      input.audioFileId
    );

    this.logger.success("Video generated and matched to audio", {
      videoFileId: matchedResult.file_id!,
    });

    return {
      videoFileId: matchedResult.file_id!,
      videoUrl: matchedResult.url,
      method: "modal_wan22",
    };
  }

  async runWithRetry(
    input: VideoGeneratorInputType,
    maxAttempts: number = 2
  ): Promise<VideoGeneratorOutputType> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.info(`Video generation attempt ${attempt}/${maxAttempts}`);
        return await this.run(input);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.warn(`Video generation attempt ${attempt} failed`, {
          error: lastError.message,
        });

        if (attempt < maxAttempts) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          this.logger.info(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error("Video generation failed after all retries");
  }
}

export default VideoGeneratorSkill;
