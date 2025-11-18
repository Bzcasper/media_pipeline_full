# **🎧 AI Multimedia Pipeline — Full System Documentation**

A fully automated **AI-driven music, video, and metadata generation pipeline**, orchestrated through:

- **Next.js 15 (App Router)**
- **Vercel AI SDK v6**
- **Claude Code CLI agents + skills**
- **Google Cloud Run**
- **Google Cloud Storage**
- **Your GPU-powered Media Server**
- **Modal Labs (GPU inference)**
- **Replicate API**
- **Weaviate Vector DB**

This system processes ZIP uploads of music folders and automatically performs:

1. **Riva ASR transcription**
2. **Whisper Large-V3 fallback (Modal)**
3. **Album Cover V2 generation (Media Server image/model endpoints)**
4. **Metadata extraction + tagging**
5. **Video generation (Wan, LTX-Video, etc.)**
6. **Embedding + Weaviate indexing**
7. **Output upload to GCS**
8. **Status tracking through Vercel Workflows & Agents**
9. **Spotify-style Next.js Dashboard UI**

---

# 🚀 **Technology Stack**

## **Frontend**

- **Next.js 15 (App Router)**
- **React Server Components**
- **Server Actions w/ Vercel Workflows**
- **TailwindCSS + ShadCN**
- **Monaco Editor for job logs**
- **Framer Motion**
- **Zustand for global UI state**
- **Zod for schema validation**

## **Backend**

- **Vercel Workflows (NEW)**

  - Workflow steps (parallel + sequential + fan-out)
  - Cron triggers
  - Durable job orchestration
  - State persistence across runs

- **Vercel AI SDK v6**

  - Agents
  - Tools
  - Runnables
  - State Machines
  - Multi-model routing

- **Node 20 runtime**

- **Google Cloud Storage**

- **Weaviate (semantic search + embeddings)**

---

# 🧠 **AI Models Used**

### **Speech-to-Text**

| Model            | Provider           | Purpose               |
| ---------------- | ------------------ | --------------------- |
| NVIDIA Riva ASR  | Cloud Run instance | Primary transcription |
| Whisper Large-V3 | Modal GPU          | Secondary fallback    |

### **Image Generation**

| Model          | Provider     |
| -------------- | ------------ |
| Flux Dev       | Media Server |
| Qwen Image     | Media Server |
| SDXL Lightning | Replicate    |

### **Video Generation**

| Model                | Provider     |
| -------------------- | ------------ |
| Wan 2.2              | Media Server |
| Lightricks LTX-Video | Modal        |
| Runway Gen-2         | Replicate    |

### **Text + Metadata**

| Model      | Use                                                    |
| ---------- | ------------------------------------------------------ |
| Claude 3.7 | Metadata extraction + tagging + pipeline orchestration |
| GPT-4o     | JSON validation + summaries                            |
| Qwen-VL    | Image analysis for album cover & frames                |

---

# ☁️ **Cloud Infrastructure**

### **Google Cloud Storage (GCS)**

Used for:

- Uploading ZIP files from dashboard
- Extracted audio files
- Transcription outputs
- Album covers (v1 & v2)
- Videos
- Metadata JSON
- Job logs

### **Google Cloud Run**

Used for:

- N8N (optional)
- Riva ASR server (primary STT)
- Webhook endpoints for backpressure

### **Modal GPU Functions**

Used for:

- Whisper fallback transcription
- LTX-Video generation
- Image-to-video animations
- Heavy GPU preprocessing

---

# ⚙️ **Agent Architecture (Claude Code)**

The system uses a **tool-based, skill-based agent framework** with Claude Code CLI.

### **Primary Orchestrator Agent**

- Handles full job lifecycle
- Routes to specialized agents depending on state
- Writes logs to GCS
- Updates Vercel Workflow state

### **Skills Included**

| Skill                  | Purpose                               |
| ---------------------- | ------------------------------------- |
| transcription.skill.ts | Riva + Whisper fallback logic         |
| albumCover.skill.ts    | Uses media server image endpoints     |
| videoGen.skill.ts      | Uses media server + Modal video       |
| metadata.skill.ts      | Uses LLM to extract/validate metadata |
| gcs.skill.ts           | Upload, extract, delete, list         |
| weaviate.skill.ts      | Embeddings + indexing                 |
| pipeline.skill.ts      | Full orchestration state machine      |

