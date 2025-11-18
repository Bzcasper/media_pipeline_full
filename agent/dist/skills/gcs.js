"use strict";
/**
 * GCS Upload Skill
 * Uploads assets to Google Cloud Storage and generates signed URLs
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
exports.GCSWorker = exports.GCSUploadOutput = exports.GCSUploadInput = void 0;
var zod_1 = require("zod");
var storage_1 = require("@google-cloud/storage");
exports.GCSUploadInput = zod_1.z.object({
    files: zod_1.z.array(zod_1.z.object({
        localPath: zod_1.z.string().optional(),
        url: zod_1.z.string().optional(),
        content: zod_1.z.any().optional(),
        filename: zod_1.z.string(),
        contentType: zod_1.z.string(),
    })),
    bucketName: zod_1.z.string().optional(),
});
exports.GCSUploadOutput = zod_1.z.object({
    uploads: zod_1.z.record(zod_1.z.object({
        url: zod_1.z.string(),
        signedUrl: zod_1.z.string(),
        path: zod_1.z.string(),
    })),
    bucketName: zod_1.z.string(),
});
var GCSWorker = /** @class */ (function () {
    function GCSWorker(logger, bucketName) {
        this.logger = logger;
        this.bucketName = bucketName || process.env.GCS_BUCKET || "media-pipeline-assets";
        // Initialize GCS client
        this.storage = new storage_1.Storage({
            projectId: process.env.GCS_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID,
            keyFilename: process.env.GCP_SERVICE_ACCOUNT_KEY,
        });
    }
    GCSWorker.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, bucket, uploads, _i, _a, file, fileName, fileRef, response, buffer, _b, _c, buffer, signedUrl, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        validInput = exports.GCSUploadInput.parse(input);
                        this.logger.info("Starting GCS upload", { fileCount: validInput.files.length });
                        bucket = this.storage.bucket(this.bucketName);
                        uploads = {};
                        _i = 0, _a = validInput.files;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 15];
                        file = _a[_i];
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 13, , 14]);
                        fileName = "".concat(Date.now(), "_").concat(file.filename);
                        fileRef = bucket.file(fileName);
                        if (!file.localPath) return [3 /*break*/, 4];
                        return [4 /*yield*/, bucket.upload(file.localPath, {
                                destination: fileName,
                                metadata: { contentType: file.contentType },
                            })];
                    case 3:
                        _d.sent();
                        return [3 /*break*/, 11];
                    case 4:
                        if (!file.url) return [3 /*break*/, 8];
                        return [4 /*yield*/, fetch(file.url)];
                    case 5:
                        response = _d.sent();
                        _c = (_b = Buffer).from;
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 6:
                        buffer = _c.apply(_b, [_d.sent()]);
                        return [4 /*yield*/, fileRef.save(buffer, { contentType: file.contentType })];
                    case 7:
                        _d.sent();
                        return [3 /*break*/, 11];
                    case 8:
                        if (!file.content) return [3 /*break*/, 10];
                        buffer = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content);
                        return [4 /*yield*/, fileRef.save(buffer, { contentType: file.contentType })];
                    case 9:
                        _d.sent();
                        return [3 /*break*/, 11];
                    case 10: throw new Error("No file source provided");
                    case 11: return [4 /*yield*/, fileRef.getSignedUrl({
                            action: 'read',
                            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
                        })];
                    case 12:
                        signedUrl = (_d.sent())[0];
                        uploads[file.filename] = {
                            url: "https://storage.googleapis.com/".concat(this.bucketName, "/").concat(fileName),
                            signedUrl: signedUrl,
                            path: fileName,
                        };
                        this.logger.success("Uploaded ".concat(file.filename), { path: fileName });
                        return [3 /*break*/, 14];
                    case 13:
                        error_1 = _d.sent();
                        this.logger.error("Failed to upload ".concat(file.filename), {
                            error: error_1 instanceof Error ? error_1.message : String(error_1)
                        });
                        throw error_1;
                    case 14:
                        _i++;
                        return [3 /*break*/, 1];
                    case 15:
                        this.logger.success("GCS upload completed", { uploadedCount: Object.keys(uploads).length });
                        return [2 /*return*/, {
                                uploads: uploads,
                                bucketName: this.bucketName,
                            }];
                }
            });
        });
    };
    GCSWorker.prototype.runWithRetry = function (input_1) {
        return __awaiter(this, arguments, void 0, function (input, maxAttempts) {
            var lastError, _loop_1, this_1, attempt, state_1;
            if (maxAttempts === void 0) { maxAttempts = 3; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastError = null;
                        _loop_1 = function (attempt) {
                            var _b, error_2, delay_1;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 2, , 5]);
                                        this_1.logger.info("GCS upload attempt ".concat(attempt, "/").concat(maxAttempts));
                                        _b = {};
                                        return [4 /*yield*/, this_1.run(input)];
                                    case 1: return [2 /*return*/, (_b.value = _c.sent(), _b)];
                                    case 2:
                                        error_2 = _c.sent();
                                        lastError = error_2 instanceof Error ? error_2 : new Error(String(error_2));
                                        this_1.logger.warn("GCS upload attempt ".concat(attempt, " failed"), {
                                            error: lastError.message,
                                        });
                                        if (!(attempt < maxAttempts)) return [3 /*break*/, 4];
                                        delay_1 = Math.min(2000 * Math.pow(2, attempt - 1), 30000);
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
                    case 4: throw lastError || new Error("GCS upload failed after all retries");
                }
            });
        });
    };
    return GCSWorker;
}());
exports.GCSWorker = GCSWorker;
exports.default = GCSWorker;
