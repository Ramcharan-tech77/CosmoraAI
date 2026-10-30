import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  GraduationCap,
  Building2,
  Calendar,
  Layers,
  IdCard,
  Mail,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Edit2,
  Save,
  Clock,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, stats, badges, updateProfile, addToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [college, setCollege] = useState(user?.college || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [year, setYear] = useState(user?.year || '3rd Year');
  const [semester, setSemester] = useState(user?.semester || 'Semester 5');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      college,
      studentId,
      year,
      semester,
      bio,
    });
    setIsEditing(false);
  };

  const unlockedBadges = badges.filter((b) => b.unlocked);

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-[#070c1d] rounded-[22px] flex items-center justify-center text-white font-display font-extrabold text-3xl">
                {user?.fullName?.charAt(0) || 'S'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-white">{user?.fullName}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  Student
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{user?.department}</span>
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user?.college}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-center py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2"
          >
            <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Bio paragraph */}
        <p className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
          {user?.bio || 'Student member of IEEE Student Branch. Preparing for academic excellence with COSMORA AI.'}
        </p>
      </div>

      {/* Profile Form (if editing) */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Save className="w-4 h-4 text-cyan-400" />
            <span>Edit Permitted Profile Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Year of Study</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={`Semester ${s}`}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Bio / Research Interests</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Academic Credentials & Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total XP Earned</span>
          <p className="text-2xl font-extrabold text-cyan-400 flex items-center gap-1.5">
            <Zap className="w-5 h-5 fill-cyan-400" />
            <span>{stats.xp}</span>
          </p>
          <p className="text-[10px] text-slate-400">Level {stats.level}: {stats.levelTitle}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Study Streak</span>
          <p className="text-2xl font-extrabold text-amber-400 flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-amber-400" />
            <span>{stats.studyStreakDays}d</span>
          </p>
          <p className="text-[10px] text-slate-400">Continuous daily learning</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Quizzes Taken</span>
          <p className="text-2xl font-extrabold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" />
            <span>{stats.quizzesTaken}</span>
          </p>
          <p className="text-[10px] text-slate-400">{stats.averageQuizScore}% Average Accuracy</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Study Hours</span>
          <p className="text-2xl font-extrabold text-indigo-400 flex items-center gap-1.5">
            <Clock className="w-5 h-5" />
            <span>{Math.round(stats.totalStudyMinutes / 60)}h</span>
          </p>
          <p className="text-[10px] text-slate-400">{stats.completedTopicsCount} Topics Mastered</p>
        </div>
      </div>

      {/* Unlocked Badges Showcase */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Unlocked Academic Achievements ({unlockedBadges.length})</span>
          </h3>
          <span className="text-xs text-cyan-400 font-semibold">Alliance Hackathon 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {unlockedBadges.map((b) => (
            <div
              key={b.id}
              className="p-3.5 rounded-2xl bg-slate-950/60 border border-cyan-500/30 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{b.title}</p>
                <p className="text-[10px] text-emerald-400">+{b.xpReward} XP Awarded</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
