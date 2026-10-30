import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Code2,
  Cpu,
  FileText,
  AlertCircle,
  HelpCircle,
  Globe,
  Mic,
  MicOff,
} from 'lucide-react';

export const AiTutorChat: React.FC = () => {
  const {
    user,
    chatMessages,
    addChatMessage,
    clearChat,
    uploadedMaterials,
    isAiLive,
    addXp,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedMaterialContext, setSelectedMaterialContext] = useState<string>('none');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputMessage]);

  const testPrompts = [
    'Explain quantum physics in simple words.',
    "What is Newton's second law?",
    'Explain artificial intelligence.',
    'What is the difference between RAM and ROM?',
    'Explain quantum superposition.',
    'Write a Python program to check whether a number is prime.',
    'What is photosynthesis?',
    'Explain quantum entanglement.',
  ];

  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [selectedRole, setSelectedRole] = useState<'general' | 'coding' | 'physics' | 'math'>('general');
  const [isSearchGrounding, setIsSearchGrounding] = useState(false);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micChunksRef = useRef<Blob[]>([]);

  const startMicDictate = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mr;
      micChunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) micChunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(micChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          try {
            const resp = await fetch('/api/ai/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64, mimeType: 'audio/webm' }),
            });
            const data = await resp.json();
            if (data.transcript) {
              const cleanText = data.transcript.split('\n')[0].replace(/^Transcript:?\s*/i, '');
              setInputMessage((prev) => (prev ? prev + ' ' + cleanText : cleanText));
            }
          } catch (e) {
            console.warn('Dictate transcribe error:', e);
          }
        };
      };

      mr.start();
      setIsRecordingMic(true);
    } catch (e) {
      console.warn('Mic permission error:', e);
    }
  };

  const stopMicDictate = () => {
    if (mediaRecorderRef.current && isRecordingMic) {
      mediaRecorderRef.current.stop();
      setIsRecordingMic(false);
    }
  };

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Append user message
    const userMsg = {
      id: 'usr_' + Date.now(),
      role: 'user' as const,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    addChatMessage(userMsg);
    setIsLoading(true);

    // If Search Grounding is active, route through /api/ai/search-grounded
    if (isSearchGrounding) {
      try {
        const response = await fetch('/api/ai/search-grounded', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: text,
            department: user?.department || 'General STEM',
          }),
        });
        const data = await response.json();
        let reply = data.answer || 'No search result found.';
        if (data.sources && data.sources.length > 0) {
          reply += '\n\n**Verified Sources & Citations:**\n' + data.sources.map((s: any) => `- [${s.title}](${s.url})`).join('\n');
        }
        addChatMessage({
          id: 'ai_ground_' + Date.now(),
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveAI: true,
        });
        addXp(20, 'Utilized Google Search Grounding for verified research facts');
      } catch (err: any) {
        addChatMessage({
          id: 'ai_err_' + Date.now(),
          role: 'assistant',
          content: `⚠️ Search Grounding Error: ${err?.message || 'Failed to search'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveAI: false,
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Prepare optional notes context only if explicitly selected
    let notesContext = '';
    if (selectedMaterialContext !== 'none') {
      if (selectedMaterialContext === 'all') {
        notesContext = uploadedMaterials.map((m) => `${m.title}: ${m.contentSnippet}`).join('\n\n');
      } else {
        const match = uploadedMaterials.find((m) => m.id === selectedMaterialContext);
        if (match) notesContext = `${match.title}:\n${match.contentSnippet}`;
      }
    }

    try {
      // Build conversation history from existing chat messages
      const historyPayload = chatMessages.slice(-14).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          preferredModel: selectedModel,
          role: selectedRole,
          studentContext: {
            fullName: user?.fullName,
            department: user?.department,
            year: user?.year,
            semester: user?.semester,
          },
          uploadedNotesContext: notesContext,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        addChatMessage({
          id: 'ai_err_' + Date.now(),
          role: 'assistant',
          content: data.reply || `⚠️ Error: Could not generate response from Gemini API. Please verify your connection or try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveAI: false,
        });
      } else {
        addChatMessage({
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveAI: data.isLiveAI,
        });
        addXp(15, `Engaged in academic inquiry with AI Tutor (${data.model || selectedModel})`);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      addChatMessage({
        id: 'ai_err_' + Date.now(),
        role: 'assistant',
        content: `⚠️ Network error: Could not reach the server API (${err?.message || 'Failed to fetch'}). Please check your connection and try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageContent = (content: string) => {
    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].replace(/^[a-zA-Z0-9_-]+$/, '').length === 0 && lines.length > 1
          ? lines[0].trim()
          : '';
        const code = lang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-3 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono-code text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                <span>{lang || 'code'}</span>
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="hover:text-white flex items-center gap-1 text-[10px]"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-emerald-300 whitespace-pre">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Format markdown lines
      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-1.5 leading-relaxed">
          {lines.map((line, lIdx) => {
            if (line.startsWith('# ')) {
              return <h1 key={lIdx} className="font-extrabold text-base text-white mt-2 mb-1">{renderFormattedText(line.replace('# ', ''))}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={lIdx} className="font-bold text-sm text-cyan-200 mt-2 mb-1">{renderFormattedText(line.replace('## ', ''))}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={lIdx} className="font-bold text-xs text-cyan-300 mt-2">{renderFormattedText(line.replace('### ', ''))}</h3>;
            }
            if (line.startsWith('#### ')) {
              return <h4 key={lIdx} className="font-semibold text-xs text-indigo-300 mt-1">{renderFormattedText(line.replace('#### ', ''))}</h4>;
            }
            if (/^(\*|-|\+)\s/.test(line)) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2 text-xs text-slate-200">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>{renderFormattedText(line.replace(/^(\*|-|\+)\s/, ''))}</span>
                </div>
              );
            }
            if (/^\d+\.\s/.test(line)) {
              const num = line.match(/^(\d+\.)\s/)?.[1] || '1.';
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2 text-xs text-slate-200">
                  <span className="text-cyan-400 font-bold font-mono-code text-[11px] shrink-0">{num}</span>
                  <span>{renderFormattedText(line.replace(/^\d+\.\s/, ''))}</span>
                </div>
              );
            }
            if (line.trim() === '') {
              return <div key={lIdx} className="h-1" />;
            }
            return <p key={lIdx} className="text-xs text-slate-200">{renderFormattedText(line)}</p>;
          })}
        </div>
      );
    });
  };

  const renderFormattedText = (text: string) => {
    // Process inline bold (**text**) and code (`text`)
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((seg, i) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{seg.slice(2, -2)}</strong>;
      }
      if (seg.startsWith('`') && seg.endsWith('`')) {
        return (
          <code key={i} className="px-1 py-0.5 rounded bg-slate-950 border border-slate-700/80 text-cyan-300 font-mono-code text-[11px]">
            {seg.slice(1, -1)}
          </code>
        );
      }
      return seg;
    });
  };

  return (
    <div className="flex flex-col h-[700px] rounded-3xl bg-slate-900/80 border border-indigo-900/30 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#070c1d]/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-[#070c1d] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display font-bold text-base text-white">COSMORA AI Assistant</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 bg-emerald-950/70 border-emerald-500/30 text-emerald-300">
                <Cpu className="w-3 h-3" />
                <span>{selectedModel}</span>
              </span>
              {isSearchGrounding && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 bg-cyan-950/70 border-cyan-500/40 text-cyan-300 animate-pulse">
                  <Globe className="w-3 h-3" />
                  <span>Search Grounding ON</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Multi-turn intelligence across STEM, programming, quantum mechanics, and general academic inquiry
            </p>
          </div>
        </div>

        {/* Controls: Model, Role, Search Grounding Toggle, Notes, New Chat */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Model Selector */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (General Tasks)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Mode)</option>
              <option value="gemini-4-argon">gemini-4-argon (Complex STEM)</option>
            </select>
          </div>

          {/* Persona Role Selector */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="general">Role: General STEM Tutor</option>
              <option value="coding">Role: Senior Software Engineer & DSA</option>
              <option value="physics">Role: Quantum & Theoretical Physics</option>
              <option value="math">Role: Pure Mathematics & Calculus</option>
            </select>
          </div>

          {/* Search Grounding Toggle */}
          <button
            onClick={() => setIsSearchGrounding(!isSearchGrounding)}
            title="Toggle Google Search Grounding with live web facts"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isSearchGrounding
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Search Grounding</span>
          </button>

          {/* Notes Context selector */}
          {uploadedMaterials.length > 0 && (
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedMaterialContext}
                onChange={(e) => setSelectedMaterialContext(e.target.value)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none"
              >
                <option value="none">Notes: None</option>
                <option value="all">Notes: All ({uploadedMaterials.length})</option>
                {uploadedMaterials.map((m) => (
                  <option key={m.id} value={m.id}>
                    Notes: {m.title.slice(0, 18)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          const isError = msg.content.startsWith('⚠️');

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-sm'
                    : isError
                    ? 'bg-rose-950 border border-rose-500/40 text-rose-400'
                    : 'bg-indigo-950 border border-cyan-500/30 text-cyan-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : isError ? <AlertCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`group relative rounded-2xl p-4 text-left shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                    : isError
                    ? 'bg-rose-950/40 border border-rose-500/40 text-rose-200 rounded-tl-none'
                    : 'bg-slate-800/80 border border-slate-700/70 text-slate-200 rounded-tl-none'
                }`}
              >
                {formatMessageContent(msg.content)}

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-slate-400 hover:text-cyan-300"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-md">
            <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-cyan-500/30 text-cyan-400 shrink-0 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-800/80 border border-slate-700 text-slate-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>COSMORA AI is formulating step-by-step educational explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts (covering quantum physics, newton's laws, AI, prime checker, etc.) */}
      <div className="px-6 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Quick Inquiries:</span>
        </span>
        {testPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-cyan-950/60 hover:border-cyan-500/40 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Bottom Message Input Bar with Textarea (Enter to send, Shift+Enter for newline) */}
      <div className="p-4 bg-[#070c1d] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2"
        >
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder={
                isSearchGrounding
                  ? 'Ask Google Grounded Research query... (with live web citations)'
                  : 'Ask any question... (Press Enter to send, Shift + Enter for newline)'
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 shadow-inner resize-none max-h-36 leading-relaxed"
            />
          </div>

          {/* Mic Dictate Button with gemini-3.5-transcribe */}
          <button
            type="button"
            onClick={isRecordingMic ? stopMicDictate : startMicDictate}
            title={isRecordingMic ? 'Stop recording & transcribe' : 'Dictate with microphone (gemini-3.5-transcribe)'}
            className={`p-3 rounded-xl transition-all shrink-0 cursor-pointer ${
              isRecordingMic
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700'
            }`}
          >
            {isRecordingMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-cyan-500/20 transition-all shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
