"use strict";
/**
 * Pipeline Orchestrator
 * Coordinates all skills to process music files end-to-end
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
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jobId = this.jobState.getJobId();
                        this.logger.info('Starting pipeline orchestration', { jobId: jobId, input: input });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 27, , 30]);
                        // Update status
                        this.jobState.updateStatus('processing');
                        this.jobState.updateProgress(5);
                        return [4 /*yield*/, this.jobState.save()];
                    case 2:
                        _a.sent();
                        // Step 1: Transcription
                        this.logger.info('=== Step 1: Transcription ===');
                        this.jobState.addStep('transcription', 'in_progress');
                        this.jobState.updateStatus('transcribing');
                        return [4 /*yield*/, this.jobState.save()];
                    case 3:
                        _a.sent();
                        transcriptionSkill = new skills_1.TranscriptionSkill(this.logger);
                        return [4 /*yield*/, transcriptionSkill.runWithRetry({
                                audioFileId: input.audioFileId,
                                audioBuffer: input.audioBuffer,
                                audioUrl: input.audioUrl
                            })];
                    case 4:
                        transcriptionResult = _a.sent();
                        this.jobState.completeStep('transcription', transcriptionResult);
                        this.jobState.addOutput('transcription', transcriptionResult);
                        this.jobState.updateProgress(25);
                        return [4 /*yield*/, this.jobState.save()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 6:
                        _a.sent();
                        // Step 2: Metadata Extraction
                        this.logger.info('=== Step 2: Metadata Extraction ===');
                        this.jobState.addStep('metadata_extraction', 'in_progress');
                        this.jobState.updateStatus('generating_metadata');
                        return [4 /*yield*/, this.jobState.save()];
                    case 7:
                        _a.sent();
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
                        metadataResult = _a.sent();
                        this.jobState.completeStep('metadata_extraction', metadataResult);
                        this.jobState.addOutput('metadata', metadataResult);
                        this.jobState.updateProgress(40);
                        return [4 /*yield*/, this.jobState.save()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 10:
                        _a.sent();
                        // Step 3: Album Cover Generation
                        this.logger.info('=== Step 3: Album Cover Generation ===');
                        this.jobState.addStep('album_cover_generation', 'in_progress');
                        this.jobState.updateStatus('generating_visuals');
                        return [4 /*yield*/, this.jobState.save()];
                    case 11:
                        _a.sent();
                        albumCoverSkill = new skills_1.AlbumCoverSkill(this.logger);
                        return [4 /*yield*/, albumCoverSkill.run({
                                title: metadataResult.title || input.title || 'Untitled',
                                artist: metadataResult.artist || input.artist,
                                genre: metadataResult.genre,
                                mood: metadataResult.mood,
                                lyrics: transcriptionResult.text
                            })];
                    case 12:
                        albumCoverResult = _a.sent();
                        this.jobState.completeStep('album_cover_generation', albumCoverResult);
                        this.jobState.addOutput('albumCover', albumCoverResult);
                        this.jobState.updateProgress(60);
                        return [4 /*yield*/, this.jobState.save()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 14:
                        _a.sent();
                        // Step 4: Video Generation
                        this.logger.info('=== Step 4: Video Generation ===');
                        this.jobState.addStep('video_generation', 'in_progress');
                        this.jobState.updateStatus('creating_video');
                        return [4 /*yield*/, this.jobState.save()];
                    case 15:
                        _a.sent();
                        videoGeneratorSkill = new skills_1.VideoGeneratorSkill(this.logger);
                        return [4 /*yield*/, videoGeneratorSkill.runWithRetry({
                                audioFileId: input.audioFileId,
                                coverImageFileId: albumCoverResult.imageFileId,
                                title: metadataResult.title,
                                artist: metadataResult.artist
                            })];
                    case 16:
                        videoResult = _a.sent();
                        this.jobState.completeStep('video_generation', videoResult);
                        this.jobState.addOutput('video', videoResult);
                        this.jobState.updateProgress(75);
                        return [4 /*yield*/, this.jobState.save()];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 18:
                        _a.sent();
                        // Step 5: Upload to GCS
                        this.logger.info('=== Step 5: GCS Upload ===');
                        this.jobState.addStep('gcs_upload', 'in_progress');
                        this.jobState.updateStatus('uploading_results');
                        return [4 /*yield*/, this.jobState.save()];
                    case 19:
                        _a.sent();
                        gcsUploadSkill = new skills_1.GCSWorker(this.logger);
                        return [4 /*yield*/, gcsUploadSkill.run({
                                files: __spreadArray([
                                    {
                                        url: albumCoverResult.imageUrl,
                                        filename: 'cover.png',
                                        contentType: 'image/png'
                                    },
                                    {
                                        url: videoResult.videoUrl,
                                        filename: 'video.mp4',
                                        contentType: 'video/mp4'
                                    }
                                ], (input.audioFileId ? [{
                                        url: "".concat(process.env.MEDIA_SERVER_URL, "/api/v1/media/storage/").concat(input.audioFileId),
                                        filename: 'audio.mp3',
                                        contentType: 'audio/mpeg'
                                    }] : []), true)
                            })];
                    case 20:
                        gcsResult = _a.sent();
                        this.jobState.completeStep('gcs_upload', gcsResult);
                        this.jobState.addOutput('gcsUrls', gcsResult.uploads);
                        this.jobState.updateProgress(90);
                        return [4 /*yield*/, this.jobState.save()];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 22:
                        _a.sent();
                        // Step 6: Index in Weaviate
                        this.logger.info('=== Step 6: Weaviate Indexing ===');
                        this.jobState.addStep('weaviate_indexing', 'in_progress');
                        this.jobState.updateStatus('indexing');
                        return [4 /*yield*/, this.jobState.save()];
                    case 23:
                        _a.sent();
                        weaviateIndexerSkill = new skills_1.WeaviateIndexerSkill(this.logger);
                        return [4 /*yield*/, weaviateIndexerSkill.run({
                                jobId: jobId,
                                metadata: {
                                    title: metadataResult.title || input.title || 'Untitled',
                                    artist: metadataResult.artist || input.artist,
                                    album: metadataResult.album || input.album,
                                    genre: metadataResult.genre,
                                    mood: metadataResult.mood,
                                    bpm: metadataResult.bpm,
                                    key: metadataResult.key,
                                },
                                assets: gcsResult.uploads,
                                transcription: transcriptionResult,
                            })];
                    case 24:
                        weaviateResult = _a.sent();
                        this.jobState.completeStep('weaviate_indexing', weaviateResult);
                        this.jobState.addOutput('indexed', weaviateResult);
                        this.jobState.updateProgress(100);
                        this.jobState.updateStatus('completed');
                        return [4 /*yield*/, this.jobState.save()];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 26:
                        _a.sent();
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
                        error_1 = _a.sent();
                        this.logger.error('Pipeline failed', {
                            error: error_1 instanceof Error ? error_1.message : String(error_1),
                            stack: error_1 instanceof Error ? error_1.stack : undefined
                        });
                        this.jobState.updateStatus('failed');
                        this.jobState.addError(error_1 instanceof Error ? error_1.message : String(error_1));
                        return [4 /*yield*/, this.jobState.save()];
                    case 28:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 29:
                        _a.sent();
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
