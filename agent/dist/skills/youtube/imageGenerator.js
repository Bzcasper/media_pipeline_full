"use strict";
/**
 * Image Generator Skill
 * Generates images using Modal endpoints
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
exports.ImageGeneratorSkill = exports.ImageGeneratorOutput = exports.ImageGeneratorInput = void 0;
var zod_1 = require("zod");
var tools_1 = require("../../tools");
exports.ImageGeneratorInput = zod_1.z.object({
    prompts: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        prompt: zod_1.z.string(),
        negativePrompt: zod_1.z.string(),
        style: zod_1.z.string()
    })),
    aspectRatio: zod_1.z.enum(['16:9', '9:16', '1:1']),
    style: zod_1.z.string(),
    model: zod_1.z.enum(['flux-dev', 'flux-schnell', 'sdxl']).default('flux-dev')
});
exports.ImageGeneratorOutput = zod_1.z.object({
    images: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        url: zod_1.z.string(),
        prompt: zod_1.z.string(),
        status: zod_1.z.enum(['success', 'failed']),
        metadata: zod_1.z.record(zod_1.z.any()).optional()
    }))
});
var ImageGeneratorSkill = /** @class */ (function () {
    function ImageGeneratorSkill(logger) {
        this.logger = logger;
    }
    ImageGeneratorSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, images, batchSize, i, batch, batchResults, successCount;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validInput = exports.ImageGeneratorInput.parse(input);
                        this.logger.info('Generating images', {
                            count: validInput.prompts.length,
                            model: validInput.model
                        });
                        images = [];
                        batchSize = 3;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < validInput.prompts.length)) return [3 /*break*/, 5];
                        batch = validInput.prompts.slice(i, i + batchSize);
                        this.logger.info("Processing image batch ".concat(Math.floor(i / batchSize) + 1), {
                            batchStart: i,
                            batchSize: batch.length
                        });
                        return [4 /*yield*/, Promise.all(batch.map(function (promptData) { return _this.generateSingleImage(promptData, validInput); }))];
                    case 2:
                        batchResults = _a.sent();
                        images.push.apply(images, batchResults);
                        if (!(i + batchSize < validInput.prompts.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i += batchSize;
                        return [3 /*break*/, 1];
                    case 5:
                        successCount = images.filter(function (img) { return img.status === 'success'; }).length;
                        this.logger.success('Image generation complete', {
                            total: images.length,
                            successful: successCount,
                            failed: images.length - successCount
                        });
                        return [2 /*return*/, { images: images }];
                }
            });
        });
    };
    ImageGeneratorSkill.prototype.generateSingleImage = function (promptData, config) {
        return __awaiter(this, void 0, void 0, function () {
            var dimensions, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.info("Generating image ".concat(promptData.index + 1), {
                            prompt: promptData.prompt.slice(0, 100)
                        });
                        dimensions = this.getDimensions(config.aspectRatio);
                        return [4 /*yield*/, this.callModalImageGen({
                                prompt: promptData.prompt,
                                negative_prompt: promptData.negativePrompt,
                                width: dimensions.width,
                                height: dimensions.height,
                                model: config.model,
                                steps: 25,
                                guidance_scale: 7.5
                            })];
                    case 1:
                        result = _a.sent();
                        if (!result || !result.image_url) {
                            throw new Error('No image URL returned from Modal');
                        }
                        this.logger.success("Image ".concat(promptData.index + 1, " generated"));
                        return [2 /*return*/, {
                                index: promptData.index,
                                url: result.image_url,
                                prompt: promptData.prompt,
                                status: 'success',
                                metadata: {
                                    model: config.model,
                                    dimensions: dimensions,
                                    generationTime: result.generation_time
                                }
                            }];
                    case 2:
                        error_1 = _a.sent();
                        this.logger.error("Failed to generate image ".concat(promptData.index + 1), {
                            error: error_1 instanceof Error ? error_1.message : String(error_1)
                        });
                        return [2 /*return*/, {
                                index: promptData.index,
                                url: '',
                                prompt: promptData.prompt,
                                status: 'failed',
                                metadata: {
                                    error: error_1 instanceof Error ? error_1.message : String(error_1)
                                }
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ImageGeneratorSkill.prototype.callModalImageGen = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var modalJobUrl, response, data, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modalJobUrl = process.env.MODAL_JOB_URL;
                        if (!modalJobUrl) {
                            throw new Error('MODAL_JOB_URL not configured');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 8]);
                        return [4 /*yield*/, fetch("".concat(modalJobUrl, "/image-gen"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(params)
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Modal API error: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        if (!data.job_id) return [3 /*break*/, 5];
                        return [4 /*yield*/, tools_1.modal.pollJob(data.job_id, 60, 3000)];
                    case 4:
                        result = _a.sent();
                        return [2 /*return*/, result.output];
                    case 5: return [2 /*return*/, data];
                    case 6:
                        error_2 = _a.sent();
                        this.logger.warn('Modal endpoint failed, trying fallback');
                        return [4 /*yield*/, this.callReplicateFallback(params)];
                    case 7: 
                    // Fallback: Try Replicate or other service
                    return [2 /*return*/, _a.sent()];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ImageGeneratorSkill.prototype.callReplicateFallback = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var apiToken, response, prediction, result, pollResponse, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiToken = process.env.REPLICATE_API_TOKEN;
                        if (!apiToken) {
                            throw new Error('No image generation service available');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, fetch('https://api.replicate.com/v1/predictions', {
                                method: 'POST',
                                headers: {
                                    'Authorization': "Token ".concat(apiToken),
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    version: 'black-forest-labs/flux-schnell',
                                    input: {
                                        prompt: params.prompt,
                                        num_outputs: 1,
                                        aspect_ratio: '16:9',
                                        output_format: 'jpg',
                                        output_quality: 90
                                    }
                                })
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        prediction = _a.sent();
                        result = prediction;
                        _a.label = 4;
                    case 4:
                        if (!(result.status !== 'succeeded' && result.status !== 'failed')) return [3 /*break*/, 8];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, fetch("https://api.replicate.com/v1/predictions/".concat(prediction.id), {
                                headers: {
                                    'Authorization': "Token ".concat(apiToken),
                                }
                            })];
                    case 6:
                        pollResponse = _a.sent();
                        return [4 /*yield*/, pollResponse.json()];
                    case 7:
                        result = (_a.sent());
                        return [3 /*break*/, 4];
                    case 8:
                        if (result.status === 'failed' || !result.output || result.output.length === 0) {
                            throw new Error('Replicate generation failed');
                        }
                        return [2 /*return*/, {
                                image_url: result.output[0],
                                generation_time: 0
                            }];
                    case 9:
                        error_3 = _a.sent();
                        throw new Error("All image generation services failed: ".concat(error_3));
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ImageGeneratorSkill.prototype.getDimensions = function (aspectRatio) {
        var ratios = {
            '16:9': { width: 1920, height: 1080 },
            '9:16': { width: 1080, height: 1920 },
            '1:1': { width: 1024, height: 1024 }
        };
        return ratios[aspectRatio];
    };
    return ImageGeneratorSkill;
}());
exports.ImageGeneratorSkill = ImageGeneratorSkill;
exports.default = ImageGeneratorSkill;
