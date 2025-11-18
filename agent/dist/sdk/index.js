"use strict";
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
exports.MediaServerClient = exports.V1Service = exports.UtilsService = exports.MediaService = exports.DefaultService = exports.ApiService = exports.Body_upload_file_api_v1_media_storage_post = exports.OpenAPI = exports.CancelError = exports.CancelablePromise = exports.ApiError = void 0;
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
var ApiError_1 = require("./core/ApiError");
Object.defineProperty(exports, "ApiError", { enumerable: true, get: function () { return ApiError_1.ApiError; } });
var CancelablePromise_1 = require("./core/CancelablePromise");
Object.defineProperty(exports, "CancelablePromise", { enumerable: true, get: function () { return CancelablePromise_1.CancelablePromise; } });
Object.defineProperty(exports, "CancelError", { enumerable: true, get: function () { return CancelablePromise_1.CancelError; } });
var OpenAPI_1 = require("./core/OpenAPI");
Object.defineProperty(exports, "OpenAPI", { enumerable: true, get: function () { return OpenAPI_1.OpenAPI; } });
var Body_upload_file_api_v1_media_storage_post_1 = require("./models/Body_upload_file_api_v1_media_storage_post");
Object.defineProperty(exports, "Body_upload_file_api_v1_media_storage_post", { enumerable: true, get: function () { return Body_upload_file_api_v1_media_storage_post_1.Body_upload_file_api_v1_media_storage_post; } });
var ApiService_1 = require("./services/ApiService");
Object.defineProperty(exports, "ApiService", { enumerable: true, get: function () { return ApiService_1.ApiService; } });
var DefaultService_1 = require("./services/DefaultService");
Object.defineProperty(exports, "DefaultService", { enumerable: true, get: function () { return DefaultService_1.DefaultService; } });
var MediaService_1 = require("./services/MediaService");
Object.defineProperty(exports, "MediaService", { enumerable: true, get: function () { return MediaService_1.MediaService; } });
var UtilsService_1 = require("./services/UtilsService");
Object.defineProperty(exports, "UtilsService", { enumerable: true, get: function () { return UtilsService_1.UtilsService; } });
var V1Service_1 = require("./services/V1Service");
Object.defineProperty(exports, "V1Service", { enumerable: true, get: function () { return V1Service_1.V1Service; } });
// Friendly Media Server Client with wrappers
var services_1 = require("./services");
var OpenAPI_2 = require("./core/OpenAPI");
var MediaServerClient = /** @class */ (function () {
    function MediaServerClient(config) {
        OpenAPI_2.OpenAPI.BASE = config.baseURL;
        if (config.apiKey) {
            OpenAPI_2.OpenAPI.HEADERS = { 'Authorization': "Bearer ".concat(config.apiKey) };
        }
    }
    // Image generation wrapper
    MediaServerClient.prototype.generateImage = function (prompt, style, options) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, services_1.MediaService.generateImage(__assign({ prompt: prompt, style: style }, options))];
                    case 1: 
                    // Use MediaService for image generation (assuming endpoint exists)
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error("Image generation failed: ".concat(error_1));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Audio transcription wrapper (Riva or GPU chain)
    MediaServerClient.prototype.transcribeAudio = function (audioFile, language) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, services_1.MediaService.transcribeAudio({ audio_file: audioFile, language: language })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error("Transcription failed: ".concat(error_2));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Image-to-video wrapper
    MediaServerClient.prototype.imageToVideo = function (imageFile, options) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, services_1.MediaService.imageToVideo(__assign({ image: imageFile }, options))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        throw new Error("Image-to-video failed: ".concat(error_3));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GPU chains wrapper (predefined pipelines)
    MediaServerClient.prototype.runGpuChain = function (chainName, inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, services_1.MediaService.runGpuChain({ chain: chainName, inputs: inputs })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        throw new Error("GPU chain failed: ".concat(error_4));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Utility: Upload file
    MediaServerClient.prototype.uploadFile = function (file, mediaType) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, services_1.MediaService.uploadFile({ file: file, media_type: mediaType })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        throw new Error("Upload failed: ".concat(error_5));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return MediaServerClient;
}());
exports.MediaServerClient = MediaServerClient;
