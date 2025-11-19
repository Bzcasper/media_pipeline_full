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
  const [numScenes, setNumScenes] = useState(5);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [style, setStyle] = useState('cinematic, dramatic lighting, high quality');
  const [voice, setVoice] = useState('af_bella');
  const [useSVD, setUseSVD] = useState(true);
  const [svdLoopCount, setSvdLoopCount] = useState(2);
  const [svdMotion, setSvdMotion] = useState(100);
  const [captionOn, setCaptionOn] = useState(true);
  const [captionFont, setCaptionFont] = useState('Arial');
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setGenerating(true);

    try {
      // Calculate dimensions based on aspect ratio
      let width, height;
      switch (aspectRatio) {
        case '16:9': // Landscape (YouTube, TV)
          width = 1024;
          height = 576;
          break;
        case '9:16': // Portrait (YouTube Shorts, TikTok)
          width = 576;
          height = 1024;
          break;
        case '1:1': // Square (Instagram)
          width = 512;
          height = 512;
          break;
        default:
          width = 1024;
          height = 576;
      }

      const response = await fetch('/api/youtube/create-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          numScenes,
          style,
          voice,
          useSVD,
          svdLoopCount,
          svdMotion,
          captionOn,
          captionFont,
          width,
          height,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start video generation');
      }

      const data = await response.json();
      // Since we now return video URLs directly, redirect to a success page or show the video
      alert(`Video created successfully!\n\nVideo: ${data.videoUrl}\nThumbnail: ${data.thumbnailUrl}`);
      // router.push(`/status/${data.videoId}`); // Could create a video display page

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

               {/* Video Settings */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-spotify-gray rounded-lg p-6">
                   <label className="block text-white mb-3 font-medium">
                     Number of Scenes
                   </label>
                   <input
                     type="number"
                     value={numScenes}
                     onChange={(e) => setNumScenes(parseInt(e.target.value))}
                     className="w-full input-spotify"
                     min="1"
                     max="20"
                     disabled={generating}
                   />
                   <p className="text-spotify-lightgray text-sm mt-2">
                     1-20 scenes (more scenes = longer videos)
                   </p>
                 </div>

                 <div className="bg-spotify-gray rounded-lg p-6">
                   <label className="block text-white mb-3 font-medium">
                     Aspect Ratio
                   </label>
                   <div className="grid grid-cols-3 gap-2">
                     {[
                       { ratio: '16:9', label: '16:9', desc: 'Landscape' },
                       { ratio: '9:16', label: '9:16', desc: 'Portrait' },
                       { ratio: '1:1', label: '1:1', desc: 'Square' },
                     ].map(({ ratio, label, desc }) => (
                       <button
                         key={ratio}
                         type="button"
                         onClick={() => setAspectRatio(ratio as any)}
                         disabled={generating}
                         className={`
                           p-3 rounded-lg border-2 transition-all text-center
                           ${aspectRatio === ratio
                             ? 'border-spotify-green bg-spotify-green/10 text-white'
                             : 'border-spotify-gray hover:border-spotify-lightgray text-spotify-lightgray'
                           }
                         `}
                       >
                         <div className="font-semibold text-sm">{label}</div>
                         <div className="text-xs opacity-70">{desc}</div>
                       </button>
                     ))}
                   </div>
                   <p className="text-spotify-lightgray text-sm mt-2">
                     16:9 (YouTube), 9:16 (Shorts/TikTok), 1:1 (Instagram)
                   </p>
                 </div>

                 <div className="bg-spotify-gray rounded-lg p-6">
                   <label className="block text-white mb-3 font-medium">
                     Visual Style
                   </label>
                   <input
                     type="text"
                     value={style}
                     onChange={(e) => setStyle(e.target.value)}
                     className="w-full input-spotify"
                     placeholder="cinematic, dramatic lighting, high quality"
                     disabled={generating}
                   />
                   <p className="text-spotify-lightgray text-sm mt-2">
                     Describe the visual style for AI image generation
                   </p>
                 </div>
               </div>

               {/* Voice & Animation Settings */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-spotify-gray rounded-lg p-6">
                   <label className="block text-white mb-3 font-medium">
                     Voice
                   </label>
                   <select
                     value={voice}
                     onChange={(e) => setVoice(e.target.value)}
                     className="w-full input-spotify"
                     disabled={generating}
                   >
                     <option value="af_bella">Bella (Female)</option>
                     <option value="af_sarah">Sarah (Female)</option>
                     <option value="am_michael">Michael (Male)</option>
                     <option value="am_adam">Adam (Male)</option>
                   </select>
                   <p className="text-spotify-lightgray text-sm mt-2">
                     Choose the voice for narration
                   </p>
                 </div>

                 <div className="bg-spotify-gray rounded-lg p-6">
                   <label className="block text-white mb-3 font-medium">
                     Caption Font
                   </label>
                   <select
                     value={captionFont}
                     onChange={(e) => setCaptionFont(e.target.value)}
                     className="w-full input-spotify"
                     disabled={generating}
                   >
                     <option value="Arial">Arial</option>
                     <option value="Helvetica">Helvetica</option>
                     <option value="Times New Roman">Times New Roman</option>
                     <option value="Courier New">Courier New</option>
                     <option value="Impact">Impact</option>
                   </select>
                   <p className="text-spotify-lightgray text-sm mt-2">
                     Font for video captions
                   </p>
                 </div>
               </div>

               {/* Animation & Effects */}
               <div className="bg-spotify-gray rounded-lg p-6">
                 <label className="block text-white mb-4 font-medium">
                   Animation & Effects
                 </label>
                 <div className="space-y-4">
                   <label className="flex items-center gap-3 cursor-pointer">
                     <input
                       type="checkbox"
                       checked={useSVD}
                       onChange={(e) => setUseSVD(e.target.checked)}
                       disabled={generating}
                       className="w-5 h-5 rounded border-spotify-gray bg-spotify-black checked:bg-spotify-green"
                     />
                     <span className="text-white">Enable SVD Animation</span>
                     <span className="text-spotify-lightgray text-sm">(animated backgrounds)</span>
                   </label>

                   {useSVD && (
                     <div className="grid grid-cols-2 gap-4 ml-8">
                       <div>
                         <label className="block text-white text-sm mb-1">Loop Count</label>
                         <input
                           type="number"
                           value={svdLoopCount}
                           onChange={(e) => setSvdLoopCount(parseInt(e.target.value))}
                           className="w-full input-spotify text-sm"
                           min="1"
                           max="5"
                           disabled={generating}
                         />
                       </div>
                       <div>
                         <label className="block text-white text-sm mb-1">Motion Intensity</label>
                         <input
                           type="number"
                           value={svdMotion}
                           onChange={(e) => setSvdMotion(parseInt(e.target.value))}
                           className="w-full input-spotify text-sm"
                           min="50"
                           max="200"
                           disabled={generating}
                         />
                       </div>
                     </div>
                   )}

                   <label className="flex items-center gap-3 cursor-pointer">
                     <input
                       type="checkbox"
                       checked={captionOn}
                       onChange={(e) => setCaptionOn(e.target.checked)}
                       disabled={generating}
                       className="w-5 h-5 rounded border-spotify-gray bg-spotify-black checked:bg-spotify-green"
                     />
                     <span className="text-white">Add Captions</span>
                     <span className="text-spotify-lightgray text-sm">(subtitles on video)</span>
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
