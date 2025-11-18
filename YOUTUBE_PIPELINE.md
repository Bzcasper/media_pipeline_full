# YouTube Video Generation Pipeline

## 🎬 Overview

Complete AI-powered system that generates YouTube videos from a single text query. The pipeline automatically creates scripts, generates images, validates quality, animates visuals, and assembles final videos with voiceovers and music.

## 🔄 Pipeline Flow

```
User Query
    ↓
1. Script Generation (Claude/GPT)
    ├─ Generate engaging script
    ├─ Create hook (first 3 seconds)
    ├─ Structure scenes
    └─ Extract keywords
    ↓
2. Script Chunking
    ├─ Break into scenes
    ├─ Calculate timing
    └─ Generate visual descriptions
    ↓
3. Image Prompt Generation
    ├─ Detailed prompts per scene
    ├─ Style modifiers
    ├─ Video motion planning
    └─ Quality tags
    ↓
4. Image Generation (Modal/Replicate)
    ├─ Flux Dev / SDXL
    ├─ Batch processing (3 at a time)
    ├─ Aspect ratio optimization
    └─ Retry on failures
    ↓
5. AI Image Validation (Claude Vision/GPT-4o)
    ├─ Quality assessment
    ├─ Relevance check
    ├─ Issue detection
    └─ Auto-editing if needed
    ↓
6. Image-to-Video (Wan2.2/LTX-Video via Modal)
    ├─ Animate each image
    ├─ Apply camera motions
    ├─ 5-second clips
    └─ Batch processing (2 at a time)
    ↓
7. Video Assembly
    ├─ Merge all clips
    ├─ Add voiceover (Kokoro TTS)
    ├─ Add background music
    ├─ Apply transitions
    └─ Upload to GCS
    ↓
Final Video Ready for YouTube Upload!
```

## 📁 Project Structure

```
agent/
├── youtube-orchestrator.ts        # Main pipeline coordinator
└── skills/youtube/
    ├── scriptGenerator.ts         # LLM script creation
    ├── scriptChunker.ts           # Scene breakdown
    ├── imagePromptGenerator.ts    # Prompt engineering
    ├── imageGenerator.ts          # Modal image generation
    ├── imageValidator.ts          # AI quality check
    ├── imageToVideo.ts            # Wan2.2/LTX-Video
    ├── videoAssembler.ts          # Final compilation
    └── index.ts

web/
├── app/
│   ├── youtube/page.tsx           # Creation UI
│   └── api/youtube/create/route.ts # API endpoint
```

## 🎯 Features

### Script Generation
- **AI-Powered**: Uses Claude 3.7 or GPT-4o
- **Optimized Structure**: Hook, intro, main points, conclusion
- **Multiple Styles**: Documentary, narrative, educational, entertainment
- **Automatic Scene Planning**: Calculates optimal scene count

### Image Generation
- **Multiple Models**: Flux Dev (primary), SDXL (fallback)
- **Batch Processing**: 3 images in parallel
- **Automatic Retry**: Handles failures gracefully
- **Aspect Ratio Support**: 16:9, 9:16, 1:1

### AI Validation
- **Quality Assessment**: Excellent, good, acceptable, poor
- **Issue Detection**: Composition, quality, relevance
- **Auto-Editing**: Fixes color, contrast, sharpness
- **Prompt Alignment**: Ensures visuals match script

### Video Generation
- **Wan2.2**: Primary i2v model via Modal
- **LTX-Video**: Fallback option
- **Camera Motion**: Zoom, pan, tilt based on context
- **Smooth Animations**: Professional cinematography

### Assembly
- **Video Merging**: Seamless transitions
- **Voiceover**: AI-generated narration (Kokoro TTS)
- **Background Music**: Optional audio track
- **GCS Upload**: Cloud storage with signed URLs

## 🚀 Usage

### Web Interface

```typescript
// Navigate to /youtube
1. Enter your video query
2. Select video style
3. Set duration (30-300s)
4. Choose aspect ratio
5. Enable voiceover/music (optional)
6. Click "Generate Video"
```

### API Usage

```bash
POST /api/youtube/create

{
  "query": "The history of artificial intelligence",
  "videoStyle": "educational",
  "duration": 60,
  "aspectRatio": "16:9",
  "voiceOver": true,
  "backgroundMusic": false
}

Response:
{
  "jobId": "uuid",
  "message": "YouTube video generation started"
}
```

### Programmatic

```typescript
import { YouTubeVideoOrchestrator } from '@trapgod/agent/youtube-orchestrator';

const orchestrator = new YouTubeVideoOrchestrator();

const result = await orchestrator.run({
  query: 'How to start a successful YouTube channel',
  videoStyle: 'educational',
  duration: 60,
  aspectRatio: '16:9',
  voiceOver: true,
  backgroundMusic: true
});

console.log('Video URL:', result.finalVideoUrl);
console.log('Scenes:', result.scenes.length);
console.log('Metadata:', result.metadata);
```

## ⚙️ Configuration

### Environment Variables

```env
# Required
ANTHROPIC_API_KEY=sk-ant-...          # For script generation & validation
MODAL_JOB_URL=https://...             # Modal endpoints
GCS_BUCKET=your-bucket                # Cloud storage

# Optional
OPENAI_API_KEY=sk-...                 # Alternative to Claude
REPLICATE_API_TOKEN=r8_...            # Fallback image generation
```

### Modal Endpoints Required

