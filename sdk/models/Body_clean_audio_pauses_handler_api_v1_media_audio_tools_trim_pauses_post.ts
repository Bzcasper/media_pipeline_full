/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_clean_audio_pauses_handler_api_v1_media_audio_tools_trim_pauses_post = {
    /**
     * Audio ID to clean pauses from
     */
    audio_id: string;
    /**
     * Script text for alignment
     */
    script: string;
    /**
     * Maximum pause duration in seconds before trimming (default: 0.5, minimum: 0.2)
     */
    pause_threshold?: (number | null);
};

