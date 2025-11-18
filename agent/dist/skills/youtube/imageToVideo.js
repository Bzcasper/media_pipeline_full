"use strict";
/**
 * Image-to-Video Skill
 * Converts static images into animated video clips
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
exports.ImageToVideoSkill = exports.ImageToVideoOutput = exports.ImageToVideoInput = void 0;
var zod_1 = require("zod");
var tools_1 = require("../../tools");
exports.ImageToVideoInput = zod_1.z.object({
    images: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        url: zod_1.z.string()
    })),
    prompts: zod_1.z.array(zod_1.z.string()),
    duration: zod_1.z.number().default(5)
});
exports.ImageToVideoOutput = zod_1.z.object({
    videos: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        url: zod_1.z.string(),
        duration: zod_1.z.number(),
        status: zod_1.z.enum(['success', 'failed']),
        metadata: zod_1.z.record(zod_1.z.any()).optional()
    }))
});
var ImageToVideoSkill = /** @class */ (function () {
    function ImageToVideoSkill(logger) {
        this.logger = logger;
    }
    ImageToVideoSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, videos, batchSize, _loop_1, this_1, i, successCount;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validInput = exports.ImageToVideoInput.parse(input);
                        this.logger.info('Converting images to videos', {
                            count: validInput.images.length,
                            duration: validInput.duration
                        });
                        videos = [];
                        batchSize = 2;
                        _loop_1 = function (i) {
                            var batch, batchResults;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        batch = validInput.images.slice(i, i + batchSize);
                                        this_1.logger.info("Processing video batch ".concat(Math.floor(i / batchSize) + 1), {
                                            batchStart: i,
                                            batchSize: batch.length
                                        });
                                        return [4 /*yield*/, Promise.all(batch.map(function (image, batchIdx) {
                                                return _this.convertSingleImage(image, validInput.prompts[i + batchIdx], validInput.duration);
                                            }))];
                                    case 1:
                                        batchResults = _b.sent();
                                        videos.push.apply(videos, batchResults);
                                        if (!(i + batchSize < validInput.images.length)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                                    case 2:
                                        _b.sent();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < validInput.images.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i += batchSize;
                        return [3 /*break*/, 1];
                    case 4:
                        successCount = videos.filter(function (v) { return v.status === 'success'; }).length;
                        this.logger.success('Image-to-video conversion complete', {
                            total: videos.length,
                            successful: successCount,
                            failed: videos.length - successCount
                        });
                        return [2 /*return*/, { videos: videos }];
                }
            });
        });
    };
    ImageToVideoSkill.prototype.convertSingleImage = function (image, motionPrompt, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        this.logger.info("Converting image ".concat(image.index + 1, " to video"));
                        result = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 6]);
                        return [4 /*yield*/, tools_1.modal.runWan22(image.url, motionPrompt)];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, tools_1.modal.pollJob(result.job_id)];
                    case 3:
                        result = _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        this.logger.warn('Wan2.2 failed, trying LTX-Video');
                        return [4 /*yield*/, this.callLTXVideo(image.url, motionPrompt, duration)];
                    case 5:
                        result = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        if (!result || !result.video_url) {
                            throw new Error('No video URL returned');
                        }
                        this.logger.success("Video ".concat(image.index + 1, " generated"));
                        return [2 /*return*/, {
                                index: image.index,
                                url: result.video_url,
                                duration: result.duration || duration,
                                status: 'success',
                                metadata: {
                                    model: result.model || 'wan2.2',
                                    generationTime: result.generation_time
                                }
                            }];
                    case 7:
                        error_2 = _a.sent();
                        this.logger.error("Failed to convert image ".concat(image.index + 1), {
                            error: error_2 instanceof Error ? error_2.message : String(error_2)
                        });
                        // Fallback: Use static image as video
                        return [2 /*return*/, {
                                index: image.index,
                                url: image.url,
                                duration: duration,
                                status: 'failed',
                                metadata: {
                                    error: error_2 instanceof Error ? error_2.message : String(error_2),
                                    fallback: 'static_image'
                                }
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ImageToVideoSkill.prototype.callLTXVideo = function (imageUrl, prompt, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var modalJobUrl, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modalJobUrl = process.env.MODAL_JOB_URL;
                        if (!modalJobUrl) {
                            throw new Error('Modal endpoint not configured');
                        }
                        return [4 /*yield*/, fetch("".concat(modalJobUrl, "/ltx-video"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    image_url: imageUrl,
                                    prompt: prompt,
                                    duration: duration,
                                    fps: 24
                                })
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("LTX-Video API error: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if (!data.job_id) return [3 /*break*/, 4];
                        return [4 /*yield*/, tools_1.modal.pollJob(data.job_id, 120, 5000)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/, data];
                }
            });
        });
    };
    return ImageToVideoSkill;
}());
exports.ImageToVideoSkill = ImageToVideoSkill;
exports.default = ImageToVideoSkill;
