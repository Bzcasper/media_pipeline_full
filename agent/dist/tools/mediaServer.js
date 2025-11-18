"use strict";
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
exports.mediaServer = void 0;
exports.mediaServer = {
    /**
     * Upload a file to the media server
     */
    uploadFile: function (file_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([file_1], args_1, true), void 0, function (file, mediaType) {
            var exec, promisify, execAsync, fs, path, os, tempDir, tempFile, url, stdout, result, error_1;
            if (mediaType === void 0) { mediaType = "tmp"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exec = require('child_process').exec;
                        promisify = require('util').promisify;
                        execAsync = promisify(exec);
                        fs = require('fs/promises');
                        path = require('path');
                        os = require('os');
                        tempDir = os.tmpdir();
                        tempFile = path.join(tempDir, "upload_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2)));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 8]);
                        // Write file to temp location
                        return [4 /*yield*/, fs.writeFile(tempFile, file)];
                    case 2:
                        // Write file to temp location
                        _a.sent();
                        url = process.env.MEDIA_SERVER_URL || "https://2281a5a294754c19f8c9e2df0be013fb-bobby-casper-4235.aiagentsaz.com";
                        return [4 /*yield*/, execAsync("curl -s -X POST \"".concat(url, "/api/v1/media/storage\" -F \"file=@").concat(tempFile, "\" -F \"media_type=").concat(mediaType, "\""))];
                    case 3:
                        stdout = (_a.sent()).stdout;
                        result = JSON.parse(stdout.trim());
                        return [2 /*return*/, result];
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, fs.unlink(tempFile)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7: return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Upload from URL
     */
    uploadFromURL: function (url_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([url_1], args_1, true), void 0, function (url, mediaType) {
            if (mediaType === void 0) { mediaType = "tmp"; }
            return __generator(this, function (_a) {
                // TODO: Implement URL upload
                return [2 /*return*/, { file_id: "mock-file-id", url: url }];
            });
        });
    },
    /**
     * Transcribe audio using Riva ASR
     */
    transcribeAudio: function (audioFile, language) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Implement Riva transcription
            return [2 /*return*/, {
                    text: "Sample transcribed text",
                    segments: [],
                    language: language || "en",
                    method: "riva"
                }];
        });
    }); },
    /**
     * Generate image
     */
    generateImage: function (prompt, style, options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Implement image generation
            return [2 /*return*/, { imageFileId: "mock-image-id", imageUrl: "https://example.com/image.png" }];
        });
    }); },
    /**
     * Convert image to video
     */
    imageToVideo: function (imageFile, options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Implement image-to-video
            return [2 /*return*/, { videoFileId: "mock-video-id", videoUrl: "https://example.com/video.mp4" }];
        });
    }); },
    /**
     * Download file
     */
    downloadFile: function (fileId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Implement download
            return [2 /*return*/, new Response("mock file content")];
        });
    }); },
    /**
     * Match video duration to audio
     */
    matchDuration: function (videoId, audioId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Implement duration matching
            return [2 /*return*/, { file_id: "mock-matched-video-id", url: "https://example.com/matched.mp4" }];
        });
    }); },
    // Mock client for compatibility
    client: {
        utils: {
            renderHTML: function (options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ file_id: "mock-html-id", url: "https://example.com/image.png" })];
            }); }); },
        },
        video: {
            generateCaptionedVideo: function (options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ file_id: "mock-captioned-id", url: "https://example.com/captioned.mp4" })];
            }); }); },
        }
    },
};
exports.default = exports.mediaServer;
