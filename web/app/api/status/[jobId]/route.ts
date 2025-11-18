import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

const JOBS_DIR = process.env.JOBS_DIR || path.join(process.cwd(), '..', 'agent', 'jobs');

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId;
    const jobFile = path.join(JOBS_DIR, `${jobId}.json`);

    try {
      const content = await fs.readFile(jobFile, 'utf-8');
      const jobState = JSON.parse(content);
      return NextResponse.json(jobState);
    } catch (fileError) {
      // File not found or invalid
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Failed to fetch job ${params.jobId}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
