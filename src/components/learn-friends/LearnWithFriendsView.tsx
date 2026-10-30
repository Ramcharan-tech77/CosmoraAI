import React, { useState } from 'react';
import { useApp, FriendsSubTab } from '../../context/AppContext';
import {
  INITIAL_STUDY_ROOMS,
  INITIAL_GROUP_DISCUSSIONS,
  STUDY_PARTNERS_DATA,
} from '../../data/mockData';
import { StudyRoom, GroupDiscussion, StudyPartner } from '../../types';
import {
  Users2,
  Plus,
  Key,
  MessageSquare,
  Sparkles,
  Bot,
  UserPlus,
  Check,
  Search,
  Filter,
  Send,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ThumbsUp,
  Share2,
} from 'lucide-react';

export const LearnWithFriendsView: React.FC = () => {
  const { friendsTab, setFriendsTab, user, addXp, addToast } = useApp();

  // Study Rooms State
  const [rooms, setRooms] = useState<StudyRoom[]>(INITIAL_STUDY_ROOMS);
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [roomChatMessages, setRoomChatMessages] = useState<
    Array<{ id: string; sender: string; text: string; time: string; isAi?: boolean }>
  >([
    { id: '1', sender: 'Sneha Rao (Host)', text: 'Welcome everyone! Today we are doing 2 LeetCode dynamic programming questions.', time: '10:02 AM' },
    { id: '2', sender: 'Rohan Mehta', text: 'Hey! Are we starting with 0/1 Knapsack or Longest Common Subsequence?', time: '10:04 AM' },
    { id: '3', sender: 'COSMORA Group Bot', text: '🤖 @CosmoraBot here! I have prepared 3 revision flashcards for Longest Common Subsequence when you are ready.', time: '10:05 AM', isAi: true },
  ]);
  const [roomChatInput, setRoomChatInput] = useState('');

  // Create Room Form State
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomSubject, setNewRoomSubject] = useState('Data Structures & Algorithms');
  const [newRoomDesc, setNewRoomDesc] = useState('');

  // Group Discussions State
  const [discussions, setDiscussions] = useState<GroupDiscussion[]>(INITIAL_GROUP_DISCUSSIONS);
  const [selectedDiscussion, setSelectedDiscussion] = useState<GroupDiscussion | null>(discussions[0]);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newQuestionSubject, setNewQuestionSubject] = useState('Operating Systems');
  const [showAskModal, setShowAskModal] = useState(false);
  const [replyInput, setReplyInput] = useState('');

  // Study Partners State
  const [partners, setPartners] = useState<StudyPartner[]>(STUDY_PARTNERS_DATA);
  const [partnerFilterDept, setPartnerFilterDept] = useState('All');
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');

  // Collaborative Pomodoro Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLofiSoundOn, setIsLofiSoundOn] = useState(false);

  // Toggle Pomodoro timer
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      addToast('success', 'Focus Session Completed! 🍅', '+50 XP awarded for 25 minutes of deep focus study.');
      addXp(50, 'Completed collaborative focus timer session');
      setIsTimerRunning(false);
      setPomodoroSeconds(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Create Room Handler
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const generatedCode = 'AU-' + Math.floor(1000 + Math.random() * 9000);
    const created: StudyRoom = {
      id: 'room_' + Date.now(),
      name: newRoomName.trim(),
      subject: newRoomSubject,
      department: user?.department?.split('(')[1]?.replace(')', '') || 'CSE',
      code: generatedCode,
      hostName: user?.fullName || 'Student Host',
      maxParticipants: 8,
      isLive: true,
      topicDescription: newRoomDesc || 'Collaborative study and exam preparation.',
      tags: [newRoomSubject, 'Peer Learning', 'Live Sync'],
      participants: [
        {
          id: 'u_me',
          name: `${user?.fullName || 'You'} (Host)`,
          avatar: 'usr',
          status: 'studying',
        },
      ],
    };

    setRooms([created, ...rooms]);
    setActiveRoom(created);
    setShowCreateRoomModal(false);
    setNewRoomName('');
    setNewRoomDesc('');
    addXp(40, 'Created a new collaborative study room');
    addToast('success', 'Study Room Created!', `Share Room Code: ${generatedCode} with your classmates.`);
  };

  // Join Room by Code
  const handleJoinByCode = () => {
    if (!joinCodeInput.trim()) return;
    const match = rooms.find((r) => r.code.toUpperCase() === joinCodeInput.trim().toUpperCase());
    if (match) {
      setActiveRoom(match);
      addToast('success', 'Joined Study Room', `Connected to "${match.name}".`);
      addXp(25, 'Joined a collaborative study room');
      setJoinCodeInput('');
    } else {
      addToast('error', 'Room Not Found', 'No active study room matches that code. Check the code and try again.');
    }
  };

  // Send message in active room
  const handleSendRoomChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomChatInput.trim()) return;

    const msg = {
      id: 'msg_' + Date.now(),
      sender: user?.fullName || 'You',
      text: roomChatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setRoomChatMessages((prev) => [...prev, msg]);
    setRoomChatInput('');

    // If message mentions @bot or bot or question, simulate group bot answer
    if (roomChatInput.toLowerCase().includes('@cosmorabot') || roomChatInput.toLowerCase().includes('bot') || roomChatInput.includes('?')) {
      setTimeout(() => {
        setRoomChatMessages((prev) => [
          ...prev,
          {
            id: 'bot_' + Date.now(),
            sender: 'COSMORA Group Assistant',
            text: `🤖 **Group AI Guidance**: Regarding "${msg.text}" — this is tested under Unit 2. Remember to verify the boundary base condition first!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAi: true,
          },
        ]);
      }, 1000);
    }
  };

  // Ask new Discussion Question
  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;

    const newDisc: GroupDiscussion = {
      id: 'disc_' + Date.now(),
      title: newQuestionTitle.trim(),
      authorName: user?.fullName || 'Student',
      authorDept: user?.department?.split('(')[1]?.replace(')', '') || 'CSE',
      authorYear: user?.year || '3rd Year',
      subject: newQuestionSubject,
      timestamp: 'Just now',
      content: newQuestionContent.trim(),
      upvotes: 1,
      replies: [
        {
          id: 'ai_rep_' + Date.now(),
          author: 'COSMORA AI Group Assistant',
          dept: 'AI Bot',
          content: `🤖 **Instant AI Clarification**: This is a key syllabus concept in ${newQuestionSubject}. The fundamental theorem states that local optimal choices yield global optima only if the matroid property holds!`,
          timestamp: 'Just now',
          isAiAssistant: true,
        },
      ],
    };

    setDiscussions([newDisc, ...discussions]);
    setSelectedDiscussion(newDisc);
    setShowAskModal(false);
    setNewQuestionTitle('');
    setNewQuestionContent('');
    addXp(30, 'Posted a new academic discussion question');
    addToast('success', 'Question Posted! 💬', 'Your question is now visible to classmates in your department.');
  };

  // Reply to discussion
  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedDiscussion) return;

    const reply = {
      id: 'rep_' + Date.now(),
      author: user?.fullName || 'You',
      dept: user?.department?.split('(')[1]?.replace(')', '') || 'CSE',
      content: replyInput.trim(),
      timestamp: 'Just now',
    };

    setDiscussions((prev) =>
      prev.map((d) => (d.id === selectedDiscussion.id ? { ...d, replies: [...d.replies, reply] } : d))
    );

    setSelectedDiscussion((prev) => (prev ? { ...prev, replies: [...prev.replies, reply] } : null));
    setReplyInput('');
    addXp(20, 'Contributed an answer to discussion');
  };

  // Upvote Question
  const handleUpvote = (id: string) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d))
    );
    if (selectedDiscussion?.id === id) {
      setSelectedDiscussion((prev) => (prev ? { ...prev, upvotes: prev.upvotes + 1 } : null));
    }
  };

  // Toggle Partner Connect
  const togglePartnerConnect = (id: string) => {
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.connected;
          if (nextState) {
            addToast('success', 'Study Partner Connected! 🤝', `You and ${p.name} are now connected.`);
            addXp(25, `Connected with study partner ${p.name}`);
          }
          return { ...p, connected: nextState };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900/80 to-[#070c1d] border border-indigo-500/25">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Users2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>MODULE TWO — COLLABORATIVE STUDENT LEARNING</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Learn with Friends
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Study rooms, academic discussion forums, synchronized timers, and peer study matching.
          </p>
        </div>

        {/* Quick Room Code Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Enter Room Code (e.g. CS-7842)..."
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 w-52"
            />
          </div>
          <button
            onClick={handleJoinByCode}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors shrink-0"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Friends Sub-tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 no-scrollbar">
        {[
          { id: 'rooms', label: 'Study Rooms', count: rooms.length },
          { id: 'discussions', label: 'Group Discussions', count: discussions.length },
          { id: 'study-together', label: 'Focus & Study Together' },
          { id: 'partners', label: 'Find Study Partners', count: partners.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFriendsTab(tab.id as FriendsSubTab)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              friendsTab === tab.id
                ? 'bg-gradient-to-r from-indigo-600/25 to-purple-600/25 text-indigo-200 border border-indigo-500/40 shadow-sm'
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

      {/* SUB-TAB 1: STUDY ROOMS */}
      {friendsTab === 'rooms' && (
        <div className="space-y-6">
          {!activeRoom ? (
            /* Rooms List View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Active Virtual Study Rooms</h3>
                  <p className="text-xs text-slate-400">Join peers to study in focused, interactive audio/chat rooms.</p>
                </div>
                <button
                  onClick={() => setShowCreateRoomModal(true)}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Study Room</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 backdrop-blur-md flex flex-col justify-between transition-all group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                          {room.subject}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-mono-code text-slate-400">
                          Code: <strong className="text-white">{room.code}</strong>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {room.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{room.topicDescription}</p>

                      {/* Participants Avatars */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center -space-x-2">
                          {room.participants.map((p, idx) => (
                            <div
                              key={p.id || idx}
                              title={`${p.name} (${p.status})`}
                              className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                            >
                              {p.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {room.participants.length} / {room.maxParticipants} Students
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveRoom(room);
                          addToast('info', 'Entered Room', `Connected to ${room.name}`);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                      >
                        Enter Room
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(room.code);
                          addToast('success', 'Code Copied! 📋', `Share code ${room.code} with friends.`);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                        title="Copy Room Code"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ACTIVE ROOM INSIDE VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Room info & Participant list */}
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-400">Active Room</span>
                      <h3 className="text-base font-bold text-white">{activeRoom.name}</h3>
                      <p className="text-xs text-slate-400">{activeRoom.subject}</p>
                    </div>
                    <button
                      onClick={() => setActiveRoom(null)}
                      className="text-xs text-rose-400 hover:underline font-semibold"
                    >
                      Leave Room
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Room Invite Code:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeRoom.code);
                        addToast('success', 'Code Copied', activeRoom.code);
                      }}
                      className="text-cyan-400 font-mono-code font-bold hover:underline"
                    >
                      {activeRoom.code} (Copy)
                    </button>
                  </div>

                  {/* Participants */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Study Participants ({activeRoom.participants.length})
                    </span>
                    <div className="space-y-1.5">
                      {activeRoom.participants.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                              {p.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-200">{p.name}</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>{p.status}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Assistant Callout */}
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                      <Bot className="w-3.5 h-3.5" />
                      <span>AI Group Assistant Active</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Tag <code>@CosmoraBot</code> in the room chat to generate group quiz questions or summarize discussions!
                    </p>
                  </div>
                </div>
              </div>

              {/* Right 2 Columns: Live Room Chat */}
              <div className="lg:col-span-2 flex flex-col h-[560px] rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Live Study Room Chat</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Connected
                  </span>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {roomChatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl max-w-lg ${
                        msg.isAi
                          ? 'bg-indigo-950/60 border border-indigo-500/40 text-indigo-100 mr-auto'
                          : msg.sender.includes('You')
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-slate-800/80 border border-slate-700 text-slate-200 mr-auto'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-1">
                        <span className={msg.isAi ? 'text-cyan-400 font-bold' : 'text-slate-300'}>
                          {msg.sender}
                        </span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Input bar */}
                <form onSubmit={handleSendRoomChat} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type message or ask @CosmoraBot..."
                    value={roomChatInput}
                    onChange={(e) => setRoomChatInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: GROUP DISCUSSIONS */}
      {friendsTab === 'discussions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Discussion List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Academic Forum ({discussions.length})
              </span>
              <button
                onClick={() => setShowAskModal(true)}
                className="py-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ask Question</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {discussions.map((d) => {
                const isSelected = selectedDiscussion?.id === d.id;

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDiscussion(d)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">
                      {d.subject}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1 line-clamp-2">{d.title}</h4>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{d.authorName} ({d.authorDept})</span>
                      <div className="flex items-center gap-2">
                        <span>{d.replies.length} replies</span>
                        <span className="flex items-center gap-1 text-cyan-400 font-bold">
                          <ThumbsUp className="w-3 h-3" /> {d.upvotes}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Question Thread */}
          <div className="lg:col-span-2 space-y-4">
            {selectedDiscussion ? (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-cyan-400">{selectedDiscussion.subject}</span>
                    <button
                      onClick={() => handleUpvote(selectedDiscussion.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs border border-slate-700"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{selectedDiscussion.upvotes} Upvotes</span>
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-3">{selectedDiscussion.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                    {selectedDiscussion.content}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Asked by <strong>{selectedDiscussion.authorName}</strong> ({selectedDiscussion.authorDept}, {selectedDiscussion.authorYear})</span>
                    <span>•</span>
                    <span>{selectedDiscussion.timestamp}</span>
                  </div>
                </div>

                {/* Answers / Replies List */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Answers & Explanations ({selectedDiscussion.replies.length})
                  </h4>

                  <div className="space-y-3">
                    {selectedDiscussion.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                          rep.isAiAssistant
                            ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-100'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-bold ${rep.isAiAssistant ? 'text-cyan-400' : 'text-slate-300'}`}>
                            {rep.author} ({rep.dept})
                          </span>
                          <span className="text-slate-400">{rep.timestamp}</span>
                        </div>
                        <p>{rep.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Post Answer Bar */}
                <form onSubmit={handleAddReply} className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Contribute your solution or answer to this academic question..."
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs"
                  >
                    Reply
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400">
                Select a discussion question on the left to review explanations.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: STUDY TOGETHER & POMODORO FOCUS TIMER */}
      {friendsTab === 'study-together' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Synchronized Focus Pomodoro */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 text-center space-y-6 shadow-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Timer className="w-3.5 h-3.5 text-indigo-400" />
              <span>SYNCHRONIZED FOCUS POMODORO</span>
            </div>

            <div>
              <div className="font-display font-extrabold text-6xl sm:text-7xl text-white tracking-wider my-4">
                {formatTimer(pomodoroSeconds)}
              </div>
              <p className="text-xs text-slate-400">
                {isTimerRunning ? 'Deep Focus Sprint Active — Stay dialed in' : 'Ready to start 25-minute shared focus block'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="py-3 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause Focus
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Start Focus Session
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setPomodoroSeconds(25 * 60);
                }}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsLofiSoundOn(!isLofiSoundOn);
                  addToast('info', isLofiSoundOn ? 'Sound Muted' : 'Cosmic Ambience', 'Cosmic focus white-noise toggled.');
                }}
                className={`p-3 rounded-xl border ${
                  isLofiSoundOn
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Toggle Cosmic Study Ambience"
              >
                {isLofiSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
              ⚡ <strong>Study Together Reward</strong>: Completing this 25m cycle awards +50 XP and increments your streak!
            </div>
          </div>

          {/* Shared Group Goals & Revision Schedule */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Shared Department Goals (Alliance CSE/AIML)
            </h3>

            <div className="space-y-3">
              {[
                { title: 'Solve 10 LeetCode Mediums on Graphs before IEEE Hackathon', progress: 8, total: 10, target: 'Nov 12' },
                { title: 'Read Chapter 4 of xv6 Kernel Operating System', progress: 3, total: 4, target: 'Nov 05' },
                { title: 'Collaborative Mock Interview Practice Room', progress: 2, total: 3, target: 'Nov 08' },
              ].map((goal, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">{goal.title}</span>
                    <span className="text-cyan-400">{goal.progress}/{goal.total} done</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${(goal.progress / goal.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Target: {goal.target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: FIND STUDY PARTNERS */}
      {friendsTab === 'partners' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by student name or subject (e.g. PyTorch, Networks)..."
                value={partnerSearchQuery}
                onChange={(e) => setPartnerSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={partnerFilterDept}
                onChange={(e) => setPartnerFilterDept(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
              >
                <option value="All">All Departments</option>
                <option value="Computer Science and Engineering (CSE)">CSE</option>
                <option value="Artificial Intelligence and Machine Learning (AIML)">AIML</option>
                <option value="Electronics and Communication Engineering (ECE)">ECE</option>
              </select>
            </div>
          </div>

          {/* Study Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {partners
              .filter((p) => {
                const matchesDept = partnerFilterDept === 'All' || p.department.includes(partnerFilterDept);
                const matchesSearch =
                  p.name.toLowerCase().includes(partnerSearchQuery.toLowerCase()) ||
                  p.studyGoals.some((g) => g.toLowerCase().includes(partnerSearchQuery.toLowerCase()));
                return matchesDept && matchesSearch;
              })
              .map((partner) => (
                <div
                  key={partner.id}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                        {partner.name.charAt(0)}
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                        {partner.matchScore}% Match
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-3">{partner.name}</h4>
                    <p className="text-[11px] text-cyan-400 font-medium">
                      {partner.department.split('(')[1]?.replace(')', '') || partner.department} • {partner.year}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                      {partner.bio}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {partner.studyGoals.map((goal, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700/60"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => togglePartnerConnect(partner.id)}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      partner.connected
                        ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {partner.connected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect to Study</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal: Create Study Room */}
      {showCreateRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#090f24] border border-cyan-500/30 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Create Virtual Study Room</h3>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🚀 LeetCode Hard DP Prep Room"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject Area</label>
                <input
                  type="text"
                  required
                  value={newRoomSubject}
                  onChange={(e) => setNewRoomSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Room Purpose / Description</label>
                <textarea
                  rows={3}
                  placeholder="What will students discuss or work on in this room?"
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRoomModal(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold"
                >
                  Create & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ask Question in Discussion */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#090f24] border border-cyan-500/30 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Ask an Academic Question</h3>

            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How does Peterson's solution guarantee mutual exclusion?"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newQuestionSubject}
                  onChange={(e) => setNewQuestionSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Explanation & Code Snippet</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide context, what you have tried, and where you are getting stuck..."
                  value={newQuestionContent}
                  onChange={(e) => setNewQuestionContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
