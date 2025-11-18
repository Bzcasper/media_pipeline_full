/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_generate_long_form_ambient_video_api_v1_media_video_tools_long_form_ambient_post = {
    /**
     * Video ID to generate ambient video from
     */
    video_id: string;
    /**
     * (duplicate) Music ID for the video background music (optional)
     */
    audio_id?: (string | null);
    /**
     * Music ID to use for the video background music (optional)
     */
    music_id?: (string | null);
    /**
     * Comma-separated list of dialogue audio IDs to overlay on the ambient video (optional)
     */
    dialogue_ids?: (string | null);
    /**
     * Pause in seconds between dialogue clips (default: 0.5)
     */
    dialogue_pause_seconds?: (number | null);
    /**
     * Volume for the music (0.0 to 1.0, default: 1)
     */
    music_volume?: (number | null);
    /**
     * Duration of the ambient video in minutes (default: 10), minimum: 10, maximum: 180
     */
    duration_minutes?: (number | null);
    /**
     * Width of the video (default: 1920), maximum is 1920
     */
    width?: (number | null);
    /**
     * Height of the video (default: 1080), maximum is 1080
     */
    height?: (number | null);
    /**
     * Comma-separated list of ambient sounds and their volume in the format: 'TYPE:VOLUME,TYPE:VOLUME', e.g. 'rain:1.0,wind:0.5'.
     */
    ambient_sounds?: (string | null);
};

