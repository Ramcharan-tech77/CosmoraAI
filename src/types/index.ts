export type Department =
  | 'Computer Science and Engineering (CSE)'
  | 'Artificial Intelligence and Machine Learning (AIML)'
  | 'Information Science and Engineering (ISE)'
  | 'Electronics and Communication Engineering (ECE)'
  | 'Electrical and Electronics Engineering (EEE)'
  | 'Mechanical Engineering'
  | 'Civil Engineering'
  | 'Other';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  college: string;
  department: Department | string;
  customDepartment?: string;
  year: string; // e.g. "1st Year", "2nd Year", "3rd Year", "4th Year"
  semester: string; // e.g. "Semester 1" to "Semester 8"
  studentId?: string;
  avatarSeed: string;
  bio?: string;
  joinedDate: string;
}

export interface LearningStats {
  xp: number;
  level: number;
  levelTitle: string;
  studyStreakDays: number;
  completedTopicsCount: number;
  quizzesTaken: number;
  averageQuizScore: number;
  totalStudyMinutes: number;
  weakTopics: string[];
  strongTopics: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  estimatedMinutes: number;
  dateAdded: string;
}

export interface UploadedMaterial {
  id: string;
  title: string;
  subject: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'analyzed' | 'analyzing' | 'ready';
  contentSnippet: string;
  units: {
    unitNumber: number;
    title: string;
    topics: string[];
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isLiveAI?: boolean;
}

export interface StudyRoom {
  id: string;
  name: string;
  subject: string;
  department: string;
  code: string;
  hostName: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    status: 'studying' | 'break' | 'asking';
  }[];
  maxParticipants: number;
  isLive: boolean;
  topicDescription: string;
  tags: string[];
}

export interface GroupDiscussion {
  id: string;
  title: string;
  authorName: string;
  authorDept: string;
  authorYear: string;
  subject: string;
  timestamp: string;
  content: string;
  upvotes: number;
  replies: {
    id: string;
    author: string;
    dept: string;
    content: string;
    timestamp: string;
    isAiAssistant?: boolean;
  }[];
}

export interface StudyPartner {
  id: string;
  name: string;
  department: string;
  year: string;
  semester: string;
  college: string;
  avatarSeed: string;
  bio: string;
  studyGoals: string[];
  matchScore: number;
  isOnline: boolean;
  connected?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Quiz' | 'Streak' | 'Community' | 'Mastery';
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  claimed: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  department: string;
  avatar: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}
