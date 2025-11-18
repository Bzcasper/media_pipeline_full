export declare class JobStateManager {
  constructor(jobId: string, jobDir?: string);

  static load(jobId: string, jobDir?: string): Promise<JobStateManager>;
  static listJobs(): Promise<any[]>;

  getState(): any;
  setState(state: any): void;
}

export declare class PipelineOrchestrator {
  constructor(jobId?: string);

  run(config: any): Promise<any>;
  getState(): any;
}

export declare class YouTubeVideoOrchestrator {
  constructor(jobId?: string);

  run(config: any): Promise<any>;
  getState(): any;
}

export declare const Logger: any;
export declare const MediaPipelineAgent: any;
export declare const MediaPipelineOrchestrator: any;

// Re-export everything from submodules
export * from "./utils";
export * from "./skills";
export * from "./tools";
