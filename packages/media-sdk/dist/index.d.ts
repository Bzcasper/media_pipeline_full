/**
 * Media Server SDK
 * Production-grade TypeScript SDK for GPU Media Server API
 *
 * @example
 * ```typescript
 * import { MediaServerClient } from '@trapgod/media-sdk';
 *
 * const client = new MediaServerClient({
 *   baseUrl: 'https://your-media-server.com'
 * });
 *
 * // Upload and transcribe audio
 * const upload = await client.storage.upload({
 *   file: audioBuffer,
 *   media_type: 'audio'
 * });
 *
 * const transcription = await client.audio.transcribe({
 *   audio_file: audioBuffer
 * });
 * ```
 */
export { MediaServerClient, MediaServerConfig } from './client';
export * from './types';
export { default } from './client';
//# sourceMappingURL=index.d.ts.map