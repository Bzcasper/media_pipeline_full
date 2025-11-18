export type Body_generate_captioned_video_api_v1_media_video_tools_generate_tts_captioned_video_post = {
    /**
     * Background image ID
     */
    background_id: string;
    /**
     * Text to generate video from, or to use it as alignment with the provided audio_id
     */
    text?: (string | null);
    /**
     * Width of the video (default: 1080)
     */
    width?: (number | null);
    /**
     * Height of the video (default: 1920)
     */
    height?: (number | null);
    /**
     * Audio ID for the video (optional)
     */
    audio_id?: (string | null);
    /**
     * Voice for kokoro TTS (default: af_heart)
     */
    kokoro_voice?: (string | null);
    /**
     * Speed for kokoro TTS (default: 1.0)
     */
    kokoro_speed?: (number | null);
    /**
     * Language code for STT (optional, e.g. 'en', 'fr', 'de'), defaults to None (auto-detect language if audio_id is provided)
     */
    language?: (string | null);
    /**
     * ISO-639-3 language code for TTS alignment (optional, e.g. 'eng', 'fra', 'deu'), defaults to None
     */
    alignment_language_code?: (string | null);
    /**
     * Font ID to use for captions (optional)
     */
    font_id?: (string | null);
    /**
     * Effect to apply to the background image, options: ken_burns, pan, still (default: 'ken_burns')
     */
    image_effect?: (string | null);
    /**
     * Whether to enable captions (default: True)
     */
    caption_on?: (boolean | null);
    /**
     * Number of lines per subtitle segment (default: 1)
     */
    caption_config_line_count?: (number | null);
    /**
     * Maximum characters per line (default: 1)
     */
    caption_config_line_max_length?: (number | null);
    /**
     * Font size for subtitles (default: 50)
     */
    caption_config_font_size?: (number | null);
    /**
     * Font family name (default: 'EB Garamond', see the available fonts form the /fonts endpoint)
     */
    caption_config_font_name?: (string | null);
    /**
     * Whether to use bold font (default: True)
     */
    caption_config_font_bold?: (boolean | null);
    /**
     * Whether to use italic font (default: false)
     */
    caption_config_font_italic?: (boolean | null);
    /**
     * Font color in hex format (default: '#fff')
     */
    caption_config_font_color?: (string | null);
    /**
     * Vertical position of subtitles (default: 'top')
     */
    caption_config_subtitle_position?: ('top' | 'center' | 'bottom' | null);
    /**
     * Shadow color in hex format (default: '#000')
     */
    caption_config_shadow_color?: (string | null);
    /**
     * Shadow transparency from 0.0 to 1.0 (default: 0.4)
     */
    caption_config_shadow_transparency?: (number | null);
    /**
     * Shadow blur radius (default: 10)
     */
    caption_config_shadow_blur?: (number | null);
    /**
     * Stroke/outline color in hex format (default: '#000')
     */
    caption_config_stroke_color?: (string | null);
    /**
     * Stroke/outline size (default: 5)
     */
    caption_config_stroke_size?: (number | null);
};
