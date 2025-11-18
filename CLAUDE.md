You are Claude Code, acting as a Principal System Architect, AI Agent Engineer, and Senior Full-Stack Engineer responsible for generating an entire production-grade system.

Your task is to build a complete multimodal agent-powered automated video content generation system using:

My GPU Media Server (OpenAPI attached inside project)

Modal Labs image/video/audio generation endpoints

Replicate API

YouTube Shorts generation pipeline

Google Cloud Storage (GCS)

Weaviate / pgvector memory layer

Next.js (Vercel) front-end

AI SDK v4 / v5 / v6 (choose best)

Agents + Skills system

Claude Code tool functions

Webhook-triggered pipelines

Automatic job tracking + logging

RAG-enhanced agent memory

Full TypeScript SDK for Media Server from OpenAPI

You must create, modify, and organize all files necessary to make this system deployable end-to-end.

🎯 Primary Objective

Build a unified system where users upload a ZIP of songs → pipeline processes each folder → transcription (Riva → Whisper fallback) → metadata → album cover → image2video → full video generation → upload to GCS → store results → index in Weaviate → return final URL.

All orchestrated by Claude Code agents + skills using the AI SDK.

The system must support autonomous execution, meaning the agent can analyze tasks, plan, execute, revise, and write files.  

🧩 Folders Claude Code Must Create

/agent
  system.md
  skills/
    transcription.ts
    albumCover.ts
    videoGenerator.ts
    metadata.ts
    weaviate.ts
    gcs.ts
    router.ts
    pipeline.ts
  tools/
    mediaServer.ts
    modal.ts
    replicate.ts
    gcs.ts
    weaviate.ts

/sdk
  openapi.json (use attached)
  client.ts
  index.ts

/app (Next.js)
  layout.tsx
  page.tsx
  upload/page.tsx
  status/[jobId]/page.tsx
  history/page.tsx
  components/ui/*
  components/dashboard/*
  components/spotify/*
  lib/api.ts

/scripts
  deploy-vercel.sh
  deploy-cloudrun.sh

/env
  .env.example



  🧠 Agent Architecture Requirements

Claude must build:

1. Orchestrator Agent (Master Controller)

Plans pipeline

Routes work

Calls workers

Maintains state

Logs every step

Writes status files JSON for UI

2. Worker Skills

Each skill must be its own file, with:

name

description

run(args)

Zod schemas for input/output

Tool invocations inside

Full error handling

Retries

Workers:

TranscriptionWorker

Hit Riva → detect failure message → fallback to Whisper (Modal)

Return text, segments, metadata

AlbumCoverWorker

Use Media Server image endpoint

Name output cover-v2.png

VideoGeneratorWorker

Use Modal Wan2.2 → animate generated album cover

Or Media Server i2v

MetadataWorker

Use LLM to extract metadata from lyrics

IndexerWorker

Push features, metadata, and assets → Weaviate or pgvector

GCSWorker

Upload all outputs to bucket

Generate signed URLs

🖥 Next.js UI Requirements

Claude must generate:

/upload page

Drag-and-drop ZIP uploader

Calls /api/upload

Uses signed GCS URL

/status/[jobId]

Spotify-style dark UI

Timeline display

Monaco editor to view job logs

Auto-poll /api/status

/history

Table of past jobs with badges, buttons

Global styling

Spotify-like dark theme

#1DB954 accent

Sidebar navigation

Top header bar

Reusable components

🔌 Media Server SDK

Claude must:

Read openapi.json in /sdk

Generate a typed client

Expose all GPU tools:

Image generation

Image edit

Audio transcription

Image-to-video

GPU chains

🪄 Execution Rules
Claude Code must:

Plan → scaffold → implement → refine

Always create missing files

Use the most modern libraries

Use AI SDK v6 with Agents + Tools

Use TypeScript, not JS

Use Zod for all schemas

Use fetch or SDK for all media server endpoints

Write production-ready code

Put all environment variables in .env.example

Ask clarifying questions ONLY when blocking

On each step, propose the next action until the system is complete

🚀 Kickoff Command

After receiving this prompt, begin with:

Generate the architecture plan

Create project folder structure

Add initial skeleton code

Implement each module step-by-step

Auto-iterate until production-ready