import { NextRequest, NextResponse } from "next/server";
import { youtubeVideoAgent } from "@trapgod/agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      videoStyle = "educational",
      duration = 60,
      aspectRatio = "16:9",
      voiceOver = false,
      backgroundMusic = false,
    } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Run AI SDK agent for YouTube video generation
    const jobId = `youtube_${Date.now()}`;
    const agentResult = await youtubeVideoAgent({
      jobId,
      query,
      videoStyle,
      duration,
    });

    if (!agentResult.success) {
      throw new Error(`YouTube agent failed: ${agentResult.error}`);
    }

    return NextResponse.json({
      jobId,
      message: "YouTube video generation started",
    });
  } catch (error) {
    console.error("YouTube video creation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Creation failed" },
      { status: 500 }
    );
  }
}
