/**
 * Manual Loop Control Implementation
 * Demonstrates advanced workflow patterns for complex media pipelines
 */

import { z } from "zod";

// Import existing skills and utilities
import {
  TranscriptionSkill,
  MetadataSkill,
  AlbumCoverSkill,
  VideoGeneratorSkill,
  GCSUploadSkill,
  WeaviateIndexerSkill,
} from "./skills";
import { Logger } from "./utils";

// ========== MANUAL LOOP CONTROL IMPLEMENTATION ==========

interface ManualLoopContext {
  currentStep: number;
  maxSteps: number;
  budgetUsed: number;
  budgetLimit: number;
  activeSteps: string[];
  qualityThreshold: number;
  executionHistory: ExecutionStep[];
  jobId?: string;
}

interface ExecutionStep {
  step: number;
  stepName: string;
  input: any;
  output?: any;
  error?: string;
  duration: number;
  cost: number;
  quality: number;
  timestamp: Date;
}

interface LoopControlMetrics {
  totalCost: number;
  averageQuality: number;
  successfulSteps: number;
  failedSteps: number;
  totalDuration: number;
  budgetUtilization: number;
}

// ========== MANUAL LOOP CONTROL AGENT ==========

export class ManualLoopControlAgent {
  private logger: Logger;
  private costTracker: Map<string, number> = new Map();

  constructor() {
    this.logger = new Logger("manual-loop-agent");
  }

  /**
   * Execute manual loop with complete control
   */
  async executeManualLoop(input: {
    audioFileId?: string;
    audioUrl?: string;
    title?: string;
    artist?: string;
    budgetLimit?: number;
    qualityThreshold?: number;
    maxSteps?: number;
  }): Promise<{
    success: boolean;
    jobId: string;
    executionMode: string;
    totalSteps: number;
    steps: Array<{
      name: string;
      status: string;
      quality: number;
      duration: number;
      cost: number;
    }>;
    finalOutput: {
      transcription?: any;
      metadata?: any;
      assets?: any;
    };
    metrics: LoopControlMetrics;
    executionHistory: ExecutionStep[];
  }> {
    const jobId = `manual_${Date.now()}`;

    const context: ManualLoopContext = {
      currentStep: 0,
      maxSteps: input.maxSteps || 8,
      budgetUsed: 0,
      budgetLimit: input.budgetLimit || 1.0,
      activeSteps: [
        "transcription",
        "metadata_extraction", 
        "album_cover_generation",
        "video_generation",
        "gcs_upload",
        "weaviate_indexing"
      ],
      qualityThreshold: input.qualityThreshold || 0.7,
      executionHistory: [],
      jobId,
    };

    this.logger.info("Starting manual loop control execution", {
      maxSteps: context.maxSteps,
      budgetLimit: context.budgetLimit,
      jobId,
    });

    try {
      // Manual loop implementation - complete control over execution
      while (context.currentStep < context.maxSteps) {
        // Check if we should continue based on budget and quality
        if (context.budgetUsed >= context.budgetLimit) {
          this.logger.info("Budget limit reached, stopping loop");
          break;
        }

        // Get next step using decision logic
        const nextStep = this.decideNextStep(context, input);
        if (!nextStep) {
          this.logger.info("No more steps to execute");
          break;
        }

        // Execute the step manually
        const stepResult = await this.executeStepManually(
          nextStep,
          input,
          context
        );

        // Update context based on step results
        await this.updateContextAfterStep(stepResult, context);

        // Log metrics for analysis
        await this.logStepMetrics(stepResult, context);

        context.currentStep++;
      }

      // Compile final results
      const finalMetrics = this.calculateFinalMetrics(context);
      const finalResult = this.compileManualLoopResult(context, input);

      return {
        ...finalResult,
        metrics: finalMetrics,
        executionHistory: context.executionHistory,
      };
    } catch (error) {
      this.logger.error("Manual loop failed", {
        error,
        step: context.currentStep,
      });
      throw error;
    }
  }

