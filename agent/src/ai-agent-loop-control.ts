/**
 * Media Pipeline AI SDK v6 Agent with Advanced Loop Control
 * Implements sophisticated execution flow management patterns
 */

import { tool, generateText, generateObject, streamText } from "ai";
import { z } from "zod";

// Import existing skills and tools
import {
  TranscriptionSkill,
  MetadataSkill,
  AlbumCoverSkill,
  VideoGeneratorSkill,
  GCSUploadSkill,
  WeaviateIndexerSkill,
} from "./skills";
import { Logger } from "./utils";
import { env } from "./utils/env";

// Enhanced interfaces for loop control
interface WorkflowStep {
  id: string;
  name: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  quality?: number;
  cost?: number;
  duration?: number;
  output?: any;
  error?: string;
  retries?: number;
}

interface ExecutionContext {
  jobId: string;
  stepNumber: number;
  totalSteps: number;
  budgetUsed: number;
  budgetLimit: number;
  qualityThreshold: number;
  messages: any[];
  activeTools: string[];
  model: string;
}

interface LoopControlResult {
  shouldContinue: boolean;
  stopReason?: string;
  newSettings?: Partial<ExecutionContext>;
}

// ========== CUSTOM STOP CONDITIONS ==========

// Quality-based stopping condition
function createQualityStopCondition(threshold: number = 0.8) {
  return (context: ExecutionContext) => {
    const failedSteps = context.messages.filter(
      (msg) => msg.type === "tool_result" && !msg.success
    ).length;

    const qualityScore =
      (context.totalSteps - failedSteps) / context.totalSteps;

    return qualityScore < threshold;
  };
}

// Budget-based stopping condition
function createBudgetStopCondition(limit: number = 0.5) {
  return (context: ExecutionContext) => {
    return context.budgetUsed >= limit;
  };
}

// Step count limitation
function createStepLimit(maxSteps: number = 10) {
  return (context: ExecutionContext) => {
    return context.stepNumber >= maxSteps;
  };
}

// ========== ADVANCED LOOP CONTROL AGENT ==========

export class AdvancedMediaPipelineAgent {
  private logger: Logger;
  private budgetTracker: Map<string, number> = new Map();

  constructor() {
    this.logger = new Logger("advanced-media-pipeline-agent");
  }

  /**
   * Execute pipeline with advanced loop control
   */
  async executeWithLoopControl(input: {
    audioFileId?: string;
    audioUrl?: string;
    title?: string;
    artist?: string;
    budgetLimit?: number;
    qualityThreshold?: number;
    maxSteps?: number;
  }): Promise<any> {
    const jobId = `advanced_${Date.now()}`;
    const budgetLimit = input.budgetLimit ?? 0.5;
    const qualityThreshold = input.qualityThreshold ?? 0.8;
    const maxSteps = input.maxSteps ?? 8;

    this.logger.info("Starting advanced pipeline execution", {
      jobId,
      budgetLimit,
      qualityThreshold,
      maxSteps,
    });

    const context: ExecutionContext = {
      jobId,
      stepNumber: 0,
      totalSteps: 0,
      budgetUsed: 0,
      budgetLimit,
      qualityThreshold,
      messages: [],
      activeTools: [
        "transcriptionTool",
        "metadataExtractionTool",
        "albumCoverTool",
        "videoGenerationTool",
        "gcsUploadTool",
        "weaviateIndexTool",
      ],
      model: "openai/gpt-4o-mini", // Start with efficient model
    };

    const steps: WorkflowStep[] = [];
    let currentStep = 0;

    try {
      // ===== PHASE 1: PLAN GENERATION =====
      context.totalSteps = await this.planExecution(context, input);

      // ===== PHASE 2: STEP-BY-STEP EXECUTION WITH LOOP CONTROL =====
      while (currentStep < context.totalSteps) {
        // Check stop conditions before each step
        const stopCheck = this.evaluateStopConditions(context, steps);
        if (!stopCheck.shouldContinue) {
          this.logger.info("Loop stopped", {
            reason: stopCheck.stopReason,
            stepNumber: currentStep,
            budgetUsed: context.budgetUsed,
          });
          break;
        }

        // Prepare step with dynamic settings
        const stepSettings = await this.prepareStep(
          context,
          currentStep,
          steps
        );
        if (stepSettings.newSettings) {
          Object.assign(context, stepSettings.newSettings);
        }

        // Execute current step
        const stepResult = await this.executeStep(
          currentStep,
          input,
          context,
          steps
        );

        // Update budget and quality tracking
        await this.updateExecutionMetrics(stepResult, context, steps);

        // Enhance next iteration based on results
        this.enhanceNextIteration(context, stepResult, steps);

        currentStep++;
        context.stepNumber++;
      }

      // ===== PHASE 3: QUALITY CONTROL =====
      const finalQuality = this.evaluateFinalQuality(steps);

      if (finalQuality < qualityThreshold) {
        // Trigger optimization loop
        return await this.executeOptimizationLoop(input, context, steps);
      }

      return this.compileFinalResult(steps, context);
    } catch (error) {
      this.logger.error("Advanced pipeline failed", { jobId, error });
      throw error;
    }
  }

