export type Body_generate_gif_preview_api_v1_media_video_tools_gif_preview_post = {
    /**
     * Video ID to generate GIF preview from
     */
    video_id: string;
    /**
     * Start time in seconds for the GIF preview (default: 0.0)
     */
    start_time?: (number | null);
    /**
     * Duration in seconds (1-6) for the GIF preview (default: 3.0)
     */
    duration?: (number | null);
};
