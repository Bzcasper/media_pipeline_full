"use strict";
/**
 * Modal Labs Tool
 * Handles interactions with Modal Labs for Whisper transcription and image-to-video generation
 */
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
exports.modal = void 0;
exports.modal = {
    /**
     * Run Whisper transcription via Modal
     */
    runWhisper: function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var modalJobUrl, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    modalJobUrl = process.env.MODAL_JOB_URL;
                    if (!modalJobUrl) {
                        throw new Error('MODAL_JOB_URL environment variable is not set');
                    }
                    return [4 /*yield*/, fetch("".concat(modalJobUrl, "/whisper"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                audio_url: params.audioUrl,
                                model: params.model || 'large-v3',
                                language: params.language
                            })
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Modal Whisper API failed: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Run Wan2.2 image-to-video generation via Modal
     */
    runWan22: function (imageUrl, prompt) { return __awaiter(void 0, void 0, void 0, function () {
        var modalJobUrl, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    modalJobUrl = process.env.MODAL_JOB_URL;
                    if (!modalJobUrl) {
                        throw new Error('MODAL_JOB_URL environment variable is not set');
                    }
                    return [4 /*yield*/, fetch("".concat(modalJobUrl, "/wan22"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                image_url: imageUrl,
                                prompt: prompt
                            })
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Modal Wan2.2 API failed: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Poll Modal job status
     */
    pollJob: function (jobId_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([jobId_1], args_1, true), void 0, function (jobId, maxAttempts, intervalMs) {
            var modalPollUrl, attempt, response, job;
            if (maxAttempts === void 0) { maxAttempts = 60; }
            if (intervalMs === void 0) { intervalMs = 5000; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modalPollUrl = process.env.MODAL_POLL_URL;
                        if (!modalPollUrl) {
                            throw new Error('MODAL_POLL_URL environment variable is not set');
                        }
                        attempt = 0;
                        _a.label = 1;
                    case 1:
                        if (!(attempt < maxAttempts)) return [3 /*break*/, 6];
                        return [4 /*yield*/, fetch("".concat(modalPollUrl, "/").concat(jobId), {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                }
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Modal poll API failed: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        job = _a.sent();
                        if (job.status === 'completed') {
                            return [2 /*return*/, job];
                        }
                        if (job.status === 'failed') {
                            throw new Error("Modal job failed: ".concat(job.error || 'Unknown error'));
                        }
                        // Wait before next poll
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, intervalMs); })];
                    case 4:
                        // Wait before next poll
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        attempt++;
                        return [3 /*break*/, 1];
                    case 6: throw new Error("Modal job ".concat(jobId, " timed out after ").concat(maxAttempts, " attempts"));
                }
            });
        });
    },
    /**
     * Run and wait for Modal job
     */
    runAndWait: function (jobType, params) { return __awaiter(void 0, void 0, void 0, function () {
        var jobResponse, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(jobType === 'whisper')) return [3 /*break*/, 2];
                    return [4 /*yield*/, exports.modal.runWhisper(params)];
                case 1:
                    jobResponse = _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    if (!(jobType === 'wan22')) return [3 /*break*/, 4];
                    return [4 /*yield*/, exports.modal.runWan22(params.imageUrl, params.prompt)];
                case 3:
                    jobResponse = _a.sent();
                    return [3 /*break*/, 5];
                case 4: throw new Error("Unknown job type: ".concat(jobType));
                case 5: return [4 /*yield*/, exports.modal.pollJob(jobResponse.job_id)];
                case 6:
                    result = _a.sent();
                    return [2 /*return*/, result.output];
            }
        });
    }); }
};
exports.default = exports.modal;
