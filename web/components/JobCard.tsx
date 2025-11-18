'use client';

import Link from 'next/link';
import { Music, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn, formatDate, getStatusBadgeColor } from '../lib/utils';

export interface Job {
  jobId: string;
  status: string;
  progress: number;
  createdAt: string;
  metadata?: {
    title?: string;
    artist?: string;
  };
}

export function JobCard({ job }: { job: Job }) {
  const StatusIcon = () => {
    if (job.status === 'completed') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (job.status === 'failed') return <XCircle className="h-5 w-5 text-red-500" />;
    if (job.status === 'pending') return <Clock className="h-5 w-5 text-yellow-500" />;
    return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
  };

  return (
    <Link href={`/status/${job.jobId}`}>
      <div className="group relative rounded-lg bg-spotify-gray p-6 hover:bg-spotify-gray/80 transition-all duration-200 cursor-pointer">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-spotify-green/0 to-spotify-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="relative flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-spotify-black p-3">
              <Music className="h-6 w-6 text-spotify-green" />
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-white">
                {job.metadata?.title || 'Untitled'}
              </h3>
              {job.metadata?.artist && (
                <p className="text-sm text-spotify-lightgray">{job.metadata.artist}</p>
              )}
              <p className="text-xs text-spotify-lightgray">{formatDate(job.createdAt)}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <StatusIcon />
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              getStatusBadgeColor(job.status)
            )}>
              {job.status}
            </span>
          </div>
        </div>

        {job.status !== 'completed' && job.status !== 'failed' && (
          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-spotify-black overflow-hidden">
              <div
                className="h-full bg-spotify-green transition-all duration-500"
                style={{ width: `${job.progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-spotify-lightgray text-right">{job.progress}%</p>
          </div>
        )}
      </div>
    </Link>
  );
}
