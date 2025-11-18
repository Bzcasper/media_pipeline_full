/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_merge_videos_api_v1_media_video_tools_merge_post = {
    /**
     * List of video IDs to merge - 150 max
     */
    video_ids: string;
    /**
     * Background music ID (optional)
     */
    background_music_id?: (string | null);
    /**
     * Whether to normalize the FPS, video codec and audio codec before merging (default: True)
     */
    normalize?: (boolean | null);
    /**
     * Volume for background music (0.0 to 1.0)
     */
    background_music_volume?: (number | null);
};

