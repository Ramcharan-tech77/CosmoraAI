import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  LearningStats,
  StudyTask,
  UploadedMaterial,
  Badge,
  DailyChallenge,
  ChatMessage,
} from '../types';
import {
  DEFAULT_USER,
  INITIAL_STATS,
  INITIAL_STUDY_TASKS,
  INITIAL_UPLOADED_MATERIALS,
  INITIAL_BADGES,
  INITIAL_DAILY_CHALLENGES,
} from '../data/mockData';

export type ActiveView =
  | 'dashboard'
  | 'learn-ai'
  | 'learn-friends'
  | 'gamified'
  | 'department'
  | 'progress'
  | 'profile'
  | 'settings';

export type LearnAiSubTab =
  | 'tutor'
  | 'materials'
  | 'quiz'
  | 'analysis'
  | 'study-plan'
  | 'galaxy'
  | 'snap-learn'
  | 'concept-3d'
  | 'voice-live'
  | 'search-ground'
  | 'transcribe'
  | 'video-gen';

export type FriendsSubTab = 'rooms' | 'discussions' | 'study-together' | 'partners';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Auth & Profile
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  register: (profile: Partial<UserProfile>, pass: string) => boolean;
  demoLogin: (deptPreset?: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;

  // Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  learnAiTab: LearnAiSubTab;
  setLearnAiTab: (tab: LearnAiSubTab) => void;
  friendsTab: FriendsSubTab;
  setFriendsTab: (tab: FriendsSubTab) => void;

  // Stats & Gamification
  stats: LearningStats;
  addXp: (amount: number, reason?: string) => void;
  badges: Badge[];
  unlockBadge: (badgeId: string) => void;
  challenges: DailyChallenge[];
  claimChallenge: (challengeId: string) => void;

  // Tasks & Materials
  tasks: StudyTask[];
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<StudyTask, 'id' | 'dateAdded'>) => void;
  deleteTask: (taskId: string) => void;

  uploadedMaterials: UploadedMaterial[];
  addMaterial: (mat: UploadedMaterial) => void;
  deleteMaterial: (matId: string) => void;

  // AI & Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  isAiLive: boolean;
  aiModelName: string;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Sound & Theme preferences
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  theme: string;
  setTheme: (t: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial stored user or null
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('cosmora_user');
      return stored ? JSON.parse(stored) : DEFAULT_USER; // Default to demo student for instantaneous experience
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('cosmora_auth_token') || true; // true by default with preloaded demo profile
  });

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [learnAiTab, setLearnAiTab] = useState<LearnAiSubTab>('tutor');
  const [friendsTab, setFriendsTab] = useState<FriendsSubTab>('rooms');

  const [stats, setStats] = useState<LearningStats>(() => {
    try {
      const stored = localStorage.getItem('cosmora_stats');
      return stored ? JSON.parse(stored) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const stored = localStorage.getItem('cosmora_tasks');
      return stored ? JSON.parse(stored) : INITIAL_STUDY_TASKS;
    } catch {
      return INITIAL_STUDY_TASKS;
    }
  });

  const [uploadedMaterials, setUploadedMaterials] = useState<UploadedMaterial[]>(() => {
    try {
      const stored = localStorage.getItem('cosmora_materials');
      return stored ? JSON.parse(stored) : INITIAL_UPLOADED_MATERIALS;
    } catch {
      return INITIAL_UPLOADED_MATERIALS;
    }
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const stored = localStorage.getItem('cosmora_badges');
      return stored ? JSON.parse(stored) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [challenges, setChallenges] = useState<DailyChallenge[]>(() => {
    try {
      const stored = localStorage.getItem('cosmora_challenges');
      return stored ? JSON.parse(stored) : INITIAL_DAILY_CHALLENGES;
    } catch {
      return INITIAL_DAILY_CHALLENGES;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c-welcome',
      role: 'assistant',
      content: `🌌 **Welcome to COSMORA AI!**
I am your personal AI learning companion for **IEEE × Alliance University Hackathon 2026**.

I can help you:
- Break down complex engineering theorems into intuitive analogies
- Step-by-step debug algorithms and write clean code
- Solve tricky practice problems from your uploaded notes
- Prepare for your semester exams and hackathon projects

What concept would you like to explore today?`,
      timestamp: 'Just now',
    },
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAiLive, setIsAiLive] = useState<boolean>(false);
  const [aiModelName, setAiModelName] = useState<string>('Detecting AI Engine...');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>('Cosmic Dark');

  // Check backend Gemini status on mount
  useEffect(() => {
    fetch('/api/ai/status')
      .then((res) => res.json())
      .then((data) => {
        setIsAiLive(!!data.active);
        setAiModelName(data.model || 'COSMORA Academic Engine');
      })
      .catch(() => {
        setIsAiLive(false);
        setAiModelName('COSMORA Local Engine');
      });
  }, []);

  // Sync state to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('cosmora_user', JSON.stringify(user));
    }
    localStorage.setItem('cosmora_stats', JSON.stringify(stats));
    localStorage.setItem('cosmora_tasks', JSON.stringify(tasks));
    localStorage.setItem('cosmora_materials', JSON.stringify(uploadedMaterials));
    localStorage.setItem('cosmora_badges', JSON.stringify(badges));
    localStorage.setItem('cosmora_challenges', JSON.stringify(challenges));
  }, [user, stats, tasks, uploadedMaterials, badges, challenges]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addXp = (amount: number, reason?: string) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newTitle = prev.levelTitle;

      if (newXp >= 3500) {
        newLevel = 5;
        newTitle = 'Learning Champion';
      } else if (newXp >= 2500) {
        newLevel = 4;
        newTitle = 'Master Thinker';
      } else if (newXp >= 1500) {
        newLevel = 3;
        newTitle = 'Smart Learner';
      } else if (newXp >= 600) {
        newLevel = 2;
        newTitle = 'Knowledge Seeker';
      } else {
        newLevel = 1;
        newTitle = 'Beginner Explorer';
      }

      if (newLevel > prev.level) {
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
        addToast('success', 'Level Up! 🌟', `Congratulations! You reached Level ${newLevel}: ${newTitle}!`);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        levelTitle: newTitle,
      };
    });

    if (reason) {
      addToast('info', `+${amount} XP Earned! ⚡`, reason);
    }
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === badgeId && !b.unlocked) {
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
            });
          } catch {}
          addToast('success', '🏆 Achievement Unlocked!', `${b.title} (+${b.xpReward} XP)`);
          addXp(b.xpReward);
          return {
            ...b,
            unlocked: true,
            unlockedAt: 'Just now',
            progress: b.maxProgress,
          };
        }
        return b;
      })
    );
  };

  const claimChallenge = (challengeId: string) => {
    const ch = challenges.find((c) => c.id === challengeId);
    if (!ch || ch.claimed || !ch.completed) return;

    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, claimed: true } : c))
    );
    addXp(ch.xpReward, `Completed daily challenge: ${ch.title}`);
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            addXp(40, `Finished task: ${t.title}`);
            setStats((s) => ({
              ...s,
              completedTopicsCount: s.completedTopicsCount + 1,
            }));
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const addTask = (taskData: Omit<StudyTask, 'id' | 'dateAdded'>) => {
    const newTask: StudyTask = {
      ...taskData,
      id: 'task_' + Date.now(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    addToast('success', 'Task Added', `"${newTask.title}" added to your study schedule.`);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    addToast('info', 'Task Removed', 'Task removed from your schedule.');
  };

  const addMaterial = (mat: UploadedMaterial) => {
    setUploadedMaterials((prev) => [mat, ...prev]);
    addXp(75, `Uploaded study material: ${mat.title}`);
    addToast('success', 'Material Uploaded', `Extracted units and topics for "${mat.title}".`);
  };

  const deleteMaterial = (matId: string) => {
    setUploadedMaterials((prev) => prev.filter((m) => m.id !== matId));
    addToast('info', 'Material Removed', 'Document deleted.');
  };

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'c-new',
        role: 'assistant',
        content: `✨ New conversation started! What engineering, science, or programming topic can I explain for you today?`,
        timestamp: 'Just now',
      },
    ]);
  };

  const login = (email: string, pass: string): boolean => {
    if (!email || !pass) return false;
    // For demo/prototype auth: accept existing user or create session
    setIsAuthenticated(true);
    localStorage.setItem('cosmora_auth_token', 'demo_token_' + Date.now());
    addToast('success', 'Welcome Back!', `Logged in successfully as ${user?.fullName || email}.`);
    return true;
  };

  const register = (profileData: Partial<UserProfile>, pass: string): boolean => {
    if (!profileData.fullName || !profileData.email || !pass) return false;

    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      fullName: profileData.fullName,
      email: profileData.email,
      college: profileData.college || 'Alliance University, Bengaluru',
      department: profileData.department || 'Computer Science and Engineering (CSE)',
      customDepartment: profileData.customDepartment,
      year: profileData.year || '1st Year',
      semester: profileData.semester || 'Semester 1',
      studentId: profileData.studentId || 'AU-' + Math.floor(1000 + Math.random() * 9000),
      avatarSeed: profileData.fullName.toLowerCase().replace(/\s+/g, '_'),
      bio: `Student at ${profileData.college || 'Alliance University'} exploring ${profileData.department}.`,
      joinedDate: 'October 2026',
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('cosmora_user', JSON.stringify(newUser));
    localStorage.setItem('cosmora_auth_token', 'token_' + Date.now());
    addToast('success', 'Account Created! 🚀', `Welcome to COSMORA AI, ${newUser.fullName}!`);
    return true;
  };

  const demoLogin = (deptPreset: string = 'Computer Science and Engineering (CSE)') => {
    const presetUser: UserProfile = {
      ...DEFAULT_USER,
      department: deptPreset,
      customDepartment: deptPreset === 'Other' ? 'Robotics & Automation' : undefined,
    };
    setUser(presetUser);
    setIsAuthenticated(true);
    localStorage.setItem('cosmora_user', JSON.stringify(presetUser));
    localStorage.setItem('cosmora_auth_token', 'demo_token');
    addToast('success', 'Demo Student Profile Loaded', `Exploring as ${presetUser.fullName} (${deptPreset}).`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cosmora_auth_token');
    addToast('info', 'Logged Out', 'You have securely signed out of COSMORA AI.');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updated };
      return next;
    });
    addToast('success', 'Profile Updated', 'Your student details have been saved.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
        activeView,
        setActiveView,
        learnAiTab,
        setLearnAiTab,
        friendsTab,
        setFriendsTab,
        stats,
        addXp,
        badges,
        unlockBadge,
        challenges,
        claimChallenge,
        tasks,
        toggleTask,
        addTask,
        deleteTask,
        uploadedMaterials,
        addMaterial,
        deleteMaterial,
        chatMessages,
        addChatMessage,
        clearChat,
        isAiLive,
        aiModelName,
        toasts,
        addToast,
        removeToast,
        soundEnabled,
        setSoundEnabled,
        theme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
