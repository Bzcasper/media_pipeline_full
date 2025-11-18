"use strict";
/**
 * Video Generator Skill
 * Creates music videos from album covers and audio
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
exports.VideoGeneratorSkill = exports.VideoGeneratorOutput = exports.VideoGeneratorInput = void 0;
var zod_1 = require("zod");
var tools_1 = require("../tools");
var env_1 = require("../utils/env");
exports.VideoGeneratorInput = zod_1.z.object({
    audioFileId: zod_1.z.string(),
    coverImageFileId: zod_1.z.string(),
    title: zod_1.z.string().optional(),
    artist: zod_1.z.string().optional(),
    method: zod_1.z.enum(["media_server", "modal_wan22"]).optional(),
});
exports.VideoGeneratorOutput = zod_1.z.object({
    videoFileId: zod_1.z.string(),
    videoUrl: zod_1.z.string().optional(),
    duration: zod_1.z.number().optional(),
    method: zod_1.z.string(),
});
var VideoGeneratorSkill = /** @class */ (function () {
    function VideoGeneratorSkill(logger) {
        this.logger = logger;
    }
    VideoGeneratorSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, method;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validInput = exports.VideoGeneratorInput.parse(input);
                        this.logger.info("Generating music video", {
                            audioId: validInput.audioFileId,
                            coverId: validInput.coverImageFileId,
                        });
                        method = validInput.method || "media_server";
                        if (!(method === "modal_wan22")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.generateWithModal(validInput)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.generateWithMediaServer(validInput)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Generate video using Media Server music tools
     */
    VideoGeneratorSkill.prototype.generateWithMediaServer = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var imageVideoResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("Generating video using Media Server");
                        // Step 1: Create a looping video from the cover image
                        this.logger.info("Creating looping video from cover image");
                        return [4 /*yield*/, tools_1.mediaServer.client.video.generateCaptionedVideo({
                                background_id: input.coverImageFileId,
                                audio_id: input.audioFileId,
                                caption_on: false,
                                image_effect: "ken_burns", // Ken Burns effect for motion
                                width: 1920,
                                height: 1080,
                            })];
                    case 1:
                        imageVideoResult = _a.sent();
                        if (!imageVideoResult.file_id) {
                            throw new Error("Failed to create video from image");
                        }
                        this.logger.success("Music video generated", {
                            videoFileId: imageVideoResult.file_id,
                        });
                        return [2 /*return*/, {
                                videoFileId: imageVideoResult.file_id,
                                videoUrl: imageVideoResult.url,
                                method: "media_server",
                            }];
                }
            });
        });
    };
    /**
     * Generate video using Modal Wan2.2 (image-to-video)
     */
    VideoGeneratorSkill.prototype.generateWithModal = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var imageUrl, prompt, result, uploadResult, matchedResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("Generating video using Modal Wan2.2");
                        imageUrl = "".concat(env_1.env.MEDIA_SERVER_URL, "/api/v1/media/storage/").concat(input.coverImageFileId);
                        prompt = "Animated music video, smooth motion, professional quality";
                        return [4 /*yield*/, tools_1.modal.runAndWait("wan22", { imageUrl: imageUrl, prompt: prompt })];
                    case 1:
                        result = _a.sent();
                        if (!result || !result.video_url) {
                            throw new Error("Modal Wan2.2 failed to generate video");
                        }
                        // Upload the result to media server
                        this.logger.info("Uploading generated video to media server");
                        return [4 /*yield*/, tools_1.mediaServer.uploadFromURL(result.video_url, "video")];
                    case 2:
                        uploadResult = _a.sent();
                        // Match video duration to audio
                        this.logger.info("Matching video duration to audio");
                        return [4 /*yield*/, tools_1.mediaServer.matchDuration(uploadResult.file_id, input.audioFileId)];
                    case 3:
                        matchedResult = _a.sent();
                        this.logger.success("Video generated and matched to audio", {
                            videoFileId: matchedResult.file_id,
                        });
                        return [2 /*return*/, {
                                videoFileId: matchedResult.file_id,
                                videoUrl: matchedResult.url,
                                method: "modal_wan22",
                            }];
                }
            });
        });
    };
    VideoGeneratorSkill.prototype.runWithRetry = function (input_1) {
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
                                        this_1.logger.info("Video generation attempt ".concat(attempt, "/").concat(maxAttempts));
                                        _b = {};
                                        return [4 /*yield*/, this_1.run(input)];
                                    case 1: return [2 /*return*/, (_b.value = _c.sent(), _b)];
                                    case 2:
                                        error_1 = _c.sent();
                                        lastError = error_1 instanceof Error ? error_1 : new Error(String(error_1));
                                        this_1.logger.warn("Video generation attempt ".concat(attempt, " failed"), {
                                            error: lastError.message,
                                        });
                                        if (!(attempt < maxAttempts)) return [3 /*break*/, 4];
                                        delay_1 = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
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
                    case 4: throw lastError || new Error("Video generation failed after all retries");
                }
            });
        });
    };
    return VideoGeneratorSkill;
}());
exports.VideoGeneratorSkill = VideoGeneratorSkill;
exports.default = VideoGeneratorSkill;
