"use strict";
/**
 * Media Server SDK Types
 * Auto-generated from OpenAPI specification
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaServerError = void 0;
// Error Types
class MediaServerError extends Error {
    statusCode;
    response;
    constructor(message, statusCode, response) {
        super(message);
        this.statusCode = statusCode;
        this.response = response;
        this.name = 'MediaServerError';
    }
}
exports.MediaServerError = MediaServerError;
//# sourceMappingURL=types.js.map