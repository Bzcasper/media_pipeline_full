# 🎬 Complete AI Media Pipeline System

**Two Production-Grade Pipelines in One System**

## 🌟 Overview

This is a comprehensive AI-powered multimedia processing platform with **two complete pipelines**:

1. **🎵 Music Video Pipeline** - Transform songs into videos with lyrics, album art, and visuals
2. **📹 YouTube Video Pipeline** - Generate complete storyline videos from text queries

Both pipelines share infrastructure, tools, and UI, creating a unified content generation platform.

---

## 🎵 Pipeline 1: Music Video Generation

### Process Flow
```
Audio Upload → Transcription (Riva/Whisper) → Metadata Extraction →
Album Cover Generation → Video Creation → GCS Upload → Weaviate Indexing
```

### Key Features
- **Automatic Transcription**: Riva ASR with Whisper fallback
- **AI Metadata**: Extract genre, mood, BPM from lyrics
- **Album Art**: Generate professional covers
- **Video Synthesis**: Animate cover with music
- **Cloud Storage**: Upload to GCS with signed URLs
- **Semantic Search**: Index in Weaviate

### Usage
```typescript
// Via UI: Navigate to /upload

// Via API:
POST /api/upload
Content-Type: multipart/form-data

{
  file: <audio-file>,
  title: "Song Title",
  artist: "Artist Name"
}

// Programmatic:
import { PipelineOrchestrator } from '@trapgod/agent';

const orchestrator = new PipelineOrchestrator();
const result = await orchestrator.run({
  audioFileId: 'file-id',
  title: 'My Song'
});
```

---

## 📹 Pipeline 2: YouTube Video Generation

### Process Flow
```
Text Query → Script Generation → Scene Chunking → Image Prompts →
Image Generation → AI Validation → Image-to-Video → Video Assembly
```

### Key Features
- **AI Scriptwriting**: Claude/GPT generates engaging scripts
- **Smart Scene Planning**: Automatic scene breakdown
- **Image Generation**: Flux Dev/SDXL via Modal
- **AI Quality Check**: Vision models validate images
- **Auto-Editing**: Fix quality issues automatically
- **Video Animation**: Wan2.2/LTX-Video for i2v
- **Voiceover**: AI-generated narration (Kokoro TTS)
- **Professional Assembly**: Transitions, music, effects

### Usage
```typescript
// Via UI: Navigate to /youtube

// Via API:
POST /api/youtube/create
Content-Type: application/json

{
  "query": "The history of AI",
  "videoStyle": "educational",
  "duration": 60,
  "aspectRatio": "16:9",
  "voiceOver": true
}

// Programmatic:
import { YouTubeVideoOrchestrator } from '@trapgod/agent/youtube-orchestrator';

const orchestrator = new YouTubeVideoOrchestrator();
const result = await orchestrator.run({
  query: 'How to start a YouTube channel',
  videoStyle: 'educational',
  duration: 60
});
```

---

## 🏗️ Architecture

### Shared Components

#### Agent System (`/agent/`)
```
agent/
├── orchestrator.ts              # Music pipeline
├── youtube-orchestrator.ts      # YouTube pipeline
├── skills/
│   ├── transcription.ts         # Shared
│   ├── metadata.ts              # Shared
│   ├── videoGenerator.ts        # Shared
│   └── youtube/                 # YouTube-specific
│       ├── scriptGenerator.ts
│       ├── imageGenerator.ts
│       ├── imageValidator.ts
│       └── videoAssembler.ts
├── tools/
│   ├── mediaServer.ts           # Shared
│   ├── modal.ts                 # Shared
│   ├── gcs.ts                   # Shared
│   └── weaviate.ts              # Shared
└── utils/
    ├── logger.ts                # Shared
    └── jobState.ts              # Shared
```

#### SDK (`/packages/media-sdk/`)
- Complete TypeScript SDK for Media Server
- 50+ endpoints (audio, video, storage, music tools)
- Type-safe, with error handling
- FormData support for uploads

#### Frontend (`/web/`)
```
web/
├── app/
│   ├── page.tsx                 # Dashboard (both pipelines)
│   ├── upload/page.tsx          # Music upload
│   ├── youtube/page.tsx         # YouTube creator
│   ├── status/[jobId]/page.tsx  # Job monitoring
│   ├── history/page.tsx         # Job history
│   └── api/
│       ├── upload/route.ts      # Music API
│       └── youtube/create/route.ts # YouTube API
├── components/
│   ├── Sidebar.tsx              # Navigation
│   ├── Header.tsx               # Top bar
│   └── JobCard.tsx              # Job display
```

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Start development server
npm run dev
```

### Environment Setup

Create `.env`:

```env
# Media Server
MEDIA_SERVER_URL=https://your-media-server.com

# Modal Labs
MODAL_JOB_URL=https://your-modal-app.modal.run
MODAL_POLL_URL=https://your-modal-app.modal.run

# Google Cloud
GCS_BUCKET=your-bucket
GCS_PROJECT_ID=your-project
GCS_KEYFILE_PATH=/path/to/key.json

# AI APIs
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Vector DB
WEAVIATE_URL=https://your-weaviate.com
WEAVIATE_API_KEY=your-key

