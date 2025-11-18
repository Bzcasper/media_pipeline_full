/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_transcode_video_api_v1_media_video_tools_transcode_post = {
    /**
     * Video ID to transcode
     */
    video_id: string;
    /**
     * Video codec to use: libx264 (default), h264, libx265, h265, hevc, or mp4
     */
    codec?: (string | null);
    /**
     * Quality level from 1 (lowest quality, smallest file) to 10 (highest quality, largest file), default: 5
     */
    quality?: (number | null);
    /**
     * Target bitrate (e.g., '1000k', '2M'). If specified, overrides quality parameter for more precise file size control
     */
    bitrate?: (string | null);
    /**
     * Target resolution in format 'WIDTHxHEIGHT' (e.g., '1920x1080', '1280x720', '640x360'), optional
     */
    resolution?: (string | null);
    /**
     * Target frames per second (FPS), optional
     */
    fps?: (number | null);
};

