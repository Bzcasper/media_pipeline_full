"use strict";
/**
 * Transcription Skill
 * Handles audio transcription with Riva (primary) and Whisper (fallback)
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptionSkill = exports.TranscriptionOutput = exports.TranscriptionInput = void 0;
var zod_1 = require("zod");
var tools_1 = require("../tools");
var env_1 = require("../utils/env");
// Input/Output Schemas
exports.TranscriptionInput = zod_1.z
    .object({
    audioFileId: zod_1.z.string().optional(),
    audioBuffer: zod_1.z.any().optional(),
    audioUrl: zod_1.z.string().optional(),
    language: zod_1.z.string().optional(),
})
    .refine(function (data) { return data.audioFileId || data.audioBuffer || data.audioUrl; }, { message: "One of audioFileId, audioBuffer, or audioUrl must be provided" });
exports.TranscriptionOutput = zod_1.z.object({
    text: zod_1.z.string(),
    segments: zod_1.z
        .array(zod_1.z.object({
        text: zod_1.z.string(),
        start: zod_1.z.number(),
        end: zod_1.z.number(),
        confidence: zod_1.z.number().optional(),
    }))
        .optional(),
    language: zod_1.z.string().optional(),
    method: zod_1.z.enum(["riva", "whisper"]),
    duration: zod_1.z.number().optional(),
});
/**
 * Transcription Skill
 */
