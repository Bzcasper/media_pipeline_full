export type Body_align_script_api_v1_media_audio_tools_align_script_post = {
    /**
     * Audio ID to align script to
     */
    audio_id: string;
    /**
     * Script text to align
     */
    script: string;
    /**
     * Segmentation mode; one of: 'word', 'sentence', 'sentence_punc', 'fixed_words', 'max_chars' (default: 'sentence')
     */
    mode?: ('word' | 'sentence' | 'sentence_punc' | 'fixed_words' | 'max_chars' | null);
    /**
     * Maximum count per chunk. For 'fixed_words': max words. For 'max_chars': max characters. If None, defaults apply.
     */
    limit?: (number | null);
    /**
     * ISO-639-3 language code for alignment (default: None)
     */
    lang_code?: (string | null);
};
