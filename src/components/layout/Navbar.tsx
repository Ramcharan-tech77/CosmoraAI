import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Flame,
  Zap,
  GraduationCap,
  Bell,
  Cpu,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, stats, isAiLive, aiModelName, setActiveView, logout } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const displayDept = user?.department === 'Other' && user?.customDepartment
    ? user.customDepartment
    : user?.department?.split('(')[1]?.replace(')', '') || user?.department || 'CSE';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-900/30 bg-[#070b19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#070b19] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400">
                  COSMORA
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                  AI
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 font-medium tracking-tight">
                Your Personal AI Learning Companion
              </p>
            </div>
          </button>
        </div>

        {/* Center / IEEE & AI status pills */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-950/60 border border-blue-500/25 text-blue-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>IEEE × Alliance University 2026</span>
          </div>

          <div
            title={`Active Engine: ${aiModelName}`}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${
              isAiLive
                ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                : 'bg-indigo-950/50 border-indigo-500/30 text-indigo-300'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{isAiLive ? 'Gemini 3.8 Flash (Live AI)' : 'AI Academic Engine'}</span>
          </div>
        </div>

        {/* Right side stats & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Department badge */}
          <div
            onClick={() => setActiveView('department')}
            className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 text-xs font-semibold hover:border-cyan-500/50 transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="truncate max-w-[120px]">{displayDept}</span>
          </div>

          {/* Streak indicator */}
          <div
            title={`${stats.studyStreakDays} Day Study Streak`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{stats.studyStreakDays}d</span>
          </div>

          {/* XP Badge */}
          <div
            onClick={() => setActiveView('gamified')}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-900/50 to-blue-900/50 border border-indigo-500/30 text-cyan-300 text-xs font-bold hover:border-cyan-400/50 transition-colors"
          >
            <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span>{stats.xp} XP</span>
            <span className="hidden md:inline text-[10px] text-slate-400 font-normal">
              (Lvl {stats.level})
            </span>
          </div>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-white tracking-wider uppercase">Notifications</h4>
                  <span className="text-[10px] text-cyan-400 font-medium">3 New</span>
                </div>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <p className="font-semibold text-slate-200">🏆 IEEE Hackathon 2026</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Your team registration is confirmed. Prepare in Learn with AI!
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <p className="font-semibold text-slate-200">⚡ Daily Challenge Ready</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Take 1 diagnostic quiz to earn +100 XP and sustain your 7-day streak.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/40 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                {user?.fullName?.charAt(0) || 'S'}
              </div>
              <span className="hidden md:block text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                {user?.fullName?.split(' ')[0] || 'Student'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0b1329] border border-slate-700/80 shadow-2xl p-2 z-50 text-left">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <p className="text-[10px] text-cyan-400 mt-1 font-medium">{user?.college}</p>
                </div>
                <div className="mt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4 text-indigo-400" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
