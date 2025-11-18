"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultService = void 0;
var OpenAPI_1 = require("../core/OpenAPI");
var request_1 = require("../core/request");
var DefaultService = /** @class */ (function () {
    function DefaultService() {
    }
    /**
     * Root
     * @returns any Successful Response
     * @throws ApiError
     */
    DefaultService.rootGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/',
        });
    };
    /**
     * Root
     * @returns any Successful Response
     * @throws ApiError
     */
    DefaultService.rootGet1 = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'HEAD',
            url: '/',
        });
    };
    /**
     * Healthcheck
     * @returns any Successful Response
     * @throws ApiError
     */
    DefaultService.healthcheckHealthGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    };
    /**
     * Healthcheck
     * @returns any Successful Response
     * @throws ApiError
     */
    DefaultService.healthcheckHealthGet1 = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'HEAD',
            url: '/health',
        });
    };
    /**
     * Serve React App
     * Serve the React app for any /ui* route to support client-side routing.
     * This ensures that React Router can handle the routing on the frontend.
     * @param fullPath
     * @returns any Successful Response
     * @throws ApiError
     */
    DefaultService.serveReactAppUiFullPathGet = function (fullPath) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/ui/{full_path}',
            path: {
                'full_path': fullPath,
            },
            errors: {
                422: "Validation Error",
            },
        });
    };
    /**
     * Serve React App Root
     * Serve the React app for the base /ui route
     * @returns any Successful Response
     * @throws ApiError
     */
    DefaultService.serveReactAppRootUiGet = function () {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/ui',
        });
    };
    return DefaultService;
}());
exports.DefaultService = DefaultService;
