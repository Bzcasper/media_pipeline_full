/**
 * Video Assembler Skill
 * Combines video clips into a complete storyline with voiceover and music
 */

import { z } from 'zod';
import { Logger } from '../../utils';
import { mediaServer, gcs } from '../../tools';

export const VideoAssemblerInput = z.object({
  videos: z.array(z.object({
    index: z.number(),
    url: z.string(),
    duration: z.number()
  })),
  script: z.string(),
  chunks: z.array(z.object({
    text: z.string()
  })),
  voiceOver: z.boolean().default(false),
  backgroundMusic: z.boolean().default(false),
  transitions: z.boolean().default(true)
});

export const VideoAssemblerOutput = z.object({
  videoUrl: z.string(),
  videoFileId: z.string(),
  duration: z.number(),
  gcsUrl: z.string().optional()
});

export type VideoAssemblerInputType = z.infer<typeof VideoAssemblerInput>;
export type VideoAssemblerOutputType = z.infer<typeof VideoAssemblerOutput>;

export class VideoAssemblerSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async run(input: VideoAssemblerInputType): Promise<VideoAssemblerOutputType> {
    const validInput = VideoAssemblerInput.parse(input);
    this.logger.info('Assembling final video', {
      clipCount: validInput.videos.length,
      voiceOver: validInput.voiceOver,
      backgroundMusic: validInput.backgroundMusic
    });

    // Step 1: Upload all video clips to media server
    const videoIds = await this.uploadVideoClips(validInput.videos);

    // Step 2: Generate voiceover if requested
    let voiceOverId: string | undefined;
    if (validInput.voiceOver) {
      voiceOverId = await this.generateVoiceOver(validInput.script);
    }

    // Step 3: Merge video clips
    const mergedVideoId = await this.mergeVideos(
      videoIds,
      voiceOverId,
      validInput.backgroundMusic,
      validInput.transitions
    );

    // Step 4: Upload to GCS
    const gcsUrl = await this.uploadToGCS(mergedVideoId);

    const totalDuration = validInput.videos.reduce((sum, v) => sum + v.duration, 0);
    const videoUrl = `${process.env.MEDIA_SERVER_URL}/api/v1/media/storage/${mergedVideoId}`;

    this.logger.success('Final video assembled', {
      videoUrl,
      duration: totalDuration
    });

    return {
      videoUrl,
      videoFileId: mergedVideoId,
      duration: totalDuration,
      gcsUrl
    };
  }

  private async uploadVideoClips(videos: Array<{ index: number; url: string; duration: number }>) {
    this.logger.info('Uploading video clips to media server');

    const videoIds: string[] = [];

    for (const video of videos) {
      try {
        // Download video
        const response = await fetch(video.url);
        const buffer = Buffer.from(await response.arrayBuffer());

        // Upload to media server
        const uploadResult = await mediaServer.uploadFile(buffer, 'video');

        if (!uploadResult.file_id) {
          throw new Error(`Failed to upload video ${video.index}`);
        }

        videoIds.push(uploadResult.file_id);
        this.logger.info(`Uploaded video ${video.index + 1}/${videos.length}`);

      } catch (error) {
        this.logger.error(`Failed to upload video ${video.index}`, { error });
        throw error;
      }
    }

    return videoIds;
  }

  private async generateVoiceOver(script: string): Promise<string> {
    this.logger.info('Generating voiceover');

    try {
      // Use Kokoro TTS for voiceover
      const result = await mediaServer.generateTTS(script, 'af_heart', 1.0);

      if (!result.file_id) {
        throw new Error('Failed to generate voiceover');
      }

      this.logger.success('Voiceover generated');
      return result.file_id;

    } catch (error) {
      this.logger.warn('Voiceover generation failed', { error });
      throw error;
    }
  }

  private async mergeVideos(
    videoIds: string[],
    voiceOverId: string | undefined,
    backgroundMusic: boolean,
    transitions: boolean
  ): Promise<string> {
    this.logger.info('Merging video clips');

    try {
      // Use media server video merge endpoint
      const mergeResult = await mediaServer.client.video.merge({
        video_ids: videoIds.join(','),
        background_music_id: voiceOverId,
        normalize: true,
        background_music_volume: 0.8
      });

      if (!mergeResult.file_id) {
        throw new Error('Failed to merge videos');
      }

      this.logger.success('Videos merged successfully');
      return mergeResult.file_id;

    } catch (error) {
      this.logger.error('Video merging failed', { error });
      throw error;
    }
  }

  private async uploadToGCS(videoFileId: string): Promise<string> {
    this.logger.info('Uploading final video to GCS');

    try {
      // Download video from media server
      const response = await mediaServer.downloadFile(videoFileId);
      const buffer = Buffer.from(await response.arrayBuffer());

      // Upload to GCS
      const gcsResult = await gcs.uploadFile(buffer, `youtube-video-${Date.now()}.mp4`, {
        contentType: 'video/mp4'
      });

      this.logger.success('Video uploaded to GCS', { url: gcsResult.signedUrl });
      return gcsResult.signedUrl;

    } catch (error) {
      this.logger.warn('GCS upload failed', { error });
      return '';
    }
  }
}

export default VideoAssemblerSkill;
