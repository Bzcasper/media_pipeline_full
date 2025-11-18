/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_create_mix_handler_api_v1_media_music_tools_create_mix_post = {
    /**
     * Comma-separated list of audio IDs to include in the mix
     */
    audio_ids: string;
    /**
     * Duration of the mix in minutes, limit: 180 (3 hours) (default: 30)
     */
    duration_minutes?: (number | null);
};

