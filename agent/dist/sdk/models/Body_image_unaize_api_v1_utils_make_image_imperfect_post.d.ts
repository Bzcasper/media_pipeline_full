export type Body_image_unaize_api_v1_utils_make_image_imperfect_post = {
    /**
     * ID of the image to unaize
     */
    image_id: string;
    /**
     * Strength of the color enhancement (0-2). 0 means black and white, 1 means no change, 2 means full color enhancement
     */
    enhance_color?: number;
    /**
     * Strength of the contrast enhancement (0-2)
     */
    enhance_contrast?: number;
    /**
     * Strength of the noise to apply to the image (0-100)
     */
    noise_strength?: number;
};
