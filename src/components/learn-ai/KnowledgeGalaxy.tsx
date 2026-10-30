import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Compass,
  Layers,
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface CelestialNode {
  id: string;
  name: string;
  category: string;
  cx: number;
  cy: number;
  radius: number;
  color: string;
  glowColor: string;
  mastery: number;
  status: 'Mastered' | 'In Progress' | 'Upcoming';
  description: string;
  subtopics: string[];
  recommendedResource: string;
}

export const KnowledgeGalaxy: React.FC = () => {
  const { user, setActiveView, setLearnAiTab } = useApp();

  const [selectedNode, setSelectedNode] = useState<CelestialNode | null>(null);

  const galaxyNodes: CelestialNode[] = [
    {
      id: 'node-1',
      name: 'Non-Linear Trees & Heaps',
      category: 'Data Structures Core',
      cx: 160,
      cy: 140,
      radius: 28,
      color: '#38bdf8',
      glowColor: 'rgba(56, 189, 248, 0.4)',
      mastery: 88,
      status: 'Mastered',
      description: 'Self-balancing AVL rotations, Red-Black color invariants, and binary priority heaps.',
      subtopics: ['AVL Balance Factor', 'Red-Black 5 Invariants', 'Bottom-Up Heapify O(N)', 'B-Tree Node Splits'],
      recommendedResource: 'MIT 6.006 Lecture 6 Notes & LeetCode AVL Tree Simulator',
    },
    {
      id: 'node-2',
      name: 'Kernel Virtual Memory',
      category: 'Operating Systems',
      cx: 480,
      cy: 120,
      radius: 26,
      color: '#818cf8',
      glowColor: 'rgba(129, 140, 248, 0.4)',
      mastery: 62,
      status: 'In Progress',
      description: 'Paging, TLB latency penalties, page replacement policies, and Belady’s anomaly.',
      subtopics: ['Demand Paging Invalidation', 'TLB Reach & 2-Level Page Tables', 'LRU Clock Approximation', 'Thrashing Working Set'],
      recommendedResource: 'OSTEP Chapter 18: Paging & Virtual Memory Models',
    },
    {
      id: 'node-3',
      name: 'Dynamic Programming & Graphs',
      category: 'Algorithms Analysis',
      cx: 300,
      cy: 280,
      radius: 34,
      color: '#06b6d4',
      glowColor: 'rgba(6, 182, 212, 0.5)',
      mastery: 82,
      status: 'Mastered',
      description: 'Optimal substructure, overlapping subproblems, memoization vs tabulation, and DAG reachability.',
      subtopics: ['0/1 Knapsack State Space', 'Matrix Chain Multiplication', 'Dijkstra Min-Heap Relaxation', 'Floyd-Warshall All-Pairs'],
      recommendedResource: 'CLRS Section 15: Dynamic Programming Paradigms',
    },
    {
      id: 'node-4',
      name: 'Neural Backprop & Transformers',
      category: 'Machine Learning Elective',
      cx: 140,
      cy: 380,
      radius: 30,
      color: '#f43f5e',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      mastery: 74,
      status: 'In Progress',
      description: 'Computational graph auto-differentiation, gradient vanish mitigation, and scaled dot-product attention.',
      subtopics: ['Vectorized Multivariate Chain Rule', 'Softmax Temperature Scaling', 'Multi-Head Attention Projections', 'LayerNorm vs BatchNorm'],
      recommendedResource: 'Andrej Karpathy Neural Networks: Zero to Hero',
    },
    {
      id: 'node-5',
      name: 'Distributed Consensus & Raft',
      category: 'Advanced Systems',
      cx: 460,
      cy: 390,
      radius: 24,
      color: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      mastery: 35,
      status: 'Upcoming',
      description: 'Leader election, log replication safety, split-brain mitigation, and Byzantine fault tolerance.',
      subtopics: ['Raft Leader Election Term Invariant', 'Heartbeat RPC Timing', 'Commit Index Quorum Rules', 'CAP Theorem Tradeoffs'],
      recommendedResource: 'The Secret Lives of Data (Raft Visualization)',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Galaxy Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1">
            <Compass className="w-3 h-3" />
            <span>Interactive Subject Map</span>
          </div>
          <h2 className="text-xl font-bold text-white">COSMORA Knowledge Galaxy</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any planetary topic node in the celestial orbit to inspect mastery, syllabus units, and study resources.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Mastered
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> In Progress
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Upcoming
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Galaxy Canvas / SVG */}
        <div className="lg:col-span-2 relative min-h-[500px] rounded-3xl bg-[#040817] border border-cyan-500/20 overflow-hidden flex items-center justify-center p-4">
          {/* Subtle cosmic stars background */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          {/* Central Sun: COSMORA Academic Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 blur-sm animate-pulse opacity-70" />
            <div className="absolute top-2 w-16 h-16 rounded-full bg-[#0a122c] border-2 border-cyan-400 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/50">
              <Sparkles className="w-6 h-6 text-cyan-300" />
              <span className="text-[9px] font-extrabold text-white uppercase tracking-tighter">COSMORA</span>
            </div>
          </div>

          {/* Orbit Circles */}
          <svg className="w-full h-full max-w-[600px] max-h-[500px]" viewBox="0 0 600 500">
            {/* Orbit paths */}
            <circle cx="300" cy="250" r="110" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeDasharray="4 4" />
            <circle cx="300" cy="250" r="190" fill="none" stroke="rgba(99, 102, 241, 0.15)" strokeDasharray="6 6" />

            {/* Constellation lines */}
            <line x1="300" y1="250" x2="160" y2="140" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />
            <line x1="300" y1="250" x2="480" y2="120" stroke="rgba(129, 140, 248, 0.2)" strokeWidth="1" />
            <line x1="300" y1="250" x2="300" y2="280" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1" />
            <line x1="300" y1="250" x2="140" y2="380" stroke="rgba(244, 63, 94, 0.2)" strokeWidth="1" />
            <line x1="300" y1="250" x2="460" y2="390" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1" />

            {/* Planetary Nodes */}
            {galaxyNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-all duration-300 group"
                >
                  {/* Outer glow ring */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={isSelected ? node.radius + 8 : node.radius + 3}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={isSelected ? '2' : '1'}
                    opacity={isSelected ? '0.8' : '0.3'}
                    className="group-hover:opacity-100 transition-opacity"
                  />
                  {/* Planet body */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={node.radius}
                    fill={node.color}
                    filter="drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))"
                    className="group-hover:scale-110 transition-transform origin-center"
                  />
                  {/* Label */}
                  <text
                    x={node.cx}
                    y={node.cy + node.radius + 16}
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="11"
                    fontWeight="700"
                    className="select-none font-sans"
                  >
                    {node.name}
                  </text>
                  <text
                    x={node.cx}
                    y={node.cy + node.radius + 28}
                    textAnchor="middle"
                    fill={node.color}
                    fontSize="9"
                    fontWeight="600"
                    className="select-none font-sans"
                  >
                    {node.mastery}% Mastery
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Topic Inspector Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                  {selectedNode.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedNode.status === 'Mastered'
                      ? 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300'
                      : selectedNode.status === 'In Progress'
                      ? 'bg-cyan-950/70 border border-cyan-500/30 text-cyan-300'
                      : 'bg-purple-950/70 border border-purple-500/30 text-purple-300'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{selectedNode.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Mastery bar */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Demonstrated Mastery</span>
                  <span className="text-cyan-400 font-bold">{selectedNode.mastery}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full"
                    style={{ width: `${selectedNode.mastery}%` }}
                  />
                </div>
              </div>

              {/* Subtopics Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Curriculum Subtopics:</span>
                </span>
                <div className="space-y-1.5">
                  {selectedNode.subtopics.map((sub, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs text-slate-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended resource */}
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs space-y-1">
                <span className="text-[10px] font-bold text-blue-300 uppercase">
                  Recommended Study Reference:
                </span>
                <p className="text-slate-300 text-xs font-medium">
                  {selectedNode.recommendedResource}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setLearnAiTab('tutor')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <span>Ask AI Tutor About {selectedNode.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Compass className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
              <h4 className="text-sm font-bold text-slate-200">Explore the Celestial Map</h4>
              <p className="text-xs text-slate-400">
                Click any glowing topic planet on the left to reveal its curriculum structure, syllabus mastery, and recommended references.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
