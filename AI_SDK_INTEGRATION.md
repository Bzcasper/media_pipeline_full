# AI SDK v6 Integration Guide

## Overview

The system now supports **two orchestration approaches**:

1. **Custom Orchestrators** (`orchestrator.ts`, `youtube-orchestrator.ts`) - Direct skill calling
2. **AI SDK Agents** (`ai-sdk-agent.ts`) - Agent-based with call options ✨ **NEW**

## Why AI SDK Agents?

### Benefits

✅ **Type-Safe Call Options** - Dynamic configuration with Zod validation
✅ **Automatic Tool Calling** - Agent decides tool order and parameters
✅ **Model Selection** - Choose models based on complexity
✅ **Built-in Reasoning** - Agent plans and executes autonomously
✅ **Error Recovery** - Automatic retry and fallback handling
✅ **Streaming Support** - Real-time progress updates
✅ **Production Ready** - Used by Vercel AI SDK

### When to Use Each

| Use Case | Custom Orchestrator | AI SDK Agent |
|----------|---------------------|--------------|
| Fixed pipeline | ✅ Best choice | ⚠️ Overkill |
| Dynamic workflow | ⚠️ Manual logic | ✅ Automatic |
| Simple tasks | ✅ Direct control | ⚠️ Too complex |
| Complex reasoning | ⚠️ Hard to code | ✅ Agent decides |
| Cost sensitive | ✅ Predictable | ⚠️ Variable |
| User customization | ⚠️ Pre-coded paths | ✅ Flexible |

## Architecture

### AI SDK Agent System

```typescript
import { ToolLoopAgent } from 'ai';
import { z } from 'zod';

const agent = new ToolLoopAgent({
  model: anthropic('claude-3-5-sonnet-20241022'),

  // Define what options users can pass
  callOptionsSchema: z.object({
    jobId: z.string(),
    complexity: z.enum(['simple', 'complex']),
    // ... user preferences
  }),

  // Tools the agent can call
  tools: {
    generateScript: {...},
    generateImages: {...},
    // ... all pipeline skills
  },

  // Dynamic configuration based on options
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    model: options.complexity === 'complex'
      ? 'claude-3-5-sonnet-20241022'
      : 'claude-3-5-haiku-20241022',
    instructions: enhanceWith(options),
  }),
});

// Use the agent
const result = await agent.generate({
  prompt: 'Create a video about AI',
  options: {
    jobId: 'abc123',
    complexity: 'complex',
  },
});
```

## Call Options Schema

### YouTube Video Agent

```typescript
{
  jobId: string,              // Job identifier
  query: string,              // User's video query
  videoStyle: 'documentary' | 'narrative' | 'educational' | 'entertainment',
  duration: number,           // Target seconds (default: 60)
  aspectRatio: '16:9' | '9:16' | '1:1',
  voiceOver: boolean,         // Add AI voiceover
  backgroundMusic: boolean,   // Add background music
  complexity: 'simple' | 'complex',  // Model selection
  userPreferences: {
    imageStyle?: string,      // Custom image style
    voiceType?: string,       // Voice preference
    musicGenre?: string,      // Music genre
  }
}
```

### Music Video Agent

```typescript
{
  jobId: string,
  audioFileId: string,        // Uploaded audio file
  title?: string,
  artist?: string,
  album?: string,
  transcriptionMethod: 'riva' | 'whisper' | 'auto',
}
```

## Dynamic Model Selection

```typescript
prepareCall: ({ options, ...settings }) => {
  // Use cheaper model for simple tasks
  const model = options.complexity === 'simple'
    ? anthropic('claude-3-5-haiku-20241022')   // Fast & cheap
    : anthropic('claude-3-5-sonnet-20241022'); // Powerful

  return { ...settings, model };
}
```

**Cost Savings:** Haiku is 10x cheaper than Sonnet for simple queries!

## API Endpoints

### Version 1 (Custom Orchestrator)
```
POST /api/youtube/create    - Original implementation
POST /api/upload            - Original implementation
```

### Version 2 (AI SDK Agent) ✨ **NEW**
```
POST /api/youtube/create-v2 - Agent-based YouTube
POST /api/upload-v2         - Agent-based Music
```

## Usage Examples

### YouTube Video with Agent

```typescript
// Frontend
const response = await fetch('/api/youtube/create-v2', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'The future of renewable energy',
    videoStyle: 'documentary',
    duration: 120,
    aspectRatio: '16:9',
    voiceOver: true,
    complexity: 'complex', // Use best model
    userPreferences: {
      imageStyle: 'cinematic realism',
      voiceType: 'professional narrator',
      musicGenre: 'ambient'
    }
  })
});

// Backend (automatic tool calling)
const result = await youtubeVideoAgent.generate({
  prompt: 'Create documentary video...',
  options: { /* ... */ }
});
```

### Music Upload with Agent

```typescript
const formData = new FormData();
formData.append('file', audioFile);
formData.append('title', 'My Song');
formData.append('transcriptionMethod', 'auto');

const response = await fetch('/api/upload-v2', {
  method: 'POST',
  body: formData
});
```

## Tool Definitions

Each skill is wrapped as an agent tool:

```typescript
tools: {
  generateScript: {
    description: 'Generate a video script from a query',
    parameters: z.object({
      query: z.string(),
      style: z.string(),
      targetDuration: z.number(),
    }),
    execute: async ({ query, style, targetDuration }) => {
      const skill = new ScriptGeneratorSkill(logger);
      return await skill.run({ query, style, targetDuration });
    },
  },
  // ... more tools
}
```

