import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { LEADERBOARD_USERS } from '../../data/mockData';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  Lock,
  ChevronRight,
  Sparkles,
  Users,
  Target,
  Gift,
} from 'lucide-react';

export const GamifiedLearningView: React.FC = () => {
  const {
    stats,
    badges,
    challenges,
    claimChallenge,
    user,
    addXp,
    unlockBadge,
    addToast,
  } = useApp();

  const [leaderboardFilter, setLeaderboardFilter] = useState<'All' | 'CSE' | 'AIML' | 'ECE'>('All');

  // Next level computation
  const getLevelThresholds = (lvl: number) => {
    switch (lvl) {
      case 1:
        return { current: 0, next: 600, nextTitle: 'Knowledge Seeker' };
      case 2:
        return { current: 600, next: 1500, nextTitle: 'Smart Learner' };
      case 3:
        return { current: 1500, next: 2500, nextTitle: 'Master Thinker' };
      case 4:
        return { current: 2500, next: 3500, nextTitle: 'Learning Champion' };
      default:
        return { current: 3500, next: 5000, nextTitle: 'Cosmic Grandmaster' };
    }
  };

  const currentLevelInfo = getLevelThresholds(stats.level);
  const xpNeeded = currentLevelInfo.next - stats.xp;
  const levelProgressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((stats.xp - currentLevelInfo.current) / (currentLevelInfo.next - currentLevelInfo.current)) * 100
      )
    )
  );

  // Filter leaderboard
  const filteredLeaderboard = LEADERBOARD_USERS.filter((u) => {
    if (leaderboardFilter === 'All') return true;
    return u.department === leaderboardFilter;
  });

  // 30 days streak calendar simulation
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const activeStreakDays = Array.from({ length: stats.studyStreakDays }, (_, i) => 30 - i);

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900/80 to-[#070c1d] border border-amber-500/25">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>MODULE THREE — GAMIFIED ACADEMIC ACHIEVEMENT</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Gamified Learning Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Earn XP, unlock milestones, sustain your streak, and compete on the university leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total XP</span>
            <p className="text-xl font-extrabold text-cyan-400 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              <span>{stats.xp}</span>
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Level</span>
            <p className="text-xl font-extrabold text-amber-400">Lvl {stats.level}</p>
          </div>
        </div>
      </div>

      {/* Level Progress Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              Level Progression
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Level {stats.level}: <span className="text-cyan-300">{stats.levelTitle}</span>
            </h3>
          </div>
          <p className="text-xs font-semibold text-slate-300">
            {xpNeeded > 0 ? (
              <span>
                <strong className="text-amber-400">{xpNeeded} XP</strong> needed to reach{' '}
                <strong className="text-white">Level {stats.level + 1}: {currentLevelInfo.nextTitle}</strong>
              </span>
            ) : (
              <span className="text-emerald-400">Maximum Master Level Achieved!</span>
            )}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-md shadow-cyan-500/30"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>{currentLevelInfo.current} XP ({stats.levelTitle})</span>
            <span>{levelProgressPercent}% Completed</span>
            <span>{currentLevelInfo.next} XP ({currentLevelInfo.nextTitle})</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Daily Challenges vs Streak Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Challenges */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Daily Academic Quests & Challenges</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">Resets in 14h</span>
          </div>

          <div className="space-y-3">
            {challenges.map((ch) => (
              <div
                key={ch.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white">{ch.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ch.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-bold text-xs shrink-0">
                    +{ch.xpReward} XP
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-1.5 rounded-full"
                      style={{ width: `${(ch.progress / ch.maxProgress) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                    {ch.progress}/{ch.maxProgress}
                  </span>

                  {ch.claimed ? (
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                    </span>
                  ) : ch.completed ? (
                    <button
                      onClick={() => claimChallenge(ch.id)}
                      className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-white font-bold text-xs shadow-md shadow-amber-500/20 shrink-0"
                    >
                      Claim XP!
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium shrink-0">In Progress</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30-Day Streak Calendar */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>30-Day Streak Calendar ({stats.studyStreakDays} Consecutive Days)</span>
            </h3>
            <span className="text-[10px] text-amber-400 font-semibold">Active Streak</span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            {daysInMonth.map((day) => {
              const isActive = activeStreakDays.includes(day);

              return (
                <div
                  key={day}
                  title={`Day ${day}: ${isActive ? 'Study completed (+XP earned)' : 'Past inactive day'}`}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center text-[10px] font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-500/20'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>{day}</span>
                  {isActive && <Flame className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mt-0.5" />}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            🔥 Maintain daily learning on COSMORA AI to unlock the <strong>14-Day Cosmic Champion</strong> badge (+500 XP reward).
          </p>
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Badges & Achievements</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unlock prestigious badges by taking quizzes, building streaks, and collaborating.
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-400">
            {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all ${
                b.unlocked
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-950/50 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                    b.unlocked
                      ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {b.unlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    b.unlocked
                      ? 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {b.unlocked ? 'Unlocked' : `+${b.xpReward} XP`}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white mt-3">{b.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{b.description}</p>

              {b.unlocked ? (
                <p className="text-[10px] text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Awarded: {b.unlockedAt || 'Recently'}</span>
                </p>
              ) : (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Progress</span>
                    <span>{b.progress}/{b.maxProgress}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-1 rounded-full"
                      style={{ width: `${Math.min(100, (b.progress / b.maxProgress) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>University Academic Leaderboard</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rankings across Alliance University departments based on weekly learning XP.
            </p>
          </div>

          {/* Department Filter for Leaderboard */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {(['All', 'CSE', 'AIML', 'ECE'] as const).map((dept) => (
              <button
                key={dept}
                onClick={() => setLeaderboardFilter(dept)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  leaderboardFilter === dept
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Podium Top 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {filteredLeaderboard.slice(0, 3).map((u) => {
            const podiumColors = [
              'border-amber-400/50 bg-amber-950/20 text-amber-300',
              'border-slate-300/50 bg-slate-800/40 text-slate-200',
              'border-amber-700/50 bg-amber-950/10 text-amber-500',
            ];

            return (
              <div
                key={u.rank}
                className={`p-5 rounded-2xl border text-center space-y-2 ${podiumColors[u.rank - 1]}`}
              >
                <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center font-extrabold text-sm border-2 border-current">
                  #{u.rank}
                </div>
                <h4 className="text-sm font-bold text-white">{u.name}</h4>
                <p className="text-[11px] text-slate-400">{u.department} Department</p>
                <p className="text-base font-extrabold text-cyan-300">{u.xp} XP</p>
              </div>
            );
          })}
        </div>

        {/* Full Leaderboard Table */}
        <div className="rounded-2xl bg-slate-950/60 border border-slate-800 overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="col-span-1 text-center">Rank</span>
            <span className="col-span-5">Student</span>
            <span className="col-span-2 text-center">Dept</span>
            <span className="col-span-2 text-center">Streak</span>
            <span className="col-span-2 text-right">XP Points</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {filteredLeaderboard.map((u) => {
              const isMe = u.isCurrentUser;

              return (
                <div
                  key={u.rank}
                  className={`grid grid-cols-12 px-4 py-3 items-center text-xs ${
                    isMe
                      ? 'bg-cyan-950/40 border-l-4 border-l-cyan-400 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-900/40'
                  }`}
                >
                  <span className="col-span-1 text-center font-extrabold">#{u.rank}</span>
                  <div className="col-span-5 flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <span className="truncate">{u.name}</span>
                  </div>
                  <span className="col-span-2 text-center text-[11px] text-slate-400">{u.department}</span>
                  <span className="col-span-2 text-center text-amber-400 font-semibold">{u.streak}d</span>
                  <span className="col-span-2 text-right text-cyan-300 font-extrabold">{u.xp} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
