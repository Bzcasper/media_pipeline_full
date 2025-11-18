import { NextRequest, NextResponse } from 'next/server';
import { JobStateManager } from '@trapgod/agent';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');

    const jobs = await JobStateManager.listJobs();
    const limitedJobs = jobs.slice(0, limit);

    return NextResponse.json({
      jobs: limitedJobs,
      total: jobs.length
    });
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