## Agent Decision Making

The agent **autonomously decides**:

1. **Tool Order** - Which tools to call and when
2. **Parameters** - What parameters to pass to each tool
3. **Retries** - When to retry failed operations
4. **Branching** - Different paths based on results

Example agent reasoning:

```
User Query: "Create an educational video about photosynthesis"

Agent's Plan:
1. Call generateScript with style='educational'
2. If script is good, call chunkScript with targetScenes=8
3. Call generateImagePrompts for each scene
4. Call generateImages in parallel batches
5. Call validateImages to check quality
6. If quality issues detected, call generateImages again
7. Call animateImages for each validated image
8. Call assembleVideo with voiceOver=true
9. Update job state throughout
```

## Advanced Patterns

### RAG Integration

```typescript
prepareCall: async ({ options, ...settings }) => {
  // Fetch relevant context
  const docs = await weaviate.search(options.query);

  return {
    ...settings,
    instructions: `${settings.instructions}

**Relevant Context:**
${docs.map(d => d.content).join('\n\n')}`,
  };
}
```

### User Preferences

```typescript
prepareCall: ({ options, ...settings }) => ({
  ...settings,
  instructions: `${settings.instructions}

**User Preferences:**
- Image Style: ${options.userPreferences?.imageStyle || 'default'}
- Voice Type: ${options.userPreferences?.voiceType || 'default'}
- Music Genre: ${options.userPreferences?.musicGenre || 'none'}

Apply these preferences to all generated content.`,
})
```

### Role-Based Access

```typescript
callOptionsSchema: z.object({
  userRole: z.enum(['free', 'pro', 'enterprise']),
  // ...
}),

prepareCall: ({ options, ...settings }) => {
  const limits = {
    free: { duration: 60, quality: 'standard' },
    pro: { duration: 180, quality: 'high' },
    enterprise: { duration: 600, quality: 'ultra' },
  };

  return {
    ...settings,
    instructions: `${settings.instructions}

User limits: ${JSON.stringify(limits[options.userRole])}`,
  };
}
```

## Migration Guide

### From Custom Orchestrator to AI SDK Agent

**Before (Custom):**
```typescript
const orchestrator = new YouTubeVideoOrchestrator();
const result = await orchestrator.run({
  query: 'AI history',
  videoStyle: 'educational',
});
```

**After (AI SDK):**
```typescript
const result = await youtubeVideoAgent.generate({
  prompt: 'Create educational video about AI history',
  options: {
    jobId: uuidv4(),
    query: 'AI history',
    videoStyle: 'educational',
    duration: 60,
    aspectRatio: '16:9',
    voiceOver: true,
    complexity: 'simple',
  },
});
```

## Performance Comparison

| Metric | Custom Orchestrator | AI SDK Agent |
|--------|---------------------|--------------|
| Setup Time | Fast (pre-coded) | Slower (reasoning) |
| Execution | Predictable | Variable |
| Flexibility | Low | High |
| Error Handling | Manual | Automatic |
| Cost | Fixed | Variable (by complexity) |
| Customization | Code changes | Call options |

## Best Practices

### 1. Choose the Right Approach

**Use Custom Orchestrator when:**
- Pipeline is fixed and well-defined
- Cost predictability is critical
- Execution speed matters most
- You want direct control

**Use AI SDK Agent when:**
- Users need customization
- Requirements vary per request
- Complex reasoning needed
- Automatic tool selection preferred

### 2. Optimize Call Options

```typescript
// Good: Specific, typed options
options: {
  complexity: 'simple',    // Clear choice
  voiceOver: true,         // Boolean
  duration: 60,            // Exact number
}

// Bad: Vague options
options: {
  quality: 'good',         // Ambiguous
  features: 'some',        // Unclear
}
```

### 3. Handle Errors

```typescript
try {
  const result = await agent.generate({ prompt, options });
} catch (error) {
  if (error.type === 'model_error') {
    // Fallback to custom orchestrator
    return await fallbackOrchestrator.run(options);
  }
  throw error;
}
```

### 4. Monitor Costs

```typescript
const result = await agent.generate({
  prompt,
  options: {
    complexity: userRole === 'free' ? 'simple' : 'complex',
  },
});
```

## Testing

```typescript
import { youtubeVideoAgent } from './ai-sdk-agent';

describe('YouTube Video Agent', () => {
  it('generates video with simple complexity', async () => {
    const result = await youtubeVideoAgent.generate({
      prompt: 'Create video about cats',
      options: {
        jobId: 'test-123',
        query: 'cats',
        videoStyle: 'entertainment',
        duration: 30,
        complexity: 'simple',
      },
    });

    expect(result).toHaveProperty('finalVideoUrl');
  });
});
```

## Deployment

```bash
# Install AI SDK
npm install ai @ai-sdk/anthropic @ai-sdk/openai

# Set API keys
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...

# Deploy
npm run build && npm start
```

## Future Enhancements

- [ ] Streaming responses for real-time updates
- [ ] Multi-agent collaboration
- [ ] Custom tool marketplace
- [ ] Agent performance analytics
- [ ] A/B testing different agents
- [ ] Agent version management

## Resources

- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Call Options Guide](https://sdk.vercel.ai/docs/agents/call-options)
- [ToolLoopAgent API](https://sdk.vercel.ai/docs/agents/tool-loop-agent)
- [Anthropic Claude](https://anthropic.com)

---

**Built with ❤️ using AI SDK v6**

Both orchestration methods are production-ready - choose based on your needs!
