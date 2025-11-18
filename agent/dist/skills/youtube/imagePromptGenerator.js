"use strict";
/**
 * Image Prompt Generator Skill
 * Creates detailed image generation prompts from script scenes
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
exports.ImagePromptGeneratorSkill = exports.ImagePromptGeneratorOutput = exports.ImagePromptGeneratorInput = void 0;
var zod_1 = require("zod");
exports.ImagePromptGeneratorInput = zod_1.z.object({
    scenes: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        text: zod_1.z.string(),
        visualDescription: zod_1.z.string()
    })),
    style: zod_1.z.enum(['documentary', 'narrative', 'educational', 'entertainment']),
    aspectRatio: zod_1.z.enum(['16:9', '9:16', '1:1']).default('16:9')
});
exports.ImagePromptGeneratorOutput = zod_1.z.object({
    prompts: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        prompt: zod_1.z.string(),
        negativePrompt: zod_1.z.string(),
        videoMotion: zod_1.z.string(),
        style: zod_1.z.string()
    }))
});
var ImagePromptGeneratorSkill = /** @class */ (function () {
    function ImagePromptGeneratorSkill(logger) {
        this.logger = logger;
    }
    ImagePromptGeneratorSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, prompts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validInput = exports.ImagePromptGeneratorInput.parse(input);
                        this.logger.info('Generating image prompts', {
                            sceneCount: validInput.scenes.length
                        });
                        return [4 /*yield*/, Promise.all(validInput.scenes.map(function (scene) { return _this.generatePromptForScene(scene, validInput); }))];
                    case 1:
                        prompts = _a.sent();
                        this.logger.success('Image prompts generated', {
                            count: prompts.length
                        });
                        return [2 /*return*/, { prompts: prompts }];
                }
            });
        });
    };
    ImagePromptGeneratorSkill.prototype.generatePromptForScene = function (scene, config) {
        return __awaiter(this, void 0, void 0, function () {
            var basePrompt, styleModifiers, qualityTags, prompt, negativePrompt, videoMotion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createDetailedPrompt(scene.text, scene.visualDescription, config.style)];
                    case 1:
                        basePrompt = _a.sent();
                        styleModifiers = this.getStyleModifiers(config.style);
                        qualityTags = this.getQualityTags(config.aspectRatio);
                        prompt = "".concat(basePrompt, ", ").concat(styleModifiers, ", ").concat(qualityTags);
                        negativePrompt = this.getNegativePrompt();
                        videoMotion = this.generateVideoMotion(scene.text);
                        return [2 /*return*/, {
                                index: scene.index,
                                prompt: prompt,
                                negativePrompt: negativePrompt,
                                videoMotion: videoMotion,
                                style: config.style
                            }];
                }
            });
        });
    };
    ImagePromptGeneratorSkill.prototype.createDetailedPrompt = function (text, visualDesc, style) {
        return __awaiter(this, void 0, void 0, function () {
            var subjects, actions, setting, prompt;
            return __generator(this, function (_a) {
                subjects = this.extractSubjects(text);
                actions = this.extractActions(text);
                setting = this.extractSetting(text);
                prompt = '';
                if (setting) {
                    prompt += "".concat(setting, ", ");
                }
                if (subjects.length > 0) {
                    prompt += "featuring ".concat(subjects.join(', '), ", ");
                }
                if (actions.length > 0) {
                    prompt += "".concat(actions.join(', '), ", ");
                }
                prompt += visualDesc;
                return [2 /*return*/, prompt.trim()];
            });
        });
    };
    ImagePromptGeneratorSkill.prototype.extractSubjects = function (text) {
        // Simple subject extraction (in production, use NLP)
        var commonSubjects = ['person', 'people', 'man', 'woman', 'child', 'animal', 'object', 'building', 'landscape'];
        return commonSubjects.filter(function (s) { return text.toLowerCase().includes(s); });
    };
    ImagePromptGeneratorSkill.prototype.extractActions = function (text) {
        // Simple action extraction
        var commonActions = ['walking', 'running', 'talking', 'working', 'studying', 'playing', 'showing', 'demonstrating'];
        return commonActions.filter(function (a) { return text.toLowerCase().includes(a); });
    };
    ImagePromptGeneratorSkill.prototype.extractSetting = function (text) {
        var settings = {
            'outdoor': ['outside', 'park', 'street', 'nature', 'outdoor'],
            'indoor': ['inside', 'room', 'office', 'home', 'indoor'],
            'urban': ['city', 'urban', 'building', 'downtown'],
            'natural': ['forest', 'mountain', 'beach', 'nature', 'landscape']
        };
        for (var _i = 0, _a = Object.entries(settings); _i < _a.length; _i++) {
            var _b = _a[_i], setting = _b[0], keywords = _b[1];
            if (keywords.some(function (k) { return text.toLowerCase().includes(k); })) {
                return setting;
            }
        }
        return 'cinematic scene';
    };
    ImagePromptGeneratorSkill.prototype.getStyleModifiers = function (style) {
        var modifiers = {
            documentary: 'photorealistic, documentary style, natural lighting, authentic',
            narrative: 'cinematic, dramatic lighting, storytelling composition',
            educational: 'clean, clear, well-lit, professional, informative',
            entertainment: 'vibrant, energetic, engaging, dynamic composition'
        };
        return modifiers[style] || modifiers.educational;
    };
    ImagePromptGeneratorSkill.prototype.getQualityTags = function (aspectRatio) {
        var baseTags = 'high quality, detailed, professional, 4k, sharp focus';
        var ratioTags = {
            '16:9': 'widescreen composition',
            '9:16': 'vertical composition, mobile-optimized',
            '1:1': 'square composition, balanced framing'
        };
        return "".concat(baseTags, ", ").concat(ratioTags[aspectRatio]);
    };
    ImagePromptGeneratorSkill.prototype.getNegativePrompt = function () {
        return 'blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, text, signature, amateur';
    };
    ImagePromptGeneratorSkill.prototype.generateVideoMotion = function (text) {
        // Determine camera motion based on scene context
        var motionKeywords = {
            'zoom in': ['close', 'detail', 'focus'],
            'zoom out': ['reveal', 'wide', 'panorama'],
            'pan right': ['across', 'move', 'sweep'],
            'tilt up': ['rise', 'ascend', 'upward'],
            'static': ['still', 'stable', 'steady']
        };
        for (var _i = 0, _a = Object.entries(motionKeywords); _i < _a.length; _i++) {
            var _b = _a[_i], motion = _b[0], keywords = _b[1];
            if (keywords.some(function (k) { return text.toLowerCase().includes(k); })) {
                return "".concat(motion, ", smooth camera movement, professional cinematography");
            }
        }
        return 'subtle camera movement, dynamic composition, cinematic motion';
    };
    return ImagePromptGeneratorSkill;
}());
exports.ImagePromptGeneratorSkill = ImagePromptGeneratorSkill;
exports.default = ImagePromptGeneratorSkill;
