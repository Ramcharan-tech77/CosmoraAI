import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Globe,
  ExternalLink,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const SearchGroundingView: React.FC = () => {
  const { user, addXp } = useApp();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    answer: string;
    sources: Array<{ title: string; url: string }>;
    searchQueries: string[];
    model?: string;
  } | null>(null);

  const sampleQueries = [
    'Recent breakthroughs in Room-Temperature Superconductors 2026',
    'Current state-of-the-art Deep Learning Attention Mechanisms',
    'Latest IEEE standard updates for 6G wireless communication',
    'Recent astronomical findings from James Webb Space Telescope',
  ];

  const handleSearch = async (targetQuery?: string) => {
    const q = (targetQuery || query).trim();
    if (!q) return;

    if (targetQuery) setQuery(targetQuery);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/search-grounded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          department: user?.department || 'Computer Science and Engineering',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult({
          answer: data.answer,
          sources: data.sources || [],
          searchQueries: data.searchQueries || [q],
          model: data.model,
        });
        addXp(20, 'Performed Google Search Grounding for verified academic facts');
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>GOOGLE SEARCH GROUNDING ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Live Research & Verified Citations
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Directly queries the live web via <span className="text-cyan-400 font-semibold font-mono">gemini-3.8-flash</span> with real-time Google Search data, web citations, and verifiable academic sources.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real-time Grounded Facts</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 focus-within:border-cyan-500 transition-all">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search academic breakthroughs, IEEE standards, or verified research..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => handleSearch()}
            disabled={isLoading || !query.trim()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Searching Google...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Grounded Search</span>
              </>
            )}
          </button>
        </div>

        {/* Quick query chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
          <span className="font-semibold text-slate-500">Trending Prompts:</span>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSearch(sq)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-cyan-300 text-slate-300 transition-colors cursor-pointer text-[11px]"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Main Answer (2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Verified Grounded Synthesis
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {result.model || 'gemini-3.8-flash (Search Grounded)'}
              </span>
            </div>

            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap space-y-2">
              {result.answer}
            </div>
          </div>

          {/* Sources and Citations (1 col) */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 border-b border-slate-800 pb-3">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Grounded Web Citations ({result.sources.length})</span>
            </div>

            {result.sources.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No direct external URLs were returned by grounding.</p>
            ) : (
              <div className="space-y-2.5">
                {result.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="block p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 line-clamp-2">
                        {src.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 mt-0.5" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-500/80 block mt-1 truncate">
                      {src.url}
                    </span>
                  </a>
                ))}
              </div>
            )}

            {/* Queries executed */}
            {result.searchQueries && result.searchQueries.length > 0 && (
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Web Search Queries Executed:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.searchQueries.map((sq, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {sq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
