import type { CancelablePromise } from '../core/CancelablePromise';
export declare class DefaultService {
    /**
     * Root
     * @returns any Successful Response
     * @throws ApiError
     */
    static rootGet(): CancelablePromise<any>;
    /**
     * Root
     * @returns any Successful Response
     * @throws ApiError
     */
    static rootGet1(): CancelablePromise<any>;
    /**
     * Healthcheck
     * @returns any Successful Response
     * @throws ApiError
     */
    static healthcheckHealthGet(): CancelablePromise<any>;
    /**
     * Healthcheck
     * @returns any Successful Response
     * @throws ApiError
     */
    static healthcheckHealthGet1(): CancelablePromise<any>;
    /**
     * Serve React App
     * Serve the React app for any /ui* route to support client-side routing.
     * This ensures that React Router can handle the routing on the frontend.
     * @param fullPath
     * @returns any Successful Response
     * @throws ApiError
     */
    static serveReactAppUiFullPathGet(fullPath: string): CancelablePromise<any>;
    /**
     * Serve React App Root
     * Serve the React app for the base /ui route
     * @returns any Successful Response
     * @throws ApiError
     */
    static serveReactAppRootUiGet(): CancelablePromise<any>;
}
