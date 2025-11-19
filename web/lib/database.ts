import { prisma } from './db';

// Note: Database functionality is optional and will gracefully degrade
// if Prisma client is not available during build time

export class DatabaseService {
  // Job operations - gracefully degrade if database not available
  static async createJob(data: {
    jobId: string;
    title?: string;
    artist?: string;
    album?: string;
    metadata?: any;
    status?: string;
  }): Promise<any> {
    try {
      return await prisma.job.create({
        data: {
          jobId: data.jobId,
          title: data.title,
          artist: data.artist,
          album: data.album,
          status: data.status || 'pending',
          metadata: data.metadata,
        }
      });
    } catch (error) {
      console.warn('Database not available, skipping job creation:', error);
      return { id: data.jobId, ...data }; // Return mock data
    }
  }

  static async updateJob(jobId: string, data: any): Promise<any> {
    try {
      return await prisma.job.update({
        where: { jobId },
        data
      });
    } catch (error) {
      console.warn('Database not available, skipping job update:', error);
      return { jobId, ...data }; // Return mock data
    }
  }

  static async getJob(jobId: string): Promise<any> {
    try {
      return await prisma.job.findUnique({
        where: { jobId }
      });
    } catch (error) {
      console.warn('Database not available, skipping job retrieval:', error);
      return null; // Return null when database not available
    }
  }

  // Job step operations
  static async createJobStep(data: {
    jobId: string;
    name: string;
    status?: string;
  }): Promise<any> {
    try {
      return await prisma.jobStep.create({
        data: {
          jobId: data.jobId,
          name: data.name,
          status: data.status || 'pending'
        }
      });
    } catch (error) {
      console.warn('Database not available, skipping job step creation:', error);
      return { id: `${data.jobId}_${data.name}`, ...data }; // Return mock data
    }
  }

  static async updateJobStep(jobId: string, stepName: string, data: any): Promise<any> {
    try {
      await prisma.jobStep.updateMany({
        where: {
          jobId,
          name: stepName
        },
        data
      });
      return await prisma.jobStep.findFirst({
        where: {
          jobId,
          name: stepName
        }
      });
    } catch (error) {
      console.warn('Database not available, skipping job step update:', error);
      return { jobId, name: stepName, ...data }; // Return mock data
    }
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
    try {
      return await prisma.file.create({
        data
      });
    } catch (error) {
      console.warn('Database not available, skipping file creation:', error);
      return { id: data.fileId, ...data }; // Return mock data
    }
  }

  // Log operations
  static async createLog(data: {
    jobId: string;
    level: string;
    message: string;
    data?: any;
  }): Promise<any> {
    try {
      return await prisma.log.create({
        data
      });
    } catch (error) {
      console.warn('Database not available, skipping log creation:', error);
      return { id: `${data.jobId}_${Date.now()}`, ...data }; // Return mock data
    }
  }

  // Bulk operations for efficiency
  static async createLogs(logs: Array<{
    jobId: string;
    level: string;
    message: string;
    data?: any;
  }>): Promise<void> {
    try {
      await prisma.log.createMany({
        data: logs
      });
    } catch (error) {
      console.warn('Database not available, skipping bulk log creation:', error);
      // Silently fail for bulk operations
    }
  }
}