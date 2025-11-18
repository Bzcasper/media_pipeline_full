# 🚀 Quick Start Guide - AI SDK v6 Integration

## Overview

This system now features **dual orchestration modes** with AI SDK v6 agents providing enhanced flexibility and autonomous decision-making.

## 🎯 What's New

### AI SDK v6 Agent Features
- ✨ **Automatic Tool Calling** - Agents autonomously select and execute tools
- 🎛️ **Dynamic Model Selection** - Choose between Haiku (fast) and Sonnet (best quality)
- 📊 **Type-Safe Configuration** - Zod-validated call options
- 🔄 **Built-in Reasoning** - Agents plan and adapt during execution
- 🛡️ **Error Recovery** - Automatic retries and fallbacks

## 📦 Installation

### 1. Install Dependencies

```bash
# From project root
npm install

# Install AI SDK packages
cd agent
npm install ai@^4.0.0 @ai-sdk/anthropic@^1.0.0 @ai-sdk/openai@^1.0.0
cd ..
```

### 2. Configure Environment Variables

Create `.env` in the project root:

```env
# Required: AI Model APIs
ANTHROPIC_API_KEY=sk-ant-...    # For Claude Sonnet/Haiku
OPENAI_API_KEY=sk-...           # For GPT-4o (optional fallback)

# Required: Media Server
MEDIA_SERVER_URL=https://your-media-server.com

# Required: Modal Labs (GPU Compute)
MODAL_JOB_URL=https://your-app.modal.run/job
MODAL_POLL_URL=https://your-app.modal.run/poll

# Required: Google Cloud Storage
GCS_BUCKET=your-bucket-name
GCS_PROJECT_ID=your-project-id
GCS_KEYFILE_PATH=/path/to/service-account-key.json

# Optional: Weaviate Vector Database
WEAVIATE_URL=https://your-weaviate-instance.com
WEAVIATE_API_KEY=your-key

# Optional: Replicate (fallback for image generation)
REPLICATE_API_TOKEN=r8_...
```

### 3. Build the Project

```bash
npm run build
```

### 4. Start Development Server

```bash
npm run dev
```

Access the dashboard at: **http://localhost:3000**

## 🎵 Music Video Pipeline (AI SDK v2)

### Via UI
1. Navigate to **Upload Music** (`/upload`)
2. Upload an audio file (MP3, WAV, FLAC)
3. Fill in metadata (title, artist, album)
4. Click **Start Processing**

### Via API

```bash
curl -X POST http://localhost:3000/api/upload-v2 \
  -F "file=@song.mp3" \
  -F "title=My Song" \
  -F "artist=Artist Name" \
  -F "album=Album Name"
```

### Pipeline Flow
```
Upload Audio
    ↓
AI Agent Orchestration (Claude Sonnet)
    ↓
1. Transcription (Riva → Whisper fallback)
2. Metadata Extraction (Genre, mood, BPM)
3. Album Cover Generation (Flux Dev)
4. Video Creation (Animated cover + music)
5. GCS Upload (Signed URLs)
6. Weaviate Indexing (Semantic search)
    ↓
Final Video URL
```

## 📹 YouTube Video Pipeline (AI SDK v2)

### Via UI
1. Navigate to **YouTube Creator** (`/youtube`)
2. Enter your video query/topic
3. Select video style (Documentary, Educational, etc.)
4. Configure settings:
   - **Duration**: 30-300 seconds
   - **Aspect Ratio**: 16:9 (YouTube), 9:16 (Shorts), 1:1 (Instagram)
   - **AI Intelligence Level**:
     - **Simple (Fast)** → Claude Haiku (10x cheaper, 3x faster)
     - **Complex (Best)** → Claude Sonnet (highest quality)
   - **Features**: Voiceover, Background Music
5. Click **Generate Video**

### Via API

```bash
curl -X POST http://localhost:3000/api/youtube/create-v2 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "The history of artificial intelligence",
    "videoStyle": "educational",
    "duration": 90,
    "aspectRatio": "16:9",
    "complexity": "complex",
    "voiceOver": true,
    "backgroundMusic": true,
    "userPreferences": {
      "imageStyle": "cinematic realism",
      "voiceType": "professional narrator"
    }
  }'
```

### Pipeline Flow
```
Text Query
    ↓
AI Agent Orchestration (Dynamic model selection)
    ↓
1. Script Generation (Claude/GPT-4o)
2. Scene Chunking (Optimal breakdown)
3. Image Prompt Engineering (Detailed descriptions)
4. Image Generation (Flux Dev via Modal, batched)
5. AI Vision Validation (Claude Vision quality check)
6. Auto-Editing (Fix issues if detected)
7. Image-to-Video (Wan2.2/LTX-Video animation)
8. Video Assembly (Transitions, voiceover, music)
    ↓
Final YouTube-Ready Video
```

## 🤖 AI Model Selection Guide

### Simple Mode (Haiku)
**Use when:**
- Quick results needed (3x faster)
- Cost optimization important (10x cheaper)
- Simple, straightforward content
- Testing or development

**Best for:**
- Short videos (30-60s)
- Entertainment style
- Social media content
- Batch processing

### Complex Mode (Sonnet)
**Use when:**
- Quality is paramount
- Complex reasoning required
- Professional/commercial use
- Educational or documentary content

**Best for:**
- Long-form videos (90-300s)
- Documentary style
- Technical topics
- Marketing videos

## 🔍 Monitoring Jobs

