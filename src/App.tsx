/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { WelcomeAuthModal } from './components/auth/WelcomeAuthModal';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardView } from './components/dashboard/DashboardView';
import { LearnWithAiView } from './components/learn-ai/LearnWithAiView';
import { LearnWithFriendsView } from './components/learn-friends/LearnWithFriendsView';
import { GamifiedLearningView } from './components/gamified/GamifiedLearningView';
import { ExploreDepartmentView } from './components/department/ExploreDepartmentView';
import { ProgressView } from './components/progress/ProgressView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen cosmic-gradient-bg flex flex-col text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* If not authenticated, render Welcome / Registration / Login Modal */}
      {!isAuthenticated && <WelcomeAuthModal />}

      {/* Main Authenticated Layout */}
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'learn-ai' && <LearnWithAiView />}
          {activeView === 'learn-friends' && <LearnWithFriendsView />}
          {activeView === 'gamified' && <GamifiedLearningView />}
          {activeView === 'department' && <ExploreDepartmentView />}
          {activeView === 'progress' && <ProgressView />}
          {activeView === 'profile' && <ProfileView />}
          {activeView === 'settings' && <SettingsView />}

          {/* Footer IEEE Hackathon 2026 Credits */}
          <footer className="mt-16 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-cyan-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COSMORA AI — Your Personal AI Learning Companion</span>
            </div>
            <p>
              IEEE × Alliance University Hackathon 2026 Prototype • Learn • Grow • Succeed
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
