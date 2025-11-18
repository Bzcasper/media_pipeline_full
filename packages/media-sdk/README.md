# Media Server SDK

A TypeScript SDK for interacting with the Media Server API, automatically generated from an OpenAPI specification.

## Installation

```bash
npm install @trapgod/media-sdk
```

## Usage

Import the `MediaClient` and instantiate it with the base URL of your media server.

```ts
import { MediaClient } from "@trapgod/media-sdk";

const client = new MediaClient({
  baseURL: "http://localhost:8000",
});

async function run() {
  try {
    // Example: Upload and transcribe an audio file
    const audioBlob = new Blob(["..."], { type: "audio/wav" });
    const audioFile = new File([audioBlob], "audio.wav");
    
    const transcriptionResult = await client.transcribeAudio({
      audio_file: audioFile,
    });
    console.log("Transcription:", transcriptionResult);

    // Example: List available fonts
    const fonts = await client.listFonts();
    console.log("Available Fonts:", fonts);

  } catch (error) {
    console.error("An API error occurred:", error);
  }
}

run();
```

## API Methods

This SDK provides convenient, typed methods for all API endpoints:

### Audio Tools
- `transcribeAudio(body)`
- `getKokoroVoices()`
- `generateKokoroTts(body)`
- `getChatterboxLanguages()`
- `generateChatterboxTts(body)`
- `mergeAudios(body)`
- `trimAudioPauses(body)`
- `getAudioInfo(file_id)`
- `extendAudio(body)`
- `alignScript(body)`

### Storage
- `uploadFile(body)`
- `downloadFile(file_id)`
- `deleteFile(file_id)`
- `getFileStatus(file_id)`

### Video Tools
- `mergeVideos(body)`
- `transcodeVideo(body)`
- `generateGifPreview(body)`
- `matchDuration(body)`
- `listFonts()`
- `generateCaptionedVideo(body)`
- `addColorkeyOverlay(body)`
- `addOverlay(body)`
- `extractFrame(video_id, timestamp)`
- `extractFrameFromUrl(body)`
- `getVideoInfo(file_id)`
- `generateLongFormAmbientVideo(body)`
- `generateRevengeStoryVideo(body)`
- `createLoopingVideo(body)`

### Music Tools
- `normalizeTrack(body)`
- `createPlaylist(body)`
- `analyzeTrack(body)`
- `createMix(body)`
- `createMusicVideo(body)`
- `createMusicThumbnail(body)`

### Utils
- `getYoutubeTranscript(video_id)`
- `stitchImages(body)`
- `makeImageImperfect(body)`
- `convertPcmToWav(body)`
- `renderHtml(body)`

---
_This SDK was generated automatically._
