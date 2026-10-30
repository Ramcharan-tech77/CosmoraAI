import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyTask } from '../../types';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  BellRing,
  Target,
  Layers,
} from 'lucide-react';

export const PersonalizedStudyPlan: React.FC = () => {
  const { tasks, toggleTask, addTask, deleteTask, user, stats } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [priority, setPriority] = useState<StudyTask['priority']>('High');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [deadline, setDeadline] = useState('Today, 8:00 PM');

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      subject,
      priority,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      deadline,
      completed: false,
    });

    setTaskTitle('');
    setShowAddModal(false);
  };

  const weeklyMilestones = [
    { title: 'Master AVL Tree & Red-Black Invariants', targetDate: 'Nov 02', progress: 75 },
    { title: 'Complete Banker Algorithm Safe State Proofs', targetDate: 'Nov 04', progress: 40 },
    { title: 'Implement B+ Tree Indexing in SQLite Simulator', targetDate: 'Nov 06', progress: 20 },
  ];

  const revisionReminders = [
    { topic: 'Page Replacement FIFO vs LRU', due: 'In 2 hours', reason: 'Detected weak diagnostic score' },
    { topic: 'Dijkstra Priority Queue Implementation', due: 'Tomorrow 10 AM', reason: 'Spaced repetition schedule' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Adaptive Study Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white">Personalized Study Schedule</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Calibrated for {user?.department?.split('(')[1]?.replace(')', '') || 'Engineering'} • {user?.year} • Based on your diagnostic accuracy ({stats.averageQuizScore}%)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Study Task</span>
        </button>
      </div>

      {/* Grid: Tasks vs Weekly Goals & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Daily Tasks Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Daily Tasks ({pendingTasks.length})
            </span>
            <span className="text-xs text-cyan-400 font-semibold">
              {completedTasks.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => toggleTask(task.id)}
                  className="flex items-start gap-3 min-w-0 cursor-pointer flex-1"
                >
                  <div className="w-5 h-5 rounded-lg border border-slate-600 group-hover:border-cyan-400 flex items-center justify-center shrink-0 mt-0.5 transition-colors" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="text-cyan-400 font-medium">{task.subject}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.estimatedMinutes} mins
                      </span>
                      <span>•</span>
                      <span>Due {task.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      task.priority === 'High'
                        ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                        : task.priority === 'Medium'
                        ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {task.priority}
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {pendingTasks.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-200">All planned tasks completed!</p>
                <p className="text-[11px] mt-0.5 text-slate-400">Add a new task or review the 3D Concept Explorer.</p>
              </div>
            )}
          </div>

          {/* Completed Tasks section */}
          {completedTasks.length > 0 && (
            <div className="pt-4 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                Completed Recently
              </span>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center justify-between text-slate-400 text-xs"
                  >
                    <div
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="line-through">{task.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{task.subject}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Weekly Goals & Spaced Repetition Reminders */}
        <div className="space-y-6">
          {/* Weekly Goals */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Weekly Learning Goals</span>
            </h3>

            <div className="space-y-3">
              {weeklyMilestones.map((milestone, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">{milestone.title}</span>
                    <span className="text-cyan-400 text-[10px]">{milestone.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Target Completion: {milestone.targetDate}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Spaced Repetition Revision Reminders */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>Smart Revision Reminders</span>
            </h3>

            <div className="space-y-2.5">
              {revisionReminders.map((rev, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/25 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-200">{rev.topic}</span>
                    <span className="text-[10px] text-amber-300 font-semibold">{rev.due}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{rev.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#090f24] border border-cyan-500/30 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Study Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 5 Knapsack DP problems"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design and Analysis of Algorithms"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deadline</label>
                <input
                  type="text"
                  placeholder="e.g. Today, 9:00 PM"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