### **Tools Included**

| Tool                 | Purpose                          |
| -------------------- | -------------------------------- |
| mediaServer.tools.ts | Auto-generated from OpenAPI.json |
| modal.tools.ts       | Modal GPU tasks                  |
| replicate.tools.ts   | Run SDXL, Gen-2, etc.            |
| gcs.tools.ts         | Signed URLs, upload, unzip       |
| logs.tools.ts        | Append logs to GCS               |
| transcribe.tools.ts  | Riva + fallback                  |

---

# 🗂️ **Project Structure**

```
/
├── agent/
│   ├── orchestrator.agent.ts
│   ├── pipeline.skill.ts
│   ├── transcription.skill.ts
│   ├── video.skill.ts
│   ├── metadata.skill.ts
│   ├── albumCover.skill.ts
│   ├── gcs.skill.ts
│   ├── weaviate.skill.ts
│   └── tools/
│       ├── mediaServer.tools.ts
│       ├── modal.tools.ts
│       ├── gcs.tools.ts
│       └── replicate.tools.ts
│
├── sdk/
│   └── media-server.ts (auto-generated from OpenAPI)
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Spotify dashboard)
│   ├── upload/page.tsx
│   ├── status/[jobId]/page.tsx
│   ├── history/page.tsx
│   └── components/
│       ├── DropzoneCard.tsx
│       ├── Timeline.tsx
│       ├── MonacoLogViewer.tsx
│       └── SpotifyCard.tsx
│
├── workflows/
│   ├── upload.workflow.ts
│   ├── pipeline.workflow.ts
│   └── cleanup.workflow.ts
│
├── openapi.json
└── README.md
```

---

# 🔄 **Vercel Workflows Used**

### ✔️ **upload.workflow.ts**

Triggered by:

- ZIP upload from frontend → GCS signed URL

Steps:

1. Upload
2. Unzip to GCS folder
3. Create job record
4. Kick off pipeline workflow

### ✔️ **pipeline.workflow.ts**

State machine includes:

```
UNZIP → DISCOVER AUDIO → TRANSCRIBE (Riva) → FALLBACK (Whisper)
→ ALBUM_COVER_V2 → METADATA → VIDEO → EMBED → SAVE → DONE
```

Supports:

- Retries
- Conditional routing
- Parallel steps
- Durable logs
- Structured state schema

### ✔️ **cleanup.workflow.ts**

Scheduled nightly:

- Remove temp folders
- Delete failed jobs
- Clear logs older than N days

---

# 🎨 **UI Features (Spotify Style)**

### **Dashboard**

- Recent jobs
- Job state color-coded
- Album art preview
- Status badge

### **Upload Page**

- Drag & drop ZIP uploader
- Vercel Upload API
- Progress bar
- Redirect to job status

### **Status Page**

- Vertical timeline
- Monaco JSON log viewer
- Album covers (v1, v2)
- Confetti on job completion

### **History Page**

- Job table w/ filters
- GCS links
- Error summaries

---

# 🔑 **Environment Variables**

Create `.env.local`:

```
MEDIA_SERVER_BASE_URL=
MEDIA_SERVER_API_KEY=

GOOGLE_CLOUD_PROJECT=
GCS_BUCKET=
GCP_SERVICE_ACCOUNT_KEY=

MODAL_TOKEN_ID=
MODAL_TOKEN_SECRET=

REPLICATE_API_TOKEN=

WEAVIATE_URL=
WEAVIATE_API_KEY=

ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

---

# 🧪 **Local Development**

```
pnpm install
pnpm dev
```

Start Claude Code agent:

```
claude code
```

Run workflows:

```
vercel workflows dev
```

---

# 🚀 **Deploy**

Deploy frontend + workflows:

```
vercel deploy --prod
```

Deploy Cloud Run Riva:

```
gcloud run deploy riva-stt ...
```

Deploy Modal functions:

```
modal deploy
```
