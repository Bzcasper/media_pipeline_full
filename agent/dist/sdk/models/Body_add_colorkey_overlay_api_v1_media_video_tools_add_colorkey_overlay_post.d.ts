export type Body_add_colorkey_overlay_api_v1_media_video_tools_add_colorkey_overlay_post = {
    /**
     * Video ID to overlay
     */
    video_id: string;
    /**
     * Overlay image ID
     */
    overlay_video_id: string;
    /**
     * Set the color for which alpha will be set to 0 (full transparency). Use name of the color or hex code (e.g. 'red' or '#ff0000')
     */
    color?: (string | null);
    /**
     * Set the radius from the key color within which other colors also have full transparency (Default: 0.1)
     */
    similarity?: (number | null);
    /**
     * Set how the alpha value for pixels that fall outside the similarity radius is computed (default: 0.1)
     */
    blend?: (number | null);
};
