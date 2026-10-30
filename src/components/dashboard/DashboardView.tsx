import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Brain,
  Users2,
  Trophy,
  GraduationCap,
  Flame,
  CheckCircle2,
  Target,
  ArrowRight,
  Sparkles,
  BookOpen,
  Compass,
  Zap,
  TrendingUp,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, stats, tasks, toggleTask, setActiveView, setLearnAiTab, setFriendsTab } = useApp();

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const displayDept = user?.department === 'Other' && user?.customDepartment
    ? user.customDepartment
    : user?.department || 'Computer Science and Engineering (CSE)';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-950/80 border border-cyan-500/25 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-950/20">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>IEEE × Alliance University 2026 Academic Ecosystem</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Welcome back,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300">
                {user?.fullName || 'Student'}!
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-medium">
              Ready to learn something new today?
            </p>

            {/* Department & Academic Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-semibold text-slate-200">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>{displayDept}</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-semibold text-slate-200">
                {user?.year} • {user?.semester}
              </span>
              <span className="px-3 py-1 rounded-lg bg-blue-950/80 border border-blue-500/30 text-xs font-bold text-cyan-300">
                {user?.college}
              </span>
            </div>
          </div>

          {/* Quick Stats Capsule Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>Streak</span>
              </div>
              <p className="text-xl font-extrabold text-white">{stats.studyStreakDays} Days</p>
              <p className="text-[10px] text-slate-400">Keep it burning!</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </div>
              <p className="text-xl font-extrabold text-white">{stats.completedTopicsCount}</p>
              <p className="text-[10px] text-slate-400">Syllabus Topics</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Quiz Score</span>
              </div>
              <p className="text-xl font-extrabold text-white">{stats.averageQuizScore}%</p>
              <p className="text-[10px] text-slate-400">Average Accuracy</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold mb-1">
                <Zap className="w-4 h-4" />
                <span>XP Points</span>
              </div>
              <p className="text-xl font-extrabold text-white">{stats.xp}</p>
              <p className="text-[10px] text-slate-400">Level {stats.level} ({stats.levelTitle})</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: FOUR LARGE INTERACTIVE FEATURE CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Core Modules</h2>
            <p className="text-xs text-slate-400">Access personalized learning companions and collaborative hubs</p>
          </div>
          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <span>Learn • Grow • Succeed</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* CARD 1: LEARN WITH AI */}
          <div className="glass-card-interactive group rounded-3xl p-6 flex flex-col justify-between border-cyan-500/25 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-[#0b132b]/80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 mb-2">
                Primary Module
              </div>
              <h3 className="font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                LEARN WITH AI
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Your personal intelligent learning companion. Upload syllabus notes, take adaptive diagnostic quizzes, chat with the AI tutor, and explore the 3D concept universe.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveView('learn-ai');
                  setLearnAiTab('tutor');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all group-hover:shadow-cyan-500/40"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* CARD 2: LEARN WITH FRIENDS */}
          <div className="glass-card-interactive group rounded-3xl p-6 flex flex-col justify-between border-indigo-500/25 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-[#0b132b]/80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                <Users2 className="w-7 h-7" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-400/10 text-indigo-300 border border-indigo-400/20 mb-2">
                Peer Collaboration
              </div>
              <h3 className="font-display font-bold text-xl text-white group-hover:text-indigo-300 transition-colors">
                LEARN WITH FRIENDS
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Learn together, discuss ideas and collaborate. Join live study rooms, solve group academic challenges, and connect with peers studying your exact subjects.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveView('learn-friends');
                  setFriendsTab('rooms');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all group-hover:shadow-indigo-500/40"
              >
                <span>Explore Together</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* CARD 3: GAMIFIED LEARNING */}
          <div className="glass-card-interactive group rounded-3xl p-6 flex flex-col justify-between border-amber-500/25 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-[#0b132b]/80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-2">
                Achievements & XP
              </div>
              <h3 className="font-display font-bold text-xl text-white group-hover:text-amber-300 transition-colors">
                GAMIFIED LEARNING
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Complete challenges, earn points and unlock achievements. Climb university department leaderboards, maintain streaks, and celebrate academic milestones.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveView('gamified')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all group-hover:shadow-amber-500/40"
              >
                <span>Play & Learn</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* CARD 4: EXPLORE YOUR DEPARTMENT */}
          <div className="glass-card-interactive group rounded-3xl p-6 flex flex-col justify-between border-blue-500/25 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-[#0b132b]/80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-400/10 text-blue-300 border border-blue-400/20 mb-2">
                Curriculum & Careers
              </div>
              <h3 className="font-display font-bold text-xl text-white group-hover:text-blue-300 transition-colors">
                EXPLORE YOUR DEPARTMENT
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Discover subjects, resources, opportunities and your department. Tailored syllabus modules, career pathways, and upcoming IEEE hackathons.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveView('department')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all group-hover:shadow-blue-500/40"
              >
                <span>Explore Department</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Dashboard Section: Adaptive Recommendations & Today's Study Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adaptive AI Recommendation (From Poster / Prompt G.4) */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-cyan-500/20 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>ADAPTIVE LEARNING ENGINE</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-semibold">
                AI Suggested
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-base font-bold text-white">
                Next Suggested Focus: Virtual Memory & Page Replacement
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Based on your diagnostic quiz accuracy (60% in Operating Systems), COSMORA AI recommends reviewing LRU stack implementation and page fault frequency models.
              </p>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Weak Concept Identified:</span>
                  <span className="text-rose-400 font-bold">Belady’s Anomaly</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Target Mastery:</span>
                  <span className="text-cyan-400 font-bold">85% Retention</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                setActiveView('learn-ai');
                setLearnAiTab('quiz');
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-colors"
            >
              Take Topic Quiz
            </button>
            <button
              onClick={() => {
                setActiveView('learn-ai');
                setLearnAiTab('concept-3d');
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              View in 3D
            </button>
          </div>
        </div>

        {/* Personalized Study Tasks Checklist */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Today's Personalized Study Tasks</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">
                {completedTasksCount} of {tasks.length} completed ({progressPercent}%)
              </span>
              <button
                onClick={() => {
                  setActiveView('learn-ai');
                  setLearnAiTab('study-plan');
                }}
                className="text-xs text-cyan-400 hover:underline font-medium"
              >
                View Full Plan
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  task.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                    : 'bg-slate-800/40 border-slate-700/60 hover:border-cyan-500/40 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-500 hover:border-cyan-400'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold truncate ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="text-cyan-400">{task.subject}</span>
                      <span>•</span>
                      <span>{task.estimatedMinutes} mins</span>
                      <span>•</span>
                      <span>Due {task.deadline}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    task.priority === 'High'
                      ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                      : task.priority === 'Medium'
                      ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {task.priority} Priority
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
