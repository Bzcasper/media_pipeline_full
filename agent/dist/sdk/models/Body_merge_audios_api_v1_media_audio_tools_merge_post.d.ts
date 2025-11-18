export type Body_merge_audios_api_v1_media_audio_tools_merge_post = {
    /**
     * Comma-separated list of audio IDs to merge
     */
    audio_ids: string;
    /**
     * Pause duration between audios in seconds (default: 0.5)
     */
    pause?: (number | null);
};
