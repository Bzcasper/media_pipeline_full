/**
 * Media Server SDK Types
 * Auto-generated from OpenAPI specification
 */

// Base Response Types
export interface MediaServerResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  file_id?: string;
  url?: string;
}

// Storage Types
export type MediaType = 'image' | 'video' | 'audio' | 'font' | 'tmp';

export interface UploadFileParams {
  file?: File | Buffer;
  url?: string;
  media_type: MediaType;
}

export interface FileStatus {
  file_id: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  url?: string;
}

// Audio Transcription Types
export interface TranscribeParams {
  audio_file: File | Buffer;
  language?: string;
}

export interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
  confidence?: number;
}

export interface TranscriptionResult {
  text: string;
  segments?: TranscriptionSegment[];
  language?: string;
}

// TTS Types
export interface KokoroTTSParams {
  text: string;
  voice?: string;
  speed?: number;
  reverb_effect?: boolean;
}

export interface ChatterboxTTSParams {
  text: string;
  language?: string;
  sample_audio_id?: string;
  sample_audio_file?: File | Buffer;
  exaggeration?: number;
  cfg_weight?: number;
  temperature?: number;
  chunk_silence_ms?: number;
  reverb_effect?: boolean;
}

// Audio Manipulation Types
export interface MergeAudiosParams {
  audio_ids: string;
  pause?: number;
}

export interface ExtendAudioParams {
  audio_id: string;
  duration_minutes?: number;
}

export interface AlignScriptParams {
  audio_id: string;
  script: string;
  mode?: 'word' | 'sentence' | 'sentence_punc' | 'fixed_words' | 'max_chars';
  limit?: number;
  lang_code?: string;
}

export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export interface AlignScriptResult {
  segments: Array<{
    text: string;
    start: number;
    end: number;
    words: WordTiming[];
  }>;
}

// Video Types
export interface MergeVideosParams {
  video_ids: string;
  background_music_id?: string;
  normalize?: boolean;
  background_music_volume?: number;
}

export interface TranscodeVideoParams {
  video_id: string;
  codec?: string;
  quality?: number;
  bitrate?: string;
  resolution?: string;
  fps?: number;
}

export interface ExtractFrameParams {
  video_id: string;
  timestamp?: number;
}

export interface ExtractFramesParams {
  url: string;
  amount?: number;
  length_seconds?: number;
  stitch?: boolean;
}

export interface MatchDurationParams {
  video_id: string;
  audio_id?: string;
  target_duration_seconds: number;
  extend_method?: 'loop' | 'freeze';
  loop_type?: 'normal' | 'pingpong';
  speed_up_limit_percent?: number;
  slow_down_limit_percent?: number;
  remove_audio?: boolean;
}

export interface AddOverlayParams {
  video_id: string;
  overlay_id: string;
  opacity?: number;
}

// Captioned Video Types
export interface CaptionConfig {
  line_count?: number;
  line_max_length?: number;
  font_size?: number;
  font_name?: string;
  font_bold?: boolean;
  font_italic?: boolean;
  font_color?: string;
  subtitle_position?: 'top' | 'center' | 'bottom';
  shadow_color?: string;
  shadow_transparency?: number;
  shadow_blur?: number;
  stroke_color?: string;
  stroke_size?: number;
}

export interface GenerateCaptionedVideoParams {
  background_id: string;
  text?: string;
  width?: number;
  height?: number;
  audio_id?: string;
  kokoro_voice?: string;
  kokoro_speed?: number;
  language?: string;
  alignment_language_code?: string;
  font_id?: string;
  image_effect?: 'ken_burns' | 'pan' | 'still';
  caption_on?: boolean;
  caption_config_line_count?: number;
  caption_config_line_max_length?: number;
  caption_config_font_size?: number;
  caption_config_font_name?: string;
  caption_config_font_bold?: boolean;
  caption_config_font_italic?: boolean;
  caption_config_font_color?: string;
  caption_config_subtitle_position?: 'top' | 'center' | 'bottom';
  caption_config_shadow_color?: string;
  caption_config_shadow_transparency?: number;
  caption_config_shadow_blur?: number;
  caption_config_stroke_color?: string;
  caption_config_stroke_size?: number;
}

// Music Tools Types
export interface NormalizeTrackParams {
  audio_id: string;
}

export interface AnalyzeTrackParams {
  audio_id: string;
}

export interface CreateMusicVideoParams {
  audio_id: string;
  looping_video_id: string;
  intro_id?: string;
  zoom_effect?: boolean;
  blur_effect?: boolean;
}

export interface CreateMusicThumbnailParams {
  title: string;
  subtitle?: string;
  padding?: number;
  subtitle_gap?: number;
  title_font_size?: number;
  title_font_id?: string;
  subtitle_font_size?: number;
  subtitle_font_id?: string;
  text_color_hex?: string;
  image_id?: string;
  video_id?: string;
}

// Utility Types
export interface RenderHTMLParams {
  html_content: string;
  width?: number;
  height?: number;
}

export interface StitchImagesParams {
  image_urls: string;
  max_width?: number;
  max_height?: number;
}

// Error Types
export class MediaServerError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'MediaServerError';
  }
}
