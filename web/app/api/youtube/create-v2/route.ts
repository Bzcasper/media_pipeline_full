/**
 * AI SDK Agent-based YouTube Video Creation
 * Uses mediaServer.generateAIStorylineVideo with SVD animation
 */

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
      captionOn = true,
      captionFont = "Arial",
      width = 1024,
      height = 576,
    } = body;

    // Input validation
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({
        error: "Query is required and must be a non-empty string",
        field: "query"
      }, { status: 400 });
    }

    if (numScenes < 1 || numScenes > 20) {
      return NextResponse.json({
        error: "Number of scenes must be between 1 and 20",
        field: "numScenes"
      }, { status: 400 });
    }

    if (!['af_bella', 'af_sarah', 'am_michael', 'am_adam'].includes(voice)) {
      return NextResponse.json({
        error: "Invalid voice selection",
        field: "voice",
        validOptions: ['af_bella', 'af_sarah', 'am_michael', 'am_adam']
      }, { status: 400 });
    }

    // Log the request for monitoring
    console.log(`🎬 Video creation request:`, {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      numScenes,
      voice,
      useSVD,
      dimensions: `${width}x${height}`,
      timestamp: new Date().toISOString()
    });

    // Generate storyline video with SVD animation, voiceover, and captions
    const result = await mediaServer.generateAIStorylineVideo({
      topic: query,
      numScenes,
      style,
      voice,
      captionOn: true,
      width,
      height,
      useSVD,
      svdLoopCount,
      svdMotion,
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

    // Provide user-friendly error messages
    let errorMessage = "Video creation failed";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("429")) {
        errorMessage = "AI service rate limit exceeded. Please try again in a few minutes.";
        statusCode = 429;
      } else if (error.message.includes("401") || error.message.includes("403")) {
        errorMessage = "Authentication failed. Please check API keys.";
        statusCode = 401;
      } else if (error.message.includes("timeout") || error.message.includes("network")) {
        errorMessage = "Request timed out. Video generation may still be processing.";
        statusCode = 408;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      },
      { status: statusCode }
    );
  }
}
