import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Department } from '../../types';
import {
  Sparkles,
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Lock,
  User,
  Building2,
  Calendar,
  Layers,
  IdCard,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const WelcomeAuthModal: React.FC = () => {
  const { login, register, demoLogin } = useApp();

  // Mode: 'welcome' | 'register' | 'login'
  const [authMode, setAuthMode] = useState<'welcome' | 'register' | 'login'>('welcome');

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [college, setCollege] = useState('Alliance University, Bengaluru');
  const [department, setDepartment] = useState<Department | 'Other'>('Computer Science and Engineering (CSE)');
  const [customDepartment, setCustomDepartment] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [semester, setSemester] = useState('Semester 5');
  const [studentId, setStudentId] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const departmentsList: Department[] = [
    'Computer Science and Engineering (CSE)',
    'Artificial Intelligence and Machine Learning (AIML)',
    'Information Science and Engineering (ISE)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical and Electronics Engineering (EEE)',
    'Mechanical Engineering',
    'Civil Engineering',
    'Other',
  ];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Form validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid university or personal email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!college.trim()) {
      setErrorMessage('Please enter your College or University name.');
      return;
    }
    if (department === 'Other' && !customDepartment.trim()) {
      setErrorMessage('Please specify your Department name.');
      return;
    }

    const success = register(
      {
        fullName: fullName.trim(),
        email: email.trim(),
        college: college.trim(),
        department: department === 'Other' ? customDepartment.trim() : department,
        customDepartment: department === 'Other' ? customDepartment.trim() : undefined,
        year,
        semester,
        studentId: studentId.trim() || undefined,
      },
      password
    );

    if (success) {
      setSuccessMessage('Registration successful! Redirecting to your personalized learning dashboard...');
    } else {
      setErrorMessage('Registration could not be completed. Please check your details.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please provide both your registered email and password.');
      return;
    }

    const success = login(loginEmail.trim(), loginPassword.trim());
    if (!success) {
      setErrorMessage('Invalid credentials. You can use the Quick Demo Student button below for instant access.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030611]/90 backdrop-blur-2xl overflow-y-auto">
      {/* Background ambient cosmic glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-2xl rounded-2xl bg-[#090f24] border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 p-6 sm:p-8 my-8 text-left">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/30 mb-3">
            <div className="w-full h-full bg-[#090f24] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-400">
            COSMORA AI
          </h1>
          <p className="text-sm font-semibold text-cyan-400 mt-1">
            Your Personal AI Learning Companion
          </p>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/20 text-xs font-medium text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Learn • Grow • Succeed</span>
            <span className="text-slate-500">•</span>
            <span className="text-blue-300">IEEE × Alliance University 2026</span>
          </div>
        </div>

        {/* VIEW 1: WELCOME SCREEN */}
        {authMode === 'welcome' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <p className="text-slate-300 text-sm leading-relaxed">
                Empowering college students with real-time syllabus comprehension, adaptive AI diagnostic quizzes, 3D concept explorations, and peer study spaces.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs text-slate-300">
                <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
                  <p className="font-bold text-cyan-400">🧠 AI Tutor</p>
                  <p className="text-[10px] text-slate-400">Contextual Explanations</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
                  <p className="font-bold text-indigo-400">📄 Notes Analyzer</p>
                  <p className="text-[10px] text-slate-400">PDF & Syllabus Parser</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
                  <p className="font-bold text-amber-400">🎮 Gamification</p>
                  <p className="text-[10px] text-slate-400">XP, Badges & Streaks</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
                  <p className="font-bold text-blue-400">👥 Study Rooms</p>
                  <p className="text-[10px] text-slate-400">Collaborative Peer Hub</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setAuthMode('register')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Register as New Student</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAuthMode('login')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-500/50 font-bold text-sm transition-all"
              >
                <span>Already have an account? Login</span>
              </button>
            </div>

            {/* Quick Demo Credentials for Instant Hackathon Evaluation */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Prototype Demo Access (Instant 1-Click Login):</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-medium">No typing needed</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => demoLogin('Computer Science and Engineering (CSE)')}
                  className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 hover:bg-cyan-900/50 hover:border-cyan-400 text-left transition-colors"
                >
                  <p className="font-bold">💻 CSE Student Demo</p>
                  <p className="text-[10px] text-slate-400">Arjun • 3rd Year • Sem 5</p>
                </button>
                <button
                  onClick={() => demoLogin('Artificial Intelligence and Machine Learning (AIML)')}
                  className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 hover:bg-indigo-900/50 hover:border-indigo-400 text-left transition-colors"
                >
                  <p className="font-bold">🧠 AIML Student Demo</p>
                  <p className="text-[10px] text-slate-400">Vikram • 4th Year • Sem 7</p>
                </button>
                <button
                  onClick={() => demoLogin('Electronics and Communication Engineering (ECE)')}
                  className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-200 hover:bg-blue-900/50 hover:border-blue-400 text-left transition-colors"
                >
                  <p className="font-bold">⚡ ECE Student Demo</p>
                  <p className="text-[10px] text-slate-400">Meera • 3rd Year • Sem 5</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: REGISTRATION FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span>Student Registration Form</span>
              </h2>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-cyan-400 hover:underline font-medium"
              >
                Already registered? Log in
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  1. Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun V. Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  2. Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="student@alliance.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  3. Create Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  4. Confirm Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* College / University Name */}
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">
                  5. College / University Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alliance University, Bengaluru"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Department (Required) */}
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">
                  6. Department <span className="text-rose-400">* (REQUIRED)</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  >
                    {departmentsList.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* If "Other" department is selected, manual input */}
              {department === 'Other' && (
                <div className="sm:col-span-2 animate-in fade-in">
                  <label className="block text-cyan-300 font-semibold mb-1">
                    Enter Your Custom Department Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aerospace Engineering / Data Analytics"
                    value={customDepartment}
                    onChange={(e) => setCustomDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              {/* Year of Study */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  7. Year of Study <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                  </select>
                </div>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  8. Semester <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={`Semester ${s}`}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student ID (Optional) */}
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">
                  9. Student ID / Roll Number <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <IdCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. AU-2023-CSE-0482"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
              >
                Complete Registration & Launch Dashboard
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('welcome')}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Back
              </button>
            </div>
          </form>
        )}

        {/* VIEW 3: LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Student Login</span>
              </h2>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-xs text-cyan-400 hover:underline font-medium"
              >
                Need an account? Register
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="student@alliance.edu.in"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Demo password reset: You can sign in using any password or use the 1-Click Demo Profiles.')}
                    className="text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
              >
                Sign In to Dashboard
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('welcome')}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Back
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-400 mb-2">Or test instantly using a preloaded hackathon profile:</p>
              <button
                type="button"
                onClick={() => demoLogin('Computer Science and Engineering (CSE)')}
                className="w-full py-2 px-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Login as Demo Student (Arjun V. Sharma)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
