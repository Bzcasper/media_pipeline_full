/**
 * AI SDK Agent-based YouTube Video Creation
 * Uses ToolLoopAgent with proper API
 */

import { NextRequest, NextResponse } from "next/server";
import { youtubeVideoAgent } from "@trapgod/agent/ai-sdk-agent";
import { v4 as uuidv4 } from "uuid";

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
      complexity = "simple",
      userPreferences = {},
    } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const jobId = uuidv4();

    // Run agent with ToolLoopAgent generate method
    youtubeVideoAgent
      .generate({
        prompt: `Create a ${videoStyle} video about: "${query}"

Please execute the full pipeline:
1. Generate an engaging script
2. Break it into ${Math.ceil(duration / 8)} scenes
3. Create detailed image prompts
4. Generate high-quality images
5. Validate all images
6. Animate images into video clips
7. Assemble the final video with ${
          voiceOver ? "voiceover" : "no voiceover"
        } and ${backgroundMusic ? "background music" : "no music"}

Return the final video URL and all metadata.`,
      })
      .then((result) => {
        console.log(`YouTube video job ${jobId} completed:`, result);
      })
      .catch((error) => {
        console.error(`YouTube video job ${jobId} failed:`, error);
      });

    return NextResponse.json({
      jobId,
      message: "YouTube video generation started with AI SDK agent",
      agentVersion: "v2",
    });
  } catch (error) {
    console.error("YouTube video creation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Creation failed" },
      { status: 500 }
    );
  }
}
