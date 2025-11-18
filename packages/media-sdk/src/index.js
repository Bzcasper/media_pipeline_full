"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.MediaServerClient = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "MediaServerClient", { enumerable: true, get: function () { return client_1.MediaServerClient; } });
__exportStar(require("./types"), exports);
var client_2 = require("./client");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(client_2).default; } });
//# sourceMappingURL=index.js.map