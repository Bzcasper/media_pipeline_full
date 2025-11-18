'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Button } from '../../components/ui/button';
import { Loader2, Video, Sparkles } from 'lucide-react';

export default function YouTubeVideoCreator() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [videoStyle, setVideoStyle] = useState<'documentary' | 'narrative' | 'educational' | 'entertainment'>('educational');
  const [duration, setDuration] = useState(60);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [voiceOver, setVoiceOver] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [complexity, setComplexity] = useState<'simple' | 'complex'>('simple');
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setGenerating(true);

    try {
      const response = await fetch('/api/youtube/create-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          videoStyle,
          duration,
          aspectRatio,
          voiceOver,
          backgroundMusic,
          complexity,
          userPreferences: {}
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start video generation');
      }

      const data = await response.json();
      router.push(`/status/${data.jobId}`);

    } catch (error) {
      console.error('Video generation error:', error);
      alert('Failed to start video generation. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto spotify-scrollbar">
          <div className="max-w-4xl mx-auto p-8">
            {/* Hero Section */}
            <div className="mb-12 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-8 w-8 text-spotify-green" />
                <h1 className="text-5xl font-bold text-white">YouTube Video Creator</h1>
              </div>
              <p className="text-spotify-lightgray text-lg">
                Generate complete AI-powered videos from a single query
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-spotify-green/20 rounded-full">
                <Sparkles className="h-4 w-4 text-spotify-green" />
                <span className="text-spotify-green text-sm font-medium">Powered by AI SDK v6 Agents</span>
              </div>
            </div>

            {/* Creation Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Query Input */}
              <div className="bg-spotify-gray rounded-lg p-8">
                <label className="block text-white mb-3 text-lg font-semibold">
                  What's your video about? *
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full input-spotify h-32 resize-none"
                  placeholder="e.g., 'The history of artificial intelligence' or 'How to start a successful YouTube channel'"
                  required
                  disabled={generating}
                />
                <p className="text-spotify-lightgray text-sm mt-2">
                  Be specific and detailed for best results
                </p>
              </div>

              {/* Video Style */}
              <div className="bg-spotify-gray rounded-lg p-8">
                <label className="block text-white mb-4 text-lg font-semibold">
                  Video Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['documentary', 'narrative', 'educational', 'entertainment'].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setVideoStyle(style as any)}
                      disabled={generating}
                      className={`
                        p-4 rounded-lg border-2 transition-all capitalize
                        ${videoStyle === style
                          ? 'border-spotify-green bg-spotify-green/10 text-white'
                          : 'border-spotify-gray hover:border-spotify-lightgray text-spotify-lightgray'
                        }
                      `}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-spotify-gray rounded-lg p-6">
                  <label className="block text-white mb-3 font-medium">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full input-spotify"
                    min="30"
                    max="300"
                    step="15"
                    disabled={generating}
                  />
                  <p className="text-spotify-lightgray text-sm mt-2">
                    30-300 seconds (Shorts: 60s recommended)
                  </p>
                </div>

                <div className="bg-spotify-gray rounded-lg p-6">
                  <label className="block text-white mb-3 font-medium">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['16:9', '9:16', '1:1'].map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio as any)}
                        disabled={generating}
                        className={`
                          p-3 rounded-lg border-2 transition-all
                          ${aspectRatio === ratio
                            ? 'border-spotify-green bg-spotify-green/10 text-white'
                            : 'border-spotify-gray hover:border-spotify-lightgray text-spotify-lightgray'
                          }
                        `}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                  <p className="text-spotify-lightgray text-sm mt-2">
                    16:9 (YouTube), 9:16 (Shorts/TikTok), 1:1 (Instagram)
                  </p>
                </div>
              </div>

              {/* AI Model Selection */}
              <div className="bg-spotify-gray rounded-lg p-6">
                <label className="block text-white mb-3 font-medium">
                  AI Intelligence Level
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setComplexity('simple')}
                    disabled={generating}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${complexity === 'simple'
                        ? 'border-spotify-green bg-spotify-green/10 text-white'
                        : 'border-spotify-gray hover:border-spotify-lightgray text-spotify-lightgray'
                      }
                    `}
                  >
                    <div className="font-semibold mb-1">Simple (Fast)</div>
                    <div className="text-xs opacity-70">Claude Haiku - Quick results</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setComplexity('complex')}
                    disabled={generating}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${complexity === 'complex'
                        ? 'border-spotify-green bg-spotify-green/10 text-white'
                        : 'border-spotify-gray hover:border-spotify-lightgray text-spotify-lightgray'
                      }
                    `}
                  >
                    <div className="font-semibold mb-1">Complex (Best)</div>
                    <div className="text-xs opacity-70">Claude Sonnet - Highest quality</div>
                  </button>
                </div>
                <p className="text-spotify-lightgray text-sm mt-3">
                  Complex mode uses more powerful AI for better creativity and reasoning
                </p>
              </div>

              {/* Additional Features */}
              <div className="bg-spotify-gray rounded-lg p-6">
                <label className="block text-white mb-4 font-medium">
                  Additional Features
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={voiceOver}
                      onChange={(e) => setVoiceOver(e.target.checked)}
                      disabled={generating}
                      className="w-5 h-5 rounded border-spotify-gray bg-spotify-black checked:bg-spotify-green"
                    />
                    <span className="text-white">Add AI Voiceover</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={backgroundMusic}
                      onChange={(e) => setBackgroundMusic(e.target.checked)}
                      disabled={generating}
                      className="w-5 h-5 rounded border-spotify-gray bg-spotify-black checked:bg-spotify-green"
                    />
                    <span className="text-white">Add Background Music</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={!query.trim() || generating}
                className="w-full text-lg h-14"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Generating Your Video...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-6 w-6" />
                    Generate Video
                  </>
                )}
              </Button>

              {generating && (
                <div className="text-center">
                  <p className="text-spotify-lightgray text-sm">
                    This may take 2-5 minutes depending on video length...
                  </p>
                </div>
              )}
            </form>

            {/* Process Overview */}
            <div className="mt-12 bg-spotify-gray rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold">1</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Script Generation</h3>
                  <p className="text-spotify-lightgray text-sm">
                    AI writes a compelling script from your query
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold">2</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Visual Creation</h3>
                  <p className="text-spotify-lightgray text-sm">
                    Generate and validate images for each scene
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold">3</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Video Assembly</h3>
                  <p className="text-spotify-lightgray text-sm">
                    Animate images and create final video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
