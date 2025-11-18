"use strict";
/**
 * Album Cover Generation Skill
 * Generates album cover art from metadata and lyrics
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
exports.AlbumCoverSkill = exports.AlbumCoverOutput = exports.AlbumCoverInput = void 0;
var zod_1 = require("zod");
var tools_1 = require("../tools");
exports.AlbumCoverInput = zod_1.z.object({
    title: zod_1.z.string(),
    artist: zod_1.z.string().optional(),
    genre: zod_1.z.string().optional(),
    mood: zod_1.z.string().optional(),
    lyrics: zod_1.z.string().optional(),
    style: zod_1.z.string().optional()
});
exports.AlbumCoverOutput = zod_1.z.object({
    imageFileId: zod_1.z.string(),
    imageUrl: zod_1.z.string().optional(),
    prompt: zod_1.z.string()
});
var AlbumCoverSkill = /** @class */ (function () {
    function AlbumCoverSkill(logger) {
        this.logger = logger;
    }
    AlbumCoverSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, prompt, htmlContent, renderResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validInput = exports.AlbumCoverInput.parse(input);
                        this.logger.info('Generating album cover', { title: validInput.title });
                        prompt = this.generatePrompt(validInput);
                        this.logger.info('Generated image prompt', { prompt: prompt });
                        htmlContent = this.generateHTMLCover(validInput);
                        return [4 /*yield*/, tools_1.mediaServer.client.utils.renderHTML({
                                html_content: htmlContent,
                                width: 1080,
                                height: 1080
                            })];
                    case 1:
                        renderResult = _a.sent();
                        if (!renderResult.file_id) {
                            throw new Error('Failed to generate album cover');
                        }
                        this.logger.success('Album cover generated', {
                            fileId: renderResult.file_id
                        });
                        return [2 /*return*/, {
                                imageFileId: renderResult.file_id,
                                imageUrl: renderResult.url,
                                prompt: prompt
                            }];
                }
            });
        });
    };
    AlbumCoverSkill.prototype.generatePrompt = function (input) {
        var parts = [];
        parts.push('Album cover art');
        if (input.genre) {
            parts.push("in ".concat(input.genre, " style"));
        }
        if (input.mood) {
            parts.push("with ".concat(input.mood, " mood"));
        }
        parts.push("titled \"".concat(input.title, "\""));
        if (input.artist) {
            parts.push("by ".concat(input.artist));
        }
        if (input.style) {
            parts.push(input.style);
        }
        else {
            parts.push('professional, high quality, artistic');
        }
        return parts.join(', ');
    };
    AlbumCoverSkill.prototype.generateHTMLCover = function (input) {
        var bgColors = {
            'rock': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'pop': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'hip-hop': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'electronic': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'country': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
        var bg = bgColors[input.genre || ''] || bgColors.default;
        return "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <style>\n          * { margin: 0; padding: 0; box-sizing: border-box; }\n          body {\n            width: 1080px;\n            height: 1080px;\n            background: ".concat(bg, ";\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            justify-content: center;\n            font-family: 'Arial Black', sans-serif;\n            color: white;\n            text-align: center;\n            padding: 60px;\n          }\n          .title {\n            font-size: 80px;\n            font-weight: bold;\n            margin-bottom: 30px;\n            text-shadow: 4px 4px 8px rgba(0,0,0,0.5);\n            line-height: 1.2;\n          }\n          .artist {\n            font-size: 48px;\n            margin-bottom: 20px;\n            opacity: 0.9;\n            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);\n          }\n          .genre {\n            font-size: 32px;\n            opacity: 0.7;\n            text-transform: uppercase;\n            letter-spacing: 4px;\n            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"title\">").concat(this.escapeHtml(input.title), "</div>\n        ").concat(input.artist ? "<div class=\"artist\">".concat(this.escapeHtml(input.artist), "</div>") : '', "\n        ").concat(input.genre ? "<div class=\"genre\">".concat(this.escapeHtml(input.genre), "</div>") : '', "\n      </body>\n      </html>\n    ");
    };
    AlbumCoverSkill.prototype.escapeHtml = function (text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) { return map[m]; });
    };
    return AlbumCoverSkill;
}());
exports.AlbumCoverSkill = AlbumCoverSkill;
exports.default = AlbumCoverSkill;
