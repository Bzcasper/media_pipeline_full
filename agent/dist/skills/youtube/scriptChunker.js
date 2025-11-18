"use strict";
/**
 * Script Chunker Skill
 * Breaks scripts into scenes for visualization
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
exports.ScriptChunkerSkill = exports.ScriptChunkerOutput = exports.ScriptChunkerInput = void 0;
var zod_1 = require("zod");
exports.ScriptChunkerInput = zod_1.z.object({
    script: zod_1.z.string(),
    targetScenes: zod_1.z.number().default(6),
    maxWordsPerScene: zod_1.z.number().default(50)
});
exports.ScriptChunkerOutput = zod_1.z.object({
    scenes: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        text: zod_1.z.string(),
        wordCount: zod_1.z.number(),
        estimatedDuration: zod_1.z.number(),
        visualDescription: zod_1.z.string()
    })),
    totalScenes: zod_1.z.number(),
    totalDuration: zod_1.z.number()
});
var ScriptChunkerSkill = /** @class */ (function () {
    function ScriptChunkerSkill(logger) {
        this.logger = logger;
    }
    ScriptChunkerSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, rawChunks, chunks, scenes, totalDuration;
            var _this = this;
            return __generator(this, function (_a) {
                validInput = exports.ScriptChunkerInput.parse(input);
                this.logger.info('Chunking script into scenes', {
                    targetScenes: validInput.targetScenes
                });
                rawChunks = validInput.script.split(/\[SCENE\]/i).filter(function (s) { return s.trim(); });
                chunks = rawChunks.length > 1
                    ? rawChunks
                    : this.splitBySentences(validInput.script, validInput.targetScenes);
                scenes = chunks.map(function (chunk, index) {
                    var text = chunk.trim();
                    var wordCount = text.split(/\s+/).length;
                    var estimatedDuration = _this.estimateDuration(wordCount);
                    var visualDescription = _this.generateVisualDescription(text);
                    return {
                        index: index,
                        text: text,
                        wordCount: wordCount,
                        estimatedDuration: estimatedDuration,
                        visualDescription: visualDescription
                    };
                });
                totalDuration = scenes.reduce(function (sum, s) { return sum + s.estimatedDuration; }, 0);
                this.logger.success('Script chunked into scenes', {
                    sceneCount: scenes.length,
                    totalDuration: totalDuration
                });
                return [2 /*return*/, {
                        scenes: scenes,
                        totalScenes: scenes.length,
                        totalDuration: totalDuration
                    }];
            });
        });
    };
    ScriptChunkerSkill.prototype.splitBySentences = function (text, targetScenes) {
        var sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        var sentencesPerChunk = Math.ceil(sentences.length / targetScenes);
        var chunks = [];
        for (var i = 0; i < sentences.length; i += sentencesPerChunk) {
            chunks.push(sentences.slice(i, i + sentencesPerChunk).join(' '));
        }
        return chunks;
    };
    ScriptChunkerSkill.prototype.estimateDuration = function (wordCount) {
        // Average speaking rate: 150 words per minute
        // Add 2 seconds buffer for visuals
        return Math.ceil((wordCount / 150) * 60) + 2;
    };
    ScriptChunkerSkill.prototype.generateVisualDescription = function (text) {
        // Extract key visual elements from the text
        // In production, use LLM to generate detailed visual descriptions
        var keywords = text
            .toLowerCase()
            .match(/\b(show|see|look|watch|view|image|picture|scene|visual)\s+([^\s,]+(?:\s+[^\s,]+)?)/gi);
        if (keywords && keywords.length > 0) {
            return keywords[0];
        }
        // Extract first meaningful phrase
        var words = text.split(/\s+/).slice(0, 10).join(' ');
        return "Visual representation of: ".concat(words);
    };
    return ScriptChunkerSkill;
}());
exports.ScriptChunkerSkill = ScriptChunkerSkill;
exports.default = ScriptChunkerSkill;
