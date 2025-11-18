"use strict";
/**
 * Script Generator Skill
 * Generates video scripts from queries using LLM
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
exports.ScriptGeneratorSkill = exports.ScriptGeneratorOutput = exports.ScriptGeneratorInput = void 0;
var zod_1 = require("zod");
exports.ScriptGeneratorInput = zod_1.z.object({
    query: zod_1.z.string(),
    style: zod_1.z.enum(['documentary', 'narrative', 'educational', 'entertainment']),
    targetDuration: zod_1.z.number().default(60),
    tone: zod_1.z.enum(['formal', 'casual', 'enthusiastic', 'serious']).optional()
});
exports.ScriptGeneratorOutput = zod_1.z.object({
    script: zod_1.z.string(),
    title: zod_1.z.string(),
    hook: zod_1.z.string(),
    suggestedSceneCount: zod_1.z.number(),
    estimatedDuration: zod_1.z.number(),
    keywords: zod_1.z.array(zod_1.z.string())
});
var ScriptGeneratorSkill = /** @class */ (function () {
    function ScriptGeneratorSkill(logger) {
        this.logger = logger;
    }
    ScriptGeneratorSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, script, sceneCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validInput = exports.ScriptGeneratorInput.parse(input);
                        this.logger.info('Generating script', { query: validInput.query });
                        return [4 /*yield*/, this.generateScript(validInput)];
                    case 1:
                        script = _a.sent();
                        sceneCount = this.calculateSceneCount(validInput.targetDuration);
                        this.logger.success('Script generated', {
                            length: script.script.length,
                            sceneCount: sceneCount
                        });
                        return [2 /*return*/, script];
                }
            });
        });
    };
    ScriptGeneratorSkill.prototype.generateScript = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var apiKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
                        if (!(apiKey && process.env.ANTHROPIC_API_KEY)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.generateWithClaude(input)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(apiKey && process.env.OPENAI_API_KEY)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.generateWithGPT(input)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: 
                    // Fallback to template
                    return [2 /*return*/, this.generateTemplateScript(input)];
                }
            });
        });
    };
    ScriptGeneratorSkill.prototype.generateWithClaude = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, response, data, text, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prompt = "Generate a ".concat(input.targetDuration, "-second ").concat(input.style, " video script about: \"").concat(input.query, "\"\n\nRequirements:\n- Engaging hook in first 3 seconds\n- Clear narrative structure\n- Visual descriptions for each scene\n- Natural pacing for ").concat(input.targetDuration, " seconds\n- ").concat(input.tone || 'casual', " tone\n\nFormat:\nTITLE: [Catchy title]\nHOOK: [First 3 seconds]\nSCRIPT: [Full script with scene breaks marked as [SCENE]]");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch('https://api.anthropic.com/v1/messages', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-api-key': process.env.ANTHROPIC_API_KEY,
                                    'anthropic-version': '2023-06-01'
                                },
                                body: JSON.stringify({
                                    model: 'claude-3-5-sonnet-20241022',
                                    max_tokens: 2000,
                                    messages: [{
                                            role: 'user',
                                            content: prompt
                                        }]
                                })
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        text = data.content[0].text;
                        return [2 /*return*/, this.parseScriptResponse(text, input)];
                    case 4:
                        error_1 = _a.sent();
                        this.logger.warn('Claude API failed, using template', { error: error_1 });
                        return [2 /*return*/, this.generateTemplateScript(input)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ScriptGeneratorSkill.prototype.generateWithGPT = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, response, data, text, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prompt = "Generate a ".concat(input.targetDuration, "-second ").concat(input.style, " video script about: \"").concat(input.query, "\"");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch('https://api.openai.com/v1/chat/completions', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': "Bearer ".concat(process.env.OPENAI_API_KEY)
                                },
                                body: JSON.stringify({
                                    model: 'gpt-4o',
                                    messages: [{
                                            role: 'user',
                                            content: prompt
                                        }],
                                    max_tokens: 2000
                                })
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        text = data.choices[0].message.content;
                        return [2 /*return*/, this.parseScriptResponse(text, input)];
                    case 4:
                        error_2 = _a.sent();
                        this.logger.warn('GPT API failed, using template', { error: error_2 });
                        return [2 /*return*/, this.generateTemplateScript(input)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ScriptGeneratorSkill.prototype.parseScriptResponse = function (text, input) {
        var lines = text.split('\n');
        var title = input.query;
        var hook = '';
        var script = '';
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (line.startsWith('TITLE:')) {
                title = line.replace('TITLE:', '').trim();
            }
            else if (line.startsWith('HOOK:')) {
                hook = line.replace('HOOK:', '').trim();
            }
            else if (line.startsWith('SCRIPT:')) {
                script = lines.slice(lines.indexOf(line) + 1).join('\n').trim();
                break;
            }
        }
        if (!script)
            script = text;
        var sceneCount = (script.match(/\[SCENE\]/g) || []).length || this.calculateSceneCount(input.targetDuration);
        var keywords = this.extractKeywords(input.query);
        return {
            script: script,
            title: title,
            hook: hook || script.split('.')[0],
            suggestedSceneCount: sceneCount,
            estimatedDuration: input.targetDuration,
            keywords: keywords
        };
    };
    ScriptGeneratorSkill.prototype.generateTemplateScript = function (input) {
        var sceneCount = this.calculateSceneCount(input.targetDuration);
        var script = "\n[SCENE] Hook: Did you know that ".concat(input.query, "? Let's dive deep into this fascinating topic.\n\n[SCENE] Introduction: In this video, we'll explore everything you need to know about ").concat(input.query, ". By the end, you'll have a complete understanding.\n\n[SCENE] Main Point 1: First, let's look at the key aspects of ").concat(input.query, ". This is crucial to understand.\n\n[SCENE] Main Point 2: Next, we'll examine how ").concat(input.query, " impacts our daily lives and why it matters.\n\n[SCENE] Main Point 3: Here's an interesting fact that most people don't know about ").concat(input.query, ".\n\n[SCENE] Conclusion: So there you have it - everything you need to know about ").concat(input.query, ". Don't forget to like and subscribe!\n    ").trim();
        return {
            script: script,
            title: "Everything You Need to Know About ".concat(input.query),
            hook: "Did you know that ".concat(input.query, "?"),
            suggestedSceneCount: sceneCount,
            estimatedDuration: input.targetDuration,
            keywords: this.extractKeywords(input.query)
        };
    };
    ScriptGeneratorSkill.prototype.calculateSceneCount = function (duration) {
        // Roughly 8-10 seconds per scene
        return Math.max(4, Math.min(12, Math.ceil(duration / 8)));
    };
    ScriptGeneratorSkill.prototype.extractKeywords = function (query) {
        return query
            .toLowerCase()
            .split(/\s+/)
            .filter(function (word) { return word.length > 3; })
            .slice(0, 10);
    };
    return ScriptGeneratorSkill;
}());
exports.ScriptGeneratorSkill = ScriptGeneratorSkill;
exports.default = ScriptGeneratorSkill;
