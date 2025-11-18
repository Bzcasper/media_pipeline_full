# Gemini Code Assistant Context

This document provides a comprehensive overview of the "AI Multimedia Pipeline" project, designed to give the Gemini code assistant the necessary context to understand and assist with development tasks.

## 🚀 Project Overview

This is a full-stack monorepo project that implements a sophisticated, AI-powered multimedia processing platform. The system is designed to handle two primary pipelines:
1.  **Music Video Generation**: Takes an audio file and automatically generates a full music video with transcription, AI-generated metadata, and an animated album cover.
2.  **YouTube Video Generation**: Takes a text query and generates a complete YouTube-style video, including an AI-generated script, scene chunking, image generation, AI-powered image validation, voiceover, and final video assembly.

The project is architected with two distinct orchestration modes, running in parallel:
-   **V1 (Custom Orchestrator)**: A manually coded, deterministic pipeline for predictable, stable workflows.
-   **V2 (AI SDK Agent)**: A flexible, autonomous agent-based workflow using the Vercel AI SDK v6. This version allows for dynamic model selection (e.g., Claude Haiku for simple tasks, Sonnet for complex ones), runtime customization via typed options, and intelligent error recovery.

## 🏗️ Architecture & Technologies

-   **Monorepo**: Managed with `pnpm` workspaces.
-   **Frontend**: A Next.js 15 application with a React-based dashboard for uploading files, initiating jobs, and monitoring status. It uses TailwindCSS and shadcn/ui for styling.
-   **Backend/Agent**: A TypeScript-based agent living in the `agent/` workspace. It contains all the business logic, skills, and tools for both the V1 and V2 pipelines.
-   **Media SDK**: A dedicated TypeScript SDK in `packages/media-sdk` provides a typed client to interact with a backend "Media Server" which handles the heavy-lifting of media manipulation (transcription, video processing, etc.).
-   **AI Integration**:
    -   **Vercel AI SDK v6**: The core of the V2 agent, using `ToolLoopAgent` to orchestrate tasks.
    -   **LLMs**: Claude (Sonnet, Haiku) and GPT-4o are used for various generation and validation tasks.
    -   **Other Models**: Whisper, Riva ASR, and various image/video generation models are used via external services (Modal, Replicate) or the internal Media Server.
-   **Infrastructure**:
    -   **Google Cloud Storage (GCS)**: For all file storage.
    -   **Google Cloud Run**: For deploying services like the Riva ASR server.
    -   **Modal / Replicate**: For serverless GPU-based inference.
    -   **Weaviate**: For vector indexing and semantic search.

### Project Structure

```
/
├── agent/              # V1 and V2 orchestration logic, skills, and tools
├── packages/
│   └── media-sdk/      # TypeScript client for the Media Server API
├── web/                # Next.js frontend application
├── scripts/            # Deployment scripts
├── .env.example        # Required environment variables
├── package.json        # Root package with monorepo scripts
└── pnpm-workspace.yaml # pnpm workspace configuration
```

## 🛠️ Building and Running

### Installation

The project uses `pnpm` as the package manager for the monorepo.

```bash
# Install dependencies for all workspaces
pnpm install
```

### Configuration

Copy the `.env.example` file to `.env.local` in the root directory and fill in the necessary API keys and service URLs.

### Running the Development Server

The main `dev` command starts the Next.js web application. The agent code is imported directly by the Next.js API routes and does not need a separate process.

```bash
# Run the Next.js development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Key `package.json` Scripts

-   `pnpm dev`: Starts the Next.js web application.
-   `pnpm build`: Builds all workspaces (`web`, `agent`, `media-sdk`).
-   `pnpm start`: Starts the production Next.js server.
-   `pnpm test`: Runs tests across all workspaces.
-   `pnpm lint`: Lints all workspaces.
-   `pnpm deploy:vercel`: Deploys the Next.js app to Vercel.
-   `pnpm deploy:cloudrun`: Deploys a service to Google Cloud Run.

## 💻 Development Conventions

-   **Monorepo Structure**: Code is organized into distinct workspaces (`web`, `agent`, `packages/media-sdk`). Use workspace dependencies (e.g., `"@trapgod/agent": "workspace:*"`) to link them.
-   **V1 vs. V2**:
    -   **V1 code** is located in `agent/orchestrator.ts` and `agent/youtube-orchestrator.ts`. It follows a procedural, step-by-step logic.
    -   **V2 code** is in `agent/ai-sdk-agent.ts` and uses the `ToolLoopAgent` from the Vercel AI SDK. It defines `tools` that wrap the project's `skills`.
    -   The two versions are exposed via different API endpoints in the `web/app/api/` directory (e.g., `/upload` vs. `/upload-v2`).
-   **Skills and Tools**: The core business logic is encapsulated in "skills" (e.g., `TranscriptionSkill`, `AlbumCoverSkill`). These skills are then used by both the V1 orchestrators and the V2 agent's tools, promoting code reuse.
-   **Media Server SDK**: All interactions with the underlying media processing API should go through the typed `MediaServerClient` from the `@trapgod/media-sdk` package.
-   **State Management**: Job progress and state are managed by the `JobStateManager` utility in `agent/utils/jobState.ts`.
-   **Environment Variables**: All secrets and configuration should be managed through environment variables, as defined in `.env.example`.
-   **TypeScript**: The entire project is written in TypeScript. Maintain strong typing and code quality.
