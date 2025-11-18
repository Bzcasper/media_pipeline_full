import { NextRequest, NextResponse } from "next/server";
import * as fs from 'fs/promises';
import * as path from 'path';

const JOBS_DIR = process.env.JOBS_DIR || path.join(process.cwd(), '..', 'agent', 'jobs');

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");

    // Read all job files from the jobs directory
    let files: string[] = [];
    try {
      files = await fs.readdir(JOBS_DIR);
    } catch (err) {
      // Directory doesn't exist yet
      return NextResponse.json({ jobs: [], total: 0 });
    }

    const jobFiles = files.filter(f => f.endsWith('.json'));

    const jobs: any[] = [];
    for (const file of jobFiles) {
      try {
        const filePath = path.join(JOBS_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const jobState = JSON.parse(content);

        // Filter by status if specified
        if (!status || jobState.status === status) {
          jobs.push(jobState);
        }
      } catch (error) {
        // Skip invalid files
      }
    }

    // Sort by creation date, newest first
    jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = jobs.length;
    const paginatedJobs = jobs.slice(0, limit);

    return NextResponse.json({
      jobs: paginatedJobs,
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
