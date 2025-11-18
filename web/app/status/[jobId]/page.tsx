'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Download, ExternalLink } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface JobState {
  jobId: string;
  status: string;
  progress: number;
  currentStep: string;
  steps: Array<{
    name: string;
    status: string;
    startTime?: string;
    endTime?: string;
  }>;
  logs: Array<{
    timestamp: string;
    level: string;
    message: string;
  }>;
  outputs: Record<string, any>;
  createdAt: string;
  metadata?: Record<string, any>;
}

export default function StatusPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const [job, setJob] = useState<JobState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobStatus();

    // Only poll if job is not completed or failed
    if (job && (job.status === 'completed' || job.status === 'failed')) {
      return;
    }

    // Adaptive polling: faster for active processing, slower for waiting
    const isActive = job && ['processing', 'transcribing', 'generating_metadata', 'generating_visuals', 'creating_video'].includes(job.status);
    const pollInterval = isActive ? 2000 : 5000; // 2s for active, 5s for waiting

    const interval = setInterval(fetchJobStatus, pollInterval);
    return () => clearInterval(interval);
  }, [jobId, job?.status]);

  // Show completion notification
  useEffect(() => {
    if (job && job.status === 'completed') {
      // Visual feedback for completion
      if (typeof window !== 'undefined') {
        // Simple notification
        alert('🎉 Job completed successfully!');
      }
    } else if (job && job.status === 'failed') {
      if (typeof window !== 'undefined') {
        alert('❌ Job failed. Check logs for details.');
      }
    }
  }, [job?.status]);

  const fetchJobStatus = async () => {
    try {
      const response = await fetch(`/api/status/${jobId}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data);
      }
    } catch (error) {
      console.error('Failed to fetch job status:', error);
    } finally {
      setLoading(false);
    }
  };

  const logsText = job?.logs
    .map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`)
    .join('\n') || '';

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-spotify-green" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Job Not Found</h2>
            <p className="text-spotify-lightgray">The requested job could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto spotify-scrollbar">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                {job.metadata?.title || 'Processing Job'}
              </h1>
              <p className="text-spotify-lightgray">
                Job ID: {job.jobId} • Created {formatDate(job.createdAt)}
              </p>
            </div>

            {/* Progress */}
            <div className="bg-spotify-gray rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-lg font-semibold ${getStatusColor(job.status)}`}>
                    {job.status.toUpperCase()}
                  </p>
                  <p className="text-spotify-lightgray text-sm">{job.currentStep}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{job.progress}%</p>
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-spotify-black overflow-hidden">
                <div
                  className="h-full bg-spotify-green transition-all duration-500"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-spotify-gray rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Pipeline Steps</h2>
                <div className="space-y-3">
                  {job.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {step.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : step.status === 'failed' ? (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      ) : step.status === 'in_progress' ? (
                        <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-spotify-lightgray flex-shrink-0" />
                      )}
                      <span className="text-white">{step.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outputs */}
              {job.outputs && Object.keys(job.outputs).length > 0 && (
                <div className="bg-spotify-gray rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Results</h2>
                  <div className="space-y-3">
                    {job.outputs.gcsUrls && (
                      <>
                        {job.outputs.gcsUrls.video && (
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <a href={job.outputs.gcsUrls.video} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Video
                            </a>
                          </Button>
                        )}
                        {job.outputs.gcsUrls.cover && (
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <a href={job.outputs.gcsUrls.cover} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Cover
                            </a>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logs */}
            <div className="bg-spotify-gray rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Logs</h2>
              <div className="h-96 rounded-md overflow-hidden">
                <MonacoEditor
                  height="100%"
                  language="log"
                  theme="vs-dark"
                  value={logsText}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 12,
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
