import React from 'react';
import { useApp, ActiveView } from '../../context/AppContext';
import {
  LayoutDashboard,
  Brain,
  Users2,
  Trophy,
  GraduationCap,
  LineChart,
  User,
  Settings,
  LogOut,
  Target,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { activeView, setActiveView, stats, tasks, logout, user } = useApp();

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const navItems: { id: ActiveView; label: string; icon: any; badge?: string | number; accent?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn-ai', label: 'Learn with AI', icon: Brain, badge: 'Core AI', accent: 'text-cyan-400' },
    { id: 'learn-friends', label: 'Learn with Friends', icon: Users2, badge: '3 Live', accent: 'text-indigo-400' },
    { id: 'gamified', label: 'Gamified Learning', icon: Trophy, badge: `${stats.xp} XP`, accent: 'text-amber-400' },
    { id: 'department', label: 'Explore Department', icon: GraduationCap, accent: 'text-blue-400' },
    { id: 'progress', label: 'My Progress', icon: LineChart },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: ActiveView) => {
    setActiveView(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 shrink-0 flex flex-col justify-between border-r border-indigo-950/40 bg-[#070b19]/95 backdrop-blur-xl p-4 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Quick Student Mini Bar */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/20 border border-indigo-800/25">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                {user?.fullName?.charAt(0) || 'S'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.fullName}</p>
                <p className="text-[10px] text-cyan-400 truncate">
                  {user?.department?.split('(')[1]?.replace(')', '') || 'Engineering'} • {user?.year}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600/20 via-blue-600/15 to-indigo-600/10 border border-cyan-500/40 text-cyan-200 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-cyan-400' : item.accent || 'text-slate-400 group-hover:text-cyan-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mini Study Goals Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Today's Tasks</span>
              </span>
              <span className="text-[11px] text-cyan-400 font-bold">
                {tasks.length - pendingTasksCount}/{tasks.length}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${tasks.length ? Math.round(((tasks.length - pendingTasksCount) / tasks.length) * 100) : 0}%`,
                }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400">
              {pendingTasksCount === 0
                ? 'All goals achieved for today! 🎉'
                : `${pendingTasksCount} pending study session${pendingTasksCount > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Footer / Hackathon Banner & Sign out */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2 shrink-0">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Alliance Hackathon 2026</span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
