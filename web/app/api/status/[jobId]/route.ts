import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { jobId: params.jobId },
      include: {
        steps: {
          orderBy: { createdAt: 'asc' }
        },
        logs: {
          orderBy: { timestamp: 'asc' }
        },
        files: true
      }
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Transform to match the expected format
    const jobState = {
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      currentStep: job.currentStep,
      steps: job.steps.map(step => ({
        name: step.name,
        status: step.status,
        startTime: step.startTime?.toISOString(),
        endTime: step.endTime?.toISOString(),
        output: step.output,
        error: step.error
      })),
      logs: job.logs.map(log => ({
        timestamp: log.timestamp.toISOString(),
        level: log.level,
        message: log.message,
        data: log.data
      })),
      outputs: job.outputs as any,
      errors: job.errors,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      metadata: job.metadata as any
    };

    return NextResponse.json(jobState);
  } catch (error) {
    console.error(`Failed to fetch job ${params.jobId}:`, error);
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }
}