  /**
   * Create execution plan using AI
   */
  private async planExecution(
    context: ExecutionContext,
    input: any
  ): Promise<number> {
    try {
      const plan = await generateText({
        model: context.model,
        messages: [
          {
            role: "system",
            content:
              "You are a media pipeline orchestrator. Plan the optimal execution sequence for the given media processing task.",
          },
          {
            role: "user",
            content: `Plan execution for:
            Title: ${input.title}
            Artist: ${input.artist}
            Available tools: ${context.activeTools.join(", ")}
            Budget limit: $${context.budgetLimit}
            
            Return the number of steps needed (4-8 steps).`,
          },
        ],
      });

      // Extract step count from AI response
      const stepMatch = plan.text.match(/(\d+)\s*steps?/i);
      const plannedSteps = stepMatch ? parseInt(stepMatch[1]) : 6;

      this.logger.info("Execution plan created", {
        plannedSteps,
        model: context.model,
      });
      return Math.min(plannedSteps, context.activeTools.length);
    } catch (error) {
      this.logger.warn("AI planning failed, using default", { error });
      return 6; // Default fallback
    }
  }

  /**
   * Prepare step with dynamic settings
   */
  private async prepareStep(
    context: ExecutionContext,
    stepNumber: number,
    steps: WorkflowStep[]
  ): Promise<LoopControlResult> {
    const result: LoopControlResult = { shouldContinue: true };

    // ===== DYNAMIC MODEL SELECTION =====
    if (stepNumber > 2 && context.messages.length > 10) {
      // Switch to stronger model for complex reasoning
      result.newSettings = { ...result.newSettings, model: "openai/gpt-4o" };
    }

    // ===== CONTEXT MANAGEMENT =====
    if (context.messages.length > 20) {
      // Keep only recent messages to stay within context limits
      result.newSettings = {
        ...result.newSettings,
        messages: [
          context.messages[0], // Keep system instructions
          ...context.messages.slice(-10), // Keep last 10 messages
        ],
      };
    }

    // ===== TOOL SELECTION CONTROL =====
    if (stepNumber <= 2) {
      // Search phase - only transcription tools
      result.newSettings = {
        ...result.newSettings,
        activeTools: ["transcriptionTool", "metadataExtractionTool"],
      };
    } else if (stepNumber <= 4) {
      // Generation phase - creative tools
      result.newSettings = {
        ...result.newSettings,
        activeTools: ["albumCoverTool", "videoGenerationTool"],
      };
    } else {
      // Finalization phase - infrastructure tools
      result.newSettings = {
        ...result.newSettings,
        activeTools: ["gcsUploadTool", "weaviateIndexTool"],
      };
    }

    // ===== BUDGET OPTIMIZATION =====
    const budgetRemaining = context.budgetLimit - context.budgetUsed;
    if (budgetRemaining < 0.1 && stepNumber > 1) {
      // Switch to cheaper tools/operations
      result.newSettings = {
        ...result.newSettings,
        model: "openai/gpt-3.5-turbo", // Cheaper model
      };
    }

    return result;
  }

