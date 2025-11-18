/**
 * Next.js App Router AI SDK v6 Integration
 * Modern patterns for streaming chat with advanced loop control
 */

import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
  generateText,
  generateObject,
} from "ai";
import { z } from "zod";

// Import our advanced loop control systems
import { AdvancedMediaPipelineAgent } from "./ai-agent-loop-control";
import { ManualLoopControlAgent } from "./manual-loop-control";
import { Logger } from "./utils";

// ========== ADVANCED NEXT.JS ROUTE HANDLER ==========

export class NextJSAIRouter {
  private logger: Logger;
  private advancedAgent: AdvancedMediaPipelineAgent;
  private manualAgent: ManualLoopControlAgent;

  constructor() {
    this.logger = new Logger("nextjs-ai-router");
    this.advancedAgent = new AdvancedMediaPipelineAgent();
    this.manualAgent = new ManualLoopControlAgent();
  }

  /**
   * Modern Next.js App Router pattern with AI SDK v6
   * Enhanced with advanced loop control capabilities
   */
  async handleChatRequest(req: Request): Promise<Response> {
    try {
      const {
        messages,
        executionMode = "streaming",
        config = {},
      }: {
        messages: UIMessage[];
        executionMode?: "streaming" | "advanced-loop" | "manual-loop";
        config?: {
          budgetLimit?: number;
          qualityThreshold?: number;
          maxSteps?: number;
          enableToolCalls?: boolean;
        };
      } = await req.json();

      this.logger.info("Chat request received", {
        messageCount: messages.length,
        executionMode,
        config,
      });

      // Convert UI messages to model messages
      const modelMessages = convertToModelMessages(messages);

      // Choose execution strategy based on mode
      switch (executionMode) {
        case "advanced-loop":
          return await this.handleAdvancedLoopExecution(modelMessages, config);
        case "manual-loop":
          return await this.handleManualLoopExecution(modelMessages, config);
        case "streaming":
        default:
          return await this.handleStreamingExecution(modelMessages, config);
      }
    } catch (error) {
      this.logger.error("Chat request failed", { error });
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  /**
   * Advanced streaming with stopWhen conditions
   */
  private async handleStreamingExecution(
    modelMessages: any[],
    config: any
  ): Promise<Response> {
    const stopConditions = [];

    // Budget-based stopping
    if (config.budgetLimit) {
      stopConditions.push(createBudgetStopCondition(config.budgetLimit));
    }

    // Quality-based stopping
    if (config.qualityThreshold) {
      stopConditions.push(createQualityStopCondition(config.qualityThreshold));
    }

    // Step count limiting
    if (config.maxSteps) {
      stopConditions.push(stepCountIs(config.maxSteps));
    } else {
      stopConditions.push(stepCountIs(10)); // Default 10 steps
    }

    const tools = config.enableToolCalls ? this.createAdvancedTools() : {};

    const result = streamText({
      model: this.selectOptimalModel(config),
      messages: modelMessages,
      stopWhen: stopConditions.length > 1 ? stopConditions : stopConditions[0],
      tools,
    });

    return result.toUIMessageStreamResponse();
  }

  /**
   * Advanced loop control execution
   */
  private async handleAdvancedLoopExecution(
    modelMessages: any[],
    config: any
  ): Promise<Response> {
    this.logger.info("Using advanced loop control execution");

    // Extract media processing request from messages
    const mediaRequest = this.extractMediaRequest(modelMessages);

    // Execute with advanced loop control
    const result = await this.advancedAgent.executeWithLoopControl({
      ...mediaRequest,
      budgetLimit: config.budgetLimit,
      qualityThreshold: config.qualityThreshold,
      maxSteps: config.maxSteps,
    });

    // Convert result to streaming format
    return new Response(
      JSON.stringify({
        type: "advanced-loop-result",
        result,
        executionMode: "advanced-loop",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "X-Execution-Mode": "advanced-loop",
        },
      }
    );
  }

  /**
   * Manual loop control execution
   */
  private async handleManualLoopExecution(
    modelMessages: any[],
    config: any
  ): Promise<Response> {
    this.logger.info("Using manual loop control execution");

    const mediaRequest = this.extractMediaRequest(modelMessages);

    const result = await this.manualAgent.executeManualLoop({
      ...mediaRequest,
      budgetLimit: config.budgetLimit,
      qualityThreshold: config.qualityThreshold,
      maxSteps: config.maxSteps,
    });

    return new Response(
      JSON.stringify({
        type: "manual-loop-result",
        result,
        executionMode: "manual-loop",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "X-Execution-Mode": "manual-loop",
        },
      }
    );
  }

  /**
   * Create advanced tools with proper schemas and descriptions
   */
  private createAdvancedTools() {
    return {
      // Weather tool (as per Next.js example)
      weather: tool({
        description: "Get the current weather for a location",
        inputSchema: z.object({
          location: z.string().describe("The location to get weather for"),
          unit: z
            .enum(["celsius", "fahrenheit"])
            .optional()
            .default("fahrenheit"),
        }),
        execute: async ({ location, unit }) => {
          this.logger.info("Weather tool called", { location, unit });

          // Simulate API call
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          const celsius = Math.round((temperature - 32) * (5 / 9));

          return {
            location,
            temperature: unit === "celsius" ? celsius : temperature,
            unit,
            condition: "sunny",
            humidity: Math.round(Math.random() * 100),
            windSpeed: Math.round(Math.random() * 20),
          };
        },
      }),

      // Media pipeline tools
      transcribeAudio: tool({
        description: "Transcribe audio file to text using AI",
        inputSchema: z.object({
          audioUrl: z.string().describe("URL of the audio file to transcribe"),
          language: z.string().optional().default("en"),
        }),
        execute: async ({ audioUrl, language }) => {
          this.logger.info("Audio transcription called", {
            audioUrl,
            language,
          });

          // Simulate transcription
          return {
            text: "This is a simulated transcription of the audio content.",
            confidence: 0.95,
            language,
            duration: 180,
            segments: [
              { text: "Hello world", start: 0, end: 2.5, confidence: 0.98 },
            ],
          };
        },
      }),

      // Budget tracking tool
      trackBudget: tool({
        description: "Track and estimate execution costs",
        inputSchema: z.object({
          operation: z.enum(["estimate", "track", "limit"]),
          cost: z.number().optional(),
          remaining: z.number().optional(),
        }),
        execute: async ({ operation, cost, remaining }) => {
          const safeRemaining = remaining ?? 1.0;
          return {
            operation,
            cost: cost || 0,
            remaining: safeRemaining,
            utilization: cost ? (cost / (cost + safeRemaining)) * 100 : 0,
          };
        },
      }),

      // Quality assessment tool
      assessQuality: tool({
        description: "Assess the quality of generated content",
        inputSchema: z.object({
          content: z.string(),
          type: z.enum(["text", "image", "audio", "video"]),
          criteria: z.array(z.string()).optional(),
        }),
        execute: async ({ content, type, criteria }) => {
          // Simulate quality assessment
          const baseScore = Math.random() * 0.3 + 0.7; // 0.7-1.0 range

          return {
            score: baseScore,
            maxScore: 1.0,
            breakdown: {
              accuracy: baseScore * 0.9,
              relevance: baseScore * 0.95,
              completeness: baseScore * 0.85,
            },
            recommendations:
              baseScore < 0.8
                ? [
                    "Consider improving content accuracy",
                    "Enhance relevance to query",
                  ]
                : [],
          };
        },
      }),
    };
  }

  /**
   * Optimal model selection based on configuration
   */
  private selectOptimalModel(config: any): string {
    // Use larger models for complex reasoning
    if (config.maxSteps && config.maxSteps > 5) {
      return "openai/gpt-4o";
    }

    // Budget-aware model selection
    if (config.budgetLimit && config.budgetLimit < 0.5) {
      return "openai/gpt-4o-mini";
    }

    // Default model
    return "openai/gpt-4o-mini";
  }

  /**
   * Extract media processing request from chat messages
   */
  private extractMediaRequest(modelMessages: any[]): any {
    const lastMessage = modelMessages[modelMessages.length - 1];

    // Parse media processing intent from user message
    const content = lastMessage.content.toLowerCase();

    if (
      content.includes("audio") ||
      content.includes("music") ||
      content.includes("song")
    ) {
      return {
        audioFileId: "demo-audio",
        audioUrl: "https://example.com/demo.mp3",
        title: this.extractTitle(content),
        artist: this.extractArtist(content),
      };
    }

    // Default request
    return {
      audioFileId: "demo-audio",
      title: "Demo Track",
      artist: "Demo Artist",
    };
  }

  /**
   * Extract title from message content
   */
  private extractTitle(content: string): string {
    const titleMatch = content.match(/title[:\s]+([^,\n]+)/i);
    return titleMatch ? titleMatch[1].trim() : "Untitled";
  }

  /**
   * Extract artist from message content
   */
  private extractArtist(content: string): string {
    const artistMatch = content.match(/artist[:\s]+([^,\n]+)/i);
    return artistMatch ? artistMatch[1].trim() : "Unknown Artist";
  }
}

// ========== CUSTOM STOP CONDITIONS ==========

function createBudgetStopCondition(limit: number) {
  return (stepResult: any) => {
    const currentSpend = stepResult.usage?.totalCost || 0;
    return currentSpend >= limit;
  };
}

function createQualityStopCondition(threshold: number) {
  return (stepResult: any) => {
    const qualityScore = stepResult.quality?.score || 0.8;
    return qualityScore < threshold;
  };
}

// Export for use in route handlers
export const nextJSAIRouter = new NextJSAIRouter();

// ========== UTILITY FUNCTIONS FOR CLIENT-SIDE ==========

export function createChatConfig(options: {
  executionMode?: "streaming" | "advanced-loop" | "manual-loop";
  budgetLimit?: number;
  qualityThreshold?: number;
  maxSteps?: number;
  enableToolCalls?: boolean;
}) {
  return {
    executionMode: options.executionMode || "streaming",
    budgetLimit: options.budgetLimit || 1.0,
    qualityThreshold: options.qualityThreshold || 0.8,
    maxSteps: options.maxSteps || 10,
    enableToolCalls: options.enableToolCalls !== false,
  };
}

export function formatToolResult(result: any): string {
  if (typeof result === "object") {
    return JSON.stringify(result, null, 2);
  }
  return String(result);
}

export function isToolCall(part: any): boolean {
  return part.type?.startsWith("tool-");
}

export function getToolName(part: any): string | null {
  if (isToolCall(part)) {
    return part.type.replace("tool-", "");
  }
  return null;
}

export default NextJSAIRouter;
