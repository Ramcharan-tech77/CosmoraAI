import React from 'react';
import { useApp, LearnAiSubTab } from '../../context/AppContext';
import { AiTutorChat } from './AiTutorChat';
import { VoiceCompanionView } from './VoiceCompanionView';
import { SearchGroundingView } from './SearchGroundingView';
import { AudioTranscriberView } from './AudioTranscriberView';
import { VideoGeneratorView } from './VideoGeneratorView';
import { ConceptExplorer3D } from './ConceptExplorer3D';
import { SyllabusAnalyzer } from './SyllabusAnalyzer';
import { DiagnosticQuiz } from './DiagnosticQuiz';
import { PerformanceAnalysis } from './PerformanceAnalysis';
import { PersonalizedStudyPlan } from './PersonalizedStudyPlan';
import { KnowledgeGalaxy } from './KnowledgeGalaxy';
import { SnapAndLearn } from './SnapAndLearn';
import {
  Brain,
  FolderTree,
  HelpCircle,
  BarChart3,
  Calendar,
  Compass,
  Camera,
  Boxes,
  Sparkles,
  Radio,
  Globe,
  Mic,
  Film,
} from 'lucide-react';

export const LearnWithAiView: React.FC = () => {
  const { learnAiTab, setLearnAiTab, user } = useApp();

  const tabs: { id: LearnAiSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'tutor', label: 'AI Tutor', icon: Brain, badge: 'Multi-Turn' },
    { id: 'voice-live', label: 'Voice Companion', icon: Radio, badge: 'Live API' },
    { id: 'search-ground', label: 'Search Grounding', icon: Globe, badge: 'Web Facts' },
    { id: 'transcribe', label: 'Audio Transcribe', icon: Mic, badge: 'Speech' },
    { id: 'video-gen', label: 'Video Studio', icon: Film, badge: 'Omni Flash' },
    { id: 'concept-3d', label: '3D STEM Lab', icon: Boxes, badge: 'Three.js' },
    { id: 'materials', label: 'Syllabus & Notes', icon: FolderTree },
    { id: 'quiz', label: 'Diagnostic Quiz', icon: HelpCircle },
    { id: 'analysis', label: 'Performance Analysis', icon: BarChart3 },
    { id: 'study-plan', label: 'Personalized Study Plan', icon: Calendar },
    { id: 'galaxy', label: 'Knowledge Galaxy', icon: Compass },
    { id: 'snap-learn', label: 'Snap & Learn', icon: Camera, badge: 'Vision' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900/80 to-[#070c1d] border border-cyan-500/25">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>MODULE ONE — CORE AI LEARNING ECOSYSTEM</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Learn with AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Adaptive, context-aware intelligence tailored to {user?.department} ({user?.year}, {user?.semester})
          </p>
        </div>

        {/* Brand Tagline Banner */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Learn • Grow • Succeed</span>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = learnAiTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setLearnAiTab(tab.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-tight ${
                    isActive
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {learnAiTab === 'tutor' && <AiTutorChat />}
        {learnAiTab === 'voice-live' && <VoiceCompanionView />}
        {learnAiTab === 'search-ground' && <SearchGroundingView />}
        {learnAiTab === 'transcribe' && <AudioTranscriberView />}
        {learnAiTab === 'video-gen' && <VideoGeneratorView />}
        {learnAiTab === 'concept-3d' && <ConceptExplorer3D />}
        {learnAiTab === 'materials' && <SyllabusAnalyzer />}
        {learnAiTab === 'quiz' && <DiagnosticQuiz />}
        {learnAiTab === 'analysis' && <PerformanceAnalysis />}
        {learnAiTab === 'study-plan' && <PersonalizedStudyPlan />}
        {learnAiTab === 'galaxy' && <KnowledgeGalaxy />}
        {learnAiTab === 'snap-learn' && <SnapAndLearn />}
      </div>
    </div>
  );
};
