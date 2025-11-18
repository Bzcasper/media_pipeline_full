"use strict";
/**
 * Enhanced Logger Utility
 * Advanced observability-integrated logging for agent skills and orchestrator
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
exports.Logger = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const observability_1 = require("./observability");
class Logger {
    jobId;
    logs = [];
    logDir;
    observability;
    constructor(jobId, logDir = 'jobs') {
        this.jobId = jobId;
        this.logDir = logDir;
        this.observability = observability_1.ObservabilityOrchestrator.getInstance();
    }
    /**
     * Enhanced logging with observability integration
     */
    log(level, message, data) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
            jobId: this.jobId,
            source: 'logger'
        };
        this.logs.push(entry);
        // Enhanced observability integration
        this.observability.recordLog(level, message, {
            jobId: this.jobId,
            data,
            source: 'logger'
        });
        // Structured logging instead of console
        this.writeStructuredLog(entry);
    }
    /**
     * Write structured log without console dependency
     */
    writeStructuredLog(entry) {
        const structuredLog = {
            timestamp: entry.timestamp,
            level: entry.level,
            message: entry.message,
            jobId: entry.jobId,
            source: entry.source,
            ...(entry.data && { data: entry.data })
        };
        // Write to structured file-based logging
        this.appendToLogFile(structuredLog);
    }
    info(message, data) {
        this.log('info', message, data);
    }
    warn(message, data) {
        this.log('warn', message, data);
    }
    error(message, data) {
        this.log('error', message, data);
    }
    debug(message, data) {
        this.log('debug', message, data);
    }
    success(message, data) {
        this.log('success', message, data);
    }
    /**
     * Get all logs with enhanced metadata
     */
    getLogs() {
        return [...this.logs];
    }
    /**
     * Enhanced persistence with error handling
     */
    async saveLogs() {
        try {
            await fs.mkdir(this.logDir, { recursive: true });
            const logFile = path.join(this.logDir, `${this.jobId}.log.json`);
            await fs.writeFile(logFile, JSON.stringify(this.logs, null, 2));
            // Record observability metric
            this.observability.recordMetric('logs_persisted', 1, 'count', {
                jobId: this.jobId,
                logCount: this.logs.length
            });
        }
        catch (error) {
            this.observability.recordError('log_persistence_failed', error, {
                jobId: this.jobId,
                logDir: this.logDir
            });
        }
    }
    /**
     * Append to structured log file
     */
    async appendToLogFile(logEntry) {
        try {
            const logFile = path.join(this.logDir, `${this.jobId}.structured.log`);
            const logLine = JSON.stringify(logEntry) + '\n';
            await fs.appendFile(logFile, logLine);
        }
        catch (error) {
            // Silent fail for structured logging to avoid cascading errors
        }
    }
    /**
     * Load logs with enhanced error handling
     */
    static async loadLogs(jobId, logDir = 'jobs') {
        try {
            const logFile = path.join(logDir, `${jobId}.log.json`);
            const content = await fs.readFile(logFile, 'utf-8');
            const parsed = JSON.parse(content);
            // Validate log structure
            if (Array.isArray(parsed)) {
                return parsed.filter(entry => entry && typeof entry === 'object' &&
                    entry.timestamp && entry.level && entry.message);
            }
            return [];
        }
        catch (error) {
            // Return empty array for missing or corrupted logs
            return [];
        }
    }
    /**
     * Get enhanced log analytics
     */
    getLogAnalytics() {
        const levelDistribution = {
            info: 0, warn: 0, error: 0, debug: 0, success: 0
        };
        this.logs.forEach(log => {
            levelDistribution[log.level]++;
        });
        const timestamps = this.logs.map(log => log.timestamp).sort();
        const recentErrors = this.logs
            .filter(log => log.level === 'error')
            .slice(-10); // Last 10 errors
        return {
            totalLogs: this.logs.length,
            levelDistribution,
            timeRange: {
                start: timestamps[0] || '',
                end: timestamps[timestamps.length - 1] || ''
            },
            recentErrors
        };
    }
}
exports.Logger = Logger;
exports.default = Logger;
//# sourceMappingURL=logger.js.map