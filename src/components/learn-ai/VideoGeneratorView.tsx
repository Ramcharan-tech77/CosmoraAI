import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Video,
  Film,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  Clock,
  Layers,
  Camera,
  Info,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export const VideoGeneratorView: React.FC = () => {
  const { addXp } = useApp();
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoResult, setVideoResult] = useState<{
    videoBase64?: string;
    aspectRatio: '16:9' | '9:16';
    requiresPaidTier?: boolean;
    notice?: string;
    storyboard?: Array<{
      frame: number;
      time: string;
      title: string;
      visualDescription: string;
      cameraMovement: string;
    }>;
  } | null>(null);

  const samplePrompts = [
    'Cellular respiration: electron transport chain in the mitochondrial inner membrane with glowing ATP synthase',
    'Quantum superposition: Bloch sphere showing a qubit vector rotating across infinite probability states',
    'Transformer neural network: multi-head self-attention queries, keys, and values multiplying into attention weights',
  ];

  const handleGenerate = async (presetPrompt?: string) => {
    const text = (presetPrompt || prompt).trim();
    if (!text) return;
    if (presetPrompt) setPrompt(presetPrompt);

    setIsGenerating(true);
    setVideoResult(null);

    try {
      const response = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          aspectRatio,
        }),
      });

      const data = await response.json();
      setVideoResult(data);
      addXp(30, `Generated educational video storyboard for "${text.slice(0, 30)}..." via Interactions API`);
    } catch (err) {
      console.error('Video generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>GEMINI INTERACTIONS API • VIDEO STUDIO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            AI Video Generation from Text
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Generates educational STEM animations and concept videos using model <span className="text-cyan-400 font-semibold font-mono">gemini-omni-1.1-flash</span> in <span className="font-semibold text-white">16:9 Landscape</span> or <span className="font-semibold text-white">9:16 Portrait</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>gemini-omni-1.1-flash</span>
        </div>
      </div>

      {/* Video Generation Form */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">Aspect Ratio:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                aspectRatio === '16:9'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              16:9 Landscape (Desktop / Lecture)
            </button>
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                aspectRatio === '9:16'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              9:16 Portrait (Mobile Short)
            </button>
          </div>
        </div>

        {/* Prompt Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            Video Generation Prompt:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Describe the academic process or scientific visualization you want to generate in detail..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all resize-none"
          />
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-500">Preset Academic Topics:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleGenerate(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-[11px] transition-colors cursor-pointer"
            >
              {p.slice(0, 45)}...
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !prompt.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Generating with Omni Flash...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4 text-slate-950" />
                <span>Generate Video ({aspectRatio})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Video Generation Result Display */}
      {videoResult && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Educational Video Production Output ({videoResult.aspectRatio})
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              gemini-omni-1.1-flash
            </span>
          </div>

          {/* If actual video base64 returned */}
          {videoResult.videoBase64 ? (
            <div className={`mx-auto rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-slate-950 ${
              videoResult.aspectRatio === '9:16' ? 'max-w-xs aspect-[9/16]' : 'max-w-2xl aspect-[16/9]'
            }`}>
              <video
                src={`data:video/mp4;base64,${videoResult.videoBase64}`}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            /* Storyboard Visual Timeline */
            <div className="space-y-4">
              {videoResult.notice && (
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
                  <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-200 leading-relaxed">
                    <strong className="text-white block font-semibold mb-0.5">Omni Flash Video Specification:</strong>
                    {videoResult.notice}
                  </div>
                </div>
              )}

              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Generated Keyframe Storyboard Timeline
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {videoResult.storyboard?.map((sb) => (
                  <div
                    key={sb.frame}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 relative group hover:border-cyan-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold">
                        Frame {sb.frame}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{sb.time}</span>
                      </span>
                    </div>

                    {/* Mock Aspect-Ratio Frame Graphic */}
                    <div className={`w-full rounded-xl bg-gradient-to-tr from-slate-900 to-blue-950 border border-slate-800 flex items-center justify-center p-3 text-center ${
                      videoResult.aspectRatio === '9:16' ? 'aspect-[9/16] max-h-48 mx-auto' : 'aspect-[16/9]'
                    }`}>
                      <div className="space-y-1">
                        <Camera className="w-6 h-6 text-cyan-400 mx-auto" />
                        <span className="text-[10px] text-slate-300 font-medium block">
                          {sb.cameraMovement}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white mb-1">{sb.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {sb.visualDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
