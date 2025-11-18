import { NextRequest, NextResponse } from "next/server";
import { PipelineOrchestrator, mediaServer } from "@trapgod/agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audioUrl, audioKey, title, artist, album } = body;

    // Validate required fields
    if (!audioUrl) {
      return NextResponse.json(
        { error: "Audio URL is required" },
        { status: 400 }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Download audio from UploadThing and upload to media server
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch audio file from UploadThing" },
        { status: 500 }
      );
    }

    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    const uploadResult = await mediaServer.uploadFile(audioBuffer, "audio");

    if (!uploadResult.file_id) {
      return NextResponse.json(
        { error: "Failed to upload audio file to media server" },
        { status: 500 }
      );
    }

    // Create orchestrator and start pipeline
    const orchestrator = new PipelineOrchestrator();
    const jobId = orchestrator.getJobId();

    // Run pipeline asynchronously
    orchestrator
      .run({
        audioFileId: uploadResult.file_id,
        title: title.trim(),
        artist: artist?.trim() || undefined,
        album: album?.trim() || undefined,
      })
      .catch((error: any) => {
        console.error(`Pipeline failed for job ${jobId}:`, error);
      });

    return NextResponse.json(
      {
        jobId,
        message: "Pipeline started successfully",
        uploadThingKey: audioKey,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Process route error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Processing failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
