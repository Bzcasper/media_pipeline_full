"use strict";
/**
 * YouTube Video Generation Orchestrator
 * Creates complete storyline videos from queries
 *
 * Pipeline:
 * 1. Query → Script Generation (LLM)
 * 2. Script → Chunking (sentence/scene based)
 * 3. Chunks → Image Prompts (LLM)
 * 4. Image Prompts → Image Generation (Modal)
 * 5. Images → AI Validation/Editing
 * 6. Images → Video Generation (Image-to-Video)
 * 7. Videos → Final Assembly (storyline)
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
exports.YouTubeVideoOrchestrator = void 0;
var uuid_1 = require("uuid");
var utils_1 = require("./utils");
var youtube_1 = require("./skills/youtube");
var YouTubeVideoOrchestrator = /** @class */ (function () {
    function YouTubeVideoOrchestrator(jobId) {
        var id = jobId || (0, uuid_1.v4)();
        this.jobState = new utils_1.JobStateManager(id);
        this.logger = new utils_1.Logger(id);
    }
    /**
     * Run the complete YouTube video generation pipeline
     */
    YouTubeVideoOrchestrator.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var jobId, scriptGenerator, scriptResult, scriptChunker, chunks, imagePromptGenerator, imagePrompts_1, imageGenerator, images, imageValidator, validatedImages_1, imageToVideo, videos_1, videoAssembler, finalVideo, metadata, scenes, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jobId = this.jobState.getJobId();
                        this.logger.info('Starting YouTube video generation pipeline', { jobId: jobId, input: input });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 34, , 37]);
                        this.jobState.updateStatus('processing');
                        this.jobState.updateProgress(5);
                        return [4 /*yield*/, this.jobState.save()];
                    case 2:
                        _a.sent();
                        // Step 1: Generate Script
                        this.logger.info('=== Step 1: Script Generation ===');
                        this.jobState.addStep('script_generation', 'in_progress');
                        return [4 /*yield*/, this.jobState.save()];
                    case 3:
                        _a.sent();
                        scriptGenerator = new youtube_1.ScriptGeneratorSkill(this.logger);
                        return [4 /*yield*/, scriptGenerator.run({
                                query: input.query,
                                style: input.videoStyle || 'educational',
                                targetDuration: input.duration || 60
                            })];
                    case 4:
                        scriptResult = _a.sent();
                        this.jobState.completeStep('script_generation', scriptResult);
                        this.jobState.addOutput('script', scriptResult);
                        this.jobState.updateProgress(15);
                        return [4 /*yield*/, this.jobState.save()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 6:
                        _a.sent();
                        // Step 2: Chunk Script into Scenes
                        this.logger.info('=== Step 2: Script Chunking ===');
                        this.jobState.addStep('script_chunking', 'in_progress');
                        return [4 /*yield*/, this.jobState.save()];
                    case 7:
                        _a.sent();
                        scriptChunker = new youtube_1.ScriptChunkerSkill(this.logger);
                        return [4 /*yield*/, scriptChunker.run({
                                script: scriptResult.script,
                                targetScenes: scriptResult.suggestedSceneCount || 6,
                                maxWordsPerScene: 50
                            })];
                    case 8:
                        chunks = _a.sent();
                        this.jobState.completeStep('script_chunking', chunks);
                        this.jobState.addOutput('chunks', chunks);
                        this.jobState.updateProgress(25);
                        return [4 /*yield*/, this.jobState.save()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 10:
                        _a.sent();
                        // Step 3: Generate Image Prompts
                        this.logger.info('=== Step 3: Image Prompt Generation ===');
                        this.jobState.addStep('image_prompt_generation', 'in_progress');
                        return [4 /*yield*/, this.jobState.save()];
                    case 11:
                        _a.sent();
                        imagePromptGenerator = new youtube_1.ImagePromptGeneratorSkill(this.logger);
                        return [4 /*yield*/, imagePromptGenerator.run({
                                scenes: chunks.scenes,
                                style: input.videoStyle || 'educational',
                                aspectRatio: input.aspectRatio || '16:9'
                            })];
                    case 12:
                        imagePrompts_1 = _a.sent();
                        this.jobState.completeStep('image_prompt_generation', imagePrompts_1);
                        this.jobState.addOutput('imagePrompts', imagePrompts_1);
                        this.jobState.updateProgress(35);
                        return [4 /*yield*/, this.jobState.save()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 14:
                        _a.sent();
                        // Step 4: Generate Images
                        this.logger.info('=== Step 4: Image Generation ===');
                        this.jobState.addStep('image_generation', 'in_progress');
                        return [4 /*yield*/, this.jobState.save()];
                    case 15:
                        _a.sent();
                        imageGenerator = new youtube_1.ImageGeneratorSkill(this.logger);
                        return [4 /*yield*/, imageGenerator.run({
                                prompts: imagePrompts_1.prompts,
                                aspectRatio: input.aspectRatio || '16:9',
                                style: input.videoStyle || 'educational'
                            })];
                    case 16:
                        images = _a.sent();
                        this.jobState.completeStep('image_generation', images);
                        this.jobState.addOutput('images', images);
                        this.jobState.updateProgress(50);
                        return [4 /*yield*/, this.jobState.save()];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 18:
                        _a.sent();
                        // Step 5: Validate and Edit Images
                        this.logger.info('=== Step 5: Image Validation ===');
                        this.jobState.addStep('image_validation', 'in_progress');
                        return [4 /*yield*/, this.jobState.save()];
                    case 19:
                        _a.sent();
                        imageValidator = new youtube_1.ImageValidatorSkill(this.logger);
                        return [4 /*yield*/, imageValidator.run({
                                images: images.images,
                                prompts: imagePrompts_1.prompts,
                                autoFix: true
                            })];
                    case 20:
                        validatedImages_1 = _a.sent();
                        this.jobState.completeStep('image_validation', validatedImages_1);
                        this.jobState.addOutput('validatedImages', validatedImages_1);
                        this.jobState.updateProgress(65);
                        return [4 /*yield*/, this.jobState.save()];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 22:
                        _a.sent();
                        // Step 6: Generate Videos from Images
                        this.logger.info('=== Step 6: Image-to-Video Generation ===');
                        this.jobState.addStep('video_generation', 'in_progress');
                        return [4 /*yield*/, this.jobState.save()];
                    case 23:
                        _a.sent();
                        imageToVideo = new youtube_1.ImageToVideoSkill(this.logger);
                        return [4 /*yield*/, imageToVideo.run({
                                images: validatedImages_1.images,
                                prompts: imagePrompts_1.prompts.map(function (p) { return p.videoMotion; }),
                                duration: 5 // seconds per clip
                            })];
                    case 24:
                        videos_1 = _a.sent();
                        this.jobState.completeStep('video_generation', videos_1);
                        this.jobState.addOutput('videos', videos_1);
                        this.jobState.updateProgress(80);
                        return [4 /*yield*/, this.jobState.save()];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 26:
                        _a.sent();
                        // Step 7: Assemble Final Video
                        this.logger.info('=== Step 7: Video Assembly ===');
                        this.jobState.addStep('video_assembly', 'in_progress');
                        return [4 /*yield*/, this.jobState.save()];
                    case 27:
                        _a.sent();
                        videoAssembler = new youtube_1.VideoAssemblerSkill(this.logger);
                        return [4 /*yield*/, videoAssembler.run({
                                videos: videos_1.videos,
                                script: scriptResult.script,
                                chunks: chunks.scenes,
                                voiceOver: input.voiceOver,
                                backgroundMusic: input.backgroundMusic,
                                transitions: true
                            })];
                    case 28:
                        finalVideo = _a.sent();
                        this.jobState.completeStep('video_assembly', finalVideo);
                        this.jobState.addOutput('finalVideo', finalVideo);
                        this.jobState.updateProgress(95);
                        return [4 /*yield*/, this.jobState.save()];
                    case 29:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 30:
                        _a.sent();
                        // Step 8: Generate Metadata
                        this.logger.info('=== Step 8: Metadata Generation ===');
                        return [4 /*yield*/, this.generateMetadata(scriptResult.script, input.query)];
                    case 31:
                        metadata = _a.sent();
                        this.jobState.updateProgress(100);
                        this.jobState.updateStatus('completed');
                        return [4 /*yield*/, this.jobState.save()];
                    case 32:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 33:
                        _a.sent();
                        this.logger.success('YouTube video generation completed!', {
                            jobId: jobId,
                            finalVideoUrl: finalVideo.videoUrl
                        });
                        scenes = chunks.scenes.map(function (scene, idx) { return ({
                            text: scene.text,
                            imagePrompt: imagePrompts_1.prompts[idx].prompt,
                            imageUrl: validatedImages_1.images[idx].url,
                            videoUrl: videos_1.videos[idx].url,
                            duration: videos_1.videos[idx].duration
                        }); });
                        return [2 /*return*/, {
                                jobId: jobId,
                                script: scriptResult.script,
                                scenes: scenes,
                                finalVideoUrl: finalVideo.videoUrl,
                                metadata: metadata,
                                success: true
                            }];
                    case 34:
                        error_1 = _a.sent();
                        this.logger.error('YouTube video generation failed', {
                            error: error_1 instanceof Error ? error_1.message : String(error_1),
                            stack: error_1 instanceof Error ? error_1.stack : undefined
                        });
                        this.jobState.updateStatus('failed');
                        this.jobState.addError(error_1 instanceof Error ? error_1.message : String(error_1));
                        return [4 /*yield*/, this.jobState.save()];
                    case 35:
                        _a.sent();
                        return [4 /*yield*/, this.logger.saveLogs()];
                    case 36:
                        _a.sent();
                        throw error_1;
                    case 37: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate video metadata for YouTube
     */
    YouTubeVideoOrchestrator.prototype.generateMetadata = function (script, query) {
        return __awaiter(this, void 0, void 0, function () {
            var words, title, description, tags;
            return __generator(this, function (_a) {
                words = script.split(' ');
                title = query.slice(0, 100);
                description = words.slice(0, 50).join(' ') + '...';
                tags = query.split(' ').filter(function (w) { return w.length > 3; }).slice(0, 10);
                return [2 /*return*/, {
                        title: title,
                        description: description,
                        tags: tags,
                        thumbnail: '' // Will be first scene image
                    }];
            });
        });
    };
    /**
     * Get current job state
     */
    YouTubeVideoOrchestrator.prototype.getState = function () {
        return this.jobState.getState();
    };
    /**
     * Get job logs
     */
    YouTubeVideoOrchestrator.prototype.getLogs = function () {
        return this.logger.getLogs();
    };
    return YouTubeVideoOrchestrator;
}());
exports.YouTubeVideoOrchestrator = YouTubeVideoOrchestrator;
exports.default = YouTubeVideoOrchestrator;
