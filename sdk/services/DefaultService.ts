/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Root
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rootGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
    /**
     * Root
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rootGet1(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'HEAD',
            url: '/',
        });
    }
    /**
     * Healthcheck
     * @returns any Successful Response
     * @throws ApiError
     */
    public static healthcheckHealthGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Healthcheck
     * @returns any Successful Response
     * @throws ApiError
     */
    public static healthcheckHealthGet1(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'HEAD',
            url: '/health',
        });
    }
    /**
     * Serve React App
     * Serve the React app for any /ui* route to support client-side routing.
     * This ensures that React Router can handle the routing on the frontend.
     * @param fullPath
     * @returns any Successful Response
     * @throws ApiError
     */
    public static serveReactAppUiFullPathGet(
        fullPath: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ui/{full_path}',
            path: {
                'full_path': fullPath,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Serve React App Root
     * Serve the React app for the base /ui route
     * @returns any Successful Response
     * @throws ApiError
     */
    public static serveReactAppRootUiGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ui',
        });
    }
}