  /**
   * Decide next step using decision logic
   */
  private decideNextStep(context: ManualLoopContext, input: any): string | null {
    const remainingSteps = context.activeSteps.slice(context.currentStep);
    
    // Simple decision logic - return next available step
    return remainingSteps[0] || null;
  }

  /**
   * Execute step manually with complete control
   */
  private async executeStepManually(
    stepName: string,
    input: any,
    context: ManualLoopContext
  ): Promise<ExecutionStep> {
    const startTime = Date.now();
    const step: ExecutionStep = {
      step: context.currentStep,
      stepName,
      input: {},
      duration: 0,
      cost: 0,
      quality: 0,
      timestamp: new Date(),
    };

    try {
      this.logger.info(`Executing step manually: ${stepName}`, {
        step: context.currentStep + 1,
        budget: context.budgetUsed,
        jobId: context.jobId,
      });

      // Prepare step input based on tool and context
      const stepInput = await this.prepareStepInput(stepName, input, context);
      step.input = stepInput;

      // Calculate estimated cost for this step
      const estimatedCost = this.estimateStepCost(stepName, context);

      if (context.budgetUsed + estimatedCost > context.budgetLimit) {
        throw new Error(
          `Budget would be exceeded: ${context.budgetUsed + estimatedCost} > ${
            context.budgetLimit
          }`
        );
      }

      // Execute step manually
      const result = await this.executeStep(stepName, stepInput);

      step.output = result;
      step.duration = Date.now() - startTime;
      step.cost = estimatedCost;
      step.quality = this.calculateStepQuality(result, stepName);

      context.budgetUsed += step.cost;

      this.logger.success(`Step completed: ${stepName}`, {
        duration: step.duration,
        cost: step.cost,
        quality: step.quality,
        jobId: context.jobId,
      });
    } catch (error) {
      step.error = error instanceof Error ? error.message : "Unknown error";
      step.duration = Date.now() - startTime;
      this.logger.error(`Step failed: ${stepName}`, {
        error: step.error,
        jobId: context.jobId,
      });
    }

    return step;
  }

  /**
   * Execute individual step with skill instantiation
   */
  private async executeStep(stepName: string, input: any): Promise<any> {
    switch (stepName) {
      case "transcription":
        const transcriptionSkill = new TranscriptionSkill(new Logger("manual-transcription"));
        return await transcriptionSkill.run(input);

      case "metadata_extraction":
        const metadataSkill = new MetadataSkill(new Logger("manual-metadata"));
        return await metadataSkill.run(input);

      case "album_cover_generation":
        const albumCoverSkill = new AlbumCoverSkill(new Logger("manual-album-cover"));
        return await albumCoverSkill.run(input);

      case "video_generation":
        const videoSkill = new VideoGeneratorSkill(new Logger("manual-video"));
        return await videoSkill.run(input);

      case "gcs_upload":
        const gcsSkill = new GCSUploadSkill(new Logger("manual-gcs"));
        return await gcsSkill.run(input);

      case "weaviate_indexing":
        const weaviateSkill = new WeaviateIndexerSkill(new Logger("manual-weaviate"));
        return await weaviateSkill.run(input);

      default:
        throw new Error(`Unknown step: ${stepName}`);
    }
  }

