export type Body_create_music_thumbnail_handler_api_v1_media_music_tools_create_thumbnail_post = {
    /**
     * Title text for the thumbnail
     */
    title: string;
    /**
     * Subtitle text for the thumbnail (optional)
     */
    subtitle?: (string | null);
    /**
     * Padding around the text in pixels (default: 100)
     */
    padding?: (number | null);
    /**
     * Gap between title and subtitle in pixels (default: 20)
     */
    subtitle_gap?: (number | null);
    /**
     * Font size for the title text (default: 200)
     */
    title_font_size?: (number | null);
    /**
     * Font ID for the title text (default: arial)
     */
    title_font_id?: (string | null);
    /**
     * Font size for the subtitle text (default: 100)
     */
    subtitle_font_size?: (number | null);
    /**
     * Font ID for the subtitle text (default: arial)
     */
    subtitle_font_id?: (string | null);
    /**
     * Text color in HEX format (default: #FFFFFF)
     */
    text_color_hex?: (string | null);
    /**
     * Image ID to use for thumbnail (optional)
     */
    image_id?: (string | null);
    /**
     * Video ID to use for thumbnail (optional)
     */
    video_id?: (string | null);
};
