/**
 * Manual Loop Control Agent Tests
 * Comprehensive test coverage for the manual loop control implementation
 */

import { describe, it, expect, beforeEach, jest } from "jest";
import { ManualLoopControlAgent } from "../manual-loop-control";
import { Logger } from "../utils";

// Mock Logger to avoid console output during tests
jest.mock("../utils", () => ({
  Logger: jest.fn().mockImplementation(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    success: jest.fn(),
  })),
}));

// Mock skills to avoid external dependencies
jest.mock("../skills", () => ({
  TranscriptionSkill: jest.fn().mockImplementation(() => ({
    run: jest.fn().mockResolvedValue({
      text: "Sample transcribed text",
      method: "riva",
      language: "en",
    }),
  })),
  MetadataSkill: jest.fn().mockImplementation(() => ({
    run: jest.fn().mockResolvedValue({
      title: "Test Song",
      artist: "Test Artist",
      genre: "rock",
    }),
  })),
  AlbumCoverSkill: jest.fn().mockImplementation(() => ({
    run: jest.fn().mockResolvedValue({
      imageFileId: "cover_123",
      imageUrl: "https://example.com/cover.jpg",
    }),
  })),
  VideoGeneratorSkill: jest.fn().mockImplementation(() => ({
    run: jest.fn().mockResolvedValue({
      videoFileId: "video_456",
      videoUrl: "https://example.com/video.mp4",
    }),
  })),
  GCSUploadSkill: jest.fn().mockImplementation(() => ({
    run: jest.fn().mockResolvedValue({
      uploads: {
        cover: {
          path: "/uploads/cover.png",
          url: "https://example.com/cover.png",
        },
        video: {
          path: "/uploads/video.mp4",
          url: "https://example.com/video.mp4",
        },
      },
    }),
  })),
  WeaviateIndexerSkill: jest.fn().mockImplementation(() => ({
    run: jest.fn().mockResolvedValue({
      indexed: true,
      documentId: "doc_789",
    }),
  })),
}));

