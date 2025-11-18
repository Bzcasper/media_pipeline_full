/**
 * Simplified AI Chat Route - TypeScript Compatible
 * Production-ready route handler without complex agent dependencies
 */

import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import { z } from "zod";

// ========== SIMPLE TOOLS ==========

/**
 * Weather tool for demonstration
 */
const weatherTool = tool({
  description: "Get the current weather for a location",
  inputSchema: z.object({
    location: z.string().describe("The location to get weather for"),
    unit: z.enum(["celsius", "fahrenheit"]).optional().default("fahrenheit"),
  }),
  execute: async ({ location, unit }) => {
    // Simulate weather API call
    const temperature = Math.round(Math.random() * (90 - 32) + 32);
    const celsius = Math.round((temperature - 32) * (5 / 9));

    return {
      location,
      temperature: unit === "celsius" ? celsius : temperature,
      unit,
      condition: "sunny",
      humidity: Math.round(Math.random() * 100),
      windSpeed: Math.round(Math.random() * 20),
      timestamp: new Date().toISOString(),
    };
  },
});

/**
 * Budget tracking tool
 */
const budgetTool = tool({
  description: "Track and manage execution budget",
  inputSchema: z.object({
    action: z.enum(["check", "report"]),
    amount: z.number().min(0).optional(),
    operation: z.string().optional(),
  }),
  execute: async ({ action, amount = 0, operation = "default" }) => {
    switch (action) {
      case "check":
        return {
          operation,
          used: amount,
          remaining: Math.max(0, 1.0 - amount),
          utilization: (amount / 1.0) * 100,
        };
      case "report":
        return {
          totalOperations: 1,
          totalReserved: amount,
          limit: 1.0,
          available: Math.max(0, 1.0 - amount),
        };
      default:
        return { error: "Invalid action" };
    }
  },
});

// ========== NEXT.JS ROUTE HANDLER ==========

export async function POST(req: Request) {
  const requestId = generateRequestId();
  const startTime = Date.now();

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
        enableTools?: boolean;
        model?: string;
      };
    } = await req.json();

    // Structured logging instead of console
    logStructuredEvent("chat_request_received", {
      requestId,
      messageCount: messages.length,
      executionMode,
      config: {
        ...config,
        // Remove sensitive data from logs
        hasBudgetLimit: !!config.budgetLimit,
        hasModelPreference: !!config.model,
        maxSteps: config.maxSteps || 10,
      },
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get("user-agent")?.substring(0, 100) || "unknown",
    });

    // Convert UI messages to model messages
    const modelMessages = convertToModelMessages(messages);

    // Handle all modes as streaming for simplicity
    return await handleStreamingExecution(modelMessages, config, requestId);
  } catch (error) {
    const duration = Date.now() - startTime;

    // Structured error logging
    logStructuredError("chat_request_failed", error as Error, {
      requestId,
      duration,
      errorType:
        error instanceof Error ? error.constructor.name : "UnknownError",
      hasStack: error instanceof Error ? !!error.stack : false,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        requestId,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        }),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "X-Request-ID": requestId,
        },
      }
    );
  }
}

/**
 * Enhanced streaming execution with observability
 */
async function handleStreamingExecution(
  modelMessages: any[],
  config: any,
  requestId: string
): Promise<Response> {
  const executionId = generateExecutionId();
  const startTime = Date.now();

  try {
    const stopConditions = [];

    // Simple step limiting
    const maxSteps = config.maxSteps || 10;
    stopConditions.push(stepCountIs(maxSteps));

    // Enhanced tools based on configuration
    const tools =
      config.enableTools !== false
        ? {
            weather: weatherTool,
            budget: budgetTool,
          }
        : undefined;

    // Select optimal model
    const model = selectOptimalModel(config);

    // Structured execution logging
    logStructuredEvent("streaming_execution_started", {
      executionId,
      requestId,
      model,
      maxSteps,
      toolsEnabled: tools ? Object.keys(tools).length : 0,
      stopConditionsCount: stopConditions.length,
      messageCount: modelMessages.length,
      timestamp: new Date().toISOString(),
    });

    const result = streamText({
      model,
      messages: modelMessages,
      stopWhen: stopConditions.length > 1 ? stopConditions : stopConditions[0],
      tools,
      // Enhanced settings
      temperature: 0.7,
    });

    // Log successful execution start
    logStructuredEvent("streaming_execution_in_progress", {
      executionId,
      requestId,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const duration = Date.now() - startTime;

    logStructuredError("streaming_execution_failed", error as Error, {
      executionId,
      requestId,
      duration,
      model: selectOptimalModel(config),
      config: { ...config, hasTools: !!config.enableTools },
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
}

/**
 * Optimal model selection based on configuration
 */
function selectOptimalModel(config: any): string {
  // Budget-aware model selection
  if (config.budgetLimit && config.budgetLimit < 0.5) {
    return "openai:gpt-4o-mini";
  }

  // User preference
  if (config.model) {
    return config.model;
  }

  // Default model
  return "openai:gpt-4o-mini";
}

// ========== STRUCTURED LOGGING UTILITIES ==========

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate unique execution ID
 */
function generateExecutionId(): string {
  return `exec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Structured event logging utility
 */
function logStructuredEvent(eventType: string, data: any): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: "info",
    event: eventType,
    service: "chat-api",
    ...data,
    // Add environment context
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "unknown",
  };

  // Write to structured log file in development
  if (process.env.NODE_ENV === "development") {
    try {
      const fs = require("fs");
      const path = require("path");
      const logDir = path.join(process.cwd(), "logs");
      const logFile = path.join(logDir, "chat-api.log");

      // Ensure log directory exists
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      // Append structured log entry
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n");
    } catch (error) {
      // Silently fail to avoid cascading errors
    }
  }

  // In production, this would send to your monitoring service
  if (process.env.NODE_ENV === "production") {
    // Example: Send to CloudWatch, Datadog, etc.
    console.log(JSON.stringify(logEntry));
  }
}

/**
 * Structured error logging utility
 */
function logStructuredError(errorType: string, error: any, context: any): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: "error",
    event: errorType,
    service: "chat-api",
    error: {
      message: error?.message || "Unknown error",
      name: error?.name || error?.constructor?.name || "UnknownError",
      stack: error?.stack || null,
      code: error?.code || null,
    },
    context,
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "unknown",
  };

  // Write to error log file in development
  if (process.env.NODE_ENV === "development") {
    try {
      const fs = require("fs");
      const path = require("path");
      const logDir = path.join(process.cwd(), "logs");
      const errorLogFile = path.join(logDir, "chat-api-errors.log");

      // Ensure log directory exists
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      // Append structured error log entry
      fs.appendFileSync(errorLogFile, JSON.stringify(logEntry) + "\n");
    } catch (loggingError) {
      // Silently fail to avoid cascading errors
    }
  }

  // In production, this would send to your error tracking service
  if (process.env.NODE_ENV === "production") {
    // Example: Send to Sentry, Rollbar, etc.
    console.error(JSON.stringify(logEntry));
  }
}
