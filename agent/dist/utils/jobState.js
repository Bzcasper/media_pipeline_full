"use strict";
/**
 * Enhanced Job State Manager
 * Advanced observability-integrated job state and progress tracking
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobStateManager = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const observability_1 = require("./observability");
class JobStateManager {
    state;
    jobDir;
    observability;
    stepTimers = new Map();
    constructor(jobId, jobDir = "jobs") {
        this.jobDir = jobDir;
        this.observability = observability_1.ObservabilityOrchestrator.getInstance();
        this.state = {
            jobId: jobId || (0, uuid_1.v4)(),
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
    getJobId() {
        return this.state.jobId;
    }
    /**
     * Get current state with deep copy
     */
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }
    /**
     * Update job status with observability
     */
    updateStatus(status) {
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
    updateProgress(progress) {
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
    addStep(name, status = "pending") {
        const step = {
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
    updateStep(name, updates) {
        const step = this.state.steps.find((s) => s.name === name);
        if (step) {
            const previousStatus = step.status;
            // Calculate duration if completing
            if (updates.status === "completed" && step.startTime && !step.endTime) {
                const duration = Date.now() - this.stepTimers.get(name);
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
    completeStep(name, output) {
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
    failStep(name, error) {
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
    addOutput(key, value) {
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
    addError(error) {
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
    addLogs(logs) {
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
    setMetadata(metadata) {
        this.state.metadata = { ...this.state.metadata, ...metadata };
        this.state.updatedAt = new Date().toISOString();
        // Record metadata metrics
        this.observability.recordMetric("job_metadata_set", Object.keys(metadata).length, "count", {
            jobId: this.state.jobId,
            metadataKeys: Object.keys(metadata).join(","),
        });
    }
    /**
     * Enhanced save with observability
     */
    async save() {
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
        }
        catch (error) {
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
    static async load(jobId, jobDir = "jobs") {
        try {
            const stateFile = path.join(jobDir, `${jobId}.json`);
            const content = await fs.readFile(stateFile, "utf-8");
            const state = JSON.parse(content);
            // Validate state structure
            if (!state.jobId || !state.createdAt || !state.updatedAt) {
                throw new Error("Invalid job state structure");
            }
            const manager = new JobStateManager(jobId, jobDir);
            manager.state = state;
            // Initialize observability for loaded job
            const observability = observability_1.ObservabilityOrchestrator.getInstance();
            observability.observeJob(state.jobId, {
                status: state.status,
                progress: state.progress,
                createdAt: state.createdAt,
                loadedAt: new Date().toISOString(),
            });
            return manager;
        }
        catch (error) {
            throw new Error(`Failed to load job state for ${jobId}: ${error}`);
        }
    }
    /**
     * List all jobs with enhanced filtering
     */
    static async listJobs(jobDir = "jobs", filter) {
        try {
            const files = await fs.readdir(jobDir);
            const jobFiles = files.filter((f) => f.endsWith(".json") && !f.endsWith(".log.json"));
            const jobs = [];
            for (const file of jobFiles) {
                try {
                    const content = await fs.readFile(path.join(jobDir, file), "utf-8");
                    const job = JSON.parse(content);
                    // Apply filters
                    if (filter?.status && job.status !== filter.status)
                        continue;
                    if (filter?.since && new Date(job.createdAt) < new Date(filter.since))
                        continue;
                    jobs.push(job);
                }
                catch (error) {
                    // Skip corrupted job files
                }
            }
            // Sort by creation date (newest first)
            jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            // Apply limit
            if (filter?.limit) {
                return jobs.slice(0, filter.limit);
            }
            return jobs;
        }
        catch (error) {
            return [];
        }
    }
    /**
     * Get job analytics
     */
    getAnalytics() {
        const completedSteps = this.state.steps.filter((s) => s.status === "completed");
        const failedSteps = this.state.steps.filter((s) => s.status === "failed");
        const totalDuration = completedSteps.reduce((sum, step) => sum + (step.duration || 0), 0);
        const averageStepDuration = completedSteps.length > 0 ? totalDuration / completedSteps.length : 0;
        const errorRate = this.state.steps.length > 0
            ? failedSteps.length / this.state.steps.length
            : 0;
        const successRate = 1 - errorRate;
        // Simple performance score (0-100)
        const performanceScore = Math.max(0, Math.min(100, successRate * 100 - errorRate * 50));
        return {
            totalDuration,
            averageStepDuration,
            errorRate,
            successRate,
            performanceScore: Math.round(performanceScore),
        };
    }
}
exports.JobStateManager = JobStateManager;
exports.default = JobStateManager;
//# sourceMappingURL=jobState.js.map