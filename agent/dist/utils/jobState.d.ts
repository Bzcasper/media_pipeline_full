/**
 * Enhanced Job State Manager
 * Advanced observability-integrated job state and progress tracking
 */
import { LogEntry } from "./logger";
export type JobStatus = "pending" | "uploading" | "extracting" | "processing" | "transcribing" | "generating_metadata" | "generating_visuals" | "creating_video" | "uploading_results" | "indexing" | "completed" | "failed";
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
export declare class JobStateManager {
    private state;
    private jobDir;
    private observability;
    private stepTimers;
    constructor(jobId?: string, jobDir?: string);
    /**
     * Get job ID
     */
    getJobId(): string;
    /**
     * Get current state with deep copy
     */
    getState(): JobState;
    /**
     * Update job status with observability
     */
    updateStatus(status: JobStatus): void;
    /**
     * Update progress (0-100) with validation
     */
    updateProgress(progress: number): void;
    /**
     * Add a step with timing
     */
    addStep(name: string, status?: StepStatus): void;
    /**
     * Update a step with duration calculation
     */
    updateStep(name: string, updates: Partial<JobStep>): void;
    /**
     * Mark step as completed with enhanced tracking
     */
    completeStep(name: string, output?: any): void;
    /**
     * Mark step as failed with error tracking
     */
    failStep(name: string, error: string): void;
    /**
     * Add output with validation
     */
    addOutput(key: string, value: any): void;
    /**
     * Add error with enhanced tracking
     */
    addError(error: string): void;
    /**
     * Add logs with enhanced tracking
     */
    addLogs(logs: LogEntry[]): void;
    /**
     * Set metadata with validation
     */
    setMetadata(metadata: Record<string, any>): void;
    /**
     * Enhanced save with observability
     */
    save(): Promise<void>;
    /**
     * Load state from disk with validation
     */
    static load(jobId: string, jobDir?: string): Promise<JobStateManager>;
    /**
     * List all jobs with enhanced filtering
     */
    static listJobs(jobDir?: string, filter?: {
        status?: JobStatus;
        limit?: number;
        since?: string;
    }): Promise<JobState[]>;
    /**
     * Get job analytics
     */
    getAnalytics(): {
        totalDuration: number;
        averageStepDuration: number;
        errorRate: number;
        successRate: number;
        performanceScore: number;
    };
}
export default JobStateManager;
//# sourceMappingURL=jobState.d.ts.map