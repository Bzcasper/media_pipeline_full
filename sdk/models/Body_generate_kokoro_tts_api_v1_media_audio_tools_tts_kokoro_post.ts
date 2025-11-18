/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_generate_kokoro_tts_api_v1_media_audio_tools_tts_kokoro_post = {
    /**
     * Text to convert to speech
     */
    text: string;
    /**
     * Voice name for kokoro TTS
     */
    voice?: (string | null);
    /**
     * Speed for kokoro TTS
     */
    speed?: (number | null);
    /**
     * Whether to apply reverb effect to the generated audio (default: False)
     */
    reverb_effect?: (boolean | null);
};

