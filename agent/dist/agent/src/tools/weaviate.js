"use strict";
/**
 * Weaviate Tool
 * Handles vector indexing and semantic search
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
exports.weaviate = void 0;
exports.weaviate = {
    /**
     * Initialize Weaviate client
     */
    getClient: function () {
        var weaviateUrl = process.env.WEAVIATE_URL;
        var apiKey = process.env.WEAVIATE_API_KEY;
        if (!weaviateUrl) {
            throw new Error('WEAVIATE_URL environment variable is not set');
        }
        // For now, return a simple fetch-based client
        // In production, use the official Weaviate client SDK
        return {
            url: weaviateUrl,
            headers: __assign({ 'Content-Type': 'application/json' }, (apiKey && { 'Authorization': "Bearer ".concat(apiKey) }))
        };
    },
    /**
     * Index a media document
     */
    indexDocument: function (doc) { return __awaiter(void 0, void 0, void 0, function () {
        var client, response, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = exports.weaviate.getClient();
                    return [4 /*yield*/, fetch("".concat(client.url, "/v1/objects"), {
                            method: 'POST',
                            headers: client.headers,
                            body: JSON.stringify({
                                class: 'MediaDocument',
                                properties: __assign(__assign({}, doc), { indexedAt: new Date().toISOString() })
                            })
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    error = _a.sent();
                    throw new Error("Failed to index document: ".concat(error));
                case 3: return [2 /*return*/];
            }
        });
    }); },
    /**
     * Batch index documents
     */
    batchIndex: function (docs) { return __awaiter(void 0, void 0, void 0, function () {
        var client, objects, response, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = exports.weaviate.getClient();
                    objects = docs.map(function (doc) { return ({
                        class: 'MediaDocument',
                        properties: __assign(__assign({}, doc), { indexedAt: new Date().toISOString() })
                    }); });
                    return [4 /*yield*/, fetch("".concat(client.url, "/v1/batch/objects"), {
                            method: 'POST',
                            headers: client.headers,
                            body: JSON.stringify({ objects: objects })
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    error = _a.sent();
                    throw new Error("Failed to batch index documents: ".concat(error));
                case 3: return [2 /*return*/];
            }
        });
    }); },
    /**
     * Search documents
     */
    search: function (query_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([query_1], args_1, true), void 0, function (query, limit) {
            var client, response, error, result;
            var _a, _b;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        client = exports.weaviate.getClient();
                        return [4 /*yield*/, fetch("".concat(client.url, "/v1/graphql"), {
                                method: 'POST',
                                headers: client.headers,
                                body: JSON.stringify({
                                    query: "\n          {\n            Get {\n              MediaDocument(\n                nearText: {\n                  concepts: [\"".concat(query, "\"]\n                }\n                limit: ").concat(limit, "\n              ) {\n                id\n                title\n                artist\n                album\n                genre\n                mood\n                lyrics\n                transcription\n                bpm\n                key\n                audioUrl\n                coverUrl\n                videoUrl\n                metadata\n              }\n            }\n          }\n        ")
                                })
                            })];
                    case 1:
                        response = _c.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        error = _c.sent();
                        throw new Error("Failed to search documents: ".concat(error));
                    case 3: return [4 /*yield*/, response.json()];
                    case 4:
                        result = _c.sent();
                        return [2 /*return*/, ((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Get) === null || _b === void 0 ? void 0 : _b.MediaDocument) || []];
                }
            });
        });
    },
    /**
     * Get document by ID
     */
    getById: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var client, response, error, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = exports.weaviate.getClient();
                    return [4 /*yield*/, fetch("".concat(client.url, "/v1/objects/MediaDocument/").concat(id), {
                            method: 'GET',
                            headers: client.headers
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status === 404) {
                        return [2 /*return*/, null];
                    }
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    error = _a.sent();
                    throw new Error("Failed to get document: ".concat(error));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    result = _a.sent();
                    return [2 /*return*/, result.properties];
            }
        });
    }); },
    /**
     * Delete document
     */
    deleteById: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var client, response, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = exports.weaviate.getClient();
                    return [4 /*yield*/, fetch("".concat(client.url, "/v1/objects/MediaDocument/").concat(id), {
                            method: 'DELETE',
                            headers: client.headers
                        })];
                case 1:
                    response = _a.sent();
                    if (!(!response.ok && response.status !== 404)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    error = _a.sent();
                    throw new Error("Failed to delete document: ".concat(error));
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = exports.weaviate;
