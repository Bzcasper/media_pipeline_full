import { prisma } from './db';
import type { Job } from '@prisma/client';

export class DatabaseService {
  // Job operations
  static async createJob(data: {
    jobId: string;
    title?: string;
    artist?: string;
    album?: string;
    metadata?: any;
    status?: string;
  }): Promise<any> {
    return prisma.job.create({
      data: {
        jobId: data.jobId,
        title: data.title,
        artist: data.artist,
        album: data.album,
        status: data.status || 'pending',
        metadata: data.metadata,
      }
    });
  }

  static async updateJob(jobId: string, data: any): Promise<any> {
    return prisma.job.update({
      where: { jobId },
      data
    });
  }

  static async getJob(jobId: string): Promise<any> {
    return prisma.job.findUnique({
      where: { jobId }
    });
  }

  // Job step operations
  static async createJobStep(data: {
    jobId: string;
    name: string;
    status?: string;
  }): Promise<any> {
    return prisma.jobStep.create({
      data: {
        jobId: data.jobId,
        name: data.name,
        status: data.status || 'pending'
      }
    });
  }

  static async updateJobStep(jobId: string, stepName: string, data: any): Promise<any> {
    return prisma.jobStep.updateMany({
      where: {
        jobId,
        name: stepName
      },
      data
    }).then(() => prisma.jobStep.findFirst({
      where: {
        jobId,
        name: stepName
      }
    })).then(result => result!);
  }

  // File operations
  static async createFile(data: {
    fileId: string;
    jobId?: string;
    mediaType: string;
    originalName?: string;
    sizeBytes?: number;
    url?: string;
    metadata?: any;
  }): Promise<any> {
    return prisma.file.create({
      data
    });
  }

  // Log operations
  static async createLog(data: {
    jobId: string;
    level: string;
    message: string;
    data?: any;
  }): Promise<any> {
    return prisma.log.create({
      data
    });
  }

  // Bulk operations for efficiency
  static async createLogs(logs: Array<{
    jobId: string;
    level: string;
    message: string;
    data?: any;
  }>): Promise<void> {
    await prisma.log.createMany({
      data: logs
    });
  }
}