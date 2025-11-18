/**
 * AI SDK Agent-based Music Upload
 * Uses ToolLoopAgent with proper API
 */

import { NextRequest, NextResponse } from "next/server";
import { musicVideoAgent, mediaServer } from "@trapgod/agent";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const album = formData.get("album") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload audio file
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await mediaServer.uploadFile(buffer, "audio");

    if (!uploadResult.file_id) {
      throw new Error("Failed to upload audio file");
    }

    const jobId = uuidv4();

    // Run AI SDK agent for music video generation
    const agentResult = await musicVideoAgent({
      jobId,
      prompt: `Process this music file and create a complete music video for:

Audio File ID: ${uploadResult.file_id}
Title: ${title}
Artist: ${artist}
Album: ${album}

Please execute the full pipeline:
1. Transcribe the audio using Riva ASR (fallback to Whisper if needed)
2. Extract metadata including genre, mood, themes, BPM, and key
3. Generate an album cover image
4. Create an animated music video
5. Upload all results to Google Cloud Storage
6. Index the content in Weaviate for search

Return the complete processing results.`,
    });

    if (!agentResult.success) {
      throw new Error(`Agent processing failed: ${agentResult.error}`);
    }

    return NextResponse.json({
      jobId,
      message: "Music video generation started with AI SDK agent",
      agentVersion: "v2",
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
