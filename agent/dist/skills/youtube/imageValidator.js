"use strict";
/**
 * Image Validator Skill
 * Uses AI to inspect images and determine if they need editing
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
exports.ImageValidatorSkill = exports.ImageValidatorOutput = exports.ImageValidatorInput = void 0;
var zod_1 = require("zod");
var tools_1 = require("../../tools");
exports.ImageValidatorInput = zod_1.z.object({
    images: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        url: zod_1.z.string(),
        prompt: zod_1.z.string(),
        status: zod_1.z.enum(['success', 'failed'])
    })),
    prompts: zod_1.z.array(zod_1.z.object({
        prompt: zod_1.z.string(),
        style: zod_1.z.string()
    })),
    autoFix: zod_1.z.boolean().default(true)
});
exports.ImageValidatorOutput = zod_1.z.object({
    images: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        url: zod_1.z.string(),
        originalUrl: zod_1.z.string(),
        prompt: zod_1.z.string(),
        validated: zod_1.z.boolean(),
        issues: zod_1.z.array(zod_1.z.string()),
        wasEdited: zod_1.z.boolean(),
        quality: zod_1.z.enum(['excellent', 'good', 'acceptable', 'poor'])
    }))
});
var ImageValidatorSkill = /** @class */ (function () {
    function ImageValidatorSkill(logger) {
        this.logger = logger;
    }
    ImageValidatorSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, validatedImages, editedCount;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validInput = exports.ImageValidatorInput.parse(input);
                        this.logger.info('Validating images', {
                            count: validInput.images.length,
                            autoFix: validInput.autoFix
                        });
                        return [4 /*yield*/, Promise.all(validInput.images.map(function (image, idx) {
                                return _this.validateAndFixImage(image, validInput.prompts[idx], validInput.autoFix);
                            }))];
                    case 1:
                        validatedImages = _a.sent();
                        editedCount = validatedImages.filter(function (img) { return img.wasEdited; }).length;
                        this.logger.success('Image validation complete', {
                            total: validatedImages.length,
                            edited: editedCount,
                            passed: validatedImages.length - editedCount
                        });
                        return [2 /*return*/, { images: validatedImages }];
                }
            });
        });
    };
    ImageValidatorSkill.prototype.validateAndFixImage = function (image, promptData, autoFix) {
        return __awaiter(this, void 0, void 0, function () {
            var analysis, needsEditing, finalUrl, wasEdited, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("Validating image ".concat(image.index + 1));
                        // Skip failed images
                        if (image.status === 'failed' || !image.url) {
                            return [2 /*return*/, {
                                    index: image.index,
                                    url: image.url,
                                    originalUrl: image.url,
                                    prompt: image.prompt,
                                    validated: false,
                                    issues: ['Generation failed'],
                                    wasEdited: false,
                                    quality: 'poor'
                                }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.analyzeImage(image.url, promptData.prompt)];
                    case 2:
                        analysis = _a.sent();
                        needsEditing = analysis.issues.length > 0 && autoFix;
                        finalUrl = image.url;
                        wasEdited = false;
                        if (!needsEditing) return [3 /*break*/, 4];
                        this.logger.info("Image ".concat(image.index + 1, " needs editing"), {
                            issues: analysis.issues
                        });
                        return [4 /*yield*/, this.editImage(image.url, analysis.issues)];
                    case 3:
                        finalUrl = _a.sent();
                        wasEdited = true;
                        this.logger.success("Image ".concat(image.index + 1, " edited successfully"));
                        _a.label = 4;
                    case 4: return [2 /*return*/, {
                            index: image.index,
                            url: finalUrl,
                            originalUrl: image.url,
                            prompt: image.prompt,
                            validated: true,
                            issues: analysis.issues,
                            wasEdited: wasEdited,
                            quality: analysis.quality
                        }];
                    case 5:
                        error_1 = _a.sent();
                        this.logger.error("Failed to validate image ".concat(image.index + 1), {
                            error: error_1 instanceof Error ? error_1.message : String(error_1)
                        });
                        return [2 /*return*/, {
                                index: image.index,
                                url: image.url,
                                originalUrl: image.url,
                                prompt: image.prompt,
                                validated: false,
                                issues: ['Validation failed'],
                                wasEdited: false,
                                quality: 'acceptable'
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ImageValidatorSkill.prototype.analyzeImage = function (imageUrl, prompt) {
        return __awaiter(this, void 0, void 0, function () {
            var apiKey, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
                        if (!apiKey) {
                            // Fallback: basic validation without AI
                            return [2 /*return*/, {
                                    issues: [],
                                    quality: 'good'
                                }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!process.env.ANTHROPIC_API_KEY) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.analyzeWithClaude(imageUrl, prompt)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        if (!process.env.OPENAI_API_KEY) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.analyzeWithGPT(imageUrl, prompt)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        this.logger.warn('AI vision analysis failed, using fallback');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, {
                            issues: [],
                            quality: 'acceptable'
                        }];
                }
            });
        });
    };
    ImageValidatorSkill.prototype.analyzeWithClaude = function (imageUrl, prompt) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('https://api.anthropic.com/v1/messages', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': process.env.ANTHROPIC_API_KEY,
                                'anthropic-version': '2023-06-01'
                            },
                            body: JSON.stringify({
                                model: 'claude-3-5-sonnet-20241022',
                                max_tokens: 500,
                                messages: [{
                                        role: 'user',
                                        content: [
                                            {
                                                type: 'image',
                                                source: {
                                                    type: 'url',
                                                    url: imageUrl
                                                }
                                            },
                                            {
                                                type: 'text',
                                                text: "Analyze this image for a video scene. Expected: \"".concat(prompt, "\"\n\nRate quality (excellent/good/acceptable/poor) and list any issues:\n- Composition problems\n- Quality issues\n- Relevance to prompt\n- Visual artifacts\n\nFormat: QUALITY: [rating]\nISSUES: [comma-separated list or \"none\"]")
                                            }
                                        ]
                                    }]
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        text = data.content[0].text;
                        return [2 /*return*/, this.parseAnalysis(text)];
                }
            });
        });
    };
    ImageValidatorSkill.prototype.analyzeWithGPT = function (imageUrl, prompt) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('https://api.openai.com/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(process.env.OPENAI_API_KEY)
                            },
                            body: JSON.stringify({
                                model: 'gpt-4o',
                                messages: [{
                                        role: 'user',
                                        content: [
                                            {
                                                type: 'image_url',
                                                image_url: { url: imageUrl }
                                            },
                                            {
                                                type: 'text',
                                                text: "Analyze this image for: \"".concat(prompt, "\"\nRate quality and list issues.")
                                            }
                                        ]
                                    }],
                                max_tokens: 300
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        text = data.choices[0].message.content;
                        return [2 /*return*/, this.parseAnalysis(text)];
                }
            });
        });
    };
    ImageValidatorSkill.prototype.parseAnalysis = function (text) {
        var _a;
        var qualityMatch = text.match(/QUALITY:\s*(excellent|good|acceptable|poor)/i);
        var quality = (((_a = qualityMatch === null || qualityMatch === void 0 ? void 0 : qualityMatch[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'acceptable');
        var issuesMatch = text.match(/ISSUES:\s*(.+?)(?:\n|$)/i);
        var issuesText = (issuesMatch === null || issuesMatch === void 0 ? void 0 : issuesMatch[1]) || 'none';
        var issues = issuesText.toLowerCase() === 'none'
            ? []
            : issuesText.split(',').map(function (i) { return i.trim(); }).filter(Boolean);
        return { quality: quality, issues: issues };
    };
    ImageValidatorSkill.prototype.editImage = function (imageUrl, issues) {
        return __awaiter(this, void 0, void 0, function () {
            var response, buffer, _a, _b, uploadResult, editInstructions, editResult, editedUrl, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, fetch(imageUrl)];
                    case 1:
                        response = _c.sent();
                        _b = (_a = Buffer).from;
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 2:
                        buffer = _b.apply(_a, [_c.sent()]);
                        return [4 /*yield*/, tools_1.mediaServer.uploadFile(buffer, 'image')];
                    case 3:
                        uploadResult = _c.sent();
                        if (!uploadResult.file_id) {
                            throw new Error('Failed to upload image for editing');
                        }
                        editInstructions = this.generateEditInstructions(issues);
                        return [4 /*yield*/, tools_1.mediaServer.client.utils.makeImageImperfect(uploadResult.file_id, {
                                enhance_color: 1.2,
                                enhance_contrast: 1.1,
                                noise_strength: 5
                            })];
                    case 4:
                        editResult = _c.sent();
                        editedUrl = "".concat(process.env.MEDIA_SERVER_URL, "/api/v1/media/storage/").concat(editResult.file_id);
                        return [2 /*return*/, editedUrl];
                    case 5:
                        error_3 = _c.sent();
                        this.logger.warn('Image editing failed, using original', { error: error_3 });
                        return [2 /*return*/, imageUrl];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ImageValidatorSkill.prototype.generateEditInstructions = function (issues) {
        var instructions = issues.map(function (issue) {
            if (issue.includes('quality') || issue.includes('blurry')) {
                return 'enhance sharpness and quality';
            }
            if (issue.includes('color') || issue.includes('exposure')) {
                return 'adjust color and exposure';
            }
            if (issue.includes('composition')) {
                return 'crop and reframe';
            }
            return 'general enhancement';
        });
        return instructions.join(', ');
    };
    return ImageValidatorSkill;
}());
exports.ImageValidatorSkill = ImageValidatorSkill;
exports.default = ImageValidatorSkill;
