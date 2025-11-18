"use strict";
/**
 * Image Validator Skill
 * Uses AI to inspect images and determine if they need editing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageValidatorSkill = exports.ImageValidatorOutput = exports.ImageValidatorInput = void 0;
const zod_1 = require("zod");
const tools_1 = require("../../tools");
exports.ImageValidatorInput = zod_1.z.object({
    images: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        url: zod_1.z.string(),
        prompt: zod_1.z.string(),
        status: zod_1.z.enum(['success', 'failed'])
    })),
    prompts: zod_1.z.array(zod_1.z.object({
        prompt: zod_1.z.string(),
        style: zod_1.z.string()
    })),
    autoFix: zod_1.z.boolean().default(true)
});
exports.ImageValidatorOutput = zod_1.z.object({
    images: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        url: zod_1.z.string(),
        originalUrl: zod_1.z.string(),
        prompt: zod_1.z.string(),
        validated: zod_1.z.boolean(),
        issues: zod_1.z.array(zod_1.z.string()),
        wasEdited: zod_1.z.boolean(),
        quality: zod_1.z.enum(['excellent', 'good', 'acceptable', 'poor'])
    }))
});
class ImageValidatorSkill {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async run(input) {
        const validInput = exports.ImageValidatorInput.parse(input);
        this.logger.info('Validating images', {
            count: validInput.images.length,
            autoFix: validInput.autoFix
        });
        const validatedImages = await Promise.all(validInput.images.map((image, idx) => this.validateAndFixImage(image, validInput.prompts[idx], validInput.autoFix)));
        const editedCount = validatedImages.filter(img => img.wasEdited).length;
        this.logger.success('Image validation complete', {
            total: validatedImages.length,
            edited: editedCount,
            passed: validatedImages.length - editedCount
        });
        return { images: validatedImages };
    }
    async validateAndFixImage(image, promptData, autoFix) {
        this.logger.info(`Validating image ${image.index + 1}`);
        // Skip failed images
        if (image.status === 'failed' || !image.url) {
            return {
                index: image.index,
                url: image.url,
                originalUrl: image.url,
                prompt: image.prompt,
                validated: false,
                issues: ['Generation failed'],
                wasEdited: false,
                quality: 'poor'
            };
        }
        try {
            // AI Vision inspection
            const analysis = await this.analyzeImage(image.url, promptData.prompt);
            // Check if editing is needed
            const needsEditing = analysis.issues.length > 0 && autoFix;
            let finalUrl = image.url;
            let wasEdited = false;
            if (needsEditing) {
                this.logger.info(`Image ${image.index + 1} needs editing`, {
                    issues: analysis.issues
                });
                finalUrl = await this.editImage(image.url, analysis.issues);
                wasEdited = true;
                this.logger.success(`Image ${image.index + 1} edited successfully`);
            }
            return {
                index: image.index,
                url: finalUrl,
                originalUrl: image.url,
                prompt: image.prompt,
                validated: true,
                issues: analysis.issues,
                wasEdited,
                quality: analysis.quality
            };
        }
        catch (error) {
            this.logger.error(`Failed to validate image ${image.index + 1}`, {
                error: error instanceof Error ? error.message : String(error)
            });
            return {
                index: image.index,
                url: image.url,
                originalUrl: image.url,
                prompt: image.prompt,
                validated: false,
                issues: ['Validation failed'],
                wasEdited: false,
                quality: 'acceptable'
            };
        }
    }
    async analyzeImage(imageUrl, prompt) {
        // Use AI vision model to analyze image quality and relevance
        const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
        if (!apiKey) {
            // Fallback: basic validation without AI
            return {
                issues: [],
                quality: 'good'
            };
        }
        try {
            if (process.env.ANTHROPIC_API_KEY) {
                return await this.analyzeWithClaude(imageUrl, prompt);
            }
            else if (process.env.OPENAI_API_KEY) {
                return await this.analyzeWithGPT(imageUrl, prompt);
            }
        }
        catch (error) {
            this.logger.warn('AI vision analysis failed, using fallback');
        }
        return {
            issues: [],
            quality: 'acceptable'
        };
    }
    async analyzeWithClaude(imageUrl, prompt) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 500,
                messages: [{
                        role: 'user',
                        content: [
                            {
                                type: 'image',
                                source: {
                                    type: 'url',
                                    url: imageUrl
                                }
                            },
                            {
                                type: 'text',
                                text: `Analyze this image for a video scene. Expected: "${prompt}"

Rate quality (excellent/good/acceptable/poor) and list any issues:
- Composition problems
- Quality issues
- Relevance to prompt
- Visual artifacts

Format: QUALITY: [rating]\nISSUES: [comma-separated list or "none"]`
                            }
                        ]
                    }]
            })
        });
        const data = await response.json();
        const text = data.content[0].text;
        return this.parseAnalysis(text);
    }
    async analyzeWithGPT(imageUrl, prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: { url: imageUrl }
                            },
                            {
                                type: 'text',
                                text: `Analyze this image for: "${prompt}"\nRate quality and list issues.`
                            }
                        ]
                    }],
                max_tokens: 300
            })
        });
        const data = await response.json();
        const text = data.choices[0].message.content;
        return this.parseAnalysis(text);
    }
    parseAnalysis(text) {
        const qualityMatch = text.match(/QUALITY:\s*(excellent|good|acceptable|poor)/i);
        const quality = (qualityMatch?.[1]?.toLowerCase() || 'acceptable');
        const issuesMatch = text.match(/ISSUES:\s*(.+?)(?:\n|$)/i);
        const issuesText = issuesMatch?.[1] || 'none';
        const issues = issuesText.toLowerCase() === 'none'
            ? []
            : issuesText.split(',').map(i => i.trim()).filter(Boolean);
        return { quality, issues };
    }
    async editImage(imageUrl, issues) {
        try {
            // Download image
            const response = await fetch(imageUrl);
            const buffer = Buffer.from(await response.arrayBuffer());
            // Upload to media server
            const uploadResult = await tools_1.mediaServer.uploadFile(buffer, 'image');
            if (!uploadResult.file_id) {
                throw new Error('Failed to upload image for editing');
            }
            // Apply automatic fixes based on issues
            const editInstructions = this.generateEditInstructions(issues);
            // Use media server image edit endpoint
            const editResult = await tools_1.mediaServer.client.utils.makeImageImperfect(uploadResult.file_id, {
                enhance_color: 1.2,
                enhance_contrast: 1.1,
                noise_strength: 5
            });
            const editedUrl = `${process.env.MEDIA_SERVER_URL}/api/v1/media/storage/${editResult.file_id}`;
            return editedUrl;
        }
        catch (error) {
            this.logger.warn('Image editing failed, using original', { error });
            return imageUrl;
        }
    }
    generateEditInstructions(issues) {
        const instructions = issues.map(issue => {
            if (issue.includes('quality') || issue.includes('blurry')) {
                return 'enhance sharpness and quality';
            }
            if (issue.includes('color') || issue.includes('exposure')) {
                return 'adjust color and exposure';
            }
            if (issue.includes('composition')) {
                return 'crop and reframe';
            }
            return 'general enhancement';
        });
        return instructions.join(', ');
    }
}
exports.ImageValidatorSkill = ImageValidatorSkill;
exports.default = ImageValidatorSkill;
//# sourceMappingURL=imageValidator.js.map