  /**
   * Prepare input for specific step based on context
   */
  private async prepareStepInput(
    stepName: string,
    input: any,
    context: ManualLoopContext
  ) {
    const jobId = context.jobId || `job_${Date.now()}`;
    const recentOutput = context.executionHistory
      .filter((h) => h.output)
      .slice(-1)[0]?.output;

    switch (stepName) {
      case "transcription":
        return {
          audioFileId: input.audioFileId,
          audioUrl: input.audioUrl,
          language: input.language || "en",
        };

      case "metadata_extraction":
        const transcription = context.executionHistory.find(
          (h) => h.stepName === "transcription"
        )?.output;
        return {
          lyrics: transcription?.text || "Sample lyrics",
          audioMetadata: {
            title: input.title,
            artist: input.artist,
            ...transcription,
          },
        };

      case "album_cover_generation":
        const metadata = context.executionHistory.find(
          (h) => h.stepName === "metadata_extraction"
        )?.output;
        return {
          title: metadata?.title || input.title || "Untitled",
          artist: metadata?.artist || input.artist,
          genre: metadata?.genre,
          lyrics: context.executionHistory.find(
            (h) => h.stepName === "transcription"
          )?.output?.text,
        };

      case "video_generation":
        const cover = context.executionHistory.find(
          (h) => h.stepName === "album_cover_generation"
        )?.output;
        return {
          audioFileId: input.audioFileId!,
          coverImageFileId: cover?.imageFileId,
          title: input.title,
          artist: input.artist,
        };

      case "gcs_upload":
        const assets = context.executionHistory
          .filter((h) =>
            ["album_cover_generation", "video_generation"].includes(h.stepName)
          )
          .reduce((acc, h) => {
            if (h.stepName === "album_cover_generation") acc.cover = h.output;
            if (h.stepName === "video_generation") acc.video = h.output;
            return acc;
          }, {} as any);

        return {
          jobId,
          files: {
            cover: { fileId: assets.cover?.imageFileId, name: "cover.png" },
            video: { fileId: assets.video?.videoFileId, name: "video.mp4" },
          },
        };

      case "weaviate_indexing":
        const metadata_final = context.executionHistory.find(
          (h) => h.stepName === "metadata_extraction"
        )?.output;
        const transcription_final = context.executionHistory.find(
          (h) => h.stepName === "transcription"
        )?.output;
        return {
          id: jobId,
          title: metadata_final?.title || input.title || "Untitled",
          artist: metadata_final?.artist || input.artist,
          lyrics: transcription_final?.text || "",
          metadata: {
            ...metadata_final,
            transcriptionMethod: transcription_final?.method,
          },
        };

      default:
        return {};
    }
  }

  /**
   * Enhanced cost estimation with detailed breakdown and budget safety
   */
  private estimateStepCost(
    stepName: string,
    context: ManualLoopContext
  ): number {
    const baseCosts = {
      transcription: 0.03,
      metadata_extraction: 0.02,
      album_cover_generation: 0.1,
      video_generation: 0.2,
      gcs_upload: 0.005,
      weaviate_indexing: 0.01,
    };

    let cost = baseCosts[stepName as keyof typeof baseCosts] || 0.02;

    // Adjust cost based on step complexity and position
    if (context.currentStep > 4) {
      cost *= 1.2; // Complex operations cost more
    }

    // Budget-aware cost adjustment with safety check
    const budgetRemaining = context.budgetLimit - context.budgetUsed;
    if (budgetRemaining < 0.1) {
      cost *= 0.8; // Cheaper operations when budget is low
    }

    // Success rate adjustment
    const recentSuccessRate = this.calculateRecentSuccessRate(
      context.executionHistory.slice(-3)
    );
    if (recentSuccessRate < 0.7) {
      cost *= 1.1; // Retry operations cost more
    }

    // Model selection impact
    if (stepName.includes("generation") || stepName.includes("extraction")) {
      cost *= 1.3; // AI-heavy operations cost more
    }

    // Ensure cost doesn't exceed remaining budget
    const maxAllowedCost = Math.max(0.001, budgetRemaining * 0.8); // Reserve 20% buffer
    cost = Math.min(cost, maxAllowedCost);

    return Math.round(cost * 1000) / 1000; // Round to 3 decimal places
  }

  /**
   * Calculate quality score for step output
   */
  private calculateStepQuality(result: any, stepName: string): number {
    if (!result) return 0.1;

    switch (stepName) {
      case "transcription":
        return result.text && result.text.length > 50 ? 0.9 : 0.4;

      case "metadata_extraction":
        return result.title && result.genre ? 0.85 : 0.5;

      case "album_cover_generation":
        return result.imageUrl ? 0.8 : 0.3;

      case "video_generation":
        return result.videoUrl ? 0.75 : 0.3;

      case "gcs_upload":
        return result.uploads ? 0.9 : 0.2;

      case "weaviate_indexing":
        return result.success !== false ? 0.8 : 0.4;

      default:
        return 0.7;
    }
  }

