export type Body_extract_frame_from_url_api_v1_media_video_tools_extract_frames_post = {
    /**
     * URL of the video to extract frame from
     */
    url: string;
    /**
     * Number of frames to extract from the video (default: 5)
     */
    amount?: number;
    /**
     * Length of the video in seconds (optional)
     */
    length_seconds?: (number | null);
    /**
     * Whether to stitch the frames into a single image (default: False)
     */
    stitch?: (boolean | null);
};
