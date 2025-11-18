/**
 * Enhanced Logger Utility
 * Advanced observability-integrated logging for agent skills and orchestrator
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ObservabilityOrchestrator } from './observability';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  jobId: string;
  source: 'logger';
}

export class Logger {
  private jobId: string;
  private logs: LogEntry[] = [];
  private logDir: string;
  private observability: ObservabilityOrchestrator;

  constructor(jobId: string, logDir: string = 'jobs') {
    this.jobId = jobId;
    this.logDir = logDir;
    this.observability = ObservabilityOrchestrator.getInstance();
  }

  /**
   * Enhanced logging with observability integration
   */
  log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
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
  private writeStructuredLog(entry: LogEntry): void {
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

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  success(message: string, data?: any): void {
    this.log('success', message, data);
  }

  /**
   * Get all logs with enhanced metadata
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Enhanced persistence with error handling
   */
  async saveLogs(): Promise<void> {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
      const logFile = path.join(this.logDir, `${this.jobId}.log.json`);
      await fs.writeFile(logFile, JSON.stringify(this.logs, null, 2));
      
      // Record observability metric
      this.observability.recordMetric('logs_persisted', 1, 'count', {
        jobId: this.jobId,
        logCount: this.logs.length
      });
    } catch (error) {
      this.observability.recordError('log_persistence_failed', error, {
        jobId: this.jobId,
        logDir: this.logDir
      });
    }
  }

  /**
   * Append to structured log file
   */
  private async appendToLogFile(logEntry: any): Promise<void> {
    try {
      const logFile = path.join(this.logDir, `${this.jobId}.structured.log`);
      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(logFile, logLine);
    } catch (error) {
      // Silent fail for structured logging to avoid cascading errors
    }
  }

  /**
   * Load logs with enhanced error handling
   */
  static async loadLogs(jobId: string, logDir: string = 'jobs'): Promise<LogEntry[]> {
    try {
      const logFile = path.join(logDir, `${jobId}.log.json`);
      const content = await fs.readFile(logFile, 'utf-8');
      const parsed = JSON.parse(content);
      
      // Validate log structure
      if (Array.isArray(parsed)) {
        return parsed.filter(entry =>
          entry && typeof entry === 'object' &&
          entry.timestamp && entry.level && entry.message
        );
      }
      
      return [];
    } catch (error) {
      // Return empty array for missing or corrupted logs
      return [];
    }
  }

  /**
   * Get enhanced log analytics
   */
  getLogAnalytics(): {
    totalLogs: number;
    levelDistribution: Record<LogLevel, number>;
    timeRange: { start: string; end: string };
    recentErrors: LogEntry[];
  } {
    const levelDistribution: Record<LogLevel, number> = {
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

export default Logger;
