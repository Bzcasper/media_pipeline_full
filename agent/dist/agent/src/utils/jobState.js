"use strict";
/**
 * Simplified Job State Manager
 * Basic job state tracking without complex observability
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobStateManager = void 0;
var fs = require("fs/promises");
var path = require("path");
var uuid_1 = require("uuid");
var JobStateManager = /** @class */ (function () {
    function JobStateManager(jobId, jobDir) {
        if (jobDir === void 0) { jobDir = "jobs"; }
        this.jobDir = jobDir;
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
    }
    JobStateManager.prototype.getJobId = function () {
        return this.state.jobId;
    };
    JobStateManager.prototype.getState = function () {
        return JSON.parse(JSON.stringify(this.state));
    };
    JobStateManager.prototype.updateStatus = function (status) {
        this.state.status = status;
        this.state.updatedAt = new Date().toISOString();
    };
    JobStateManager.prototype.updateProgress = function (progress) {
        this.state.progress = Math.min(100, Math.max(0, progress));
    };
    JobStateManager.prototype.addStep = function (name, status) {
        if (status === void 0) { status = "pending"; }
        this.state.steps.push({
            name: name,
            status: status,
            startTime: new Date().toISOString(),
        });
    };
    JobStateManager.prototype.updateStep = function (name, updates) {
        var step = this.state.steps.find(function (s) { return s.name === name; });
        if (step) {
            Object.assign(step, updates);
            if (updates.status === "completed" || updates.status === "failed") {
                step.endTime = new Date().toISOString();
                if (step.startTime && step.endTime) {
                    step.duration = new Date(step.endTime).getTime() - new Date(step.startTime).getTime();
                }
            }
        }
    };
    JobStateManager.prototype.completeStep = function (name, output) {
        this.updateStep(name, { status: "completed", output: output });
    };
    JobStateManager.prototype.failStep = function (name, error) {
        this.updateStep(name, { status: "failed", error: error });
        this.state.errors.push(error);
    };
    JobStateManager.prototype.addOutput = function (key, value) {
        this.state.outputs[key] = value;
    };
    JobStateManager.prototype.addError = function (error) {
        this.state.errors.push(error);
    };
    JobStateManager.prototype.addLogs = function (logs) {
        var _a;
        (_a = this.state.logs).push.apply(_a, logs);
    };
    JobStateManager.prototype.setMetadata = function (metadata) {
        this.state.metadata = __assign(__assign({}, this.state.metadata), metadata);
    };
    JobStateManager.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stateFile, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fs.mkdir(this.jobDir, { recursive: true })];
                    case 1:
                        _a.sent();
                        stateFile = path.join(this.jobDir, "".concat(this.state.jobId, ".json"));
                        return [4 /*yield*/, fs.writeFile(stateFile, JSON.stringify(this.state, null, 2))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Failed to save job state:", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    JobStateManager.load = function (jobId_1) {
        return __awaiter(this, arguments, void 0, function (jobId, jobDir) {
            var stateFile, content, state, manager, error_2;
            if (jobDir === void 0) { jobDir = "jobs"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        stateFile = path.join(jobDir, "".concat(jobId, ".json"));
                        return [4 /*yield*/, fs.readFile(stateFile, 'utf-8')];
                    case 1:
                        content = _a.sent();
                        state = JSON.parse(content);
                        manager = new JobStateManager(state.jobId, jobDir);
                        manager.state = state;
                        return [2 /*return*/, manager];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JobStateManager.listJobs = function () {
        return __awaiter(this, arguments, void 0, function (jobDir) {
            var files, jobFiles, jobs, _i, jobFiles_1, file, filePath, content, state, error_3, error_4;
            if (jobDir === void 0) { jobDir = "jobs"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, fs.readdir(jobDir)];
                    case 1:
                        files = _a.sent();
                        jobFiles = files.filter(function (f) { return f.endsWith('.json'); });
                        jobs = [];
                        _i = 0, jobFiles_1 = jobFiles;
                        _a.label = 2;
                    case 2:
                        if (!(_i < jobFiles_1.length)) return [3 /*break*/, 7];
                        file = jobFiles_1[_i];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        filePath = path.join(jobDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf-8')];
                    case 4:
                        content = _a.sent();
                        state = JSON.parse(content);
                        jobs.push(state);
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7:
                        // Sort by creation date, newest first
                        jobs.sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); });
                        return [2 /*return*/, jobs];
                    case 8:
                        error_4 = _a.sent();
                        return [2 /*return*/, []];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    JobStateManager.prototype.getAnalytics = function () {
        var totalSteps = this.state.steps.length;
        var completedSteps = this.state.steps.filter(function (s) { return s.status === "completed"; }).length;
        var failedSteps = this.state.steps.filter(function (s) { return s.status === "failed"; }).length;
        var completedDurations = this.state.steps
            .filter(function (s) { return s.status === "completed" && s.duration; })
            .map(function (s) { return s.duration; });
        var averageStepDuration = completedDurations.length > 0
            ? completedDurations.reduce(function (sum, d) { return sum + d; }, 0) / completedDurations.length
            : 0;
        var totalDuration = this.state.steps
            .filter(function (s) { return s.duration; })
            .reduce(function (sum, s) { return sum + s.duration; }, 0);
        return {
            totalSteps: totalSteps,
            completedSteps: completedSteps,
            failedSteps: failedSteps,
            averageStepDuration: averageStepDuration,
            totalDuration: totalDuration,
        };
    };
    return JobStateManager;
}());
exports.JobStateManager = JobStateManager;
