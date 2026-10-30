import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Code2,
  FileText,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

export const SnapAndLearn: React.FC = () => {
  const { user, addXp, addToast } = useApp();

  const [problemText, setProblemText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);

  const sampleProblems = [
    {
      title: 'Time Complexity Recurrence',
      text: 'Solve recurrence T(n) = 3T(n/4) + n log n using Master Theorem. What is the tight asymptotic bound?',
    },
    {
      title: 'Operating Systems LRU Page Faults',
      text: 'Given page reference string: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2] with 3 physical frames. Calculate total page faults under LRU policy and show frame state.',
    },
    {
      title: 'Backpropagation Gradient',
      text: 'Derive the derivative of Binary Cross-Entropy loss with respect to logit z where a = sigmoid(z) and L = -[y log a + (1-y) log(1-a)].',
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImagePreviewUrl(preview);

    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = async (customQuery?: string) => {
    const query = customQuery || problemText;
    if (!query.trim() && !imageBase64) {
      addToast('warning', 'Input Needed', 'Please type a problem or attach a textbook picture.');
      return;
    }

    setIsSolving(true);
    setSolution(null);

    try {
      const response = await fetch('/api/ai/snap-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText: query,
          imageBase64: imageBase64,
          department: user?.department,
        }),
      });

      const data = await response.json();
      setSolution(data.solution);
      addXp(35, 'Solved textbook question with Snap & Learn');
      addToast('success', 'Problem Solved! 💡', 'Step-by-step mathematical derivation ready.');
    } catch (err) {
      console.error('Snap-solve error:', err);
      addToast('error', 'Error', 'Failed to derive solution. Please retry.');
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1">
            <Camera className="w-3 h-3" />
            <span>Multimodal Vision & Problem Solver</span>
          </div>
          <h2 className="text-xl font-bold text-white">Snap & Learn Problem Solver</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload textbook images, past question papers, or paste engineering formulas for instant step-by-step proofs.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-xs font-semibold text-cyan-300">
          Powered by Gemini Vision
        </span>
      </div>

      {/* Input Section */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        {/* Sample Problems Bar */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick Sample Questions to Solve:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {sampleProblems.map((prob, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setProblemText(prob.text);
                  handleSolve(prob.text);
                }}
                className="p-3 rounded-xl bg-slate-950/70 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-left transition-colors"
              >
                <p className="text-xs font-bold text-cyan-300">{prob.title}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{prob.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input area */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Type or Paste Academic Question / Equation:
          </label>
          <textarea
            rows={3}
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="e.g. Find the maximum flow in a bipartite matching network with 8 vertices, or paste an algorithm snippet..."
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Image Attachment & Camera Upload */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Attach Textbook Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {imagePreviewUrl && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Image attached</span>
                <button
                  onClick={() => {
                    setImageBase64(null);
                    setImagePreviewUrl(null);
                  }}
                  className="text-slate-400 hover:text-white underline text-[10px]"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleSolve()}
            disabled={isSolving || (!problemText.trim() && !imageBase64)}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            {isSolving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Deriving Solution...</span>
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4" />
                <span>Solve Step-by-Step</span>
              </>
            )}
          </button>
        </div>

        {/* Preview image if attached */}
        {imagePreviewUrl && (
          <div className="mt-3 p-2 rounded-xl bg-slate-950 border border-slate-800 inline-block">
            <img
              src={imagePreviewUrl}
              alt="Uploaded question preview"
              className="max-h-40 rounded-lg object-contain"
            />
          </div>
        )}
      </div>

      {/* Solution Display Card */}
      {solution && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Step-by-Step Derivation</span>
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">IEEE Hackathon 2026 Engine</span>
          </div>

          <div className="space-y-3 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
            {solution}
          </div>
        </div>
      )}
    </div>
  );
};
