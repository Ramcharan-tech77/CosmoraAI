import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Palette,
  Bell,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  LogOut,
  ShieldCheck,
  Cpu,
  Sparkles,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    logout,
    user,
    stats,
    isAiLive,
    aiModelName,
    addToast,
  } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [studyRoomPings, setStudyRoomPings] = useState(false);

  const themes = [
    { id: 'Cosmic Dark', label: 'Cosmic Deep Navy (Default)', desc: 'Electric blue and cyan starlight highlights' },
    { id: 'Cyber Navy', label: 'Cyber Tech Blue', desc: 'High-contrast vibrant blue glow accents' },
    { id: 'Aurora Indigo', label: 'Aurora Violet Glow', desc: 'Subtle purple nebula gradients' },
  ];

  const handleExportData = () => {
    const exportObject = {
      platform: 'COSMORA AI — Your Personal AI Learning Companion',
      version: '1.0.0-hackathon2026',
      generatedDate: new Date().toISOString(),
      student: user,
      learningAnalytics: stats,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `COSMORA_Student_Transcript_${user?.studentId || 'AU'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast('success', 'Transcript Exported! 📄', 'Downloaded your verified student progress report.');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset demo tasks and progress? This will revert back to initial hackathon defaults.')) {
      localStorage.clear();
      addToast('info', 'Data Reset', 'Cleared local browser cache. Reloading default state...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>PLATFORM PREFERENCES</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Settings & Account Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Configure visual themes, AI engine telemetry, notifications, and study transcript data.
          </p>
        </div>

        <button
          onClick={logout}
          className="py-2.5 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* 1. Theme Selection */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>Visual Theme & Cosmic Atmosphere</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                addToast('info', 'Theme Applied', `${t.id} visual style selected.`);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                theme === t.id
                  ? 'bg-slate-800/90 border-cyan-500/70 shadow-lg shadow-cyan-950/30'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{t.label}</span>
                {theme === t.id && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. AI Engine Status & Diagnostics */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>AI Engine Backend Diagnostics</span>
        </h3>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">Current Active AI Model:</span>
            <span className="text-cyan-400 font-mono-code font-bold">{aiModelName}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">Gemini Server Connection:</span>
            <span
              className={`px-2.5 py-0.5 rounded font-bold text-[11px] ${
                isAiLive
                  ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                  : 'bg-indigo-950/70 border border-indigo-500/40 text-indigo-300'
              }`}
            >
              {isAiLive ? 'Active Live Gemini 3.8 Flash' : 'COSMORA Local Academic Engine'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
            All AI operations run securely through server-side proxy routes (<code>/api/ai/*</code>) with zero client-side credential exposure.
          </p>
        </div>
      </div>

      {/* 3. Notification & Sound Preferences */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <span>Notification & Sound Alerts</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-semibold text-slate-200">Study Streak & Revision Reminders</p>
              <p className="text-[11px] text-slate-400">Receive gentle daily alerts to maintain your 7-day streak</p>
            </div>
            <input
              type="checkbox"
              checked={streakReminders}
              onChange={(e) => setStreakReminders(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-0"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-semibold text-slate-200">Study Room Peer Invites</p>
              <p className="text-[11px] text-slate-400">Get notified when department classmates start a new study room</p>
            </div>
            <input
              type="checkbox"
              checked={studyRoomPings}
              onChange={(e) => setStudyRoomPings(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-0"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-semibold text-slate-200">Audio Micro-Sound Effects</p>
              <p className="text-[11px] text-slate-400">Chimes on quiz completion, task check-off, and level up</p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Export & Data Management */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Student Data & Transcript Management</span>
        </h3>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportData}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Academic Transcript (JSON)</span>
          </button>

          <button
            onClick={handleResetData}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo State to Default</span>
          </button>
        </div>
      </div>
    </div>
  );
};
