"use strict";
/**
 * Media Pipeline AI Agent - TypeScript Fixed
 * Simplified version with proper types
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
exports.MediaPipelineAgent = exports.MediaPipelineInput = exports.MediaPipelineResult = void 0;
var zod_1 = require("zod");
// Import existing skills and tools
var skills_1 = require("./skills");
var utils_1 = require("./utils");
// Define structured output schema
exports.MediaPipelineResult = zod_1.z.object({
    success: zod_1.z.boolean(),
    jobId: zod_1.z.string(),
    transcription: zod_1.z
        .object({
        text: zod_1.z.string(),
        language: zod_1.z.string().optional(),
        method: zod_1.z.enum(["riva", "whisper"]),
        segments: zod_1.z
            .array(zod_1.z.object({
            text: zod_1.z.string(),
            start: zod_1.z.number(),
            end: zod_1.z.number(),
            confidence: zod_1.z.number().optional(),
        }))
            .optional(),
    })
        .optional(),
    metadata: zod_1.z
        .object({
        title: zod_1.z.string().optional(),
        artist: zod_1.z.string().optional(),
        album: zod_1.z.string().optional(),
        genre: zod_1.z.string().optional(),
        mood: zod_1.z.string().optional(),
        themes: zod_1.z.array(zod_1.z.string()).optional(),
        bpm: zod_1.z.number().optional(),
        key: zod_1.z.string().optional(),
    })
        .optional(),
    assets: zod_1.z
        .object({
        coverImageUrl: zod_1.z.string().optional(),
        videoUrl: zod_1.z.string().optional(),
        gcsUrls: zod_1.z.record(zod_1.z.object({
            url: zod_1.z.string(),
            signedUrl: zod_1.z.string(),
            path: zod_1.z.string()
        })).optional(),
    }),
    processingSteps: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        status: zod_1.z.enum(["pending", "in_progress", "completed", "failed"]),
        output: zod_1.z.any().optional(),
        error: zod_1.z.string().optional(),
    })),
    totalDuration: zod_1.z.number().optional(),
});
// Media pipeline input schema
exports.MediaPipelineInput = zod_1.z.object({
    audioFileId: zod_1.z.string().optional(),
    audioBuffer: zod_1.z.any().optional(),
    audioUrl: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
    artist: zod_1.z.string().optional(),
    album: zod_1.z.string().optional(),
    language: zod_1.z.string().optional(),
});
// Media Pipeline Agent using standard patterns
var MediaPipelineAgent = /** @class */ (function () {
    function MediaPipelineAgent() {
        this.logger = new utils_1.Logger("media-pipeline-agent");
    }
    /**
     * Process audio file through complete pipeline
     */
    MediaPipelineAgent.prototype.processAudio = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var jobId, processingSteps, finalResult, transcriptionSkill, transcriptionResult, metadataSkill, metadataResult, albumCoverSkill, coverResult, videoSkill, videoResult, gcsSkill, gcsResult, weaviateSkill, weaviateResult, error_1, currentStep;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        jobId = "job_".concat(Date.now());
                        this.logger.info("Starting media pipeline processing", { jobId: jobId, input: input });
                        processingSteps = [];
                        finalResult = {
                            success: false,
                            jobId: jobId,
                            processingSteps: processingSteps,
                            transcription: undefined,
                            metadata: undefined,
                            assets: {
                                coverImageUrl: undefined,
                                videoUrl: undefined,
                                gcsUrls: undefined,
                            },
                        };
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 8, , 9]);
                        // Step 1: Transcription
                        processingSteps.push({
                            name: "transcription",
                            status: "in_progress",
                        });
                        transcriptionSkill = new skills_1.TranscriptionSkill(this.logger);
                        return [4 /*yield*/, transcriptionSkill.run(input)];
                    case 2:
                        transcriptionResult = _g.sent();
                        processingSteps[0].status = "completed";
                        processingSteps[0].output = transcriptionResult;
                        finalResult.transcription = transcriptionResult;
                        // Step 2: Metadata Extraction
                        processingSteps.push({
                            name: "metadata_extraction",
                            status: "in_progress",
                        });
                        metadataSkill = new skills_1.MetadataSkill(this.logger);
                        return [4 /*yield*/, metadataSkill.run({
                                lyrics: finalResult.transcription.text,
                                audioMetadata: {
                                    title: input.title,
                                    artist: input.artist,
                                    album: input.album,
                                },
                            })];
                    case 3:
                        metadataResult = _g.sent();
                        processingSteps[1].status = "completed";
                        processingSteps[1].output = metadataResult;
                        finalResult.metadata = metadataResult;
                        // Step 3: Album Cover Generation
                        processingSteps.push({
                            name: "album_cover_generation",
                            status: "in_progress",
                        });
                        albumCoverSkill = new skills_1.AlbumCoverSkill(this.logger);
                        return [4 /*yield*/, albumCoverSkill.run({
                                title: finalResult.metadata.title || input.title || "Untitled",
                                artist: finalResult.metadata.artist || input.artist,
                                genre: finalResult.metadata.genre,
                                mood: finalResult.metadata.mood,
                                lyrics: finalResult.transcription.text,
                            })];
                    case 4:
                        coverResult = _g.sent();
                        processingSteps[2].status = "completed";
                        processingSteps[2].output = coverResult;
                        finalResult.assets.coverImageUrl = coverResult.imageUrl;
                        // Step 4: Video Generation
                        processingSteps.push({
                            name: "video_generation",
                            status: "in_progress",
                        });
                        videoSkill = new skills_1.VideoGeneratorSkill(this.logger);
                        return [4 /*yield*/, videoSkill.run({
                                audioFileId: input.audioFileId,
                                coverImageFileId: coverResult.imageFileId,
                                title: finalResult.metadata.title,
                                artist: finalResult.metadata.artist,
                            })];
                    case 5:
                        videoResult = _g.sent();
                        processingSteps[3].status = "completed";
                        processingSteps[3].output = videoResult;
                        finalResult.assets.videoUrl = videoResult.videoUrl;
                        // Step 5: GCS Upload
                        processingSteps.push({
                            name: "gcs_upload",
                            status: "in_progress",
                        });
                        gcsSkill = new skills_1.GCSUploadSkill(this.logger);
                        return [4 /*yield*/, gcsSkill.run({
                                jobId: jobId,
                                files: __assign({ cover: {
                                        fileId: coverResult.imageFileId,
                                        name: "cover.png",
                                    }, video: {
                                        fileId: videoResult.videoFileId,
                                        name: "video.mp4",
                                    } }, (input.audioFileId && {
                                    audio: {
                                        fileId: input.audioFileId,
                                        name: "audio.mp3",
                                    },
                                })),
                            })];
                    case 6:
                        gcsResult = _g.sent();
                        processingSteps[4].status = "completed";
                        processingSteps[4].output = gcsResult;
                        finalResult.assets.gcsUrls = gcsResult.uploads;
                        // Step 6: Weaviate Indexing
                        processingSteps.push({
                            name: "weaviate_indexing",
                            status: "in_progress",
                        });
                        weaviateSkill = new skills_1.WeaviateIndexerSkill(this.logger);
                        return [4 /*yield*/, weaviateSkill.run({
                                id: jobId,
                                title: finalResult.metadata.title || input.title || "Untitled",
                                artist: finalResult.metadata.artist || input.artist,
                                album: finalResult.metadata.album || input.album,
                                genre: finalResult.metadata.genre,
                                lyrics: finalResult.transcription.text,
                                audioUrl: (_b = (_a = finalResult.assets.gcsUrls) === null || _a === void 0 ? void 0 : _a.audio) === null || _b === void 0 ? void 0 : _b.signedUrl,
                                coverUrl: (_d = (_c = finalResult.assets.gcsUrls) === null || _c === void 0 ? void 0 : _c.cover) === null || _d === void 0 ? void 0 : _d.signedUrl,
                                videoUrl: (_f = (_e = finalResult.assets.gcsUrls) === null || _e === void 0 ? void 0 : _e.video) === null || _f === void 0 ? void 0 : _f.signedUrl,
                                metadata: __assign(__assign({}, finalResult.metadata), { transcriptionMethod: finalResult.transcription.method }),
                            })];
                    case 7:
                        weaviateResult = _g.sent();
                        processingSteps[5].status = "completed";
                        processingSteps[5].output = weaviateResult;
                        finalResult.success = true;
                        this.logger.success("Media pipeline completed successfully", { jobId: jobId });
                        return [2 /*return*/, finalResult];
                    case 8:
                        error_1 = _g.sent();
                        this.logger.error("Media pipeline failed", { jobId: jobId, error: error_1 });
                        finalResult.success = false;
                        currentStep = processingSteps.find(function (step) { return step.status === "in_progress"; });
                        if (currentStep) {
                            currentStep.status = "failed";
                            currentStep.error =
                                error_1 instanceof Error ? error_1.message : "Unknown error";
                        }
                        throw error_1;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return MediaPipelineAgent;
}());
exports.MediaPipelineAgent = MediaPipelineAgent;
// Export the agent and utilities
exports.default = MediaPipelineAgent;
