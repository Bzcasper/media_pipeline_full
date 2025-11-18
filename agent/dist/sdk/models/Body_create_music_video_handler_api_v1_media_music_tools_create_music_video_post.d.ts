export type Body_create_music_video_handler_api_v1_media_music_tools_create_music_video_post = {
    /**
     * Audio ID to create music video for
     */
    audio_id: string;
    /**
     * Video ID to use as background for the music video - should be a perfect loop
     */
    looping_video_id: string;
    /**
     * Intro video ID to prepend to the music video (optional)
     */
    intro_id?: (string | null);
    /**
     * Whether to apply zoom effect to the background video (default: False)
     */
    zoom_effect?: (boolean | null);
    /**
     * Whether to apply blur effect to the background video (default: False)
     */
    blur_effect?: (boolean | null);
};