describe("ManualLoopControlAgent", () => {
  let agent: ManualLoopControlAgent;
  let logger: Logger;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    agent = new ManualLoopControlAgent();
    logger = new Logger("test");
  });

  describe("executeManualLoop", () => {
    it("should execute complete workflow successfully", async () => {
      const input = {
        audioFileId: "test_audio.mp3",
        audioUrl: "https://example.com/test.mp3",
        title: "Test Song",
        artist: "Test Artist",
        budgetLimit: 1.0,
        qualityThreshold: 0.7,
        maxSteps: 6,
      };

      const result = await agent.executeManualLoop(input);

      // Verify result structure
      expect(result).toMatchObject({
        success: true,
        jobId: expect.stringMatching(/^manual_\d+$/),
        executionMode: "manual-loop",
        totalSteps: expect.any(Number),
        steps: expect.arrayContaining([
          expect.objectContaining({
            name: "transcription",
            status: "completed",
            quality: expect.any(Number),
            duration: expect.any(Number),
            cost: expect.any(Number),
          }),
        ]),
        finalOutput: {
          transcription: expect.objectContaining({
            text: expect.any(String),
            method: "riva",
          }),
          metadata: expect.objectContaining({
            title: "Test Song",
            artist: "Test Artist",
          }),
          assets: expect.objectContaining({
            coverImageUrl: expect.any(String),
            videoUrl: expect.any(String),
          }),
        },
        metrics: expect.objectContaining({
          totalCost: expect.any(Number),
          averageQuality: expect.any(Number),
          successfulSteps: expect.any(Number),
          budgetUtilization: expect.any(Number),
        }),
        executionHistory: expect.arrayContaining([
          expect.objectContaining({
            stepName: "transcription",
            output: expect.any(Object),
          }),
        ]),
      });

      // Verify budget tracking
      expect(result.metrics.totalCost).toBeLessThanOrEqual(input.budgetLimit);
      expect(result.metrics.budgetUtilization).toBeLessThanOrEqual(100);
    });

    it("should handle budget limit enforcement", async () => {
      const input = {
        audioFileId: "test_audio.mp3",
        budgetLimit: 0.01, // Very low budget
        qualityThreshold: 0.9,
        maxSteps: 10,
      };

      const result = await agent.executeManualLoop(input);

      // Should stop due to budget limit
      expect(result.metrics.totalCost).toBeLessThanOrEqual(input.budgetLimit);
      expect(result.executionHistory.length).toBeLessThanOrEqual(2); // Limited steps
    });

    it("should respect maxSteps limit", async () => {
      const input = {
        audioFileId: "test_audio.mp3",
        maxSteps: 3, // Very low step limit
        budgetLimit: 10.0,
      };

      const result = await agent.executeManualLoop(input);

      // Should stop due to maxSteps
      expect(result.executionHistory.length).toBeLessThanOrEqual(3);
      expect(result.totalSteps).toBeLessThanOrEqual(3);
    });

    it("should handle missing audioFileId gracefully", async () => {
      const input = {
        title: "Test Song",
        artist: "Test Artist",
        maxSteps: 6,
      };

      const result = await agent.executeManualLoop(input);

      // Should still execute with default audio
      expect(result.success).toBeDefined();
      expect(result.executionMode).toBe("manual-loop");
    });
  });

  describe("cost estimation", () => {
    it("should estimate costs accurately for different steps", async () => {
      const context = {
        currentStep: 0,
        maxSteps: 6,
        budgetUsed: 0,
        budgetLimit: 1.0,
        activeSteps: ["transcription", "metadata_extraction"],
        qualityThreshold: 0.7,
        executionHistory: [],
        jobId: "test_job",
      };

      // Test transcription cost
      const transcriptionCost = agent["estimateStepCost"](
        "transcription",
        context
      );
      expect(transcriptionCost).toBeGreaterThan(0);
      expect(transcriptionCost).toBeLessThan(0.1); // Should be affordable

      // Test video generation cost (higher)
      const videoCost = agent["estimateStepCost"]("video_generation", context);
      expect(videoCost).toBeGreaterThan(transcriptionCost);
    });

    it("should adjust costs based on remaining budget", async () => {
      const context = {
        currentStep: 0,
        maxSteps: 6,
        budgetUsed: 0.95, // Near budget limit
        budgetLimit: 1.0,
        activeSteps: ["transcription"],
        qualityThreshold: 0.7,
        executionHistory: [],
        jobId: "test_job",
      };

      const cost = agent["estimateStepCost"]("transcription", context);

      // Should be reduced when budget is low
      expect(cost).toBeLessThan(0.03);
    });

    it("should round costs to 3 decimal places", async () => {
      const context = {
        currentStep: 0,
        maxSteps: 6,
        budgetUsed: 0,
        budgetLimit: 1.0,
        activeSteps: ["transcription"],
        qualityThreshold: 0.7,
        executionHistory: [],
        jobId: "test_job",
      };

      const cost = agent["estimateStepCost"]("transcription", context);

      // Should be rounded to 3 decimal places
      expect((cost * 1000) % 1).toBe(0);
    });
  });

  describe("quality assessment", () => {
    it("should calculate quality scores correctly", () => {
      // Test transcription quality
      const transcriptionResult = {
        text: "This is a long enough transcription text with multiple words",
      };
      const quality1 = agent["calculateStepQuality"](
        transcriptionResult,
        "transcription"
      );
      expect(quality1).toBeGreaterThan(0.8);

      // Test short transcription (poor quality)
      const shortTranscription = { text: "Short" };
      const quality2 = agent["calculateStepQuality"](
        shortTranscription,
        "transcription"
      );
      expect(quality2).toBeLessThan(0.5);

      // Test metadata quality
      const goodMetadata = { title: "Song", genre: "rock" };
      const quality3 = agent["calculateStepQuality"](
        goodMetadata,
        "metadata_extraction"
      );
      expect(quality3).toBeGreaterThan(0.8);

      // Test incomplete metadata
      const incompleteMetadata = { title: "Song" };
      const quality4 = agent["calculateStepQuality"](
        incompleteMetadata,
        "metadata_extraction"
      );
      expect(quality4).toBeLessThan(0.7);

      // Test null result
      const nullQuality = agent["calculateStepQuality"](null, "transcription");
      expect(nullQuality).toBe(0.1);
    });
  });

  describe("step execution", () => {
    it("should execute individual steps correctly", async () => {
      const context = {
        currentStep: 0,
        maxSteps: 6,
        budgetUsed: 0,
        budgetLimit: 1.0,
        activeSteps: ["transcription"],
        qualityThreshold: 0.7,
        executionHistory: [],
        jobId: "test_job",
      };

      const stepResult = await agent["executeStepManually"](
        "transcription",
        { audioFileId: "test.mp3" },
        context
      );

      expect(stepResult).toMatchObject({
        stepName: "transcription",
        duration: expect.any(Number),
        cost: expect.any(Number),
        quality: expect.any(Number),
        timestamp: expect.any(Date),
        output: expect.objectContaining({
          text: expect.any(String),
        }),
      });
    });

    it("should handle step execution failures", async () => {
      // Mock a failing step
      const mockRun = jest.fn().mockRejectedValue(new Error("Step failed"));
      jest
        .mocked(require("../skills").TranscriptionSkill)
        .mockImplementation(() => ({
          run: mockRun,
        }));

      const context = {
        currentStep: 0,
        maxSteps: 6,
        budgetUsed: 0,
        budgetLimit: 1.0,
        activeSteps: ["transcription"],
        qualityThreshold: 0.7,
        executionHistory: [],
        jobId: "test_job",
      };

      const stepResult = await agent["executeStepManually"](
        "transcription",
        { audioFileId: "test.mp3" },
        context
      );

      expect(stepResult.error).toBeDefined();
      expect(stepResult.error).toContain("Step failed");
      expect(stepResult.output).toBeUndefined();
    });
  });

  describe("context management", () => {
    it("should update context after successful step", async () => {
      const context = {
        currentStep: 0,
        maxSteps: 6,
        budgetUsed: 0,
        budgetLimit: 1.0,
        activeSteps: ["transcription", "metadata_extraction"],
        qualityThreshold: 0.7,
        executionHistory: [],
        jobId: "test_job",
      };

      const stepResult = {
        stepName: "transcription",
        output: { text: "Sample text" },
        quality: 0.9,
        error: undefined,
      };

      await agent["updateContextAfterStep"](stepResult, context);

      expect(context.executionHistory).toHaveLength(1);
      expect(context.budgetUsed).toBeGreaterThan(0);
    });

    it("should remove failed steps from active list", async () => {
      const context = {
        currentStep: 0,
        maxSteps: 6,
        budgetUsed: 0,
        budgetLimit: 1.0,
        activeSteps: ["transcription", "metadata_extraction"],
        qualityThreshold: 0.7,
        executionHistory: [],
        jobId: "test_job",
      };

      const stepResult = {
        stepName: "transcription",
        output: null,
        quality: 0.1, // Very low quality
        error: "Step failed",
      };

      await agent["updateContextAfterStep"](stepResult, context);

      // Failed step should be removed from active list
      expect(context.activeSteps).not.toContain("transcription");
      expect(context.activeSteps).toContain("metadata_extraction");
    });
  });

  describe("success rate calculation", () => {
    it("should calculate recent success rate correctly", () => {
      const history = [
        { quality: 0.9, error: undefined },
        { quality: 0.8, error: undefined },
        { quality: 0.1, error: "Failed" },
      ];

      const rate = agent["calculateRecentSuccessRate"](history);
      expect(rate).toBeCloseTo(2 / 3, 2); // 2 successful out of 3

      // Test empty history
      const emptyRate = agent["calculateRecentSuccessRate"]([]);
      expect(emptyRate).toBe(1.0);

      // Test all failures
      const failureHistory = [
        { quality: 0.1, error: "Failed" },
        { quality: 0.2, error: "Failed" },
      ];
      const failureRate = agent["calculateRecentSuccessRate"](failureHistory);
      expect(failureRate).toBe(0);
    });
  });

  describe("metrics calculation", () => {
    it("should calculate final metrics correctly", () => {
      const context = {
        currentStep: 3,
        maxSteps: 6,
        budgetUsed: 0.5,
        budgetLimit: 1.0,
        activeSteps: [],
        qualityThreshold: 0.7,
        executionHistory: [
          {
            stepName: "transcription",
            quality: 0.9,
            error: undefined,
            duration: 1000,
          },
          {
            stepName: "metadata",
            quality: 0.8,
            error: undefined,
            duration: 500,
          },
          { stepName: "cover", quality: 0.1, error: "Failed", duration: 200 },
        ],
        jobId: "test_job",
      };

      const metrics = agent["calculateFinalMetrics"](context);

      expect(metrics).toMatchObject({
        totalCost: 0.5,
        averageQuality: expect.any(Number),
        successfulSteps: 2,
        failedSteps: 1,
        totalDuration: 1700,
        budgetUtilization: 50,
      });
    });
  });

  describe("input preparation", () => {
    it("should prepare inputs correctly for different steps", async () => {
      const context = {
        currentStep: 0,
        maxSteps: 6,
        budgetUsed: 0,
        budgetLimit: 1.0,
        activeSteps: ["transcription"],
        qualityThreshold: 0.7,
        executionHistory: [],
        jobId: "test_job",
      };

      // Test transcription input
      const transcriptionInput = await agent["prepareStepInput"](
        "transcription",
        { audioFileId: "test.mp3", language: "en" },
        context
      );
      expect(transcriptionInput).toEqual({
        audioFileId: "test.mp3",
        audioUrl: undefined,
        language: "en",
      });

      // Test metadata input (requires transcription)
      context.executionHistory = [
        {
          stepName: "transcription",
          output: { text: "Sample lyrics", method: "riva" },
        },
      ];

      const metadataInput = await agent["prepareStepInput"](
        "metadata_extraction",
        { title: "Test Song", artist: "Test Artist" },
        context
      );

      expect(metadataInput).toMatchObject({
        lyrics: "Sample lyrics",
        audioMetadata: {
          title: "Test Song",
          artist: "Test Artist",
          method: "riva",
        },
      });
    });
  });
});