  /**
   * Update context after step execution
   */
  private async updateContextAfterStep(
    stepResult: ExecutionStep,
    context: ManualLoopContext
  ) {
    context.executionHistory.push(stepResult);

    // Dynamic step availability based on success
    if (stepResult.error && stepResult.quality < 0.3) {
      // Remove failed step from active list
      const stepIndex = context.activeSteps.indexOf(stepResult.stepName);
      if (stepIndex > -1) {
        context.activeSteps.splice(stepIndex, 1);
        this.logger.info(
          `Removed failed step from active list: ${stepResult.stepName}`
        );
      }
    }
  }

  /**
   * Log detailed step metrics
   */
  private async logStepMetrics(
    step: ExecutionStep,
    context: ManualLoopContext
  ) {
    this.costTracker.set(
      context.jobId || "default",
      context.budgetUsed
    );

    this.logger.info(`Step metrics: ${step.stepName}`, {
      step: step.step + 1,
      cost: step.cost.toFixed(3),
      quality: step.quality.toFixed(2),
      duration: step.duration,
      budgetUsed: context.budgetUsed.toFixed(3),
      remainingBudget: (context.budgetLimit - context.budgetUsed).toFixed(3),
      jobId: context.jobId,
    });
  }

  /**
   * Calculate recent success rate
   */
  private calculateRecentSuccessRate(history: ExecutionStep[]): number {
    if (history.length === 0) return 1.0;

    const successful = history.filter(
      (h) => !h.error && h.quality > 0.5
    ).length;
    return successful / history.length;
  }

  /**
   * Calculate final metrics
   */
  private calculateFinalMetrics(
    context: ManualLoopContext
  ): LoopControlMetrics {
    const successfulSteps = context.executionHistory.filter((s) => !s.error);
    const failedSteps = context.executionHistory.filter((s) => s.error);
    const totalDuration = context.executionHistory.reduce(
      (sum, s) => sum + s.duration,
      0
    );
    const averageQuality =
      context.executionHistory.reduce((sum, s) => sum + s.quality, 0) /
      context.executionHistory.length;

    return {
      totalCost: context.budgetUsed,
      averageQuality,
      successfulSteps: successfulSteps.length,
      failedSteps: failedSteps.length,
      totalDuration,
      budgetUtilization: (context.budgetUsed / context.budgetLimit) * 100,
    };
  }

  /**
   * Compile final result from manual loop
   */
  private compileManualLoopResult(context: ManualLoopContext, input: any) {
    const jobId = context.jobId || `manual_${Date.now()}`;
    const transcription = context.executionHistory.find(
      (s) => s.stepName === "transcription"
    )?.output;
    const metadata = context.executionHistory.find(
      (s) => s.stepName === "metadata_extraction"
    )?.output;
    const assets = {
      coverImageUrl: context.executionHistory.find(
        (s) => s.stepName === "album_cover_generation"
      )?.output?.imageUrl,
      videoUrl: context.executionHistory.find(
        (s) => s.stepName === "video_generation"
      )?.output?.videoUrl,
      gcsUrls: context.executionHistory.find((s) => s.stepName === "gcs_upload")
        ?.output?.uploads,
    };

    return {
      success:
        context.executionHistory.filter((s) => !s.error).length >=
        context.executionHistory.length * 0.7,
      jobId,
      executionMode: "manual-loop",
      totalSteps: context.executionHistory.length,
      steps: context.executionHistory.map((step) => ({
        name: step.stepName,
        status: step.error ? "failed" : "completed",
        quality: step.quality,
        duration: step.duration,
        cost: step.cost,
      })),
      finalOutput: {
        transcription,
        metadata,
        assets,
      },
    };
  }
}

export default ManualLoopControlAgent;