### Via UI
Navigate to **Job Status** (`/status/[jobId]`)

**Features:**
- Real-time progress timeline
- Live log viewer (Monaco editor)
- Auto-refresh every 5 seconds
- Detailed step tracking

### Via API

```bash
curl http://localhost:3000/api/status/{jobId}
```

**Response:**
```json
{
  "jobId": "abc-123",
  "status": "processing",
  "progress": 65,
  "currentStep": "Generating images",
  "steps": [...],
  "outputs": {...}
}
```

## 📊 Cost Optimization

### Model Selection Impact

| Complexity | Model | Cost per 1M Tokens | Speed | Quality |
|-----------|-------|-------------------|-------|---------|
| Simple | Haiku | ~$0.25 | Fast | Good |
| Complex | Sonnet | ~$3.00 | Medium | Excellent |

### Recommendations

**Free Tier / Personal Use:**
```javascript
{
  complexity: 'simple',
  duration: 60,
  voiceOver: false
}
```
**Estimated cost:** ~$0.10 per video

**Pro / Commercial Use:**
```javascript
{
  complexity: 'complex',
  duration: 180,
  voiceOver: true,
  backgroundMusic: true
}
```
**Estimated cost:** ~$0.80 per video

## 🛠️ Troubleshooting

### Issue: "AI SDK Agent Failed"

**Check:**
1. Environment variables are set correctly
2. API keys are valid and have credits
3. Modal endpoints are deployed

**Debug:**
```bash
# Check agent logs
tail -f logs/agent.log

# Verify API connectivity
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

### Issue: Image Generation Fails

**Modal Deployment:**
```bash
cd modal_apps
modal deploy flux_dev.py
modal deploy wan22_i2v.py
```

**Verify endpoints:**
```bash
curl $MODAL_JOB_URL/health
```

### Issue: Transcription Errors

**Riva Server:**
- Ensure Riva is running on Media Server
- Check `/api/audio/transcribe` endpoint
- Fallback to Whisper happens automatically

**Whisper Fallback:**
```bash
# Deploy Modal Whisper endpoint
cd modal_apps
modal deploy whisper_large_v3.py
```

## 📈 Performance Tips

### 1. Batch Processing
Process multiple files in parallel:
```bash
for file in *.mp3; do
  curl -X POST http://localhost:3000/api/upload-v2 \
    -F "file=@$file" &
done
```

### 2. Cache Optimization
- Images are cached by prompt hash
- Scripts are cached by query
- Clear cache: `rm -rf .cache/`

### 3. Resource Limits
Configure in `.env`:
```env
MAX_CONCURRENT_JOBS=5
IMAGE_BATCH_SIZE=3
VIDEO_SEGMENT_LIMIT=20
```

## 🚀 Deployment

### Vercel (Frontend)
```bash
npm run deploy:vercel
```

### Cloud Run (Agent Backend)
```bash
npm run deploy:cloudrun
```

### Modal (GPU Endpoints)
```bash
cd modal_apps
modal deploy --all
```

## 📚 Additional Resources

- **AI SDK Integration Guide**: `AI_SDK_INTEGRATION.md`
- **YouTube Pipeline Deep Dive**: `YOUTUBE_PIPELINE.md`
- **Complete System Overview**: `README_COMPLETE.md`
- **Project Summary**: `PROJECT_SUMMARY.md`

## 🎓 Example Workflows

### Workflow 1: Quick Social Media Video
```javascript
// Settings for 60s Instagram Reels
{
  query: "5 tips for productivity",
  videoStyle: "entertainment",
  duration: 60,
  aspectRatio: "9:16",
  complexity: "simple",  // Fast & cheap
  voiceOver: true,
  backgroundMusic: true
}
```

### Workflow 2: Professional YouTube Video
```javascript
// Settings for educational content
{
  query: "Understanding quantum computing",
  videoStyle: "educational",
  duration: 180,
  aspectRatio: "16:9",
  complexity: "complex",  // Best quality
  voiceOver: true,
  backgroundMusic: false,
  userPreferences: {
    imageStyle: "technical diagrams, clean minimalist",
    voiceType: "clear educational narrator"
  }
}
```

### Workflow 3: Music Album Batch
```bash
#!/bin/bash
# Process entire album
for track in album/*.mp3; do
  curl -X POST http://localhost:3000/api/upload-v2 \
    -F "file=@$track" \
    -F "album=My Album" \
    -F "artist=Artist Name"
  sleep 2
done
```

## ✨ What Makes AI SDK v6 Special?

### Before (Custom Orchestrator)
```typescript
// Manual, pre-coded flow
const script = await generateScript(query);
const chunks = await chunkScript(script);
const prompts = await generatePrompts(chunks);
// Fixed sequence, no adaptation
```

### After (AI SDK Agent)
```typescript
// Agent decides flow autonomously
await youtubeVideoAgent.generate({
  prompt: "Create educational video...",
  options: { complexity: 'complex', ... }
});
// Agent can:
// - Retry failed steps automatically
// - Choose different tools based on context
// - Adapt to quality issues
// - Optimize for user preferences
```

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Deploy Modal endpoints
4. ✅ Test music video pipeline
5. ✅ Test YouTube video pipeline
6. ✅ Monitor job execution
7. ✅ Deploy to production

---

**Need Help?** Check the full documentation or open an issue on GitHub.

**Built with ❤️ using AI SDK v6, Claude Sonnet, and modern AI infrastructure**
