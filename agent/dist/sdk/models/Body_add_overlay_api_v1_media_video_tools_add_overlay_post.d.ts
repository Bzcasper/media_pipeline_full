export type Body_add_overlay_api_v1_media_video_tools_add_overlay_post = {
    /**
     * Video ID to overlay
     */
    video_id: string;
    /**
     * Overlay image or video ID
     */
    overlay_id: string;
    /**
     * Opacity of the overlay image (0.0 to 1.0, default: 0.4)
     */
    opacity?: (number | null);
};
