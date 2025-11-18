export type Body_create_playlist_handler_api_v1_media_music_tools_create_playlist_post = {
    /**
     * Comma-separated list of audio IDs to include in the playlist
     */
    audio_ids: string;
    /**
     * Whether to include analysis data in the response (default: False)
     */
    analysis_data?: (boolean | null);
};
