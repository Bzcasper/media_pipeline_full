/**
 * Simplified Job State Manager
 * Basic job state tracking without complex observability
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
    constructor(jobId?: string, jobDir?: string);
    getJobId(): string;
    getState(): JobState;
    updateStatus(status: JobStatus): void;
    updateProgress(progress: number): void;
    addStep(name: string, status?: StepStatus): void;
    updateStep(name: string, updates: Partial<JobStep>): void;
    completeStep(name: string, output?: any): void;
    failStep(name: string, error: string): void;
    addOutput(key: string, value: any): void;
    addError(error: string): void;
    addLogs(logs: LogEntry[]): void;
    setMetadata(metadata: Record<string, any>): void;
    save(): Promise<void>;
    static load(jobId: string, jobDir?: string): Promise<JobStateManager | null>;
    static listJobs(jobDir?: string): Promise<JobState[]>;
    getAnalytics(): {
        totalSteps: number;
        completedSteps: number;
        failedSteps: number;
        averageStepDuration: number;
        totalDuration: number;
    };
}