var TranscriptionSkill = /** @class */ (function () {
    function TranscriptionSkill(logger) {
        this.logger = logger;
    }
    /**
     * Run transcription with automatic fallback
     */
    TranscriptionSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, rivaError_1, whisperError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validInput = exports.TranscriptionInput.parse(input);
                        this.logger.info("Starting transcription", { input: validInput });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 8]);
                        return [4 /*yield*/, this.transcribeWithRiva(validInput)];
                    case 2: 
                    // Try Riva first
                    return [2 /*return*/, _a.sent()];
                    case 3:
                        rivaError_1 = _a.sent();
                        this.logger.warn("Riva transcription failed, falling back to Whisper", {
                            error: rivaError_1 instanceof Error ? rivaError_1.message : String(rivaError_1),
                        });
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.transcribeWithWhisper(validInput)];
                    case 5: 
                    // Fallback to Whisper via Modal
                    return [2 /*return*/, _a.sent()];
                    case 6:
                        whisperError_1 = _a.sent();
                        this.logger.error("Both Riva and Whisper transcription failed", {
                            rivaError: rivaError_1 instanceof Error ? rivaError_1.message : String(rivaError_1),
                            whisperError: whisperError_1 instanceof Error
                                ? whisperError_1.message
                                : String(whisperError_1),
                        });
                        throw new Error("Transcription failed: Both Riva and Whisper methods failed");
                    case 7: return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Transcribe using Riva ASR via Media Server
     */
    TranscriptionSkill.prototype.transcribeWithRiva = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var audioBuffer, response, _a, _b, response, _c, _d, result;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        this.logger.info("Attempting transcription with Riva ASR");
                        if (!input.audioBuffer) return [3 /*break*/, 1];
                        audioBuffer = input.audioBuffer;
                        return [3 /*break*/, 8];
                    case 1:
                        if (!input.audioFileId) return [3 /*break*/, 4];
                        this.logger.info("Downloading audio file from media server");
                        return [4 /*yield*/, tools_1.mediaServer.downloadFile(input.audioFileId)];
                    case 2:
                        response = _f.sent();
                        _b = (_a = Buffer).from;
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 3:
                        audioBuffer = _b.apply(_a, [_f.sent()]);
                        return [3 /*break*/, 8];
                    case 4:
                        if (!input.audioUrl) return [3 /*break*/, 7];
                        this.logger.info("Downloading audio from URL");
                        return [4 /*yield*/, fetch(input.audioUrl)];
                    case 5:
                        response = _f.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch audio from URL: ".concat(response.statusText));
                        }
                        _d = (_c = Buffer).from;
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 6:
                        audioBuffer = _d.apply(_c, [_f.sent()]);
                        return [3 /*break*/, 8];
                    case 7: throw new Error("No audio source provided");
                    case 8: return [4 /*yield*/, tools_1.mediaServer.transcribeAudio(audioBuffer, input.language)];
                    case 9:
                        result = _f.sent();
                        // Check for failure indicators
                        if (!result || !result.text || result.text.trim() === "") {
                            throw new Error("Riva returned empty transcription");
                        }
                        if (result.error ||
                            (result.text && result.text.toLowerCase().includes("riva failed"))) {
                            throw new Error("Riva transcription failed");
                        }
                        this.logger.success("Riva transcription completed", {
                            textLength: result.text.length,
                            segmentCount: ((_e = result.segments) === null || _e === void 0 ? void 0 : _e.length) || 0,
                        });
                        return [2 /*return*/, {
                                text: result.text,
                                segments: result.segments,
                                language: result.language || input.language,
                                method: "riva",
                            }];
                }
            });
        });
    };
    /**
     * Transcribe using Whisper via Modal
     */
    TranscriptionSkill.prototype.transcribeWithWhisper = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var audioUrl, uploadResult, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger.info("Attempting transcription with Whisper (Modal)");
                        if (!input.audioUrl) return [3 /*break*/, 1];
                        audioUrl = input.audioUrl;
                        return [3 /*break*/, 5];
                    case 1:
                        if (!input.audioFileId) return [3 /*break*/, 2];
                        // Use media server URL
                        audioUrl = "".concat(env_1.env.MEDIA_SERVER_URL, "/api/v1/media/storage/").concat(input.audioFileId);
                        return [3 /*break*/, 5];
                    case 2:
                        if (!input.audioBuffer) return [3 /*break*/, 4];
                        // Upload to media server first
                        this.logger.info("Uploading audio to media server for Whisper processing");
                        return [4 /*yield*/, tools_1.mediaServer.uploadFile(input.audioBuffer, "audio")];
                    case 3:
                        uploadResult = _b.sent();
                        audioUrl = "".concat(env_1.env.MEDIA_SERVER_URL, "/api/v1/media/storage/").concat(uploadResult.file_id);
                        return [3 /*break*/, 5];
                    case 4: throw new Error("No audio source provided");
                    case 5: return [4 /*yield*/, tools_1.modal.runAndWait("whisper", {
                            audioUrl: audioUrl,
                            model: "large-v3",
                            language: input.language,
                        })];
                    case 6:
                        result = _b.sent();
                        if (!result || !result.text) {
                            throw new Error("Whisper returned empty result");
                        }
                        this.logger.success("Whisper transcription completed", {
                            textLength: result.text.length,
                            segmentCount: ((_a = result.segments) === null || _a === void 0 ? void 0 : _a.length) || 0,
                        });
                        return [2 /*return*/, {
                                text: result.text,
                                segments: result.segments,
                                language: result.language || input.language,
                                method: "whisper",
                                duration: result.duration,
                            }];
                }
            });
        });
    };
    /**
     * Retry wrapper
     */
    TranscriptionSkill.prototype.runWithRetry = function (input_1) {
        return __awaiter(this, arguments, void 0, function (input, maxAttempts) {
            var lastError, _loop_1, this_1, attempt, state_1;
            if (maxAttempts === void 0) { maxAttempts = 2; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastError = null;
                        _loop_1 = function (attempt) {
                            var _b, error_1, delay_1;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 2, , 5]);
                                        this_1.logger.info("Transcription attempt ".concat(attempt, "/").concat(maxAttempts));
                                        _b = {};
                                        return [4 /*yield*/, this_1.run(input)];
                                    case 1: return [2 /*return*/, (_b.value = _c.sent(), _b)];
                                    case 2:
                                        error_1 = _c.sent();
                                        lastError = error_1 instanceof Error ? error_1 : new Error(String(error_1));
                                        this_1.logger.warn("Transcription attempt ".concat(attempt, " failed"), {
                                            error: lastError.message,
                                        });
                                        if (!(attempt < maxAttempts)) return [3 /*break*/, 4];
                                        delay_1 = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                                        this_1.logger.info("Retrying in ".concat(delay_1, "ms..."));
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                                    case 3:
                                        _c.sent();
                                        _c.label = 4;
                                    case 4: return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        attempt = 1;
                        _a.label = 1;
                    case 1:
                        if (!(attempt <= maxAttempts)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(attempt)];
                    case 2:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 3;
                    case 3:
                        attempt++;
                        return [3 /*break*/, 1];
                    case 4: throw lastError || new Error("Transcription failed after all retries");
                }
            });
        });
    };
    return TranscriptionSkill;
}());
exports.TranscriptionSkill = TranscriptionSkill;
exports.default = TranscriptionSkill;
