import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UploadedMaterial } from '../../types';
import {
  Upload,
  FileText,
  Trash2,
  Sparkles,
  BookOpen,
  Layers,
  CheckCircle2,
  FilePlus,
  RefreshCw,
  FolderTree,
} from 'lucide-react';

export const SyllabusAnalyzer: React.FC = () => {
  const { uploadedMaterials, addMaterial, deleteMaterial, user, addToast } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    uploadedMaterials[0]?.id || ''
  );

  // New Upload Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [textContent, setTextContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const selectedMaterial = uploadedMaterials.find((m) => m.id === selectedMaterialId) || uploadedMaterials[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTextContent(content || 'Uploaded course material content');
    };
    reader.readAsText(file);
  };

  const handleAnalyzeNew = async () => {
    if (!title.trim()) {
      addToast('warning', 'Missing Title', 'Please enter a title for this syllabus or notes document.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/ai/analyze-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: textContent || 'Core syllabus guidelines and topic listings',
          department: user?.department,
        }),
      });

      const data = await response.json();
      const analysis = data.analysis;

      const newMaterial: UploadedMaterial = {
        id: 'mat_' + Date.now(),
        title: title.trim(),
        subject: subject.trim() || 'Core Engineering Subject',
        fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
        fileSize: `${Math.floor(1 + Math.random() * 3)}.${Math.floor(1 + Math.random() * 9)} MB`,
        uploadDate: 'Today',
        status: 'analyzed',
        contentSnippet: analysis.summary || textContent.slice(0, 300) || 'Analyzed syllabus content',
        units: analysis.modules?.map((m: any, idx: number) => ({
          unitNumber: idx + 1,
          title: m.title,
          topics: m.topics,
        })) || [
          {
            unitNumber: 1,
            title: 'Unit 1: Fundamental Concepts & Models',
            topics: ['Core Definitions', 'Mathematical Formulation', 'Basic Paradigms'],
          },
          {
            unitNumber: 2,
            title: 'Unit 2: Applied Systems & Implementations',
            topics: ['System Architecture', 'Algorithmic Pipelines', 'Edge Cases'],
          },
        ],
      };

      addMaterial(newMaterial);
      setSelectedMaterialId(newMaterial.id);
      setShowUploadModal(false);
      setTitle('');
      setSubject('');
      setTextContent('');
      setFileName('');
      addToast('success', 'Analysis Complete! 📊', `Extracted units & topics for ${newMaterial.title}`);
    } catch (err) {
      console.error('Analysis error:', err);
      addToast('error', 'Analysis Error', 'Failed to analyze material. Please retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPresetMaterial = (preset: 'dsa' | 'os' | 'ai') => {
    const presets = {
      dsa: {
        title: 'Design and Analysis of Algorithms Complete Syllabus',
        subject: 'Algorithms & Data Structures',
        fileName: 'DAA_Syllabus_2026.pdf',
        snippet: 'Asymptotic notation, divide and conquer, greedy methods, dynamic programming, graph algorithms (Dijkstra, Bellman-Ford, Kruskal), branch and bound, NP-completeness.',
      },
      os: {
        title: 'Operating Systems & Distributed Concurrency',
        subject: 'System Architecture',
        fileName: 'OS_Concurrency_Notes.pdf',
        snippet: 'Threads, locks, atomic operations, Peterson solution, deadlock prevention, Banker algorithm, virtual memory paging, segmentation, and Linux ext4 file systems.',
      },
      ai: {
        title: 'Deep Learning & Transformer Architectures',
        subject: 'Artificial Intelligence & Machine Learning',
        fileName: 'DeepLearning_Attention_Notes.txt',
        snippet: 'Convolutional neural networks, ResNet skip connections, self-attention mechanisms, multi-head attention, positional encoding, and large language model fine-tuning.',
      },
    };

    const target = presets[preset];
    setTitle(target.title);
    setSubject(target.subject);
    setFileName(target.fileName);
    setTextContent(target.snippet);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1">
            <FolderTree className="w-3 h-3" />
            <span>Document Understanding Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white">Syllabus & Study Notes Repository</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload course PDFs or notes. COSMORA AI automatically segments them into Units, Chapters, and Topics.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0"
        >
          <FilePlus className="w-4 h-4" />
          <span>Upload Syllabus or Notes</span>
        </button>
      </div>

      {/* Main Grid: Uploaded Materials List vs Detailed Topic Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Documents List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Your Materials ({uploadedMaterials.length})
            </span>
            <span className="text-[11px] text-cyan-400 font-medium">Click to inspect</span>
          </div>

          <div className="space-y-2.5">
            {uploadedMaterials.map((mat) => {
              const isSelected = selectedMaterial?.id === mat.id;

              return (
                <div
                  key={mat.id}
                  onClick={() => setSelectedMaterialId(mat.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{mat.title}</h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{mat.subject}</p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                          <span>{mat.fileName}</span>
                          <span>•</span>
                          <span>{mat.fileSize}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMaterial(mat.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Remove document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{mat.units.length} Units Analyzed</span>
                    </span>
                    <span className="text-slate-500">{mat.uploadDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Document Breakdown & Units */}
        <div className="lg:col-span-2 space-y-4">
          {selectedMaterial ? (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-6">
              {/* Document Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                    Active Study Syllabus
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedMaterial.title}</h3>
                  <p className="text-xs text-slate-400">Subject: {selectedMaterial.subject}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    AI Analyzed
                  </span>
                </div>
              </div>

              {/* Content snippet */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Executive Knowledge Summary</span>
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedMaterial.contentSnippet}
                </p>
              </div>

              {/* Units & Topics Hierarchy */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Syllabus Breakdown: Units & Topics</span>
                </h4>

                <div className="space-y-3">
                  {selectedMaterial.units.map((unit) => (
                    <div
                      key={unit.unitNumber}
                      className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-300">{unit.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                          {unit.topics.length} Key Topics
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {unit.topics.map((t, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700/70 text-xs text-slate-200"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">No study material selected</p>
              <p className="text-xs mt-1">Upload a document above to extract its syllabus hierarchy.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Upload / Add Study Material */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl bg-[#090f24] border border-cyan-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Upload & Analyze Study Material</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-cyan-400">Quick Test Samples (Instant Fill):</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => loadPresetMaterial('dsa')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200"
                >
                  ⚡ DSA Syllabus 2026
                </button>
                <button
                  type="button"
                  onClick={() => loadPresetMaterial('os')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200"
                >
                  🖥️ Operating Systems Notes
                </button>
                <button
                  type="button"
                  onClick={() => loadPresetMaterial('ai')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200"
                >
                  🧠 Deep Learning & Attention
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design and Analysis of Algorithms Unit 3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science Core / Algorithms"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* File upload input */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select File (PDF / TXT)</label>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Or Paste Text / Syllabus Notes Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste syllabus topics, unit descriptions, or revision notes here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isAnalyzing || !title.trim()}
                onClick={handleAnalyzeNew}
                className="py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Document...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze My Study Material</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
