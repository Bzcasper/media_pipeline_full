/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_match_duration_api_v1_media_video_tools_match_duration_post = {
    /**
     * Video ID to resize duration
     */
    video_id: string;
    /**
     * Audio ID to use as reference for duration resizing (optional)
     */
    audio_id?: (string | null);
    /**
     * Target duration in seconds
     */
    target_duration_seconds: number;
    /**
     * Method to extend video: 'loop' or 'freeze' (default: 'loop')
     */
    extend_method?: ('loop' | 'freeze' | null);
    /**
     * Loop type: 'normal' or 'pingpong' (default: 'normal')
     */
    loop_type?: ('normal' | 'pingpong' | null);
    /**
     * Maximum speed up limit as a decimal (default: 0.25 for 25%)
     */
    speed_up_limit_percent?: (number | null);
    /**
     * Maximum slow down limit as a decimal (default: 0.25 for 25%)
     */
    slow_down_limit_percent?: (number | null);
    /**
     * Whether to remove audio from the output video (default: True)
     */
    remove_audio?: (boolean | null);
};

