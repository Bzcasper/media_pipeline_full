/**
 * Advanced Observability System
 * Comprehensive logging, monitoring, and metrics collection
 */
export interface MetricPoint {
    name: string;
    value: number;
    timestamp: number;
    tags?: Record<string, string>;
    type: "counter" | "gauge" | "histogram" | "timer";
}
export interface SystemMetrics {
    cpu: {
        usage: number;
        cores: number;
        loadAverage: number[];
    };
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
    process: {
        uptime: number;
        heapUsed: number;
        heapTotal: number;
        external: number;
        rss: number;
    };
}
export interface JobMetrics {
    jobId: string;
    duration: number;
    steps: number;
    successfulSteps: number;
    failedSteps: number;
    quality: number;
    cost: number;
    error?: string;
}
export interface APIMetrics {
    route: string;
    method: string;
    statusCode: number;
    duration: number;
    timestamp: number;
    userAgent?: string;
    ip?: string;
}
export declare class MetricsCollector {
    private metrics;
    private maxPoints;
    private logger;
    constructor();
    /**
     * Record a metric point
     */
    record(metric: MetricPoint): void;
    /**
     * Increment counter
     */
    increment(name: string, value?: number, tags?: Record<string, string>): void;
    /**
     * Set gauge value
     */
    gauge(name: string, value: number, tags?: Record<string, string>): void;
    /**
     * Record histogram
     */
    histogram(name: string, value: number, tags?: Record<string, string>): void;
    /**
     * Record timer (duration in ms)
     */
    timer(name: string, duration: number, tags?: Record<string, string>): void;
    /**
     * Get metric points
     */
    getMetrics(name?: string): MetricPoint[];
    /**
     * Calculate aggregated statistics
     */
    getStatistics(name: string): {
        count: number;
        sum: number;
        avg: number;
        min: number;
        max: number;
        p50: number;
        p95: number;
        p99: number;
    } | null;
}
export declare class SystemMonitor {
    private metricsCollector;
    private logger;
    private interval?;
    constructor(metricsCollector: MetricsCollector);
    /**
     * Start system monitoring
     */
    start(intervalMs?: number): void;
    /**
     * Stop system monitoring
     */
    stop(): void;
    /**
     * Collect current system metrics
     */
    private collectSystemMetrics;
    /**
     * Get current system metrics
     */
    private getCurrentMetrics;
    /**
     * Calculate CPU usage percentage
     */
    private calculateCpuUsage;
}
export declare class JobObserver {
    private metricsCollector;
    private logger;
    private activeJobs;
    constructor(metricsCollector: MetricsCollector);
    /**
     * Start observing a job
     */
    startJob(jobId: string, metadata?: Record<string, any>): void;
    /**
     * Start a job step
     */
    startStep(jobId: string, stepName: string): void;
    /**
     * Complete a job step
     */
    completeStep(jobId: string, stepName: string, success?: boolean): void;
    /**
     * Complete a job
     */
    completeJob(jobId: string, result: JobMetrics): void;
    /**
     * Get active jobs
     */
    getActiveJobs(): Array<{
        jobId: string;
        duration: number;
        steps: number;
    }>;
}
export declare class APIObserver {
    private metricsCollector;
    private logger;
    constructor(metricsCollector: MetricsCollector);
    /**
     * Record API request
     */
    recordRequest(metrics: APIMetrics): void;
    /**
     * Create middleware for Express/Next.js
     */
    createMiddleware(): (req: any, res: any, next: any) => void;
}
export interface HealthStatus {
    status: "healthy" | "unhealthy" | "degraded";
    timestamp: number;
    uptime: number;
    checks: Array<{
        name: string;
        status: "healthy" | "unhealthy";
        message?: string;
        duration?: number;
    }>;
    metrics: {
        activeJobs: number;
        memoryUsage: number;
        cpuUsage: number;
    };
}
export declare class HealthChecker {
    private checks;
    private logger;
    constructor();
    /**
     * Add health check
     */
    addCheck(name: string, check: () => Promise<{
        status: "healthy" | "unhealthy";
        message?: string;
    }>): void;
    /**
     * Get health status
     */
    getStatus(): Promise<HealthStatus>;
}
export declare class ObservabilityOrchestrator {
    metricsCollector: MetricsCollector;
    systemMonitor: SystemMonitor;
    jobObserver: JobObserver;
    apiObserver: APIObserver;
    healthChecker: HealthChecker;
    private logger;
    constructor();
    /**
     * Start all observability components
     */
    start(): void;
    /**
     * Stop all observability components
     */
    stop(): void;
    /**
     * Get metrics export
     */
    exportMetrics(): {
        metrics: MetricPoint[];
        statistics: Record<string, any>;
        health: Promise<HealthStatus>;
    };
    /**
     * Setup default health checks
     */
    private setupDefaultChecks;
    /**
     * Setup periodic tasks
     */
    private setupPeriodicTasks;
}
export declare const observability: ObservabilityOrchestrator;
export default observability;
//# sourceMappingURL=observability.d.ts.map