describe("Manual Loop Control Integration", () => {
  let agent: ManualLoopControlAgent;

  beforeEach(() => {
    jest.clearAllMocks();
    agent = new ManualLoopControlAgent();
  });

  it("should handle complete end-to-end workflow", async () => {
    const input = {
      audioFileId: "integration_test.mp3",
      audioUrl: "https://example.com/integration_test.mp3",
      title: "Integration Test Song",
      artist: "Test Artist",
      budgetLimit: 2.0,
      qualityThreshold: 0.75,
      maxSteps: 6,
    };

    const result = await agent.executeManualLoop(input);

    // Verify complete workflow execution
    expect(result.success).toBe(true);
    expect(result.executionMode).toBe("manual-loop");

    // Verify all expected steps were executed
    const stepNames = result.steps.map((step) => step.name);
    expect(stepNames).toContain("transcription");
    expect(stepNames).toContain("metadata_extraction");
    expect(stepNames).toContain("album_cover_generation");
    expect(stepNames).toContain("video_generation");

    // Verify quality thresholds were met
    const avgQuality = result.metrics.averageQuality;
    expect(avgQuality).toBeGreaterThanOrEqual(input.qualityThreshold);

    // Verify budget was respected
    expect(result.metrics.totalCost).toBeLessThanOrEqual(input.budgetLimit);
  });

  it("should handle partial workflow when budget exhausted", async () => {
    const input = {
      audioFileId: "budget_test.mp3",
      budgetLimit: 0.05, // Very low budget
      qualityThreshold: 0.8,
      maxSteps: 6,
    };

    const result = await agent.executeManualLoop(input);

    // Should stop early due to budget
    expect(result.metrics.totalCost).toBeLessThanOrEqual(input.budgetLimit);
    expect(result.executionHistory.length).toBeLessThan(6);

    // Should still be marked as partial success
    expect(result.success).toBeDefined();
  });
});
