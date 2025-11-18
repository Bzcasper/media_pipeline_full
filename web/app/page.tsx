'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { JobCard, Job } from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Upload, Sparkles, Video, Music2 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs?limit=6');
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

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto spotify-scrollbar">
          <div className="p-8">
            {/* Hero Section */}
            <div className="mb-12 relative rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-12 overflow-hidden">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                  <span className="text-white/90 font-medium">Powered by AI SDK v6 Agents</span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-4">
                  AI Video Generation Platform
                </h1>
                <p className="text-white/90 text-lg mb-6 max-w-2xl">
                  Create stunning videos with AI - from music videos with lyrics and album art
                  to complete YouTube content generated from text queries.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/upload">
                    <Button size="lg" className="bg-white text-black hover:bg-white/90 hover:scale-105">
                      <Music2 className="mr-2 h-5 w-5" />
                      Music Videos
                    </Button>
                  </Link>
                  <Link href="/youtube">
                    <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:scale-105">
                      <Video className="mr-2 h-5 w-5" />
                      YouTube Creator
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-spotify-gray rounded-lg p-6 border-2 border-transparent hover:border-spotify-green/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-spotify-green/20 rounded-lg flex items-center justify-center">
                    <Music2 className="h-6 w-6 text-spotify-green" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Music Video Pipeline</h3>
                </div>
                <p className="text-spotify-lightgray mb-4">
                  Upload audio → Transcription (Riva/Whisper) → AI Metadata → Album Cover →
                  Video Generation → Cloud Storage → Semantic Search
                </p>
                <Link href="/upload">
                  <Button variant="outline" size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>

              <div className="bg-spotify-gray rounded-lg p-6 border-2 border-transparent hover:border-spotify-green/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Video className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">YouTube Video Pipeline</h3>
                </div>
                <p className="text-spotify-lightgray mb-4">
                  Text Query → AI Script → Scene Planning → Image Generation →
                  AI Validation → Image-to-Video → Professional Assembly
                </p>
                <Link href="/youtube">
                  <Button variant="outline" size="sm" className="w-full">
                    Create Video
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Jobs</h2>
                <Link href="/history">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse rounded-lg bg-spotify-gray h-48" />
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16 bg-spotify-gray rounded-lg">
                  <Sparkles className="h-16 w-16 text-spotify-lightgray mx-auto mb-4" />
                  <p className="text-spotify-lightgray text-lg mb-4">No jobs yet</p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/upload">
                      <Button>
                        <Music2 className="mr-2 h-4 w-4" />
                        Upload Music
                      </Button>
                    </Link>
                    <Link href="/youtube">
                      <Button variant="outline">
                        <Video className="mr-2 h-4 w-4" />
                        Create YouTube Video
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.jobId} job={job} />
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-spotify-gray rounded-lg p-6">
                <p className="text-spotify-lightgray text-sm mb-2">Total Videos</p>
                <p className="text-4xl font-bold text-white">{jobs.length}</p>
              </div>
              <div className="bg-spotify-gray rounded-lg p-6">
                <p className="text-spotify-lightgray text-sm mb-2">Completed</p>
                <p className="text-4xl font-bold text-green-500">
                  {jobs.filter((j) => j.status === 'completed').length}
                </p>
              </div>
              <div className="bg-spotify-gray rounded-lg p-6">
                <p className="text-spotify-lightgray text-sm mb-2">Processing</p>
                <p className="text-4xl font-bold text-blue-500">
                  {jobs.filter((j) => !['completed', 'failed'].includes(j.status)).length}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