  /**
   * Execute individual step with tool choice control
   */
  private async executeStep(
    stepIndex: number,
    input: any,
    context: ExecutionContext,
    steps: WorkflowStep[]
  ): Promise<WorkflowStep> {
    const stepMapping = [
      { name: "transcription", tool: "transcriptionTool" },
      { name: "metadata_extraction", tool: "metadataExtractionTool" },
      { name: "album_cover_generation", tool: "albumCoverTool" },
      { name: "video_generation", tool: "videoGenerationTool" },
      { name: "gcs_upload", tool: "gcsUploadTool" },
      { name: "weaviate_indexing", tool: "weaviateIndexTool" },
    ];

    const stepConfig = stepMapping[stepIndex];
    if (!stepConfig || !context.activeTools.includes(stepConfig.tool)) {
      throw new Error(`Step ${stepIndex} not available or tool not active`);
    }

    const step: WorkflowStep = {
      id: `step_${stepIndex}`,
      name: stepConfig.name,
      status: "in_progress",
      retries: 0,
    };

    try {
      this.logger.info(
        `Executing step ${stepIndex + 1}/${context.totalSteps}`,
        {
          step: stepConfig.name,
          tool: stepConfig.tool,
          model: context.model,
        }
      );

      // Execute the appropriate tool
      let result;
      switch (stepConfig.tool) {
        case "transcriptionTool":
          result = await this.executeTranscription(input, context);
          break;
        case "metadataExtractionTool":
          result = await this.executeMetadataExtraction(input, context, steps);
          break;
        case "albumCoverTool":
          result = await this.executeAlbumCover(input, context, steps);
          break;
        case "videoGenerationTool":
          result = await this.executeVideoGeneration(input, context, steps);
          break;
        case "gcsUploadTool":
          result = await this.executeGCSUpload(input, context, steps);
          break;
        case "weaviateIndexTool":
          result = await this.executeWeaviateIndex(input, context, steps);
          break;
        default:
          throw new Error(`Unknown tool: ${stepConfig.tool}`);
      }

      step.status = "completed";
      step.output = result;
      step.quality = this.calculateStepQuality(result, stepConfig.name);

      this.logger.success(`Step ${stepConfig.name} completed`, {
        quality: step.quality,
        duration: step.duration,
      });
    } catch (error) {
      step.status = "failed";
      step.error = error instanceof Error ? error.message : "Unknown error";

      // Retry logic for transient failures
      if (step.retries! < 2) {
        step.retries!++;
        this.logger.warn(`Step failed, retrying (${step.retries}/2)`, {
          step: stepConfig.name,
          error: step.error,
        });

        // Wait and retry with exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, step.retries!) * 1000)
        );
        return await this.executeStep(stepIndex, input, context, steps);
      }

      this.logger.error(`Step failed permanently`, {
        step: stepConfig.name,
        error: step.error,
      });
    }

