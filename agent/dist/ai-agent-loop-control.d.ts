/**
 * Media Pipeline AI SDK v6 Agent with Advanced Loop Control
 * Implements sophisticated execution flow management patterns
 */
export declare class AdvancedMediaPipelineAgent {
    private logger;
    private budgetTracker;
    constructor();
    /**
     * Execute pipeline with advanced loop control
     */
    executeWithLoopControl(input: {
        audioFileId?: string;
        audioUrl?: string;
        title?: string;
        artist?: string;
        budgetLimit?: number;
        qualityThreshold?: number;
        maxSteps?: number;
    }): Promise<any>;
    /**
     * Create execution plan using AI
     */
    private planExecution;
    /**
     * Prepare step with dynamic settings
     */
    private prepareStep;
    /**
     * Execute individual step with tool choice control
     */
    private executeStep;
    /**
     * Evaluate stop conditions
     */
    private evaluateStopConditions;
    /**
     * Update execution metrics (cost, quality, duration)
     */
    private updateExecutionMetrics;
    /**
     * Enhance next iteration based on current results
     */
    private enhanceNextIteration;
    /**
     * Calculate step quality score
     */
    private calculateStepQuality;
    /**
     * Evaluate final pipeline quality
     */
    private evaluateFinalQuality;
    /**
     * Execute optimization loop for low quality results
     */
    private executeOptimizationLoop;
    /**
     * Compile final result
     */
    private compileFinalResult;
    /**
     * Extract final output from completed steps
     */
    private extractFinalOutput;
    private executeTranscription;
    private executeMetadataExtraction;
    private executeAlbumCover;
    private executeVideoGeneration;
    private executeGCSUpload;
    private executeWeaviateIndex;
}
export default AdvancedMediaPipelineAgent;
//# sourceMappingURL=ai-agent-loop-control.d.ts.map