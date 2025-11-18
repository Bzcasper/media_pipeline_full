/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request model for revenge story video generation
 */
export type RevengeStoryVideoRequest = {
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
};

