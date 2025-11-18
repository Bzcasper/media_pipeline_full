import { NextRequest, NextResponse } from 'next/server';
import { JobStateManager } from '@trapgod/agent';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobState = await JobStateManager.load(params.jobId);
    const state = jobState.getState();

    return NextResponse.json(state);
  } catch (error) {
    console.error(`Failed to fetch job ${params.jobId}:`, error);
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }
}
