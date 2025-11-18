export type Body_convert_pcm_to_wav_api_v1_utils_convert_pcm_wav_post = {
    /**
     * ID of the PCM audio file to convert
     */
    pcm_id: string;
    /**
     * Sample rate of the PCM audio
     */
    sample_rate?: number;
    /**
     * Number of audio channels (1 for mono, 2 for stereo)
     */
    channels?: number;
    /**
     * Target sample rate for the WAV audio
     */
    target_sample_rate?: number;
};
