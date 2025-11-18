/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_generate_chatterbox_tts_api_v1_media_audio_tools_tts_chatterbox_post = {
    /**
     * Text to convert to speech
     */
    text: string;
    /**
     * Language code for multilingual model (default: 'en')
     */
    language?: (string | null);
    /**
     * Sample audio ID for voice cloning
     */
    sample_audio_id?: (string | null);
    /**
     * Sample audio file for voice cloning
     */
    sample_audio_file?: (Blob | null);
    /**
     * Exaggeration factor for voice cloning, default: 0.5
     */
    exaggeration?: (number | null);
    /**
     * CFG weight for voice cloning, default: 0.5
     */
    cfg_weight?: (number | null);
    /**
     * Temperature for voice cloning (default: 0.8)
     */
    temperature?: (number | null);
    /**
     * Silence duration between chunks in milliseconds (default: 350)
     */
    chunk_silence_ms?: (number | null);
    /**
     * Whether to apply reverb effect to the generated audio (default: False)
     */
    reverb_effect?: (boolean | null);
};

