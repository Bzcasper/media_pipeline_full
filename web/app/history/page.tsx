'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { JobCard, Job } from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function HistoryPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'completed') return job.status === 'completed';
    if (filter === 'processing') return !['completed', 'failed'].includes(job.status);
    if (filter === 'failed') return job.status === 'failed';
    return true;
  });

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto spotify-scrollbar">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Job History</h1>
                <p className="text-spotify-lightgray">
                  View all your processed media jobs
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
              {['all', 'processing', 'completed', 'failed'].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  onClick={() => setFilter(f)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>

            {/* Jobs Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-spotify-green" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-16 bg-spotify-gray rounded-lg">
                <p className="text-spotify-lightgray text-lg">No jobs found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.jobId} job={job} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
