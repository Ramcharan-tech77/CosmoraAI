import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Target,
  Sparkles,
  Layers,
} from 'lucide-react';

export const PerformanceAnalysis: React.FC = () => {
  const { stats, user } = useApp();

  const studyHours = Math.round((stats.totalStudyMinutes / 60) * 10) / 10;

  // Subject Performance Breakdown
  const subjectBreakdown = [
    { subject: 'Data Structures & Algorithms', mastery: 88, status: 'Strong' },
    { subject: 'Operating Systems & Concurrency', mastery: 64, status: 'Needs Revision' },
    { subject: 'Database Management Systems', mastery: 92, status: 'Mastered' },
    { subject: 'Computer Networks (TCP/IP)', mastery: 82, status: 'Proficient' },
    { subject: 'Theory of Computation', mastery: 70, status: 'Moderate' },
  ];

  // Weekly study trend hours
  const weeklyTrend = [
    { day: 'Mon', hours: 3.2 },
    { day: 'Tue', hours: 4.5 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 5.0 },
    { day: 'Fri', hours: 3.6 },
    { day: 'Sat', hours: 6.2 },
    { day: 'Sun (Today)', hours: 4.1 },
  ];

  const maxHours = Math.max(...weeklyTrend.map((w) => w.hours));

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>AI Adaptive Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-white">Student Performance & Mastery Analysis</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time diagnostic metrics for {user?.fullName} ({user?.department?.split('(')[1]?.replace(')', '') || 'Engineering'})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Accuracy</span>
            <p className="text-lg font-extrabold text-emerald-400">{stats.averageQuizScore}%</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Study Streak</span>
            <p className="text-lg font-extrabold text-amber-400">{stats.studyStreakDays} Days</p>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Study Hours</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{studyHours} hrs</p>
          <p className="text-[10px] text-emerald-400 font-semibold">+18% vs last week</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Topics Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.completedTopicsCount}</p>
          <p className="text-[10px] text-slate-400">Out of 32 total units</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Diagnostic Quizzes</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.quizzesTaken}</p>
          <p className="text-[10px] text-indigo-300">Across 4 curriculum modules</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Current Retention</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">84.2%</p>
          <p className="text-[10px] text-amber-300 font-semibold">Tier: High Proficiency</p>
        </div>
      </div>

      {/* Main Analysis Grid: Subject-wise Mastery & Weekly Study Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-Wise Performance Meters */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Subject-Wise Performance</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">Semester 5 Core</span>
          </div>

          <div className="space-y-4">
            {subjectBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{item.subject}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        item.mastery >= 85
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : item.mastery >= 70
                          ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-white font-bold">{item.mastery}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${
                      item.mastery >= 85
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                        : item.mastery >= 70
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : 'bg-gradient-to-r from-rose-500 to-amber-500'
                    }`}
                    style={{ width: `${item.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Study Hours Visual Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Weekly Study Distribution (Hours)</span>
              </h3>
              <span className="text-[11px] text-cyan-400 font-semibold">Total: 29.4 hrs</span>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
              {weeklyTrend.map((w, idx) => {
                const heightPercent = Math.round((w.hours / maxHours) * 100);
                const isToday = idx === weeklyTrend.length - 1;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] text-slate-400 group-hover:text-cyan-300 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {w.hours}h
                    </span>
                    <div className="w-full max-w-[28px] bg-slate-800 rounded-t-lg overflow-hidden h-32 flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 group-hover:brightness-125 ${
                          isToday
                            ? 'bg-gradient-to-t from-cyan-500 to-blue-400 shadow-lg shadow-cyan-500/30'
                            : 'bg-gradient-to-t from-indigo-600 to-cyan-600'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-semibold truncate ${
                        isToday ? 'text-cyan-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {w.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-800">
            💡 Peak performance observed on <strong>Saturday (6.2h)</strong> focusing on dynamic programming and graph traversals.
          </p>
        </div>
      </div>

      {/* Strong vs Weak Syllabus Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Demonstrated Strengths (80%+ Accuracy)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.strongTopics.map((t, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Target Revision Areas (Under 70% Accuracy)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.weakTopics.map((t, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
