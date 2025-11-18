"use strict";
/**
 * AI SDK Agent Implementation
 * Simplified version for music video generation
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
exports.musicVideoAgent = musicVideoAgent;
exports.youtubeVideoAgent = youtubeVideoAgent;
var ai_1 = require("ai");
var anthropic_1 = require("@ai-sdk/anthropic");
var utils_1 = require("./utils");
/**
 * Music Video Generation Agent
 * Simplified AI agent for processing music files
 */
function musicVideoAgent(input) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = new utils_1.Logger(input.jobId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    logger.info("Starting music video agent", { jobId: input.jobId });
                    return [4 /*yield*/, (0, ai_1.generateText)({
                            model: (0, anthropic_1.anthropic)("claude-3-5-haiku-20241022"),
                            prompt: input.prompt,
                            system: "You are a music video generation assistant. Help process music files through a complete pipeline:\n      1. Transcribe audio (use Riva ASR, fallback to Whisper)\n      2. Extract metadata (genre, mood, themes, BPM, key)\n      3. Generate album cover art\n      4. Create animated music video\n      5. Upload to Google Cloud Storage\n      6. Index in Weaviate vector database\n\n      Respond with a structured plan for processing the music file.",
                        })];
                case 2:
                    response = _a.sent();
                    logger.info("Music video agent completed", { jobId: input.jobId });
                    return [2 /*return*/, {
                            success: true,
                            jobId: input.jobId,
                            plan: response.text,
                        }];
                case 3:
                    error_1 = _a.sent();
                    logger.error("Music video agent failed", {
                        jobId: input.jobId,
                        error: error_1 instanceof Error ? error_1.message : String(error_1)
                    });
                    return [2 /*return*/, {
                            success: false,
                            jobId: input.jobId,
                            error: error_1 instanceof Error ? error_1.message : String(error_1),
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * YouTube Video Generation Agent
 * Simplified agent for YouTube content creation
 */
function youtubeVideoAgent(input) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = new utils_1.Logger(input.jobId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    logger.info("Starting YouTube video agent", { jobId: input.jobId });
                    return [4 /*yield*/, (0, ai_1.generateText)({
                            model: (0, anthropic_1.anthropic)("claude-3-5-haiku-20241022"),
                            prompt: "Create a YouTube video about: ".concat(input.query, "\n      Style: ").concat(input.videoStyle || 'educational', "\n      Duration: ").concat(input.duration || 60, " seconds\n\n      Generate a complete video script and plan."),
                            system: "You are a YouTube content creation assistant.",
                        })];
                case 2:
                    response = _a.sent();
                    logger.info("YouTube video agent completed", { jobId: input.jobId });
                    return [2 /*return*/, {
                            success: true,
                            jobId: input.jobId,
                            script: response.text,
                        }];
                case 3:
                    error_2 = _a.sent();
                    logger.error("YouTube video agent failed", {
                        jobId: input.jobId,
                        error: error_2 instanceof Error ? error_2.message : String(error_2)
                    });
                    return [2 /*return*/, {
                            success: false,
                            jobId: input.jobId,
                            error: error_2 instanceof Error ? error_2.message : String(error_2),
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
