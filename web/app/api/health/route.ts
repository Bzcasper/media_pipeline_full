import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check if required environment variables are set
    const requiredEnvVars = [
      'MEDIA_SERVER_URL',
      'BEARER_TOKEN',
      'XAI_API_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    // Check media server connectivity
    let mediaServerStatus = 'unknown';
    try {
      const mediaServerUrl = process.env.MEDIA_SERVER_URL;
      if (mediaServerUrl) {
        const response = await fetch(`${mediaServerUrl}/health`, {
          signal: AbortSignal.timeout(5000),
          headers: {
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
          }
        });
        mediaServerStatus = response.ok ? 'healthy' : 'unhealthy';
      }
    } catch (error) {
      mediaServerStatus = 'unreachable';
    }

    // Check xAI API connectivity
    let xaiStatus = 'unknown';
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.XAI_API_KEY}`
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'test' }],
          model: 'grok-4-fast-reasoning',
          max_tokens: 1
        }),
        signal: AbortSignal.timeout(5000)
      });
      xaiStatus = response.status === 401 ? 'auth_error' : (response.ok ? 'healthy' : 'unhealthy');
    } catch (error) {
      xaiStatus = 'unreachable';
    }

    const healthStatus = {
      status: missingVars.length === 0 && mediaServerStatus === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        mediaServer: {
          status: mediaServerStatus,
          url: process.env.MEDIA_SERVER_URL ? 'configured' : 'missing'
        },
        xai: {
          status: xaiStatus,
          keyConfigured: !!process.env.XAI_API_KEY
        }
      },
      configuration: {
        missingEnvVars: missingVars,
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    };

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;

    return NextResponse.json(healthStatus, { status: statusCode });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}