/**
 * Modal Labs Tool
 * Handles interactions with Modal Labs for Whisper transcription and image-to-video generation
 */

export interface ModalWhisperParams {
  audioUrl: string;
  model?: 'large-v3' | 'large-v2' | 'medium';
  language?: string;
}

export interface ModalJobResponse {
  job_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  output?: any;
  error?: string;
}

export const modal = {
  /**
   * Run Whisper transcription via Modal
   */
  runWhisper: async (params: ModalWhisperParams): Promise<ModalJobResponse> => {
    const modalJobUrl = process.env.MODAL_JOB_URL;

    if (!modalJobUrl) {
      throw new Error('MODAL_JOB_URL environment variable is not set');
    }

    const response = await fetch(`${modalJobUrl}/whisper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: params.audioUrl,
        model: params.model || 'large-v3',
        language: params.language
      })
    });

    if (!response.ok) {
      throw new Error(`Modal Whisper API failed: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Run Wan2.2 image-to-video generation via Modal
   */
  runWan22: async (imageUrl: string, prompt?: string): Promise<ModalJobResponse> => {
    const modalJobUrl = process.env.MODAL_JOB_URL;

    if (!modalJobUrl) {
      throw new Error('MODAL_JOB_URL environment variable is not set');
    }

    const response = await fetch(`${modalJobUrl}/wan22`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt
      })
    });

    if (!response.ok) {
      throw new Error(`Modal Wan2.2 API failed: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Poll Modal job status
   */
  pollJob: async (jobId: string, maxAttempts: number = 60, intervalMs: number = 5000): Promise<ModalJobResponse> => {
    const modalPollUrl = process.env.MODAL_POLL_URL;

    if (!modalPollUrl) {
      throw new Error('MODAL_POLL_URL environment variable is not set');
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await fetch(`${modalPollUrl}/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Modal poll API failed: ${response.statusText}`);
      }

      const job: ModalJobResponse = await response.json();

      if (job.status === 'completed') {
        return job;
      }

      if (job.status === 'failed') {
        throw new Error(`Modal job failed: ${job.error || 'Unknown error'}`);
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error(`Modal job ${jobId} timed out after ${maxAttempts} attempts`);
  },

  /**
   * Run and wait for Modal job
   */
  runAndWait: async (
    jobType: 'whisper' | 'wan22',
    params: any
  ): Promise<any> => {
    let jobResponse: ModalJobResponse;

    if (jobType === 'whisper') {
      jobResponse = await modal.runWhisper(params);
    } else if (jobType === 'wan22') {
      jobResponse = await modal.runWan22(params.imageUrl, params.prompt);
    } else {
      throw new Error(`Unknown job type: ${jobType}`);
    }

    const result = await modal.pollJob(jobResponse.job_id);
    return result.output;
  }
};

export default modal;
