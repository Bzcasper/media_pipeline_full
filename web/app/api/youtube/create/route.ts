import { NextRequest, NextResponse } from "next/server";
import { mediaServer } from "@trapgod/agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      numScenes = 3,
      style = "cinematic, dramatic lighting, high quality",
      voice = "af_bella",
      useSVD = true,
      svdLoopCount = 2,
      svdMotion = 100,
    } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Generate storyline video with SVD animation, voiceover, and captions
    const result = await mediaServer.generateAIStorylineVideo({
      topic: query,
      numScenes,
      style,
      voice,
      captionOn: true,
      width: 1024,
      height: 576,
    });

    return NextResponse.json({
      success: true,
      videoId: result.finalVideoId,
      videoUrl: result.finalVideoUrl,
      thumbnailId: result.thumbnailId,
      thumbnailUrl: result.thumbnailUrl,
      scenes: result.scenes.length,
      prompts: result.prompts,
      narrations: result.narrations,
    });
  } catch (error) {
    console.error("YouTube video creation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Creation failed" },
      { status: 500 }
    );
  }
}
