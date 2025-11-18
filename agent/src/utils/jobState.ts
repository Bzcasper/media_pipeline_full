/**
 * Simplified Job State Manager
 * Basic job state tracking without complex observability
 */

import * as fs from "fs/promises";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { LogEntry } from "./logger";

export type JobStatus =
  | "pending"
  | "uploading"
  | "extracting"
  | "processing"
  | "transcribing"
  | "generating_metadata"
  | "generating_visuals"
  | "creating_video"
  | "uploading_results"
  | "indexing"
  | "completed"
  | "failed";

export type StepStatus = "pending" | "in_progress" | "completed" | "failed";

export interface JobStep {
  name: string;
  status: StepStatus;
  startTime?: string;
  endTime?: string;
  output?: any;
  error?: string;
  duration?: number;
  retryCount?: number;
}

export interface JobState {
  jobId: string;
  status: JobStatus;
  progress: number;
  currentStep: string;
  steps: JobStep[];
  logs: LogEntry[];
  outputs: Record<string, any>;
  errors: string[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  estimatedDuration?: number;
  retryCount?: number;
}

export class JobStateManager {
  private state: JobState;
  private jobDir: string;

  constructor(jobId?: string, jobDir: string = "jobs") {
    this.jobDir = jobDir;
    this.state = {
      jobId: jobId || uuidv4(),
      status: "pending",
      progress: 0,
      currentStep: "initializing",
      steps: [],
      logs: [],
      outputs: {},
      errors: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      retryCount: 0,
    };
  }

  getJobId(): string {
    return this.state.jobId;
  }

  getState(): JobState {
    return JSON.parse(JSON.stringify(this.state));
  }

  updateStatus(status: JobStatus): void {
    this.state.status = status;
    this.state.updatedAt = new Date().toISOString();
  }

  updateProgress(progress: number): void {
    this.state.progress = Math.min(100, Math.max(0, progress));
  }

  addStep(name: string, status: StepStatus = "pending"): void {
    this.state.steps.push({
      name,
      status,
      startTime: new Date().toISOString(),
    });
  }

  updateStep(name: string, updates: Partial<JobStep>): void {
    const step = this.state.steps.find(s => s.name === name);
    if (step) {
      Object.assign(step, updates);
      if (updates.status === "completed" || updates.status === "failed") {
        step.endTime = new Date().toISOString();
        if (step.startTime && step.endTime) {
          step.duration = new Date(step.endTime).getTime() - new Date(step.startTime).getTime();
        }
      }
    }
  }

  completeStep(name: string, output?: any): void {
    this.updateStep(name, { status: "completed", output });
  }

  failStep(name: string, error: string): void {
    this.updateStep(name, { status: "failed", error });
    this.state.errors.push(error);
  }

  addOutput(key: string, value: any): void {
    this.state.outputs[key] = value;
  }

  addError(error: string): void {
    this.state.errors.push(error);
  }

  addLogs(logs: LogEntry[]): void {
    this.state.logs.push(...logs);
  }

  setMetadata(metadata: Record<string, any>): void {
    this.state.metadata = { ...this.state.metadata, ...metadata };
  }

  async save(): Promise<void> {
    try {
      await fs.mkdir(this.jobDir, { recursive: true });
      const stateFile = path.join(this.jobDir, `${this.state.jobId}.json`);
      await fs.writeFile(stateFile, JSON.stringify(this.state, null, 2));
    } catch (error) {
      console.error("Failed to save job state:", error);
    }
  }

  static async load(jobId: string, jobDir: string = "jobs"): Promise<JobStateManager | null> {
    try {
      const stateFile = path.join(jobDir, `${jobId}.json`);
      const content = await fs.readFile(stateFile, 'utf-8');
      const state: JobState = JSON.parse(content);

      const manager = new JobStateManager(state.jobId, jobDir);
      manager.state = state;
      return manager;
    } catch (error) {
      return null;
    }
  }

  static async listJobs(jobDir: string = "jobs"): Promise<JobState[]> {
    try {
      const files = await fs.readdir(jobDir);
      const jobFiles = files.filter(f => f.endsWith('.json'));

      const jobs: JobState[] = [];
      for (const file of jobFiles) {
        try {
          const filePath = path.join(jobDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const state: JobState = JSON.parse(content);
          jobs.push(state);
        } catch (error) {
          // Skip invalid files
        }
      }

      // Sort by creation date, newest first
      jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return jobs;
    } catch (error) {
      return [];
    }
  }

  getAnalytics(): {
    totalSteps: number;
    completedSteps: number;
    failedSteps: number;
    averageStepDuration: number;
    totalDuration: number;
  } {
    const totalSteps = this.state.steps.length;
    const completedSteps = this.state.steps.filter(s => s.status === "completed").length;
    const failedSteps = this.state.steps.filter(s => s.status === "failed").length;

    const completedDurations = this.state.steps
      .filter(s => s.status === "completed" && s.duration)
      .map(s => s.duration!);

    const averageStepDuration = completedDurations.length > 0
      ? completedDurations.reduce((sum, d) => sum + d, 0) / completedDurations.length
      : 0;

    const totalDuration = this.state.steps
      .filter(s => s.duration)
      .reduce((sum, s) => sum + s.duration!, 0);

    return {
      totalSteps,
      completedSteps,
      failedSteps,
      averageStepDuration,
      totalDuration,
    };
  }
}