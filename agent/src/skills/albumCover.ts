/**
 * Album Cover Generation Skill
 * Generates album cover art from metadata and lyrics
 */

import { z } from 'zod';
import { mediaServer } from '../tools';
import { Logger } from '../utils';

export const AlbumCoverInput = z.object({
  title: z.string(),
  artist: z.string().optional(),
  genre: z.string().optional(),
  mood: z.string().optional(),
  lyrics: z.string().optional(),
  style: z.string().optional()
});

export const AlbumCoverOutput = z.object({
  imageFileId: z.string(),
  imageUrl: z.string().optional(),
  prompt: z.string()
});

export type AlbumCoverInputType = z.infer<typeof AlbumCoverInput>;
export type AlbumCoverOutputType = z.infer<typeof AlbumCoverOutput>;

export class AlbumCoverSkill {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async run(input: AlbumCoverInputType): Promise<AlbumCoverOutputType> {
    const validInput = AlbumCoverInput.parse(input);
    this.logger.info('Generating album cover', { title: validInput.title });

    // Generate prompt for image generation
    const prompt = this.generatePrompt(validInput);
    this.logger.info('Generated image prompt', { prompt });

    // For now, we'll use a placeholder approach since image generation
    // is not in the OpenAPI spec. In production, this would call an
    // image generation endpoint (Replicate, Modal, etc.)

    // Create a text-based thumbnail using HTML rendering
    const htmlContent = this.generateHTMLCover(validInput);

    const renderResult = await mediaServer.client.utils.renderHTML({
      html_content: htmlContent,
      width: 1080,
      height: 1080
    });

    if (!renderResult.file_id) {
      throw new Error('Failed to generate album cover');
    }

    this.logger.success('Album cover generated', {
      fileId: renderResult.file_id
    });

    return {
      imageFileId: renderResult.file_id,
      imageUrl: renderResult.url,
      prompt
    };
  }

  private generatePrompt(input: AlbumCoverInputType): string {
    const parts: string[] = [];

    parts.push('Album cover art');

    if (input.genre) {
      parts.push(`in ${input.genre} style`);
    }

    if (input.mood) {
      parts.push(`with ${input.mood} mood`);
    }

    parts.push(`titled "${input.title}"`);

    if (input.artist) {
      parts.push(`by ${input.artist}`);
    }

    if (input.style) {
      parts.push(input.style);
    } else {
      parts.push('professional, high quality, artistic');
    }

    return parts.join(', ');
  }

  private generateHTMLCover(input: AlbumCoverInputType): string {
    const bgColors: Record<string, string> = {
      'rock': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'pop': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'hip-hop': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'electronic': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'country': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };

    const bg = bgColors[input.genre || ''] || bgColors.default;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 1080px;
            height: 1080px;
            background: ${bg};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Arial Black', sans-serif;
            color: white;
            text-align: center;
            padding: 60px;
          }
          .title {
            font-size: 80px;
            font-weight: bold;
            margin-bottom: 30px;
            text-shadow: 4px 4px 8px rgba(0,0,0,0.5);
            line-height: 1.2;
          }
          .artist {
            font-size: 48px;
            margin-bottom: 20px;
            opacity: 0.9;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          }
          .genre {
            font-size: 32px;
            opacity: 0.7;
            text-transform: uppercase;
            letter-spacing: 4px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          }
        </style>
      </head>
      <body>
        <div class="title">${this.escapeHtml(input.title)}</div>
        ${input.artist ? `<div class="artist">${this.escapeHtml(input.artist)}</div>` : ''}
        ${input.genre ? `<div class="genre">${this.escapeHtml(input.genre)}</div>` : ''}
      </body>
      </html>
    `;
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

export default AlbumCoverSkill;
