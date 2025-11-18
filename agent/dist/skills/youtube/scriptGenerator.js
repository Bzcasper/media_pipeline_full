"use strict";
/**
 * Script Generator Skill
 * Generates video scripts from queries using LLM
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptGeneratorSkill = exports.ScriptGeneratorOutput = exports.ScriptGeneratorInput = void 0;
const zod_1 = require("zod");
exports.ScriptGeneratorInput = zod_1.z.object({
    query: zod_1.z.string(),
    style: zod_1.z.enum(['documentary', 'narrative', 'educational', 'entertainment']),
    targetDuration: zod_1.z.number().default(60),
    tone: zod_1.z.enum(['formal', 'casual', 'enthusiastic', 'serious']).optional()
});
exports.ScriptGeneratorOutput = zod_1.z.object({
    script: zod_1.z.string(),
    title: zod_1.z.string(),
    hook: zod_1.z.string(),
    suggestedSceneCount: zod_1.z.number(),
    estimatedDuration: zod_1.z.number(),
    keywords: zod_1.z.array(zod_1.z.string())
});
class ScriptGeneratorSkill {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async run(input) {
        const validInput = exports.ScriptGeneratorInput.parse(input);
        this.logger.info('Generating script', { query: validInput.query });
        // In production, call Claude/GPT API for script generation
        // For now, generate a structured script based on the query
        const script = await this.generateScript(validInput);
        const sceneCount = this.calculateSceneCount(validInput.targetDuration);
        this.logger.success('Script generated', {
            length: script.script.length,
            sceneCount: sceneCount
        });
        return script;
    }
    async generateScript(input) {
        // This should call an LLM API (Claude, GPT-4, etc.)
        // For now, generate a template-based script
        const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
        if (apiKey && process.env.ANTHROPIC_API_KEY) {
            return await this.generateWithClaude(input);
        }
        else if (apiKey && process.env.OPENAI_API_KEY) {
            return await this.generateWithGPT(input);
        }
        // Fallback to template
        return this.generateTemplateScript(input);
    }
    async generateWithClaude(input) {
        const prompt = `Generate a ${input.targetDuration}-second ${input.style} video script about: "${input.query}"

Requirements:
- Engaging hook in first 3 seconds
- Clear narrative structure
- Visual descriptions for each scene
- Natural pacing for ${input.targetDuration} seconds
- ${input.tone || 'casual'} tone

Format:
TITLE: [Catchy title]
HOOK: [First 3 seconds]
SCRIPT: [Full script with scene breaks marked as [SCENE]]`;
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 2000,
                    messages: [{
                            role: 'user',
                            content: prompt
                        }]
                })
            });
            const data = await response.json();
            const text = data.content[0].text;
            return this.parseScriptResponse(text, input);
        }
        catch (error) {
            this.logger.warn('Claude API failed, using template', { error });
            return this.generateTemplateScript(input);
        }
    }
    async generateWithGPT(input) {
        const prompt = `Generate a ${input.targetDuration}-second ${input.style} video script about: "${input.query}"`;
        try {
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
                            content: prompt
                        }],
                    max_tokens: 2000
                })
            });
            const data = await response.json();
            const text = data.choices[0].message.content;
            return this.parseScriptResponse(text, input);
        }
        catch (error) {
            this.logger.warn('GPT API failed, using template', { error });
            return this.generateTemplateScript(input);
        }
    }
    parseScriptResponse(text, input) {
        const lines = text.split('\n');
        let title = input.query;
        let hook = '';
        let script = '';
        for (const line of lines) {
            if (line.startsWith('TITLE:')) {
                title = line.replace('TITLE:', '').trim();
            }
            else if (line.startsWith('HOOK:')) {
                hook = line.replace('HOOK:', '').trim();
            }
            else if (line.startsWith('SCRIPT:')) {
                script = lines.slice(lines.indexOf(line) + 1).join('\n').trim();
                break;
            }
        }
        if (!script)
            script = text;
        const sceneCount = (script.match(/\[SCENE\]/g) || []).length || this.calculateSceneCount(input.targetDuration);
        const keywords = this.extractKeywords(input.query);
        return {
            script,
            title,
            hook: hook || script.split('.')[0],
            suggestedSceneCount: sceneCount,
            estimatedDuration: input.targetDuration,
            keywords
        };
    }
    generateTemplateScript(input) {
        const sceneCount = this.calculateSceneCount(input.targetDuration);
        const script = `
[SCENE] Hook: Did you know that ${input.query}? Let's dive deep into this fascinating topic.

[SCENE] Introduction: In this video, we'll explore everything you need to know about ${input.query}. By the end, you'll have a complete understanding.

[SCENE] Main Point 1: First, let's look at the key aspects of ${input.query}. This is crucial to understand.

[SCENE] Main Point 2: Next, we'll examine how ${input.query} impacts our daily lives and why it matters.

[SCENE] Main Point 3: Here's an interesting fact that most people don't know about ${input.query}.

[SCENE] Conclusion: So there you have it - everything you need to know about ${input.query}. Don't forget to like and subscribe!
    `.trim();
        return {
            script,
            title: `Everything You Need to Know About ${input.query}`,
            hook: `Did you know that ${input.query}?`,
            suggestedSceneCount: sceneCount,
            estimatedDuration: input.targetDuration,
            keywords: this.extractKeywords(input.query)
        };
    }
    calculateSceneCount(duration) {
        // Roughly 8-10 seconds per scene
        return Math.max(4, Math.min(12, Math.ceil(duration / 8)));
    }
    extractKeywords(query) {
        return query
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 10);
    }
}
exports.ScriptGeneratorSkill = ScriptGeneratorSkill;
exports.default = ScriptGeneratorSkill;
//# sourceMappingURL=scriptGenerator.js.map