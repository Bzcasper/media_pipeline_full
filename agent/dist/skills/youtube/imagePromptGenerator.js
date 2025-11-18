"use strict";
/**
 * Image Prompt Generator Skill
 * Creates detailed image generation prompts from script scenes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagePromptGeneratorSkill = exports.ImagePromptGeneratorOutput = exports.ImagePromptGeneratorInput = void 0;
const zod_1 = require("zod");
exports.ImagePromptGeneratorInput = zod_1.z.object({
    scenes: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        text: zod_1.z.string(),
        visualDescription: zod_1.z.string()
    })),
    style: zod_1.z.enum(['documentary', 'narrative', 'educational', 'entertainment']),
    aspectRatio: zod_1.z.enum(['16:9', '9:16', '1:1']).default('16:9')
});
exports.ImagePromptGeneratorOutput = zod_1.z.object({
    prompts: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        prompt: zod_1.z.string(),
        negativePrompt: zod_1.z.string(),
        videoMotion: zod_1.z.string(),
        style: zod_1.z.string()
    }))
});
class ImagePromptGeneratorSkill {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async run(input) {
        const validInput = exports.ImagePromptGeneratorInput.parse(input);
        this.logger.info('Generating image prompts', {
            sceneCount: validInput.scenes.length
        });
        const prompts = await Promise.all(validInput.scenes.map((scene) => this.generatePromptForScene(scene, validInput)));
        this.logger.success('Image prompts generated', {
            count: prompts.length
        });
        return { prompts };
    }
    async generatePromptForScene(scene, config) {
        // In production, use LLM to generate detailed, optimized prompts
        const basePrompt = await this.createDetailedPrompt(scene.text, scene.visualDescription, config.style);
        const styleModifiers = this.getStyleModifiers(config.style);
        const qualityTags = this.getQualityTags(config.aspectRatio);
        const prompt = `${basePrompt}, ${styleModifiers}, ${qualityTags}`;
        const negativePrompt = this.getNegativePrompt();
        const videoMotion = this.generateVideoMotion(scene.text);
        return {
            index: scene.index,
            prompt,
            negativePrompt,
            videoMotion,
            style: config.style
        };
    }
    async createDetailedPrompt(text, visualDesc, style) {
        // Extract key subjects and actions
        const subjects = this.extractSubjects(text);
        const actions = this.extractActions(text);
        const setting = this.extractSetting(text);
        let prompt = '';
        if (setting) {
            prompt += `${setting}, `;
        }
        if (subjects.length > 0) {
            prompt += `featuring ${subjects.join(', ')}, `;
        }
        if (actions.length > 0) {
            prompt += `${actions.join(', ')}, `;
        }
        prompt += visualDesc;
        return prompt.trim();
    }
    extractSubjects(text) {
        // Simple subject extraction (in production, use NLP)
        const commonSubjects = ['person', 'people', 'man', 'woman', 'child', 'animal', 'object', 'building', 'landscape'];
        return commonSubjects.filter(s => text.toLowerCase().includes(s));
    }
    extractActions(text) {
        // Simple action extraction
        const commonActions = ['walking', 'running', 'talking', 'working', 'studying', 'playing', 'showing', 'demonstrating'];
        return commonActions.filter(a => text.toLowerCase().includes(a));
    }
    extractSetting(text) {
        const settings = {
            'outdoor': ['outside', 'park', 'street', 'nature', 'outdoor'],
            'indoor': ['inside', 'room', 'office', 'home', 'indoor'],
            'urban': ['city', 'urban', 'building', 'downtown'],
            'natural': ['forest', 'mountain', 'beach', 'nature', 'landscape']
        };
        for (const [setting, keywords] of Object.entries(settings)) {
            if (keywords.some(k => text.toLowerCase().includes(k))) {
                return setting;
            }
        }
        return 'cinematic scene';
    }
    getStyleModifiers(style) {
        const modifiers = {
            documentary: 'photorealistic, documentary style, natural lighting, authentic',
            narrative: 'cinematic, dramatic lighting, storytelling composition',
            educational: 'clean, clear, well-lit, professional, informative',
            entertainment: 'vibrant, energetic, engaging, dynamic composition'
        };
        return modifiers[style] || modifiers.educational;
    }
    getQualityTags(aspectRatio) {
        const baseTags = 'high quality, detailed, professional, 4k, sharp focus';
        const ratioTags = {
            '16:9': 'widescreen composition',
            '9:16': 'vertical composition, mobile-optimized',
            '1:1': 'square composition, balanced framing'
        };
        return `${baseTags}, ${ratioTags[aspectRatio]}`;
    }
    getNegativePrompt() {
        return 'blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, text, signature, amateur';
    }
    generateVideoMotion(text) {
        // Determine camera motion based on scene context
        const motionKeywords = {
            'zoom in': ['close', 'detail', 'focus'],
            'zoom out': ['reveal', 'wide', 'panorama'],
            'pan right': ['across', 'move', 'sweep'],
            'tilt up': ['rise', 'ascend', 'upward'],
            'static': ['still', 'stable', 'steady']
        };
        for (const [motion, keywords] of Object.entries(motionKeywords)) {
            if (keywords.some(k => text.toLowerCase().includes(k))) {
                return `${motion}, smooth camera movement, professional cinematography`;
            }
        }
        return 'subtle camera movement, dynamic composition, cinematic motion';
    }
}
exports.ImagePromptGeneratorSkill = ImagePromptGeneratorSkill;
exports.default = ImagePromptGeneratorSkill;
//# sourceMappingURL=imagePromptGenerator.js.map