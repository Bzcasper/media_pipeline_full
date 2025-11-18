"use strict";
/**
 * Metadata Extraction Skill
 * Extracts metadata from lyrics using LLM analysis
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
exports.MetadataSkill = exports.MetadataOutput = exports.MetadataInput = void 0;
var zod_1 = require("zod");
exports.MetadataInput = zod_1.z.object({
    lyrics: zod_1.z.string(),
    audioMetadata: zod_1.z.record(zod_1.z.any()).optional()
});
exports.MetadataOutput = zod_1.z.object({
    title: zod_1.z.string().optional(),
    artist: zod_1.z.string().optional(),
    album: zod_1.z.string().optional(),
    genre: zod_1.z.string().optional(),
    mood: zod_1.z.string().optional(),
    themes: zod_1.z.array(zod_1.z.string()).optional(),
    language: zod_1.z.string().optional(),
    bpm: zod_1.z.number().optional(),
    key: zod_1.z.string().optional(),
    summary: zod_1.z.string().optional()
});
var MetadataSkill = /** @class */ (function () {
    function MetadataSkill(logger) {
        this.logger = logger;
    }
    MetadataSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, metadata;
            return __generator(this, function (_a) {
                validInput = exports.MetadataInput.parse(input);
                this.logger.info('Extracting metadata from lyrics');
                metadata = __assign(__assign({}, this.extractBasicMetadata(validInput.lyrics)), validInput.audioMetadata);
                this.logger.success('Metadata extracted', metadata);
                return [2 /*return*/, metadata];
            });
        });
    };
    MetadataSkill.prototype.extractBasicMetadata = function (lyrics) {
        var metadata = {};
        // Extract genre keywords
        var genreKeywords = {
            'rock': ['guitar', 'drums', 'rock', 'band'],
            'pop': ['love', 'heart', 'dance', 'baby'],
            'hip-hop': ['rap', 'flow', 'beat', 'street'],
            'electronic': ['synth', 'beat', 'bass', 'drop'],
            'country': ['road', 'truck', 'home', 'dirt']
        };
        var lyricsLower = lyrics.toLowerCase();
        for (var _i = 0, _a = Object.entries(genreKeywords); _i < _a.length; _i++) {
            var _b = _a[_i], genre = _b[0], keywords = _b[1];
            if (keywords.some(function (kw) { return lyricsLower.includes(kw); })) {
                metadata.genre = genre;
                break;
            }
        }
        // Extract mood
        var moodKeywords = {
            'happy': ['happy', 'joy', 'smile', 'celebrate'],
            'sad': ['sad', 'cry', 'tears', 'lonely'],
            'angry': ['angry', 'rage', 'hate', 'fight'],
            'romantic': ['love', 'heart', 'together', 'kiss'],
            'energetic': ['energy', 'power', 'strong', 'go']
        };
        for (var _c = 0, _d = Object.entries(moodKeywords); _c < _d.length; _c++) {
            var _e = _d[_c], mood = _e[0], keywords = _e[1];
            if (keywords.some(function (kw) { return lyricsLower.includes(kw); })) {
                metadata.mood = mood;
                break;
            }
        }
        // Extract themes
        var themes = [];
        if (lyricsLower.includes('love'))
            themes.push('love');
        if (lyricsLower.includes('life'))
            themes.push('life');
        if (lyricsLower.includes('dream'))
            themes.push('dreams');
        metadata.themes = themes;
        // Create summary (first 2 lines)
        var lines = lyrics.split('\n').filter(function (l) { return l.trim(); });
        metadata.summary = lines.slice(0, 2).join(' ').slice(0, 200);
        return metadata;
    };
    return MetadataSkill;
}());
exports.MetadataSkill = MetadataSkill;
exports.default = MetadataSkill;