    steps.push(step);
    return step;
  }

  /**
   * Evaluate stop conditions
   */
  private evaluateStopConditions(
    context: ExecutionContext,
    steps: WorkflowStep[]
  ): LoopControlResult {
    const conditions = [
      createQualityStopCondition(context.qualityThreshold),
      createBudgetStopCondition(context.budgetLimit),
      createStepLimit(context.totalSteps),
    ];

    for (const condition of conditions) {
      if (condition(context)) {
        return {
          shouldContinue: false,
          stopReason: condition.name || "Condition met",
        };
      }
    }

    return { shouldContinue: true };
  }

  /**
   * Update execution metrics (cost, quality, duration)
   */
  private async updateExecutionMetrics(
    step: WorkflowStep,
    context: ExecutionContext,
    steps: WorkflowStep[]
  ) {
    // Simulate cost calculation based on model and step type
    const stepCosts = {
      transcription: 0.02,
      metadata_extraction: 0.01,
      album_cover_generation: 0.08,
      video_generation: 0.15,
      gcs_upload: 0.005,
      weaviate_indexing: 0.01,
    };

    const cost = stepCosts[step.name as keyof typeof stepCosts] || 0.01;
    context.budgetUsed += cost;
    step.cost = cost;

    // Simulate duration tracking
    step.duration = Math.random() * 5000 + 1000; // 1-6 seconds

    // Store budget usage
    this.budgetTracker.set(context.jobId, context.budgetUsed);
  }

  /**
   * Enhance next iteration based on current results
   */
  private enhanceNextIteration(
    context: ExecutionContext,
    step: WorkflowStep,
    steps: WorkflowStep[]
  ) {
    // Adaptive tool selection based on quality
    if (step.quality && step.quality < 0.7) {
      // Lower quality - consider different approach
      this.logger.info(
        `Low quality detected (${step.quality}), adjusting strategy`
      );
    }

    // Dynamic message modification
    const recentResults = steps
      .slice(-3)
      .filter((s) => s.status === "completed");
    if (recentResults.length > 0) {
      const summary = recentResults
        .map((s) => `${s.name}: quality ${s.quality?.toFixed(2)}`)
        .join(", ");
      context.messages.push({
        role: "system",
        content: `Recent results summary: ${summary}`,
      });
    }
  }

  /**
   * Calculate step quality score
   */
  private calculateStepQuality(result: any, stepName: string): number {
    // Simple quality heuristics based on step type
    switch (stepName) {
      case "transcription":
        return result.text && result.text.length > 10 ? 0.9 : 0.3;
      case "metadata_extraction":
        return result.genre && result.title ? 0.85 : 0.4;
      case "album_cover_generation":
        return result.imageUrl ? 0.8 : 0.2;
      case "video_generation":
        return result.videoUrl ? 0.75 : 0.3;
      case "gcs_upload":
        return result.uploads ? 0.9 : 0.1;
      case "weaviate_indexing":
        return result.success !== false ? 0.8 : 0.2;
      default:
        return 0.7;
    }
  }

  /**
   * Evaluate final pipeline quality
   */
  private evaluateFinalQuality(steps: WorkflowStep[]): number {
    const completedSteps = steps.filter((s) => s.status === "completed");
    if (completedSteps.length === 0) return 0;

    const totalQuality = completedSteps.reduce(
      (sum, step) => sum + (step.quality || 0),
      0
    );
    return totalQuality / completedSteps.length;
  }

  /**
   * Execute optimization loop for low quality results
   */
  private async executeOptimizationLoop(
    input: any,
    context: ExecutionContext,
    steps: WorkflowStep[]
  ) {
    this.logger.info("Starting optimization loop due to low quality");

    // Re-run with enhanced settings
    const optimizedResult = await this.executeWithLoopControl({
      ...input,
      qualityThreshold: context.qualityThreshold * 0.8, // Lower threshold
      maxSteps: context.totalSteps + 2, // Allow more steps
    });

    return optimizedResult;
  }

  /**
   * Compile final result
   */
  private compileFinalResult(steps: WorkflowStep[], context: ExecutionContext) {
    const completedSteps = steps.filter((s) => s.status === "completed");
    const failedSteps = steps.filter((s) => s.status === "failed");

    return {
      success: completedSteps.length >= context.totalSteps * 0.8, // 80% success rate
      jobId: context.jobId,
      totalSteps: steps.length,
      completedSteps: completedSteps.length,
      failedSteps: failedSteps.length,
      budgetUsed: context.budgetUsed,
      budgetLimit: context.budgetLimit,
      qualityScore: this.evaluateFinalQuality(steps),
      steps: steps.map((step) => ({
        name: step.name,
        status: step.status,
        quality: step.quality,
        duration: step.duration,
        cost: step.cost,
        retries: step.retries,
      })),
      finalOutput: this.extractFinalOutput(steps),
    };
  }

  /**
   * Extract final output from completed steps
   */
  private extractFinalOutput(steps: WorkflowStep[]) {
    const transcription = steps.find((s) => s.name === "transcription")?.output;
    const metadata = steps.find(
      (s) => s.name === "metadata_extraction"
    )?.output;
    const assets = {
      coverImageUrl: steps.find((s) => s.name === "album_cover_generation")
        ?.output?.imageUrl,
      videoUrl: steps.find((s) => s.name === "video_generation")?.output
        ?.videoUrl,
      gcsUrls: steps.find((s) => s.name === "gcs_upload")?.output?.uploads,
    };

    return { transcription, metadata, assets };
  }

  // ===== INDIVIDUAL STEP EXECUTORS =====

  private async executeTranscription(input: any, context: ExecutionContext) {
    const skill = new TranscriptionSkill(this.logger);
    return await skill.run({
      audioFileId: input.audioFileId,
      audioUrl: input.audioUrl,
    });
  }

  private async executeMetadataExtraction(
    input: any,
    context: ExecutionContext,
    steps: WorkflowStep[]
  ) {
    const transcription = steps.find((s) => s.name === "transcription")?.output;
    if (!transcription?.text) throw new Error("No transcription available");

    const skill = new MetadataSkill(this.logger);
    return await skill.run({
      lyrics: transcription.text,
      audioMetadata: { title: input.title, artist: input.artist },
    });
  }

  private async executeAlbumCover(
    input: any,
    context: ExecutionContext,
    steps: WorkflowStep[]
  ) {
    const metadata = steps.find(
      (s) => s.name === "metadata_extraction"
    )?.output;
    const transcription = steps.find((s) => s.name === "transcription")?.output;

    const skill = new AlbumCoverSkill(this.logger);
    return await skill.run({
      title: metadata?.title || input.title || "Untitled",
      artist: metadata?.artist || input.artist,
      genre: metadata?.genre,
      lyrics: transcription?.text,
    });
  }

  private async executeVideoGeneration(
    input: any,
    context: ExecutionContext,
    steps: WorkflowStep[]
  ) {
    const cover = steps.find(
      (s) => s.name === "album_cover_generation"
    )?.output;

    const skill = new VideoGeneratorSkill(this.logger);
    return await skill.run({
      audioFileId: input.audioFileId!,
      coverImageFileId: cover?.imageFileId,
      title: input.title,
      artist: input.artist,
    });
  }

  private async executeGCSUpload(
    input: any,
    context: ExecutionContext,
    steps: WorkflowStep[]
  ) {
    const cover = steps.find(
      (s) => s.name === "album_cover_generation"
    )?.output;
    const video = steps.find((s) => s.name === "video_generation")?.output;

    const skill = new GCSUploadSkill(this.logger);
    return await skill.run({
      jobId: context.jobId,
      files: {
        cover: { fileId: cover?.imageFileId, name: "cover.png" },
        video: { fileId: video?.videoFileId, name: "video.mp4" },
      },
    });
  }

  private async executeWeaviateIndex(
    input: any,
    context: ExecutionContext,
    steps: WorkflowStep[]
  ) {
    const metadata = steps.find(
      (s) => s.name === "metadata_extraction"
    )?.output;
    const transcription = steps.find((s) => s.name === "transcription")?.output;

    const skill = new WeaviateIndexerSkill(this.logger);
    return await skill.run({
      id: context.jobId,
      title: metadata?.title || input.title || "Untitled",
      artist: metadata?.artist || input.artist,
      lyrics: transcription?.text || "",
    });
  }
}

export default AdvancedMediaPipelineAgent;
