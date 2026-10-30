import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEPARTMENT_DETAILS } from '../../data/mockData';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Code,
  Award,
} from 'lucide-react';

export const ExploreDepartmentView: React.FC = () => {
  const { user, setActiveView, setLearnAiTab } = useApp();

  const userDeptKey = user?.department || 'Computer Science and Engineering (CSE)';
  const deptData =
    DEPARTMENT_DETAILS[userDeptKey] ||
    DEPARTMENT_DETAILS['Computer Science and Engineering (CSE)'];

  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'resources' | 'careers' | 'community'>('overview');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(deptData.coreSubjects[0]?.code || '');

  const selectedSubject =
    deptData.coreSubjects.find((s: any) => s.code === selectedSubjectCode) ||
    deptData.coreSubjects[0];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Department Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-[#070c1d] border border-cyan-500/30 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>MODULE FOUR — DEPARTMENT ACADEMIC HUB</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Department of {user?.department?.split('(')[0] || 'Engineering'}
          </h1>
          <p className="text-xs sm:text-sm text-cyan-300 font-medium">
            "{deptData.tagline}"
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
            <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-700">
              {user?.college}
            </span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">{user?.year} ({user?.semester})</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveView('learn-ai');
              setLearnAiTab('tutor');
            }}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Department AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 no-scrollbar">
        {[
          { id: 'overview', label: 'Department Overview' },
          { id: 'subjects', label: 'Curriculum & Subject Explorer', count: deptData.coreSubjects.length },
          { id: 'resources', label: 'Learning Notes & Toolchains' },
          { id: 'careers', label: 'Career Explorer & Internships', count: deptData.careerPathways.length },
          { id: 'community', label: 'IEEE Events & Hackathons', count: deptData.upcomingEvents.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600/25 to-cyan-600/25 text-cyan-200 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Department Vision & Academic Scope</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {deptData.overview}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-cyan-400">Core Accreditation</span>
                <p className="text-sm font-semibold text-white">NBA & IEEE Aligned</p>
                <p className="text-[10px] text-slate-400">Outcome-based engineering framework</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-indigo-400">Current Semester Focus</span>
                <p className="text-sm font-semibold text-white">{user?.semester} Core Modules</p>
                <p className="text-[10px] text-slate-400">4 Theory Courses + 2 Laboratory Practicums</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400">Placement Preparation</span>
                <p className="text-sm font-semibold text-white">IEEE Hackathon 2026</p>
                <p className="text-[10px] text-slate-400">Targeting top Tier-1 software & hardware roles</p>
              </div>
            </div>
          </div>

          {/* Popular Tech Stack in this Department */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Industry-Standard Tech Stack & Tools</span>
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {deptData.popularTech.map((tech: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-semibold text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECT EXPLORER */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subjects List */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Department Core Subjects ({deptData.coreSubjects.length})
            </span>

            <div className="space-y-2.5">
              {deptData.coreSubjects.map((subject: any) => {
                const isSelected = selectedSubject?.code === subject.code;

                return (
                  <div
                    key={subject.code}
                    onClick={() => setSelectedSubjectCode(subject.code)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono-code font-bold mb-1">
                      <span className="text-cyan-400">{subject.code}</span>
                      <span className="text-slate-400">{subject.credits} Credits</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{subject.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {subject.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Subject Details & Units */}
          <div className="lg:col-span-2 space-y-4">
            {selectedSubject && (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono-code font-bold text-cyan-400">
                      {selectedSubject.code} • {selectedSubject.credits} Credits
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{selectedSubject.name}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-xs font-bold text-cyan-300">
                    Mandatory Core
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedSubject.description}
                </p>

                {/* Units List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Syllabus Modules & Units:</span>
                  </h4>

                  <div className="space-y-2">
                    {selectedSubject.units.map((unitText: string, i: number) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-200">{unitText}</span>
                        <button
                          onClick={() => {
                            setActiveView('learn-ai');
                            setLearnAiTab('tutor');
                          }}
                          className="text-cyan-400 hover:underline font-semibold text-[11px]"
                        >
                          Learn Unit with AI
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Textbooks / Links */}
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                  <span className="text-xs font-bold text-indigo-300">
                    Verified Reference Materials & Companion Courseware:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubject.resources.map((res: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-900/40 text-indigo-200 border border-indigo-500/30 text-[11px] font-medium"
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RESOURCES & NOTES */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Comprehensive Lecture Notes & Formulas',
              desc: 'Curated by department professors with step-by-step mathematical proofs and exam problem solutions.',
              type: 'PDF Notes',
              tag: 'Alliance Library',
            },
            {
              title: 'Laboratory Practicum Codebase & Testbenches',
              desc: 'Ready-to-run GitHub template repositories for all semester practical assignments.',
              type: 'Code & Labs',
              tag: 'GitHub',
            },
            {
              title: 'IEEE Transcripts & High-Impact Papers',
              desc: 'Research papers covering state-of-the-art algorithms and engineering systems.',
              type: 'Research',
              tag: 'IEEE Xplore',
            },
            {
              title: 'MIT OpenCourseWare Companion Lectures',
              desc: 'High-definition video lectures by renowned professors explaining fundamental concepts.',
              type: 'Video Series',
              tag: 'MIT OCW',
            },
            {
              title: 'Campus Placement Technical Question Bank',
              desc: 'Solved past interview questions from Google, Microsoft, Amazon, and Texas Instruments.',
              type: 'Interview Prep',
              tag: 'Placement Cell',
            },
            {
              title: 'Interactive Simulator Sandboxes',
              desc: 'Run web-based simulations of CPU scheduling, cache models, and logic gate arrays.',
              type: 'Simulators',
              tag: 'COSMORA Labs',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400">
                  <span>{item.type}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2">{item.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <button
                onClick={() => {
                  setActiveView('learn-ai');
                  setLearnAiTab('tutor');
                }}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <span>Study with COSMORA AI</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CAREERS & INTERNSHIPS */}
      {activeTab === 'careers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {deptData.careerPathways.map((career: any, idx: number) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                      Demand: {career.demand}
                    </span>
                    <span className="text-xs font-bold text-cyan-300">{career.salaryRange}</span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-3">{career.role}</h4>

                  <div className="mt-3 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Key Required Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {career.keySkills.map((skill: string, sIdx: number) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200 border border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setActiveView('learn-ai');
                      setLearnAiTab('study-plan');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    Add Target Roadmap to Study Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COMMUNITY & IEEE HACKATHONS */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Upcoming Department Academic Events & Hackathons</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptData.upcomingEvents.map((evt: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                >
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Prize Pool: {evt.prize}
                  </span>
                  <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>📅 <strong>Date:</strong> {evt.date}</p>
                    <p>📍 <strong>Venue:</strong> {evt.venue}</p>
                    {evt.speaker && <p>🎤 <strong>Speaker:</strong> {evt.speaker}</p>}
                  </div>

                  <button
                    onClick={() => alert(`Registered for ${evt.title}! Confirmation sent to your university email.`)}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-colors"
                  >
                    Register Participation
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
