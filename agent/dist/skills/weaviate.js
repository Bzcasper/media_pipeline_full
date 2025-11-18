"use strict";
/**
 * Weaviate Indexer Skill
 * Indexes metadata and assets into Weaviate vector database
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
exports.WeaviateIndexerSkill = exports.WeaviateIndexerOutput = exports.WeaviateIndexerInput = void 0;
var zod_1 = require("zod");
var weaviate_ts_client_1 = require("weaviate-ts-client");
exports.WeaviateIndexerInput = zod_1.z.object({
    jobId: zod_1.z.string(),
    metadata: zod_1.z.record(zod_1.z.any()),
    assets: zod_1.z.record(zod_1.z.any()),
    transcription: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.WeaviateIndexerOutput = zod_1.z.object({
    indexedIds: zod_1.z.record(zod_1.z.string()),
    className: zod_1.z.string(),
});
var WeaviateIndexerSkill = /** @class */ (function () {
    function WeaviateIndexerSkill(logger, className) {
        if (className === void 0) { className = "MusicAsset"; }
        this.logger = logger;
        this.className = className;
        // Initialize Weaviate client
        this.client = weaviate_ts_client_1.default.client({
            scheme: "http",
            host: process.env.WEAVIATE_URL || "localhost:8080",
            apiKey: process.env.WEAVIATE_API_KEY ? {
                apiKey: process.env.WEAVIATE_API_KEY
            } : undefined,
        });
    }
    WeaviateIndexerSkill.prototype.run = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var validInput, dataObject, result, indexedId, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validInput = exports.WeaviateIndexerInput.parse(input);
                        this.logger.info("Starting Weaviate indexing", { jobId: validInput.jobId });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        // Ensure class exists
                        return [4 /*yield*/, this.ensureClass()];
                    case 2:
                        // Ensure class exists
                        _b.sent();
                        dataObject = {
                            jobId: validInput.jobId,
                            metadata: validInput.metadata,
                            assets: validInput.assets,
                            transcription: validInput.transcription,
                            indexedAt: new Date().toISOString(),
                        };
                        return [4 /*yield*/, this.client.data
                                .creator()
                                .withClassName(this.className)
                                .withProperties(dataObject)
                                .do()];
                    case 3:
                        result = _b.sent();
                        indexedId = result.id;
                        this.logger.success("Data indexed in Weaviate", { id: indexedId });
                        return [2 /*return*/, {
                                indexedIds: (_a = {}, _a[validInput.jobId] = indexedId, _a),
                                className: this.className,
                            }];
                    case 4:
                        error_1 = _b.sent();
                        this.logger.error("Weaviate indexing failed", {
                            error: error_1 instanceof Error ? error_1.message : String(error_1)
                        });
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    WeaviateIndexerSkill.prototype.ensureClass = function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema, existingClass, error_2;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.client.schema.getter().do()];
                    case 1:
                        schema = _b.sent();
                        existingClass = (_a = schema.classes) === null || _a === void 0 ? void 0 : _a.find(function (c) { return c.class === _this.className; });
                        if (!!existingClass) return [3 /*break*/, 3];
                        // Create class
                        return [4 /*yield*/, this.client.schema
                                .classCreator()
                                .withClass({
                                class: this.className,
                                description: "Music assets and metadata for semantic search",
                                properties: [
                                    {
                                        name: "jobId",
                                        dataType: ["string"],
                                        description: "Unique job identifier",
                                    },
                                    {
                                        name: "metadata",
                                        dataType: ["object"],
                                        description: "Song metadata (title, artist, genre, etc.)",
                                    },
                                    {
                                        name: "assets",
                                        dataType: ["object"],
                                        description: "Asset URLs and references",
                                    },
                                    {
                                        name: "transcription",
                                        dataType: ["object"],
                                        description: "Audio transcription data",
                                    },
                                    {
                                        name: "indexedAt",
                                        dataType: ["date"],
                                        description: "When this was indexed",
                                    },
                                ],
                                vectorizer: "text2vec-openai", // Or another vectorizer
                            })
                                .do()];
                    case 2:
                        // Create class
                        _b.sent();
                        this.logger.info("Created Weaviate class: ".concat(this.className));
                        _b.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        this.logger.error("Failed to ensure Weaviate class", {
                            error: error_2 instanceof Error ? error_2.message : String(error_2)
                        });
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    WeaviateIndexerSkill.prototype.runWithRetry = function (input_1) {
        return __awaiter(this, arguments, void 0, function (input, maxAttempts) {
            var lastError, _loop_1, this_1, attempt, state_1;
            if (maxAttempts === void 0) { maxAttempts = 2; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastError = null;
                        _loop_1 = function (attempt) {
                            var _b, error_3, delay_1;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 2, , 5]);
                                        this_1.logger.info("Weaviate indexing attempt ".concat(attempt, "/").concat(maxAttempts));
                                        _b = {};
                                        return [4 /*yield*/, this_1.run(input)];
                                    case 1: return [2 /*return*/, (_b.value = _c.sent(), _b)];
                                    case 2:
                                        error_3 = _c.sent();
                                        lastError = error_3 instanceof Error ? error_3 : new Error(String(error_3));
                                        this_1.logger.warn("Weaviate indexing attempt ".concat(attempt, " failed"), {
                                            error: lastError.message,
                                        });
                                        if (!(attempt < maxAttempts)) return [3 /*break*/, 4];
                                        delay_1 = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                                        this_1.logger.info("Retrying in ".concat(delay_1, "ms..."));
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                                    case 3:
                                        _c.sent();
                                        _c.label = 4;
                                    case 4: return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        attempt = 1;
                        _a.label = 1;
                    case 1:
                        if (!(attempt <= maxAttempts)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(attempt)];
                    case 2:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 3;
                    case 3:
                        attempt++;
                        return [3 /*break*/, 1];
                    case 4: throw lastError || new Error("Weaviate indexing failed after all retries");
                }
            });
        });
    };
    return WeaviateIndexerSkill;
}());
exports.WeaviateIndexerSkill = WeaviateIndexerSkill;
exports.default = WeaviateIndexerSkill;
