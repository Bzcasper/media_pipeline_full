"use strict";
/**
 * Enhanced Logger Utility
 * Advanced observability-integrated logging for agent skills and orchestrator
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var fs = require("fs/promises");
var path = require("path");
var Logger = /** @class */ (function () {
    function Logger(jobId, logDir) {
        if (logDir === void 0) { logDir = 'logs'; }
        this.logs = [];
        this.jobId = jobId;
        this.logDir = logDir;
        this.logFile = path.join(logDir, "".concat(jobId, ".log"));
    }
    /**
      * Enhanced logging with observability integration
      */
    Logger.prototype.log = function (level, message, data) {
        var entry = {
            timestamp: new Date().toISOString(),
            level: level,
            message: message,
            data: data,
            jobId: this.jobId,
            source: 'logger'
        };
        this.logs.push(entry);
        // Enhanced observability integration (lazy import to avoid circular dependency)
        try {
            var ObservabilityOrchestrator = require('./observability').ObservabilityOrchestrator;
            var observability = ObservabilityOrchestrator.getInstance();
            observability.recordLog(level, message, {
                jobId: this.jobId,
                data: data,
                source: 'logger'
            });
        }
        catch (error) {
            // Silently fail if observability is not available
        }
        // Structured logging instead of console
        this.writeStructuredLog(entry);
    };
    /**
     * Write structured log without console dependency
     */
    Logger.prototype.writeStructuredLog = function (entry) {
        var structuredLog = __assign({ timestamp: entry.timestamp, level: entry.level, message: entry.message, jobId: entry.jobId, source: entry.source }, (entry.data && { data: entry.data }));
        // Write to structured file-based logging
        this.appendToLogFile(structuredLog);
    };
    Logger.prototype.info = function (message, data) {
        this.log('info', message, data);
    };
    Logger.prototype.warn = function (message, data) {
        this.log('warn', message, data);
    };
    Logger.prototype.error = function (message, data) {
        this.log('error', message, data);
    };
    Logger.prototype.debug = function (message, data) {
        this.log('debug', message, data);
    };
    Logger.prototype.success = function (message, data) {
        this.log('success', message, data);
    };
    /**
     * Get all logs with enhanced metadata
     */
    Logger.prototype.getLogs = function () {
        return __spreadArray([], this.logs, true);
    };
    /**
      * Enhanced persistence with error handling
      */
    Logger.prototype.saveLogs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var logFile, ObservabilityOrchestrator, observability, error_1, ObservabilityOrchestrator, observability;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fs.mkdir(this.logDir, { recursive: true })];
                    case 1:
                        _a.sent();
                        logFile = path.join(this.logDir, "".concat(this.jobId, ".log.json"));
                        return [4 /*yield*/, fs.writeFile(logFile, JSON.stringify(this.logs, null, 2))];
                    case 2:
                        _a.sent();
                        // Record observability metric (lazy import)
                        try {
                            ObservabilityOrchestrator = require('./observability').ObservabilityOrchestrator;
                            observability = ObservabilityOrchestrator.getInstance();
                            observability.recordMetric('logs_persisted', 1, 'count', {
                                jobId: this.jobId,
                                logCount: this.logs.length
                            });
                        }
                        catch (error) {
                            // Silently fail if observability is not available
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        // Record error (lazy import)
                        try {
                            ObservabilityOrchestrator = require('./observability').ObservabilityOrchestrator;
                            observability = ObservabilityOrchestrator.getInstance();
                            observability.recordError('log_persistence_failed', error_1, {
                                jobId: this.jobId,
                                logDir: this.logDir
                            });
                        }
                        catch (obsError) {
                            // Silently fail if observability is not available
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Append to structured log file
     */
    Logger.prototype.appendToLogFile = function (logEntry) {
        return __awaiter(this, void 0, void 0, function () {
            var logFile, logLine, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logFile = path.join(this.logDir, "".concat(this.jobId, ".structured.log"));
                        logLine = JSON.stringify(logEntry) + '\n';
                        return [4 /*yield*/, fs.appendFile(logFile, logLine)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load logs with enhanced error handling
     */
    Logger.loadLogs = function (jobId_1) {
        return __awaiter(this, arguments, void 0, function (jobId, logDir) {
            var logFile, content, parsed, error_3;
            if (logDir === void 0) { logDir = 'jobs'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logFile = path.join(logDir, "".concat(jobId, ".log.json"));
                        return [4 /*yield*/, fs.readFile(logFile, 'utf-8')];
                    case 1:
                        content = _a.sent();
                        parsed = JSON.parse(content);
                        // Validate log structure
                        if (Array.isArray(parsed)) {
                            return [2 /*return*/, parsed.filter(function (entry) {
                                    return entry && typeof entry === 'object' &&
                                        entry.timestamp && entry.level && entry.message;
                                })];
                        }
                        return [2 /*return*/, []];
                    case 2:
                        error_3 = _a.sent();
                        // Return empty array for missing or corrupted logs
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get enhanced log analytics
     */
    Logger.prototype.getLogAnalytics = function () {
        var levelDistribution = {
            info: 0, warn: 0, error: 0, debug: 0, success: 0
        };
        this.logs.forEach(function (log) {
            levelDistribution[log.level]++;
        });
        var timestamps = this.logs.map(function (log) { return log.timestamp; }).sort();
        var recentErrors = this.logs
            .filter(function (log) { return log.level === 'error'; })
            .slice(-10); // Last 10 errors
        return {
            totalLogs: this.logs.length,
            levelDistribution: levelDistribution,
            timeRange: {
                start: timestamps[0] || '',
                end: timestamps[timestamps.length - 1] || ''
            },
            recentErrors: recentErrors
        };
    };
    return Logger;
}());
exports.Logger = Logger;
exports.default = Logger;
