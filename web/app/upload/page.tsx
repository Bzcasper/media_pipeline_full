'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Button } from '../../components/ui/button';
import { Upload, Loader2, FileAudio, Sparkles, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { UploadDropzone } from '../../lib/uploadthing';

interface UploadedFile {
  url: string;
  key: string;
  name: string;
  size: number;
}

export default function UploadPage() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFile) return;

    setProcessing(true);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioUrl: uploadedFile.url,
          audioKey: uploadedFile.key,
          title,
          artist,
          album,
        }),
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const data = await response.json();
      router.push(`/status/${data.jobId}`);
    } catch (error) {
      console.error('Processing error:', error);
      alert('Processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto spotify-scrollbar">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Upload Music</h1>
              <p className="text-spotify-lightgray mb-3">
                Upload an audio file to generate a music video with AI
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-spotify-green/20 rounded-full">
                <Sparkles className="h-3.5 w-3.5 text-spotify-green" />
                <span className="text-spotify-green text-xs font-medium">Powered by AI SDK v6 Agents</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload with UploadThing */}
              {uploadedFile ? (
                <div className="rounded-lg border-2 border-spotify-green bg-spotify-gray p-8">
                  <div className="text-center space-y-4">
                    <CheckCircle className="h-16 w-16 text-spotify-green mx-auto" />
                    <div>
                      <p className="text-white font-medium">{uploadedFile.name}</p>
                      <p className="text-spotify-lightgray text-sm">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB - Uploaded successfully
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setUploadedFile(null);
                        setTitle('');
                      }}
                      disabled={processing}
                    >
                      Upload Different File
                    </Button>
                  </div>
                </div>
              ) : (
                <UploadDropzone
                  endpoint="audioUploader"
                  onClientUploadComplete={(res: any) => {
                    if (res && res[0]) {
                      const file = res[0];
                      setUploadedFile({
                        url: file.ufsUrl,
                        key: file.key,
                        name: file.name,
                        size: file.size,
                      });
                      if (!title) {
                        setTitle(file.name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Upload failed: ${error.message}`);
                  }}
                  className="ut-button:bg-spotify-green ut-button:hover:bg-spotify-green/90 ut-label:text-white ut-allowed-content:text-spotify-lightgray border-spotify-gray hover:border-spotify-lightgray"
                />
              )}

              {/* Metadata Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2 font-medium">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full input-spotify"
                    placeholder="Song title"
                    required
                    disabled={processing}
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">
                    Artist
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full input-spotify"
                    placeholder="Artist name"
                    disabled={processing}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white mb-2 font-medium">
                    Album
                  </label>
                  <input
                    type="text"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full input-spotify"
                    placeholder="Album name"
                    disabled={processing}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={!uploadedFile || !title || processing}
                  className="flex-1"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Starting Pipeline...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Music Video
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
