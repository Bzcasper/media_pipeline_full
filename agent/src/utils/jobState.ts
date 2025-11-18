/**
 * Enhanced Job State Manager
 * Advanced observability-integrated job state and progress tracking
 */

import * as fs from "fs/promises";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { LogEntry } from "./logger";
import { ObservabilityOrchestrator } from "./observability";

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
  private observability: ObservabilityOrchestrator;
  private stepTimers: Map<string, number> = new Map();

  constructor(jobId?: string, jobDir: string = "jobs") {
    this.jobDir = jobDir;
    this.observability = ObservabilityOrchestrator.getInstance();
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

    // Initialize observability
    this.observability.observeJob(this.state.jobId, {
      status: this.state.status,
      progress: this.state.progress,
      createdAt: this.state.createdAt,
    });
  }

  /**
   * Get job ID
   */
  getJobId(): string {
    return this.state.jobId;
  }

  /**
   * Get current state with deep copy
   */
  getState(): JobState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Update job status with observability
   */
  updateStatus(status: JobStatus): void {
    const previousStatus = this.state.status;
    this.state.status = status;
    this.state.updatedAt = new Date().toISOString();

    // Record observability metrics
    this.observability.recordMetric("job_status_transition", 1, "count", {
      jobId: this.state.jobId,
      from: previousStatus,
      to: status,
      timestamp: this.state.updatedAt,
    });

    // Update job observation
    this.observability.updateJobObservation(this.state.jobId, {
      status: status,
      lastUpdate: this.state.updatedAt,
    });
  }

  /**
   * Update progress (0-100) with validation
   */
  updateProgress(progress: number): void {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const previousProgress = this.state.progress;

    this.state.progress = clampedProgress;
    this.state.updatedAt = new Date().toISOString();

    // Record progress metrics
    this.observability.recordMetric("job_progress_updated", 1, "count", {
      jobId: this.state.jobId,
      from: previousProgress,
      to: clampedProgress,
      delta: clampedProgress - previousProgress,
    });

    // Update job observation
    this.observability.updateJobObservation(this.state.jobId, {
      progress: clampedProgress,
      lastUpdate: this.state.updatedAt,
    });
  }

  /**
   * Add a step with timing
   */
  addStep(name: string, status: StepStatus = "pending"): void {
    const step: JobStep = {
      name,
      status,
      retryCount: 0,
      ...(status === "in_progress" && {
        startTime: new Date().toISOString(),
        duration: 0,
      }),
    };

    this.state.steps.push(step);
    this.state.currentStep = name;
    this.state.updatedAt = new Date().toISOString();

    // Start step timer
    if (status === "in_progress") {
      this.stepTimers.set(name, Date.now());
    }

    // Record observability
    this.observability.recordMetric("job_step_added", 1, "count", {
      jobId: this.state.jobId,
      stepName: name,
      status: status,
    });
  }

  /**
   * Update a step with duration calculation
   */
  updateStep(name: string, updates: Partial<JobStep>): void {
    const step = this.state.steps.find((s) => s.name === name);
    if (step) {
      const previousStatus = step.status;

      // Calculate duration if completing
      if (updates.status === "completed" && step.startTime && !step.endTime) {
        const duration = Date.now() - this.stepTimers.get(name)!;
        updates.duration = duration;
        this.stepTimers.delete(name);
      }

      Object.assign(step, updates);

      if (updates.status === "completed" && !step.endTime) {
        step.endTime = new Date().toISOString();
      }

      this.state.updatedAt = new Date().toISOString();

      // Record observability
      this.observability.recordMetric("job_step_updated", 1, "count", {
        jobId: this.state.jobId,
        stepName: name,
        from: previousStatus,
        to: updates.status,
        ...(updates.duration && { duration: updates.duration }),
      });
    }
  }

  /**
   * Mark step as completed with enhanced tracking
   */
  completeStep(name: string, output?: any): void {
    const duration = this.stepTimers.get(name);

    this.updateStep(name, {
      status: "completed",
      endTime: new Date().toISOString(),
      output,
      ...(duration && { duration: Date.now() - duration }),
    });

    this.stepTimers.delete(name);

    // Record completion metrics
    this.observability.recordMetric("job_step_completed", 1, "count", {
      jobId: this.state.jobId,
      stepName: name,
      ...(duration && { duration: Date.now() - duration }),
    });
  }

  /**
   * Mark step as failed with error tracking
   */
  failStep(name: string, error: string): void {
    const duration = this.stepTimers.get(name);

    this.updateStep(name, {
      status: "failed",
      endTime: new Date().toISOString(),
      error,
      ...(duration && { duration: Date.now() - duration }),
    });

    this.stepTimers.delete(name);
    this.addError(error);

    // Record failure observability
    this.observability.recordError("job_step_failed", error, {
      jobId: this.state.jobId,
      stepName: name,
      ...(duration && { duration: Date.now() - duration }),
    });
  }

  /**
   * Add output with validation
   */
  addOutput(key: string, value: any): void {
    this.state.outputs[key] = value;
    this.state.updatedAt = new Date().toISOString();

    // Record output metrics
    this.observability.recordMetric("job_output_added", 1, "count", {
      jobId: this.state.jobId,
      outputKey: key,
      valueSize: JSON.stringify(value).length,
    });
  }

  /**
   * Add error with enhanced tracking
   */
  addError(error: string): void {
    this.state.errors.push(error);
    this.state.updatedAt = new Date().toISOString();

    // Record error metrics
    this.observability.recordError("job_error_added", error, {
      jobId: this.state.jobId,
      errorCount: this.state.errors.length,
      timestamp: this.state.updatedAt,
    });
  }

  /**
   * Add logs with enhanced tracking
   */
  addLogs(logs: LogEntry[]): void {
    const previousLogCount = this.state.logs.length;
    this.state.logs.push(...logs);
    this.state.updatedAt = new Date().toISOString();

    // Record log metrics
    this.observability.recordMetric("job_logs_added", logs.length, "count", {
      jobId: this.state.jobId,
      addedCount: logs.length,
      totalCount: this.state.logs.length,
    });
  }

  /**
   * Set metadata with validation
   */
  setMetadata(metadata: Record<string, any>): void {
    this.state.metadata = { ...this.state.metadata, ...metadata };
    this.state.updatedAt = new Date().toISOString();

    // Record metadata metrics
    this.observability.recordMetric(
      "job_metadata_set",
      Object.keys(metadata).length,
      "count",
      {
        jobId: this.state.jobId,
        metadataKeys: Object.keys(metadata).join(","),
      }
    );
  }

  /**
   * Enhanced save with observability
   */
  async save(): Promise<void> {
    try {
      await fs.mkdir(this.jobDir, { recursive: true });
      const stateFile = path.join(this.jobDir, `${this.state.jobId}.json`);
      await fs.writeFile(stateFile, JSON.stringify(this.state, null, 2));

      // Record save success
      this.observability.recordMetric("job_state_saved", 1, "count", {
        jobId: this.state.jobId,
        stateSize: JSON.stringify(this.state).length,
        stepCount: this.state.steps.length,
      });
    } catch (error) {
      this.observability.recordError("job_state_save_failed", error, {
        jobId: this.state.jobId,
        jobDir: this.jobDir,
      });
      throw error;
    }
  }

  /**
   * Load state from disk with validation
   */
  static async load(
    jobId: string,
    jobDir: string = "jobs"
  ): Promise<JobStateManager> {
    try {
      const stateFile = path.join(jobDir, `${jobId}.json`);
      const content = await fs.readFile(stateFile, "utf-8");
      const state: JobState = JSON.parse(content);

      // Validate state structure
      if (!state.jobId || !state.createdAt || !state.updatedAt) {
        throw new Error("Invalid job state structure");
      }

      const manager = new JobStateManager(jobId, jobDir);
      manager.state = state;

      // Initialize observability for loaded job
      const observability = ObservabilityOrchestrator.getInstance();
      observability.observeJob(state.jobId, {
        status: state.status,
        progress: state.progress,
        createdAt: state.createdAt,
        loadedAt: new Date().toISOString(),
      });

      return manager;
    } catch (error) {
      throw new Error(`Failed to load job state for ${jobId}: ${error}`);
    }
  }

  /**
   * List all jobs with enhanced filtering
   */
  static async listJobs(
    jobDir: string = "jobs",
    filter?: {
      status?: JobStatus;
      limit?: number;
      since?: string;
    }
  ): Promise<JobState[]> {
    try {
      const files = await fs.readdir(jobDir);
      const jobFiles = files.filter(
        (f) => f.endsWith(".json") && !f.endsWith(".log.json")
      );

      const jobs: JobState[] = [];
      for (const file of jobFiles) {
        try {
          const content = await fs.readFile(path.join(jobDir, file), "utf-8");
          const job = JSON.parse(content);

          // Apply filters
          if (filter?.status && job.status !== filter.status) continue;
          if (filter?.since && new Date(job.createdAt) < new Date(filter.since))
            continue;

          jobs.push(job);
        } catch (error) {
          // Skip corrupted job files
        }
      }

      // Sort by creation date (newest first)
      jobs.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Apply limit
      if (filter?.limit) {
        return jobs.slice(0, filter.limit);
      }

      return jobs;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get job analytics
   */
  getAnalytics(): {
    totalDuration: number;
    averageStepDuration: number;
    errorRate: number;
    successRate: number;
    performanceScore: number;
  } {
    const completedSteps = this.state.steps.filter(
      (s) => s.status === "completed"
    );
    const failedSteps = this.state.steps.filter((s) => s.status === "failed");

    const totalDuration = completedSteps.reduce(
      (sum, step) => sum + (step.duration || 0),
      0
    );
    const averageStepDuration =
      completedSteps.length > 0 ? totalDuration / completedSteps.length : 0;
    const errorRate =
      this.state.steps.length > 0
        ? failedSteps.length / this.state.steps.length
        : 0;
    const successRate = 1 - errorRate;

    // Simple performance score (0-100)
    const performanceScore = Math.max(
      0,
      Math.min(100, successRate * 100 - errorRate * 50)
    );

    return {
      totalDuration,
      averageStepDuration,
      errorRate,
      successRate,
      performanceScore: Math.round(performanceScore),
    };
  }
}

export default JobStateManager;
