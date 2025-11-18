"use strict";
/**
 * Pipeline Orchestrator
 * Coordinates all skills to process music files end-to-end
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
exports.PipelineOrchestrator = void 0;
var uuid_1 = require("uuid");
var utils_1 = require("./utils");
var skills_1 = require("./skills");
var PipelineOrchestrator = /** @class */ (function () {
    function PipelineOrchestrator(jobId) {
        var id = jobId || (0, uuid_1.v4)();
        this.jobState = new utils_1.JobStateManager(id);
        this.logger = new utils_1.Logger(id);
    }
    PipelineOrchestrator.prototype.getJobId = function () {
        return this.jobState.getJobId();
    };
    /**
     * Run the complete pipeline
     */
    PipelineOrchestrator.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var jobId, transcriptionSkill, transcriptionResult, metadataSkill, metadataResult, albumCoverSkill, albumCoverResult, videoGeneratorSkill, videoResult, gcsUploadSkill, gcsResult, weaviateIndexerSkill, weaviateResult, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        jobId = this.jobState.getJobId();
                        this.logger.info('Starting pipeline orchestration', { jobId: jobId, input: input });
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 27, , 30]);
                        // Update status
                        this.jobState.updateStatus('processing');
                        this.jobState.updateProgress(5);
                        return [4 /*yield*/, this.jobState.save()];
                    case 2:
                        _d.sent();
                        // Step 1: Transcription
                        this.logger.info('=== Step 1: Transcription ===');
                        this.jobState.addStep('transcription', 'in_progress');
                        this.jobState.updateStatus('transcribing');
                        return [4 /*yield*/, this.jobState.save()];
                    case 3:
                        _d.sent();
                        transcriptionSkill = new skills_1.TranscriptionSkill(this.logger);
                        return [4 /*yield*/, transcriptionSkill.runWithRetry({
                                audioFileId: input.audioFileId,
                                audioBuffer: input.audioBuffer,
                                audioUrl: input.audioUrl
                            })];
                    case 4:
                        transcriptionResult = _d.sent();
                        this.jobState.completeStep('transcription', transcriptionResult);
                        this.jobState.addOutput('transcription', transcriptionResult);
                        this.jobState.updateProgress(25);
                        return [4 /*yield*/, this.jobState.save()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 6:
                        _d.sent();
                        // Step 2: Metadata Extraction
                        this.logger.info('=== Step 2: Metadata Extraction ===');
                        this.jobState.addStep('metadata_extraction', 'in_progress');
                        this.jobState.updateStatus('generating_metadata');
                        return [4 /*yield*/, this.jobState.save()];
                    case 7:
                        _d.sent();
                        metadataSkill = new skills_1.MetadataSkill(this.logger);
                        return [4 /*yield*/, metadataSkill.run({
                                lyrics: transcriptionResult.text,
                                audioMetadata: {
                                    title: input.title,
                                    artist: input.artist,
                                    album: input.album
                                }
                            })];
                    case 8:
                        metadataResult = _d.sent();
                        this.jobState.completeStep('metadata_extraction', metadataResult);
                        this.jobState.addOutput('metadata', metadataResult);
                        this.jobState.updateProgress(40);
                        return [4 /*yield*/, this.jobState.save()];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 10:
                        _d.sent();
                        // Step 3: Album Cover Generation
                        this.logger.info('=== Step 3: Album Cover Generation ===');
                        this.jobState.addStep('album_cover_generation', 'in_progress');
                        this.jobState.updateStatus('generating_visuals');
                        return [4 /*yield*/, this.jobState.save()];
                    case 11:
                        _d.sent();
                        albumCoverSkill = new skills_1.AlbumCoverSkill(this.logger);
                        return [4 /*yield*/, albumCoverSkill.run({
                                title: metadataResult.title || input.title || 'Untitled',
                                artist: metadataResult.artist || input.artist,
                                genre: metadataResult.genre,
                                mood: metadataResult.mood,
                                lyrics: transcriptionResult.text
                            })];
                    case 12:
                        albumCoverResult = _d.sent();
                        this.jobState.completeStep('album_cover_generation', albumCoverResult);
                        this.jobState.addOutput('albumCover', albumCoverResult);
                        this.jobState.updateProgress(60);
                        return [4 /*yield*/, this.jobState.save()];
                    case 13:
                        _d.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 14:
                        _d.sent();
                        // Step 4: Video Generation
                        this.logger.info('=== Step 4: Video Generation ===');
                        this.jobState.addStep('video_generation', 'in_progress');
                        this.jobState.updateStatus('creating_video');
                        return [4 /*yield*/, this.jobState.save()];
                    case 15:
                        _d.sent();
                        videoGeneratorSkill = new skills_1.VideoGeneratorSkill(this.logger);
                        return [4 /*yield*/, videoGeneratorSkill.runWithRetry({
                                audioFileId: input.audioFileId,
                                coverImageFileId: albumCoverResult.imageFileId,
                                title: metadataResult.title,
                                artist: metadataResult.artist
                            })];
                    case 16:
                        videoResult = _d.sent();
                        this.jobState.completeStep('video_generation', videoResult);
                        this.jobState.addOutput('video', videoResult);
                        this.jobState.updateProgress(75);
                        return [4 /*yield*/, this.jobState.save()];
                    case 17:
                        _d.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 18:
                        _d.sent();
                        // Step 5: Upload to GCS
                        this.logger.info('=== Step 5: GCS Upload ===');
                        this.jobState.addStep('gcs_upload', 'in_progress');
                        this.jobState.updateStatus('uploading_results');
                        return [4 /*yield*/, this.jobState.save()];
                    case 19:
                        _d.sent();
                        gcsUploadSkill = new skills_1.GCSUploadSkill(this.logger);
                        return [4 /*yield*/, gcsUploadSkill.run({
                                jobId: jobId,
                                files: __assign({ cover: {
                                        fileId: albumCoverResult.imageFileId,
                                        name: 'cover.png'
                                    }, video: {
                                        fileId: videoResult.videoFileId,
                                        name: 'video.mp4'
                                    } }, (input.audioFileId && {
                                    audio: {
                                        fileId: input.audioFileId,
                                        name: 'audio.mp3'
                                    }
                                }))
                            })];
                    case 20:
                        gcsResult = _d.sent();
                        this.jobState.completeStep('gcs_upload', gcsResult);
                        this.jobState.addOutput('gcsUrls', gcsResult.uploads);
                        this.jobState.updateProgress(90);
                        return [4 /*yield*/, this.jobState.save()];
                    case 21:
                        _d.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 22:
                        _d.sent();
                        // Step 6: Index in Weaviate
                        this.logger.info('=== Step 6: Weaviate Indexing ===');
                        this.jobState.addStep('weaviate_indexing', 'in_progress');
                        this.jobState.updateStatus('indexing');
                        return [4 /*yield*/, this.jobState.save()];
                    case 23:
                        _d.sent();
                        weaviateIndexerSkill = new skills_1.WeaviateIndexerSkill(this.logger);
                        return [4 /*yield*/, weaviateIndexerSkill.run({
                                id: jobId,
                                title: metadataResult.title || input.title || 'Untitled',
                                artist: metadataResult.artist || input.artist,
                                album: metadataResult.album || input.album,
                                genre: metadataResult.genre,
                                mood: metadataResult.mood,
                                lyrics: transcriptionResult.text,
                                transcription: transcriptionResult.text,
                                bpm: metadataResult.bpm,
                                key: metadataResult.key,
                                audioUrl: (_a = gcsResult.uploads.audio) === null || _a === void 0 ? void 0 : _a.signedUrl,
                                coverUrl: (_b = gcsResult.uploads.cover) === null || _b === void 0 ? void 0 : _b.signedUrl,
                                videoUrl: (_c = gcsResult.uploads.video) === null || _c === void 0 ? void 0 : _c.signedUrl,
                                metadata: __assign(__assign({}, metadataResult), { transcriptionMethod: transcriptionResult.method })
                            })];
                    case 24:
                        weaviateResult = _d.sent();
                        this.jobState.completeStep('weaviate_indexing', weaviateResult);
                        this.jobState.addOutput('indexed', weaviateResult);
                        this.jobState.updateProgress(100);
                        this.jobState.updateStatus('completed');
                        return [4 /*yield*/, this.jobState.save()];
                    case 25:
                        _d.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 26:
                        _d.sent();
                        this.logger.success('Pipeline completed successfully!', {
                            jobId: jobId,
                            videoUrl: gcsResult.uploads.video.signedUrl
                        });
                        return [2 /*return*/, {
                                jobId: jobId,
                                transcription: transcriptionResult.text,
                                metadata: metadataResult,
                                coverImageUrl: gcsResult.uploads.cover.signedUrl,
                                videoUrl: gcsResult.uploads.video.signedUrl,
                                gcsUrls: Object.fromEntries(Object.entries(gcsResult.uploads).map(function (_a) {
                                    var k = _a[0], v = _a[1];
                                    return [k, v.signedUrl];
                                })),
                                success: true
                            }];
                    case 27:
                        error_1 = _d.sent();
                        this.logger.error('Pipeline failed', {
                            error: error_1 instanceof Error ? error_1.message : String(error_1),
                            stack: error_1 instanceof Error ? error_1.stack : undefined
                        });
                        this.jobState.updateStatus('failed');
                        this.jobState.addError(error_1 instanceof Error ? error_1.message : String(error_1));
                        return [4 /*yield*/, this.jobState.save()];
                    case 28:
                        _d.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 29:
                        _d.sent();
                        throw error_1;
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get current job state
     */
    PipelineOrchestrator.prototype.getState = function () {
        return this.jobState.getState();
    };
    /**
     * Get job logs
     */
    PipelineOrchestrator.prototype.getLogs = function () {
        return this.logger.getLogs();
    };
    return PipelineOrchestrator;
}());
exports.PipelineOrchestrator = PipelineOrchestrator;
exports.default = PipelineOrchestrator;
