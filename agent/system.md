# Media Pipeline Agent System Architecture

## Overview
Production-grade autonomous multimodal content generation system that processes audio/music files through a complete pipeline: transcription → metadata extraction → visual generation → video creation → cloud storage → vector indexing.

## System Components

### 1. Orchestrator Agent
**Location:** `/agent/orchestrator.ts`

**Responsibilities:**
- Receive ZIP file upload requests
- Extract and process each folder
- Coordinate worker skills
- Manage job state and logging
- Handle retries and fallbacks
- Write status updates to `/jobs/{jobId}.json`

**State Machine:**
```
UPLOADED → EXTRACTING → PROCESSING → TRANSCRIBING → GENERATING_VISUALS →
CREATING_VIDEO → UPLOADING → INDEXING → COMPLETED
```

### 2. Worker Skills

#### TranscriptionSkill (`/agent/skills/transcription.ts`)
- **Primary:** Riva ASR via Media Server `/api/v1/media/audio-tools/transcribe`
- **Fallback:** Whisper via Modal (L4/L40/A100)
- **Output:** Text, word segments, metadata
- **Error Detection:** Check for "Riva failed" or empty responses

#### AlbumCoverSkill (`/agent/skills/albumCover.ts`)
- Use Media Server image generation endpoint
- Generate from metadata + lyrics
- Output naming: `cover-v2.png`
- Apply quality enhancements if needed

#### VideoGeneratorSkill (`/agent/skills/videoGenerator.ts`)
- **Option A:** Modal Wan2.2 for image-to-video
- **Option B:** Media Server `/api/v1/media/video-tools/*`
- Animate album cover with music
- Add audio synchronization

#### MetadataSkill (`/agent/skills/metadata.ts`)
- Extract: artist, title, genre, mood, BPM
- Use LLM analysis of lyrics
- Return structured metadata object

#### IndexerSkill (`/agent/skills/weaviate.ts`)
- Push to Weaviate or pgvector
- Store: metadata, embeddings, asset URLs
- Enable semantic search

#### GCSSkill (`/agent/skills/gcs.ts`)
- Upload all outputs to GCS bucket
- Generate signed URLs
- Return public URLs for frontend

### 3. Tools Layer

#### MediaServerTool (`/tools/mediaServer.ts`)
Generated from OpenAPI spec. Key methods:
- `audio.transcribe(file)`
- `audio.tts.kokoro(text, voice)`
- `video.merge(videoIds[])`
- `video.i2v(imageId)`
- `storage.upload(file)`
- `storage.download(fileId)`

#### ModalTool (`/tools/modal.ts`)
- `runWhisper(audioUrl, model)`
- `runWan22(imageUrl, prompt)`
- `pollJob(jobId)`

#### ReplicateTool (`/tools/replicate.ts`)
- Alternative generation endpoints
- Fallback options

#### GCSTool (`/tools/gcs.ts`)
- `uploadFile(path, bucket)`
- `generateSignedUrl(path)`
- `listFiles(prefix)`

#### WeaviateTool (`/tools/weaviate.ts`)
- `indexDocument(data)`
- `search(query, filters)`
- `getById(id)`

### 4. Frontend (Next.js)

#### Pages
- **`/upload`** - ZIP drag-and-drop, progress tracking
- **`/status/[jobId]`** - Real-time job monitoring, Monaco logs viewer
- **`/history`** - Job history table with filters
- **`/`** - Dashboard with recent jobs

#### Components
- **Sidebar** - Navigation with Spotify styling
- **Header** - User info, search
- **JobTimeline** - Vertical progress display
- **LogViewer** - Monaco editor for job logs
- **JobCard** - Individual job display

#### API Routes
- **`POST /api/upload`** - Handle ZIP upload, create job
- **`GET /api/status/[jobId]`** - Return job state
- **`GET /api/jobs`** - List all jobs
- **`GET /api/logs/[jobId]`** - Stream job logs

### 5. Job State Management

**Job Structure (`/jobs/{jobId}.json`):**
```json
{
  "jobId": "uuid",
  "status": "processing",
  "progress": 45,
  "currentStep": "generating_visuals",
  "steps": [
    {
      "name": "transcription",
      "status": "completed",
      "startTime": "ISO8601",
      "endTime": "ISO8601",
      "output": { "text": "...", "segments": [] }
    }
  ],
  "logs": [
    { "timestamp": "ISO8601", "level": "info", "message": "..." }
  ],
  "outputs": {
    "transcription": "gcs://...",
    "cover": "gcs://...",
    "video": "gcs://..."
  },
  "errors": []
}
```

## Data Flow

1. **Upload:** User uploads ZIP → stored in GCS → job created
2. **Extract:** Unzip → identify folders → queue processing
3. **Process Each Folder:**
   - Transcribe audio (Riva → Whisper fallback)
   - Extract metadata from lyrics
   - Generate album cover
   - Create video from cover + audio
   - Upload all outputs to GCS
   - Index in Weaviate
4. **Complete:** Return URLs, update UI

## Error Handling

- **Retries:** 3 attempts per skill
- **Fallbacks:** Riva → Whisper, Modal → Replicate
- **Logging:** All errors logged to job state
- **Notifications:** Frontend polls for status updates

## Environment Variables

```
MEDIA_SERVER_URL=https://...
MODAL_API_KEY=...
REPLICATE_API_TOKEN=...
GCS_BUCKET=media-pipeline-outputs
GCS_PROJECT_ID=...
WEAVIATE_URL=...
WEAVIATE_API_KEY=...
NEXT_PUBLIC_API_URL=...
```

## Deployment

- **Frontend:** Vercel (Next.js)
- **Agent:** Cloud Run or Modal serverless
- **Storage:** Google Cloud Storage
- **Vector DB:** Weaviate Cloud or self-hosted pgvector

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js 20+
- **Framework:** Next.js 14+
- **Agent SDK:** AI SDK v6 (Vercel)
- **Validation:** Zod
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide
- **Code Editor:** Monaco
- **API Client:** Fetch + FormData

## Development Workflow

1. Generate SDK from OpenAPI
2. Implement tools using SDK
3. Build skills using tools
4. Create orchestrator
5. Build frontend
6. Test end-to-end
7. Deploy
