export type Body_extend_audio_api_v1_media_audio_tools_extend_audio_post = {
    /**
     * Audio ID to extend
     */
    audio_id: string;
    /**
     * Duration to extend the audio to in minutes, minimum: 10, maximum: 180 (3 hours)
     */
    duration_minutes?: (number | null);
};
