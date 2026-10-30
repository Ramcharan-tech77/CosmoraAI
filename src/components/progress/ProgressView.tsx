import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LineChart,
  TrendingUp,
  Clock,
  Target,
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Layers,
  BookOpen,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { stats, tasks, user, setActiveView, setLearnAiTab } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const studyHours = Math.round((stats.totalStudyMinutes / 60) * 10) / 10;

  const syllabusProgress = [
    { subject: 'Data Structures & Algorithms', completedUnits: 3, totalUnits: 4, percent: 75 },
    { subject: 'Operating Systems & Concurrency', completedUnits: 2, totalUnits: 4, percent: 50 },
    { subject: 'Database Management Systems', completedUnits: 4, totalUnits: 4, percent: 100 },
    { subject: 'Computer Networks (TCP/IP)', completedUnits: 3, totalUnits: 4, percent: 75 },
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-[#070c1d] border border-cyan-500/25">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <LineChart className="w-3.5 h-3.5 text-cyan-400" />
            <span>ACADEMIC RETENTION & MASTERY OVERVIEW</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            My Learning Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track your semester milestones, diagnostic accuracy, and weak topic remediation.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveView('learn-ai');
            setLearnAiTab('quiz');
          }}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Take New Diagnostic Quiz</span>
        </button>
      </div>

      {/* KPI 4-Card Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Study Time</span>
          <p className="text-2xl font-extrabold text-cyan-400">{studyHours} hrs</p>
          <p className="text-[10px] text-emerald-400 font-semibold">+4.2 hrs this week</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Topics Mastered</span>
          <p className="text-2xl font-extrabold text-white">{stats.completedTopicsCount}</p>
          <p className="text-[10px] text-slate-400">From uploaded syllabus</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Daily Task Completion</span>
          <p className="text-2xl font-extrabold text-emerald-400">{taskPercent}%</p>
          <p className="text-[10px] text-slate-400">{completedTasks} of {totalTasks} finished</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Average Quiz Accuracy</span>
          <p className="text-2xl font-extrabold text-amber-400">{stats.averageQuizScore}%</p>
          <p className="text-[10px] text-amber-300 font-semibold">{stats.quizzesTaken} Quizzes Taken</p>
        </div>
      </div>

      {/* Syllabus Course Completion Meters */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Semester 5 Syllabus Progress Breakdown</span>
          </h3>
          <span className="text-xs text-cyan-400 font-bold">{user?.department}</span>
        </div>

        <div className="space-y-4">
          {syllabusProgress.map((item, idx) => (
            <div key={idx} className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white">{item.subject}</span>
                <span className="text-cyan-400 font-bold">
                  {item.completedUnits}/{item.totalUnits} Units ({item.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    item.percent === 100
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Topics Remediation Action Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4">
          <div className="flex items-center gap-2 text-rose-300 text-sm font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Identified Weak Topics to Remediate</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            COSMORA AI identified these concepts based on recent diagnostic quiz mistakes:
          </p>
          <div className="space-y-2">
            {stats.weakTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/30 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-rose-200">{topic}</span>
                <button
                  onClick={() => {
                    setActiveView('learn-ai');
                    setLearnAiTab('tutor');
                  }}
                  className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-bold text-[10px] transition-colors"
                >
                  Ask AI Tutor
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Mastered Concepts (85%+ Retention)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            You have proven strong conceptual understanding in these fundamental topics:
          </p>
          <div className="space-y-2">
            {stats.strongTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-emerald-200">{topic}</span>
                <span className="text-[10px] text-emerald-400 font-bold">Mastered 🌟</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
