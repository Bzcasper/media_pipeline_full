import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'text-yellow-500',
    processing: 'text-blue-500',
    transcribing: 'text-purple-500',
    generating_metadata: 'text-indigo-500',
    generating_visuals: 'text-pink-500',
    creating_video: 'text-orange-500',
    uploading_results: 'text-cyan-500',
    indexing: 'text-teal-500',
    completed: 'text-green-500',
    failed: 'text-red-500',
  };
  return colors[status] || 'text-gray-500';
}

export function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-500',
    processing: 'bg-blue-500/10 text-blue-500',
    completed: 'bg-green-500/10 text-green-500',
    failed: 'bg-red-500/10 text-red-500',
  };
  return colors[status] || 'bg-gray-500/10 text-gray-500';
}
