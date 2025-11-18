/**
 * AI SDK Agent-based Music Upload
 * Uses ToolLoopAgent with proper API
 */

import { NextRequest, NextResponse } from "next/server";
import { musicVideoAgent } from "@trapgod/agent/ai-sdk-agent";
import { mediaServer } from "@trapgod/agent/tools/mediaServer";
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

    // Run agent with ToolLoopAgent generate method
    musicVideoAgent
      .generate({
        prompt: `Process this music file and create a complete music video for:

Audio File: ${uploadResult.file_id}
Title: ${title}
Artist: ${artist}
Album: ${album}

Please execute:
1. Transcribe the audio (use Riva, fallback to Whisper if needed)
2. Extract metadata (genre, mood, themes)
3. Generate an album cover
4. Create an animated music video
5. Upload everything to GCS
6. Index in Weaviate for search

Return all URLs and metadata.`,
      })
      .then((result) => {
        console.log(`Music video job ${jobId} completed:`, result);
      })
      .catch((error) => {
        console.error(`Music video job ${jobId} failed:`, error);
      });

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
