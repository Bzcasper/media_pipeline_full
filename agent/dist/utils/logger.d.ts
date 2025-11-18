/**
 * Enhanced Logger Utility
 * Advanced observability-integrated logging for agent skills and orchestrator
 */
export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: any;
    jobId: string;
    source: 'logger';
}
export declare class Logger {
    private jobId;
    private logs;
    private logDir;
    private observability;
    constructor(jobId: string, logDir?: string);
    /**
     * Enhanced logging with observability integration
     */
    log(level: LogLevel, message: string, data?: any): void;
    /**
     * Write structured log without console dependency
     */
    private writeStructuredLog;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, data?: any): void;
    debug(message: string, data?: any): void;
    success(message: string, data?: any): void;
    /**
     * Get all logs with enhanced metadata
     */
    getLogs(): LogEntry[];
    /**
     * Enhanced persistence with error handling
     */
    saveLogs(): Promise<void>;
    /**
     * Append to structured log file
     */
    private appendToLogFile;
    /**
     * Load logs with enhanced error handling
     */
    static loadLogs(jobId: string, logDir?: string): Promise<LogEntry[]>;
    /**
     * Get enhanced log analytics
     */
    getLogAnalytics(): {
        totalLogs: number;
        levelDistribution: Record<LogLevel, number>;
        timeRange: {
            start: string;
            end: string;
        };
        recentErrors: LogEntry[];
    };
}
export default Logger;
//# sourceMappingURL=logger.d.ts.map