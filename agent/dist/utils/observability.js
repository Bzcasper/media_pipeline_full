"use strict";
/**
 * Advanced Observability System
 * Comprehensive logging, monitoring, and metrics collection
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.observability = exports.ObservabilityOrchestrator = exports.HealthChecker = exports.APIObserver = exports.JobObserver = exports.SystemMonitor = exports.MetricsCollector = void 0;
const logger_1 = require("./logger");
// ========== METRICS COLLECTOR ==========
class MetricsCollector {
    metrics = new Map();
    maxPoints = 1000; // Keep last 1000 points per metric
    logger;
    constructor() {
        this.logger = new logger_1.Logger("metrics-collector");
    }
    /**
     * Record a metric point
     */
    record(metric) {
        const key = metric.name;
        const points = this.metrics.get(key) || [];
        points.push(metric);
        // Keep only recent points
        if (points.length > this.maxPoints) {
            points.splice(0, points.length - this.maxPoints);
        }
        this.metrics.set(key, points);
    }
    /**
     * Increment counter
     */
    increment(name, value = 1, tags) {
        this.record({
            name,
            value,
            timestamp: Date.now(),
            tags,
            type: "counter",
        });
    }
    /**
     * Set gauge value
     */
    gauge(name, value, tags) {
        this.record({
            name,
            value,
            timestamp: Date.now(),
            tags,
            type: "gauge",
        });
    }
    /**
     * Record histogram
     */
    histogram(name, value, tags) {
        this.record({
            name,
            value,
            timestamp: Date.now(),
            tags,
            type: "histogram",
        });
    }
    /**
     * Record timer (duration in ms)
     */
    timer(name, duration, tags) {
        this.record({
            name,
            value: duration,
            timestamp: Date.now(),
            tags,
            type: "timer",
        });
    }
    /**
     * Get metric points
     */
    getMetrics(name) {
        if (name) {
            return this.metrics.get(name) || [];
        }
        const allMetrics = [];
        for (const points of this.metrics.values()) {
            allMetrics.push(...points);
        }
        return allMetrics;
    }
    /**
     * Calculate aggregated statistics
     */
    getStatistics(name) {
        const points = this.metrics.get(name);
        if (!points || points.length === 0)
            return null;
        const values = points.map((p) => p.value).sort((a, b) => a - b);
        const count = values.length;
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / count;
        const min = values[0];
        const max = values[values.length - 1];
        const p = (percentile) => {
            const index = Math.ceil((percentile / 100) * count) - 1;
            return values[Math.max(0, index)];
        };
        return {
            count,
            sum,
            avg,
            min,
            max,
            p50: p(50),
            p95: p(95),
            p99: p(99),
        };
    }
}
exports.MetricsCollector = MetricsCollector;
// ========== SYSTEM MONITOR ==========
class SystemMonitor {
    metricsCollector;
    logger;
    interval;
    constructor(metricsCollector) {
        this.metricsCollector = metricsCollector;
        this.logger = new logger_1.Logger("system-monitor");
    }
    /**
     * Start system monitoring
     */
    start(intervalMs = 30000) {
        this.logger.info("Starting system monitoring", { intervalMs });
        this.collectSystemMetrics();
        this.interval = setInterval(() => {
            this.collectSystemMetrics();
        }, intervalMs);
    }
    /**
     * Stop system monitoring
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
            this.logger.info("System monitoring stopped");
        }
    }
    /**
     * Collect current system metrics
     */
    collectSystemMetrics() {
        try {
            const metrics = this.getCurrentMetrics();
            // Record CPU metrics
            this.metricsCollector.gauge("system.cpu.usage", metrics.cpu.usage);
            this.metricsCollector.gauge("system.cpu.cores", metrics.cpu.cores);
            this.metricsCollector.gauge("system.cpu.load.1m", metrics.cpu.loadAverage[0]);
            this.metricsCollector.gauge("system.cpu.load.5m", metrics.cpu.loadAverage[1]);
            this.metricsCollector.gauge("system.cpu.load.15m", metrics.cpu.loadAverage[2]);
            // Record memory metrics
            this.metricsCollector.gauge("system.memory.used", metrics.memory.used);
            this.metricsCollector.gauge("system.memory.total", metrics.memory.total);
            this.metricsCollector.gauge("system.memory.percentage", metrics.memory.percentage);
            // Record process metrics
            this.metricsCollector.gauge("system.process.uptime", metrics.process.uptime);
            this.metricsCollector.gauge("system.process.heap.used", metrics.process.heapUsed);
            this.metricsCollector.gauge("system.process.heap.total", metrics.process.heapTotal);
            this.metricsCollector.gauge("system.process.memory.rss", metrics.process.rss);
        }
        catch (error) {
            this.logger.error("Failed to collect system metrics", { error });
        }
    }
    /**
     * Get current system metrics
     */
    getCurrentMetrics() {
        const memUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        const uptime = process.uptime();
        return {
            cpu: {
                usage: this.calculateCpuUsage(cpuUsage),
                cores: require("os").cpus().length,
                loadAverage: require("os").loadavg(),
            },
            memory: {
                used: memUsage.heapUsed,
                total: memUsage.heapTotal,
                percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
            },
            process: {
                uptime: uptime * 1000, // Convert to milliseconds
                heapUsed: memUsage.heapUsed,
                heapTotal: memUsage.heapTotal,
                external: memUsage.external,
                rss: memUsage.rss,
            },
        };
    }
    /**
     * Calculate CPU usage percentage
     */
    calculateCpuUsage(cpuUsage) {
        // This is a simplified calculation
        // In a real implementation, you'd measure over time
        const total = cpuUsage.user + cpuUsage.system;
        return Math.min(100, Math.max(0, (total / 1000000) * 100));
    }
}
exports.SystemMonitor = SystemMonitor;
// ========== JOB OBSERVER ==========
class JobObserver {
    metricsCollector;
    logger;
    activeJobs = new Map();
    constructor(metricsCollector) {
        this.metricsCollector = metricsCollector;
        this.logger = new logger_1.Logger("job-observer");
    }
    /**
     * Start observing a job
     */
    startJob(jobId, metadata = {}) {
        this.activeJobs.set(jobId, {
            startTime: Date.now(),
            steps: [],
            metadata,
        });
        this.logger.info("Job started", { jobId, metadata });
        this.metricsCollector.increment("job.started", 1, { jobId });
    }
    /**
     * Start a job step
     */
    startStep(jobId, stepName) {
        const job = this.activeJobs.get(jobId);
        if (job) {
            job.steps.push({
                name: stepName,
                startTime: Date.now(),
            });
            this.logger.info("Job step started", { jobId, stepName });
            this.metricsCollector.increment("job.step.started", 1, {
                jobId,
                stepName,
            });
        }
    }
    /**
     * Complete a job step
     */
    completeStep(jobId, stepName, success = true) {
        const job = this.activeJobs.get(jobId);
        if (job) {
            const step = job.steps.find((s) => s.name === stepName && !s.duration);
            if (step) {
                step.duration = Date.now() - step.startTime;
                this.logger.info("Job step completed", {
                    jobId,
                    stepName,
                    duration: step.duration,
                    success,
                });
                this.metricsCollector.timer("job.step.duration", step.duration, {
                    jobId,
                    stepName,
                    success: success.toString(),
                });
                this.metricsCollector.increment("job.step.completed", 1, {
                    jobId,
                    stepName,
                    success: success.toString(),
                });
            }
        }
    }
    /**
     * Complete a job
     */
    completeJob(jobId, result) {
        const job = this.activeJobs.get(jobId);
        if (job) {
            const duration = Date.now() - job.startTime;
            this.logger.info("Job completed", {
                jobId,
                duration,
                steps: result.steps,
                successRate: result.successfulSteps / result.steps,
                quality: result.quality,
                cost: result.cost,
            });
            // Record job metrics
            this.metricsCollector.timer("job.duration", duration, { jobId });
            this.metricsCollector.gauge("job.steps.total", result.steps, { jobId });
            this.metricsCollector.gauge("job.steps.successful", result.successfulSteps, { jobId });
            this.metricsCollector.gauge("job.steps.failed", result.failedSteps, {
                jobId,
            });
            this.metricsCollector.gauge("job.quality", result.quality, { jobId });
            this.metricsCollector.gauge("job.cost", result.cost, { jobId });
            this.metricsCollector.increment("job.completed", 1, {
                jobId,
                success: result.failedSteps === 0 ? "true" : "false",
            });
            this.activeJobs.delete(jobId);
        }
    }
    /**
     * Get active jobs
     */
    getActiveJobs() {
        const now = Date.now();
        return Array.from(this.activeJobs.entries()).map(([jobId, job]) => ({
            jobId,
            duration: now - job.startTime,
            steps: job.steps.length,
        }));
    }
}
exports.JobObserver = JobObserver;
// ========== API OBSERVER ==========
class APIObserver {
    metricsCollector;
    logger;
    constructor(metricsCollector) {
        this.metricsCollector = metricsCollector;
        this.logger = new logger_1.Logger("api-observer");
    }
    /**
     * Record API request
     */
    recordRequest(metrics) {
        const { route, method, statusCode, duration } = metrics;
        this.logger.info("API request", {
            route,
            method,
            statusCode,
            duration,
        });
        // Record metrics
        this.metricsCollector.timer("api.request.duration", duration, {
            route,
            method,
            statusCode: statusCode.toString(),
        });
        this.metricsCollector.increment("api.request.total", 1, {
            route,
            method,
            statusCode: statusCode.toString(),
        });
        // Categorize by status code
        if (statusCode >= 200 && statusCode < 300) {
            this.metricsCollector.increment("api.request.success", 1, {
                route,
                method,
            });
        }
        else if (statusCode >= 400 && statusCode < 500) {
            this.metricsCollector.increment("api.request.client_error", 1, {
                route,
                method,
            });
        }
        else if (statusCode >= 500) {
            this.metricsCollector.increment("api.request.server_error", 1, {
                route,
                method,
            });
        }
    }
    /**
     * Create middleware for Express/Next.js
     */
    createMiddleware() {
        return (req, res, next) => {
            const startTime = Date.now();
            // Override res.end to capture response
            const originalEnd = res.end;
            res.end = (...args) => {
                const duration = Date.now() - startTime;
                this.recordRequest({
                    route: req.route?.path || req.path || "unknown",
                    method: req.method,
                    statusCode: res.statusCode,
                    duration,
                    timestamp: Date.now(),
                    userAgent: req.get("User-Agent"),
                    ip: req.ip || req.connection.remoteAddress,
                });
                originalEnd.apply(res, args);
            };
            next();
        };
    }
}
exports.APIObserver = APIObserver;
class HealthChecker {
    checks = [];
    logger;
    constructor() {
        this.logger = new logger_1.Logger("health-checker");
    }
    /**
     * Add health check
     */
    addCheck(name, check) {
        this.checks.push(async () => {
            const startTime = Date.now();
            try {
                const result = await check();
                const duration = Date.now() - startTime;
                this.logger.debug(`Health check completed: ${name}`, {
                    status: result.status,
                    duration,
                });
                return { ...result, duration };
            }
            catch (error) {
                const duration = Date.now() - startTime;
                this.logger.error(`Health check failed: ${name}`, { error });
                return {
                    status: "unhealthy",
                    message: error instanceof Error ? error.message : "Unknown error",
                    duration,
                };
            }
        });
    }
    /**
     * Get health status
     */
    async getStatus() {
        const checkResults = await Promise.all(this.checks.map((check) => check()));
        const healthy = checkResults.filter((c) => c.status === "healthy").length;
        const total = checkResults.length;
        let overallStatus;
        if (healthy === total) {
            overallStatus = "healthy";
        }
        else if (healthy === 0) {
            overallStatus = "unhealthy";
        }
        else {
            overallStatus = "degraded";
        }
        return {
            status: overallStatus,
            timestamp: Date.now(),
            uptime: process.uptime() * 1000,
            checks: checkResults.map((result, index) => ({
                name: `check_${index + 1}`,
                ...result,
            })),
            metrics: {
                activeJobs: 0, // Will be filled by job observer
                memoryUsage: process.memoryUsage().heapUsed,
                cpuUsage: 0, // Will be filled by system monitor
            },
        };
    }
}
exports.HealthChecker = HealthChecker;
// ========== OBSERVABILITY ORCHESTRATOR ==========
class ObservabilityOrchestrator {
    metricsCollector;
    systemMonitor;
    jobObserver;
    apiObserver;
    healthChecker;
    logger;
    constructor() {
        this.logger = new logger_1.Logger("observability");
        this.metricsCollector = new MetricsCollector();
        this.systemMonitor = new SystemMonitor(this.metricsCollector);
        this.jobObserver = new JobObserver(this.metricsCollector);
        this.apiObserver = new APIObserver(this.metricsCollector);
        this.healthChecker = new HealthChecker();
        this.setupDefaultChecks();
    }
    /**
     * Start all observability components
     */
    start() {
        this.logger.info("Starting observability system");
        this.systemMonitor.start();
        this.setupPeriodicTasks();
        this.logger.info("Observability system started");
    }
    /**
     * Stop all observability components
     */
    stop() {
        this.logger.info("Stopping observability system");
        this.systemMonitor.stop();
        this.logger.info("Observability system stopped");
    }
    /**
     * Get metrics export
     */
    exportMetrics() {
        const metrics = this.metricsCollector.getMetrics();
        const statistics = {};
        // Calculate statistics for all metrics
        const metricNames = [...new Set(metrics.map((m) => m.name))];
        for (const name of metricNames) {
            const stats = this.metricsCollector.getStatistics(name);
            if (stats) {
                statistics[name] = stats;
            }
        }
        return {
            metrics,
            statistics,
            health: this.healthChecker.getStatus(),
        };
    }
    /**
     * Setup default health checks
     */
    setupDefaultChecks() {
        // Memory usage check
        this.healthChecker.addCheck("memory", async () => {
            const usage = process.memoryUsage();
            const percentage = (usage.heapUsed / usage.heapTotal) * 100;
            if (percentage > 90) {
                return {
                    status: "unhealthy",
                    message: `Memory usage at ${percentage.toFixed(1)}%`,
                };
            }
            else if (percentage > 75) {
                return {
                    status: "degraded",
                    message: `Memory usage at ${percentage.toFixed(1)}%`,
                };
            }
            return { status: "healthy" };
        });
        // Process uptime check
        this.healthChecker.addCheck("uptime", async () => {
            const uptime = process.uptime();
            if (uptime < 60) {
                return {
                    status: "degraded",
                    message: `Process uptime only ${uptime} seconds`,
                };
            }
            return { status: "healthy" };
        });
    }
    /**
     * Setup periodic tasks
     */
    setupPeriodicTasks() {
        // Export metrics every 5 minutes
        setInterval(() => {
            try {
                const exportData = this.exportMetrics();
                this.logger.info("Metrics exported", {
                    metricCount: exportData.metrics.length,
                    statisticCount: Object.keys(exportData.statistics).length,
                });
                // In a real implementation, you would send this to your metrics backend
                // e.g., Prometheus, DataDog, New Relic, etc.
            }
            catch (error) {
                this.logger.error("Failed to export metrics", { error });
            }
        }, 5 * 60 * 1000); // 5 minutes
    }
}
exports.ObservabilityOrchestrator = ObservabilityOrchestrator;
// Export singleton instance
exports.observability = new ObservabilityOrchestrator();
exports.default = exports.observability;
//# sourceMappingURL=observability.js.map