Your Modal deployment should expose:
- `POST /image-gen` - Image generation (Flux/SDXL)
- `POST /wan22` - Wan2.2 image-to-video
- `POST /ltx-video` - LTX-Video fallback
- `GET /jobs/{id}` - Job status polling

## 📊 Performance

### Typical Generation Times

| Duration | Scenes | Time to Generate |
|----------|--------|------------------|
| 30s      | 4-5    | ~2 minutes       |
| 60s      | 6-8    | ~3-4 minutes     |
| 120s     | 10-12  | ~6-8 minutes     |
| 300s     | 15-20  | ~12-15 minutes   |

### Resource Usage

- **Image Generation**: ~10-15s per image
- **Image Validation**: ~2-3s per image
- **Image-to-Video**: ~30-45s per clip
- **Video Assembly**: ~10-20s
- **Total**: ~3-5 minutes for 60s video

## 🎨 Video Styles

### Documentary
- Photorealistic visuals
- Natural lighting
- Authentic compositions
- Informative narration

### Narrative
- Cinematic shots
- Dramatic lighting
- Storytelling focus
- Emotional pacing

### Educational
- Clean visuals
- Clear compositions
- Professional style
- Informative content

### Entertainment
- Vibrant colors
- Dynamic framing
- Energetic pacing
- Engaging visuals

## 🛠️ Advanced Options

### Custom Prompts

```typescript
const orchestrator = new YouTubeVideoOrchestrator();

// Override automatic prompt generation
const result = await orchestrator.run({
  query: 'Space exploration',
  videoStyle: 'documentary',
  // ... other options
});
```

### Scene Control

```typescript
// Control scene count
const scriptGenerator = new ScriptGeneratorSkill(logger);
const script = await scriptGenerator.run({
  query: 'Your topic',
  style: 'educational',
  targetDuration: 90,
  tone: 'enthusiastic' // formal, casual, enthusiastic, serious
});
```

### Image Quality

```typescript
const imageGenerator = new ImageGeneratorSkill(logger);
const images = await imageGenerator.run({
  prompts: [...],
  aspectRatio: '16:9',
  model: 'flux-dev', // flux-dev, flux-schnell, sdxl
  style: 'educational'
});
```

## 🔧 Troubleshooting

### Images Not Generating
- Check `MODAL_JOB_URL` is set
- Verify Modal endpoints are running
- Check `REPLICATE_API_TOKEN` for fallback

### Poor Quality Images
- Try different `videoStyle`
- Increase prompt detail in query
- Enable `autoFix` in validation

### Video Assembly Fails
- Ensure `MEDIA_SERVER_URL` is accessible
- Check video file sizes aren't too large
- Verify GCS permissions

### Slow Generation
- Reduce `duration` (fewer scenes)
- Disable `voiceOver` and `backgroundMusic`
- Use `flux-schnell` instead of `flux-dev`

## 📈 Optimization Tips

1. **Batch Processing**: System automatically batches API calls
2. **Caching**: Reuse generated assets when possible
3. **Quality vs Speed**: Use `flux-schnell` for faster generation
4. **Scene Count**: Fewer scenes = faster processing
5. **Parallel Processing**: Images generate in parallel

## 🎓 Best Practices

### Writing Queries
✅ **Good**: "Explain quantum computing with visual examples of qubits and superposition"
❌ **Bad**: "quantum computing"

✅ **Good**: "Step-by-step tutorial on making sourdough bread at home"
❌ **Bad**: "bread recipe"

### Choosing Styles
- **Documentary**: Historical topics, nature, science
- **Narrative**: Stories, case studies, journeys
- **Educational**: Tutorials, explainers, how-tos
- **Entertainment**: Top 10s, fun facts, viral content

### Duration Guidelines
- **Shorts (30-60s)**: Single concept, quick tips
- **Standard (60-180s)**: Detailed explanations
- **Long-form (180-300s)**: In-depth tutorials

## 🔄 Integration

### With Existing Music Pipeline

```typescript
// Generate video, then add music from music pipeline
const youtubeVideo = await youtubeOrchestrator.run({...});
const musicVideo = await musicOrchestrator.run({
  audioFileId: 'your-audio',
  title: 'Song Title'
});

// Merge both
const final = await mediaServer.client.video.merge({
  video_ids: [youtubeVideo.videoFileId, musicVideo.videoFileId].join(',')
});
```

## 📝 Output Format

```typescript
{
  jobId: "uuid",
  script: "Full generated script...",
  scenes: [
    {
      text: "Scene narration",
      imagePrompt: "Detailed visual prompt",
      imageUrl: "https://...",
      videoUrl: "https://...",
      duration: 5
    }
  ],
  finalVideoUrl: "https://storage.googleapis.com/...",
  metadata: {
    title: "Generated title",
    description: "SEO-optimized description",
    tags: ["keyword1", "keyword2"],
    thumbnail: "https://..."
  },
  success: true
}
```

## 🚀 Production Deployment

```bash
# Deploy Modal endpoints
modal deploy modal_apps/image_gen.py
modal deploy modal_apps/wan22.py

# Deploy Next.js frontend
cd web && vercel deploy --prod

# Set environment variables
vercel env add ANTHROPIC_API_KEY
vercel env add MODAL_JOB_URL
vercel env add GCS_BUCKET
```

---

**Built with ❤️ using Claude Code**

For support or questions, check the main PROJECT_SUMMARY.md
