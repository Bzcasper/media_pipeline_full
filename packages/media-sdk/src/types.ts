// src/types.ts

// Universal type for all uploadable file types
export type Uploadable = Buffer | Blob | File | ArrayBuffer | Uint8Array;

// SCHEMAS

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface RevengeStoryVideoRequest {
  background_video_id: string;
  person_image_id: string;
  text: string;
  character_name: string;
  kokoro_voice?: string;
  kokoro_speed?: number;
  width?: number;
  height?: number;
  font_size?: number;
  max_caption_length?: number;
  caption_lines?: number;
}

// REQUEST BODY TYPES

export interface BodyAddColorkeyOverlay {
  video_id: string;
  overlay_video_id: string;
  color?: string | null;
  similarity?: number | null;
  blend?: number | null;
}

export interface BodyAddOverlay {
  video_id: string;
  overlay_id: string;
  opacity?: number | null;
}

export interface BodyAlignScript {
  audio_id: string;
  script: string;
  mode?:
    | "word"
    | "sentence"
    | "sentence_punc"
    | "fixed_words"
    | "max_chars"
    | null;
  limit?: number | null;
  lang_code?: string | null;
}

export interface BodyAnalyzeTrack {
  audio_id: string;
}

export interface BodyCleanAudioPauses {
  audio_id: string;
  script: string;
  pause_threshold?: number | null;
}

export interface BodyConvertPcmToWav {
  pcm_id: string;
  sample_rate?: number;
  channels?: number;
  target_sample_rate?: number;
}

export interface BodyCreateLoopingVideo {
  video_id: string;
}

export interface BodyCreateMix {
  audio_ids: string;
  duration_minutes?: number | null;
}

export interface BodyCreateMusicThumbnail {
  title: string;
  subtitle?: string | null;
  padding?: number | null;
  subtitle_gap?: number | null;
  title_font_size?: number | null;
  title_font_id?: string | null;
  subtitle_font_size?: number | null;
  subtitle_font_id?: string | null;
  text_color_hex?: string | null;
  image_id?: string | null;
  video_id?: string | null;
}

export interface BodyCreateMusicVideo {
  audio_id: string;
  looping_video_id: string;
  intro_id?: string | null;
  zoom_effect?: boolean | null;
  blur_effect?: boolean | null;
}

export interface BodyCreatePlaylist {
  audio_ids: string;
  analysis_data?: boolean | null;
}

export interface BodyExtendAudio {
  audio_id: string;
  duration_minutes?: number;
}

export interface BodyExtractFrameFromUrl {
  url: string;
  amount?: number;
  length_seconds?: number | null;
  stitch?: boolean | null;
}

export interface BodyGenerateCaptionVideo {
  background_id: string;
  text?: string | null;
  width?: number | null;
  height?: number | null;
  audio_id?: string | null;
  kokoro_voice?: string | null;
  kokoro_speed?: number | null;
  language?: string | null;
  alignment_language_code?: string | null;
  font_id?: string | null;
  image_effect?: string | null;
  caption_on?: boolean | null;
  caption_config_line_count?: number | null;
  caption_config_line_max_length?: number | null;
  caption_config_font_size?: number | null;
  caption_config_font_name?: string | null;
  caption_config_font_bold?: boolean | null;
  caption_config_font_italic?: boolean | null;
  caption_config_font_color?: string | null;
  caption_config_subtitle_position?: "top" | "center" | "bottom" | null;
  caption_config_shadow_color?: string | null;
  caption_config_shadow_transparency?: number | null;
  caption_config_shadow_blur?: number | null;
  caption_config_stroke_color?: string | null;
  caption_config_stroke_size?: number | null;
}

export interface BodyGenerateChatterboxTts {
  text: string;
  language?: string | null;
  sample_audio_id?: string | null;
  sample_audio_file?: Uploadable | null;
  exaggeration?: number | null;
  cfg_weight?: number | null;
  temperature?: number | null;
  chunk_silence_ms?: number | null;
  reverb_effect?: boolean | null;
}

export interface BodyGenerateGifPreview {
  video_id: string;
  start_time?: number | null;
  duration?: number | null;
}

export interface BodyGenerateKokoroTts {
  text: string;
  voice?: string | null;
  speed?: number | null;
  reverb_effect?: boolean | null;
}

export interface BodyGenerateLongFormAmbientVideo {
  video_id: string;
  audio_id?: string | null;
  music_id?: string | null;
  dialogue_ids?: string | null;
  dialogue_pause_seconds?: number | null;
  music_volume?: number | null;
  duration_minutes?: number | null;
  width?: number | null;
  height?: number | null;
  ambient_sounds?: string | null;
}

export interface BodyImageUnaize {
  image_id: string;
  enhance_color: number;
  enhance_contrast: number;
  noise_strength?: number;
}

export interface BodyMatchDuration {
  video_id: string;
  target_duration_seconds: number;
  audio_id?: string | null;
  extend_method?: "loop" | "freeze" | null;
  loop_type?: "normal" | "pingpong" | null;
  speed_up_limit_percent?: number | null;
  slow_down_limit_percent?: number | null;
  remove_audio?: boolean | null;
}

export interface BodyMergeAudios {
  audio_ids: string;
  pause?: number | null;
}

export interface BodyMergeVideos {
  video_ids: string;
  background_music_id?: string | null;
  normalize?: boolean | null;
  background_music_volume?: number | null;
}

export interface BodyNormalizeTrack {
  audio_id: string;
}

export interface BodyRenderHtml {
  html_content: string;
  width?: number;
  height?: number;
}

export interface BodyStitchImages {
  image_urls: string;
  max_width?: number;
  max_height?: number;
}

export interface BodyTranscodeVideo {
  video_id: string;
  codec?: string | null;
  quality?: number | null;
  bitrate?: string | null;
  resolution?: string | null;
  fps?: number | null;
}

export interface BodyTranscribeAudio {
  audio_file: Uploadable;
  language?: string | null;
}

export interface BodyUploadFile {
  media_type: "image" | "video" | "audio" | "font" | "tmp";
  file?: Uploadable | null;
  url?: string | null;
}
