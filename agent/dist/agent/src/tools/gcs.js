"use strict";
/**
 * Google Cloud Storage Tool
 * Handles file uploads and signed URL generation
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
exports.gcs = void 0;
var storage_1 = require("@google-cloud/storage");
var uuid_1 = require("uuid");
// Initialize GCS client
var storage;
var getStorage = function () {
    if (!storage) {
        storage = new storage_1.Storage(__assign({ projectId: process.env.GCS_PROJECT_ID }, (process.env.GCS_KEYFILE_PATH && {
            keyFilename: process.env.GCS_KEYFILE_PATH
        })));
    }
    return storage;
};
var getBucket = function () {
    var bucketName = process.env.GCS_BUCKET;
    if (!bucketName) {
        throw new Error('GCS_BUCKET environment variable is not set');
    }
    return getStorage().bucket(bucketName);
};
exports.gcs = {
    /**
     * Upload a file to GCS
     */
    uploadFile: function (fileContent, fileName, metadata) { return __awaiter(void 0, void 0, void 0, function () {
        var bucket, uniqueFileName, file, signedUrl, publicUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bucket = getBucket();
                    uniqueFileName = "".concat((0, uuid_1.v4)(), "-").concat(fileName);
                    file = bucket.file(uniqueFileName);
                    return [4 /*yield*/, file.save(fileContent, {
                            metadata: {
                                contentType: (metadata === null || metadata === void 0 ? void 0 : metadata.contentType) || 'application/octet-stream',
                                metadata: metadata
                            }
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, file.getSignedUrl({
                            action: 'read',
                            expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
                        })];
                case 2:
                    signedUrl = (_a.sent())[0];
                    publicUrl = "https://storage.googleapis.com/".concat(bucket.name, "/").concat(uniqueFileName);
                    return [2 /*return*/, {
                            url: publicUrl,
                            signedUrl: signedUrl,
                            path: uniqueFileName
                        }];
            }
        });
    }); },
    /**
     * Upload from URL to GCS
     */
    uploadFromURL: function (url, fileName) { return __awaiter(void 0, void 0, void 0, function () {
        var response, buffer, _a, _b, contentType, finalFileName;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _c.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch file from ".concat(url, ": ").concat(response.statusText));
                    }
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, response.arrayBuffer()];
                case 2:
                    buffer = _b.apply(_a, [_c.sent()]);
                    contentType = response.headers.get('content-type') || 'application/octet-stream';
                    finalFileName = fileName || url.split('/').pop() || 'file';
                    return [2 /*return*/, exports.gcs.uploadFile(buffer, finalFileName, { contentType: contentType })];
            }
        });
    }); },
    /**
     * Generate signed URL for existing file
     */
    getSignedUrl: function (filePath_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([filePath_1], args_1, true), void 0, function (filePath, expiresInDays) {
            var bucket, file, signedUrl;
            if (expiresInDays === void 0) { expiresInDays = 7; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bucket = getBucket();
                        file = bucket.file(filePath);
                        return [4 /*yield*/, file.getSignedUrl({
                                action: 'read',
                                expires: Date.now() + expiresInDays * 24 * 60 * 60 * 1000
                            })];
                    case 1:
                        signedUrl = (_a.sent())[0];
                        return [2 /*return*/, signedUrl];
                }
            });
        });
    },
    /**
     * List files with prefix
     */
    listFiles: function (prefix) { return __awaiter(void 0, void 0, void 0, function () {
        var bucket, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bucket = getBucket();
                    return [4 /*yield*/, bucket.getFiles({ prefix: prefix })];
                case 1:
                    files = (_a.sent())[0];
                    return [2 /*return*/, files.map(function (file) { return file.name; })];
            }
        });
    }); },
    /**
     * Delete file
     */
    deleteFile: function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
        var bucket;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bucket = getBucket();
                    return [4 /*yield*/, bucket.file(filePath).delete()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    /**
     * Download file
     */
    downloadFile: function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
        var bucket, file, contents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bucket = getBucket();
                    file = bucket.file(filePath);
                    return [4 /*yield*/, file.download()];
                case 1:
                    contents = (_a.sent())[0];
                    return [2 /*return*/, contents];
            }
        });
    }); },
    /**
     * Upload job results
     */
    uploadJobResults: function (jobId, results, metadata) { return __awaiter(void 0, void 0, void 0, function () {
        var uploads, _i, _a, _b, key, buffer, fileName, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    uploads = {};
                    _i = 0, _a = Object.entries(results);
                    _e.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    _b = _a[_i], key = _b[0], buffer = _b[1];
                    fileName = "jobs/".concat(jobId, "/").concat(key);
                    _c = uploads;
                    _d = key;
                    return [4 /*yield*/, exports.gcs.uploadFile(buffer, fileName, metadata)];
                case 2:
                    _c[_d] = _e.sent();
                    _e.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, uploads];
            }
        });
    }); }
};
exports.default = exports.gcs;
