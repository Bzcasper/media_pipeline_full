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
var sdk_1 = require("../../../sdk");
// Create singleton instance with retries and error handling
var client = new sdk_1.MediaServerClient({
    baseURL: process.env.MEDIA_SERVER_URL || "https://2281a5a294754c19f8c9e2df0be013fb-bobby-casper-4235.aiagentsaz.com",
    apiKey: process.env.MEDIA_SERVER_API_KEY,
});
// Retry utility for API calls
function withRetry(fn_1) {
    return __awaiter(this, arguments, void 0, function (fn, maxRetries) {
        var _loop_1, i, state_1;
        if (maxRetries === void 0) { maxRetries = 3; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_1 = function (i) {
                        var _b, error_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 4]);
                                    _b = {};
                                    return [4 /*yield*/, fn()];
                                case 1: return [2 /*return*/, (_b.value = _c.sent(), _b)];
                                case 2:
                                    error_1 = _c.sent();
                                    if (i === maxRetries - 1)
                                        throw error_1;
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000 * (i + 1)); })];
                                case 3:
                                    _c.sent(); // Exponential backoff
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < maxRetries)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: throw new Error("Retry failed");
            }
        });
    });
}
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
            if (mediaType === void 0) { mediaType = "tmp"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withRetry(function () { return client.uploadFile(file, mediaType); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    /**
     * Transcribe audio using Riva ASR
     */
    transcribeAudio: function (audioFile, language) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withRetry(function () { return client.transcribeAudio(audioFile, language); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Generate image
     */
    generateImage: function (prompt, style, options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withRetry(function () { return client.generateImage(prompt, style, options); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Convert image to video
     */
    imageToVideo: function (imageFile, options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withRetry(function () { return client.imageToVideo(imageFile, options); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Run GPU chain
     */
    runGpuChain: function (chainName, inputs) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withRetry(function () { return client.runGpuChain(chainName, inputs); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
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
                // TODO: Implement URL upload via SDK
                throw new Error("URL upload not implemented yet");
            });
        });
    },
    /**
     * Download file
     */
    downloadFile: function (fileId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Implement download via SDK
            throw new Error("Download not implemented yet");
        });
    }); },
    /**
     * Match video duration to audio
     */
    matchDuration: function (videoId, audioId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Implement duration matching
            throw new Error("Duration matching not implemented yet");
        });
    }); },
    // Expose the full client for advanced use cases
    client: client,
};
exports.default = exports.mediaServer;
