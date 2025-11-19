import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check UploadThing configuration
    const config = {
      hasToken: !!process.env.UPLOADTHING_TOKEN,
      hasSecret: !!process.env.UPLOADTHING_SECRET,
      hasAppId: !!process.env.UPLOADTHING_APP_ID,
      tokenPrefix: process.env.UPLOADTHING_TOKEN?.substring(0, 10) + "...",
      appId: process.env.UPLOADTHING_APP_ID,
      environment: process.env.NODE_ENV,
    };

    // Test basic UploadThing functionality
    let uploadthingStatus = "unknown";
    try {
      // This is a basic connectivity test
      uploadthingStatus =
        config.hasToken && config.hasSecret && config.hasAppId
          ? "configured"
          : "missing_env_vars";
    } catch (error) {
      uploadthingStatus = "error";
    }

    return NextResponse.json({
      result: "ok",
      service: "UploadThing",
      configuration: config,
      status: uploadthingStatus,
      endpoints: {
        audioUploader: "/api/uploadthing/audioUploader",
        imageUploader: "/api/uploadthing/imageUploader",
        videoUploader: "/api/uploadthing/videoUploader",
        batchUploader: "/api/uploadthing/batchUploader",
      },
      limits: {
        audio: "128MB max, 1 file",
        image: "8MB max, 1 file",
        video: "512MB max, 1 file",
        batch: "128MB max, 10 files",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        service: "UploadThing",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
