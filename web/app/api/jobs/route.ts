import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const jobs = await prisma.job.findMany({
      where,
      include: {
        steps: {
          orderBy: { createdAt: 'asc' }
        },
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 5 // Last 5 logs for preview
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    const total = await prisma.job.count({ where });

    // Transform to match expected format
    const transformedJobs = jobs.map((job: any) => ({
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      currentStep: job.currentStep,
      steps: job.steps.map((step: any) => ({
        name: step.name,
        status: step.status,
        startTime: step.startTime?.toISOString(),
        endTime: step.endTime?.toISOString()
      })),
      logs: job.logs.map((log: any) => ({
        timestamp: log.timestamp.toISOString(),
        level: log.level,
        message: log.message
      })),
      outputs: job.outputs,
      errors: job.errors,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      metadata: job.metadata
    }));

    return NextResponse.json({
      jobs: transformedJobs,
      total,
    });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