# Optional
REPLICATE_API_TOKEN=r8_...
```

### Access the System

```
Dashboard:        http://localhost:3000
Music Upload:     http://localhost:3000/upload
YouTube Creator:  http://localhost:3000/youtube
Job History:      http://localhost:3000/history
```

---

## 📊 Comparison

| Feature | Music Pipeline | YouTube Pipeline |
|---------|----------------|------------------|
| Input | Audio file | Text query |
| Script | From transcription | AI-generated |
| Visuals | Album cover | Multiple images |
| Animation | Image effects | Image-to-video |
| Audio | Original music | AI voiceover |
| Duration | Song length | 30-300 seconds |
| Output | 1 video | 1 compiled video |
| Use Case | Music videos | YouTube content |

---

## 🎯 Use Cases

### Music Pipeline
- Music videos for artists
- Lyric videos
- Album visualizers
- Podcast intros
- Audio content visualization

### YouTube Pipeline
- Educational content
- Tutorial videos
- Explainer videos
- Documentary shorts
- Social media content
- Marketing videos

---

## 🔧 Technology Stack

### Core
- **TypeScript** - Type-safe development
- **Node.js 20** - Runtime environment
- **Next.js 14** - React framework
- **Zod** - Schema validation

### AI & ML
- **Claude 3.7** - Script generation, validation
- **GPT-4o** - Alternative LLM
- **Whisper Large-V3** - Speech-to-text
- **Riva ASR** - Primary transcription
- **Flux Dev** - Image generation
- **Wan2.2** - Image-to-video
- **LTX-Video** - Alternative i2v
- **Kokoro TTS** - Voice synthesis

### Infrastructure
- **Modal Labs** - GPU compute
- **Google Cloud Storage** - File storage
- **Weaviate** - Vector database
- **Media Server** - Processing APIs
- **Vercel** - Frontend hosting

### UI
- **Tailwind CSS** - Styling
- **shadcn/ui** - Components
- **Monaco Editor** - Log viewer
- **Lucide Icons** - Icons

---

## 📈 Performance

### Music Pipeline
- **Duration**: 3-5 minutes per song
- **Steps**: 6 major operations
- **Output**: 1 video + metadata

### YouTube Pipeline
- **Duration**: 3-5 minutes per minute of video
- **Steps**: 7 major operations
- **Output**: Multiple clips → final video

---

## 🛠️ Development

### Build Commands
```bash
npm run build              # Build all
npm run build:web         # Build frontend
npm run build:sdk         # Build SDK
npm run build:agent       # Build agent

npm run dev               # Development mode
npm run type-check        # Check types
```

### Testing
```bash
# Test music pipeline
curl -X POST http://localhost:3000/api/upload \
  -F "file=@song.mp3" \
  -F "title=Test Song"

# Test YouTube pipeline
curl -X POST http://localhost:3000/api/youtube/create \
  -H "Content-Type: application/json" \
  -d '{"query":"AI history","duration":60}'
```

### Deployment
```bash
# Deploy frontend
./scripts/deploy-vercel.sh

# Deploy agent
./scripts/deploy-cloudrun.sh

# Deploy Modal endpoints
modal deploy modal_apps/
```

---

## 📚 Documentation

- **PROJECT_SUMMARY.md** - Complete project overview
- **YOUTUBE_PIPELINE.md** - YouTube pipeline deep dive
- **agent/system.md** - Agent architecture
- **CLAUDE.md** - Build instructions

---

## 🎓 Examples

### Example 1: Music Video

```typescript
// Upload song and generate video
const orchestrator = new PipelineOrchestrator();

const result = await orchestrator.run({
  audioFileId: 'uploaded-song-id',
  title: 'Summer Nights',
  artist: 'The Band',
  album: 'Greatest Hits'
});

console.log('Video URL:', result.videoUrl);
console.log('Transcription:', result.transcription);
console.log('Genre:', result.metadata.genre);
```

### Example 2: YouTube Video

```typescript
// Generate educational video
const orchestrator = new YouTubeVideoOrchestrator();

const result = await orchestrator.run({
  query: 'How photosynthesis works in plants',
  videoStyle: 'educational',
  duration: 90,
  aspectRatio: '16:9',
  voiceOver: true,
  backgroundMusic: true
});

console.log('Video URL:', result.finalVideoUrl);
console.log('Scenes:', result.scenes.length);
console.log('Title:', result.metadata.title);
```

---

## 🔐 Security

- Environment variables for all secrets
- Signed URLs for cloud storage
- API key rotation support
- Rate limiting ready
- Input validation with Zod

---

## 🚧 Roadmap

### Planned Features
- [ ] Batch processing (multiple files)
- [ ] Custom voice selection
- [ ] Style transfer for videos
- [ ] Real-time preview
- [ ] Template library
- [ ] Advanced editing tools
- [ ] Analytics dashboard
- [ ] Team collaboration
- [ ] API webhooks
- [ ] Multi-language support

---

## 🤝 Contributing

Built with Claude Code following best practices:
- TypeScript for type safety
- Modular skill-based architecture
- Comprehensive error handling
- Automatic retries and fallbacks
- Production-ready logging

---

## 📄 License

Private project - All rights reserved

---

## 🎉 Success Metrics

### What This System Can Do

**Music Pipeline:**
- ✅ Process any audio format
- ✅ Transcribe in 95+ languages (Whisper)
- ✅ Generate album art automatically
- ✅ Create synchronized videos
- ✅ Upload to cloud storage
- ✅ Enable semantic search

**YouTube Pipeline:**
- ✅ Generate videos from text alone
- ✅ Create professional scripts
- ✅ Generate 4-20 scenes per video
- ✅ Validate image quality with AI
- ✅ Animate static images
- ✅ Add voiceover and music
- ✅ Produce YouTube-ready content

**Combined:**
- 🎯 Two complete pipelines
- 🎯 Shared infrastructure
- 🎯 Unified UI/UX
- 🎯 Production-grade quality
- 🎯 Fully documented
- 🎯 Ready to deploy

---

**Built with ❤️ using Claude Code**

For support: See individual documentation files
For updates: Check PROJECT_SUMMARY.md and YOUTUBE_PIPELINE.md
