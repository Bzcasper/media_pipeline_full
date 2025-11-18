"use strict";
/**
 * Video Assembler Skill
 * Combines video clips into a complete storyline with voiceover and music
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
exports.VideoAssemblerSkill = exports.VideoAssemblerOutput = exports.VideoAssemblerInput = void 0;
var zod_1 = require("zod");
var tools_1 = require("../../tools");
exports.VideoAssemblerInput = zod_1.z.object({
    videos: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        url: zod_1.z.string(),
        duration: zod_1.z.number()
    })),
    script: zod_1.z.string(),
    chunks: zod_1.z.array(zod_1.z.object({
        text: zod_1.z.string()
    })),
    voiceOver: zod_1.z.boolean().default(false),
    backgroundMusic: zod_1.z.boolean().default(false),
    transitions: zod_1.z.boolean().default(true)
});
exports.VideoAssemblerOutput = zod_1.z.object({
    videoUrl: zod_1.z.string(),
    videoFileId: zod_1.z.string(),
    duration: zod_1.z.number(),
    gcsUrl: zod_1.z.string().optional()
});
var VideoAssemblerSkill = /** @class */ (function () {
    function VideoAssemblerSkill(logger) {
        this.logger = logger;
    }
    VideoAssemblerSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, videoIds, voiceOverId, mergedVideoId, gcsUrl, totalDuration, videoUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validInput = exports.VideoAssemblerInput.parse(input);
                        this.logger.info('Assembling final video', {
                            clipCount: validInput.videos.length,
                            voiceOver: validInput.voiceOver,
                            backgroundMusic: validInput.backgroundMusic
                        });
                        return [4 /*yield*/, this.uploadVideoClips(validInput.videos)];
                    case 1:
                        videoIds = _a.sent();
                        if (!validInput.voiceOver) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.generateVoiceOver(validInput.script)];
                    case 2:
                        voiceOverId = _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.mergeVideos(videoIds, voiceOverId, validInput.backgroundMusic, validInput.transitions)];
                    case 4:
                        mergedVideoId = _a.sent();
                        return [4 /*yield*/, this.uploadToGCS(mergedVideoId)];
                    case 5:
                        gcsUrl = _a.sent();
                        totalDuration = validInput.videos.reduce(function (sum, v) { return sum + v.duration; }, 0);
                        videoUrl = "".concat(process.env.MEDIA_SERVER_URL, "/api/v1/media/storage/").concat(mergedVideoId);
                        this.logger.success('Final video assembled', {
                            videoUrl: videoUrl,
                            duration: totalDuration
                        });
                        return [2 /*return*/, {
                                videoUrl: videoUrl,
                                videoFileId: mergedVideoId,
                                duration: totalDuration,
                                gcsUrl: gcsUrl
                            }];
                }
            });
        });
    };
    VideoAssemblerSkill.prototype.uploadVideoClips = function (videos) {
        return __awaiter(this, void 0, void 0, function () {
            var videoIds, _i, videos_1, video, response, buffer, _a, _b, uploadResult, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.logger.info('Uploading video clips to media server');
                        videoIds = [];
                        _i = 0, videos_1 = videos;
                        _c.label = 1;
                    case 1:
                        if (!(_i < videos_1.length)) return [3 /*break*/, 8];
                        video = videos_1[_i];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, fetch(video.url)];
                    case 3:
                        response = _c.sent();
                        _b = (_a = Buffer).from;
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 4:
                        buffer = _b.apply(_a, [_c.sent()]);
                        return [4 /*yield*/, tools_1.mediaServer.uploadFile(buffer, 'video')];
                    case 5:
                        uploadResult = _c.sent();
                        if (!uploadResult.file_id) {
                            throw new Error("Failed to upload video ".concat(video.index));
                        }
                        videoIds.push(uploadResult.file_id);
                        this.logger.info("Uploaded video ".concat(video.index + 1, "/").concat(videos.length));
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _c.sent();
                        this.logger.error("Failed to upload video ".concat(video.index), { error: error_1 });
                        throw error_1;
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/, videoIds];
                }
            });
        });
    };
    VideoAssemblerSkill.prototype.generateVoiceOver = function (script) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info('Generating voiceover');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, tools_1.mediaServer.generateTTS(script, 'af_heart', 1.0)];
                    case 2:
                        result = _a.sent();
                        if (!result.file_id) {
                            throw new Error('Failed to generate voiceover');
                        }
                        this.logger.success('Voiceover generated');
                        return [2 /*return*/, result.file_id];
                    case 3:
                        error_2 = _a.sent();
                        this.logger.warn('Voiceover generation failed', { error: error_2 });
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    VideoAssemblerSkill.prototype.mergeVideos = function (videoIds, voiceOverId, backgroundMusic, transitions) {
        return __awaiter(this, void 0, void 0, function () {
            var mergeResult, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info('Merging video clips');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, tools_1.mediaServer.client.video.merge({
                                video_ids: videoIds.join(','),
                                background_music_id: voiceOverId,
                                normalize: true,
                                background_music_volume: 0.8
                            })];
                    case 2:
                        mergeResult = _a.sent();
                        if (!mergeResult.file_id) {
                            throw new Error('Failed to merge videos');
                        }
                        this.logger.success('Videos merged successfully');
                        return [2 /*return*/, mergeResult.file_id];
                    case 3:
                        error_3 = _a.sent();
                        this.logger.error('Video merging failed', { error: error_3 });
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    VideoAssemblerSkill.prototype.uploadToGCS = function (videoFileId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, buffer, _a, _b, gcsResult, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.logger.info('Uploading final video to GCS');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, tools_1.mediaServer.downloadFile(videoFileId)];
                    case 2:
                        response = _c.sent();
                        _b = (_a = Buffer).from;
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 3:
                        buffer = _b.apply(_a, [_c.sent()]);
                        return [4 /*yield*/, tools_1.gcs.uploadFile(buffer, "youtube-video-".concat(Date.now(), ".mp4"), {
                                contentType: 'video/mp4'
                            })];
                    case 4:
                        gcsResult = _c.sent();
                        this.logger.success('Video uploaded to GCS', { url: gcsResult.signedUrl });
                        return [2 /*return*/, gcsResult.signedUrl];
                    case 5:
                        error_4 = _c.sent();
                        this.logger.warn('GCS upload failed', { error: error_4 });
                        return [2 /*return*/, ''];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return VideoAssemblerSkill;
}());
exports.VideoAssemblerSkill = VideoAssemblerSkill;
exports.default = VideoAssemblerSkill;
