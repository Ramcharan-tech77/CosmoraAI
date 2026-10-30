import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Zap,
  Activity,
  AlertCircle,
  RefreshCw,
  Send,
  MessageSquare,
} from 'lucide-react';

export const VoiceCompanionView: React.FC = () => {
  const { user, addXp } = useApp();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('Ready to start live session');
  const [conversationLogs, setConversationLogs] = useState<Array<{ role: 'user' | 'model'; text: string; time: string }>>([
    {
      role: 'model',
      text: `Hello ${user?.fullName?.split(' ')[0] || 'there'}! I am COSMORA Voice powered by the gemini-3.8-live Live API. You can talk to me directly using your microphone about any academic concept, formula, or problem.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [typedMessage, setTypedMessage] = useState('');
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);

  // Helper to convert Float32Array PCM to base64 int16
  const floatTo16BitPCMBase64 = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  };

  // Helper to decode base64 raw PCM (24kHz 16-bit LE) to Float32Array
  const base64ToFloat32Array = (base64: string): Float32Array => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }
    return float32;
  };

  // Play queued audio chunks at 24kHz
  const playNextChunk = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsSpeaking(false);
      setVoiceStatus('Listening to you...');
      return;
    }

    if (!outputAudioCtxRef.current) {
      outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
    }

    const ctx = outputAudioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    isPlayingRef.current = true;
    setIsSpeaking(true);
    setVoiceStatus('COSMORA AI is speaking...');

    const chunk = audioQueueRef.current.shift()!;
    const audioBuffer = ctx.createBuffer(1, chunk.length, 24000);
    audioBuffer.copyToChannel(chunk as any, 0);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.onended = () => {
      playNextChunk();
    };
    source.start();
  };

  const startLiveSession = async () => {
    try {
      setIsConnecting(true);
      setVoiceStatus('Initializing Gemini 3.8 Live API session...');

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsConnecting(false);
        setIsConnected(true);
        setIsListening(true);
        setVoiceStatus('Connected! Microphone active. Speak to begin.');
        addXp(25, 'Connected to Gemini 3.8 Live API real-time voice session');

        // Request microphone access
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          mediaStreamRef.current = stream;

          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const inputCtx = new AudioContextClass({ sampleRate: 16000 });
          inputAudioCtxRef.current = inputCtx;

          const source = inputCtx.createMediaStreamSource(stream);
          // Script processor to capture 16kHz audio buffer chunks
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (!ws || ws.readyState !== WebSocket.OPEN) return;
            const inputData = e.inputBuffer.getChannelData(0);

            // Compute volume level for reactive visualizer
            let sum = 0;
            for (let i = 0; i < inputData.length; i++) {
              sum += inputData[i] * inputData[i];
            }
            const rms = Math.sqrt(sum / inputData.length);
            setAudioLevel(Math.min(100, Math.round(rms * 400)));

            const base64PCM = floatTo16BitPCMBase64(inputData);
            ws.send(JSON.stringify({ audio: base64PCM }));
          };

          source.connect(processor);
          processor.connect(inputCtx.destination);
        } catch (micErr: any) {
          console.warn('Microphone error:', micErr);
          setVoiceStatus('Connected via text (Microphone permission not granted)');
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.interrupted) {
            audioQueueRef.current = [];
            isPlayingRef.current = false;
            setIsSpeaking(false);
            setVoiceStatus('Listening to you (Interrupted)...');
            return;
          }

          if (data.audio) {
            const float32 = base64ToFloat32Array(data.audio);
            audioQueueRef.current.push(float32);
            if (!isPlayingRef.current) {
              playNextChunk();
            }
          }

          if (data.text) {
            setConversationLogs((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'model') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + ' ' + data.text },
                ];
              } else {
                return [
                  ...prev,
                  {
                    role: 'model',
                    text: data.text,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ];
              }
            });
          }

          if (data.error) {
            setVoiceStatus(`Session notification: ${data.error}`);
          }
        } catch (e) {
          console.warn('WS Message parse error:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        setIsSpeaking(false);
        setIsListening(false);
        setVoiceStatus('Session ended. Click Connect to restart.');
        stopMic();
      };

      ws.onerror = () => {
        setIsConnected(false);
        setIsConnecting(false);
        setVoiceStatus('Live API connection error. Click Connect to retry.');
        stopMic();
      };
    } catch (err: any) {
      setIsConnecting(false);
      setVoiceStatus(`Connection failed: ${err?.message || 'Network error'}`);
    }
  };

  const stopMic = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };

  const disconnectSession = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopMic();
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsConnected(false);
    setIsSpeaking(false);
    setIsListening(false);
    setVoiceStatus('Disconnected');
  };

  const sendTextMessage = () => {
    if (!typedMessage.trim()) return;
    const text = typedMessage.trim();
    setConversationLogs((prev) => [
      ...prev,
      {
        role: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setTypedMessage('');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text }));
      setVoiceStatus('Waiting for Live API response...');
    } else {
      // If not connected, start session first or notify
      setVoiceStatus('Please click "Start Voice Session" first');
    }
  };

  useEffect(() => {
    return () => {
      disconnectSession();
    };
  }, []);

  return (
    <div className="flex flex-col h-[700px] rounded-3xl bg-slate-900/90 border border-indigo-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">COSMORA Live Voice Companion</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                gemini-3.8-live
              </span>
            </div>
            <p className="text-xs text-slate-400">Full duplex real-time speech conversation with low latency</p>
          </div>
        </div>

        {/* Connection Toggle Button */}
        <div>
          {!isConnected ? (
            <button
              onClick={startLiveSession}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-slate-950" />
                  <span>Start Voice Session</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={disconnectSession}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold text-xs transition-all cursor-pointer"
            >
              <MicOff className="w-4 h-4 text-red-400" />
              <span>End Voice Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Voice Interactive Stage */}
      <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950/40 via-blue-950/20 to-slate-950/60 border-b border-slate-800/80">
        {/* Pulsating Orb with reactive equalizer rings */}
        <div className="relative flex items-center justify-center my-4">
          {/* Animated glow rings */}
          {isConnected && (
            <>
              <div
                className={`absolute rounded-full transition-all duration-300 ${
                  isSpeaking
                    ? 'w-48 h-48 bg-cyan-500/15 animate-ping'
                    : 'w-40 h-40 bg-blue-500/10'
                }`}
              />
              <div
                className="absolute rounded-full border border-cyan-400/30 transition-all duration-150"
                style={{
                  width: `${120 + audioLevel * 0.8}px`,
                  height: `${120 + audioLevel * 0.8}px`,
                }}
              />
            </>
          )}

          {/* Core Orb */}
          <div
            className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
              isSpeaking
                ? 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-cyan-500/50 scale-105'
                : isListening
                ? 'bg-gradient-to-tr from-blue-600 to-cyan-700 shadow-blue-500/30'
                : 'bg-slate-800 border border-slate-700'
            }`}
          >
            {isSpeaking ? (
              <Volume2 className="w-10 h-10 text-white animate-pulse" />
            ) : isListening ? (
              <Mic className="w-10 h-10 text-cyan-200 animate-bounce" />
            ) : (
              <MicOff className="w-10 h-10 text-slate-500" />
            )}
            <span className="text-[10px] font-bold text-white/90 mt-1 uppercase tracking-wider">
              {isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Idle'}
            </span>
          </div>
        </div>

        {/* Audio Wave Visualizer Bars */}
        <div className="flex items-center gap-1.5 h-8 my-2">
          {[...Array(16)].map((_, i) => {
            const h = isSpeaking
              ? Math.max(6, Math.sin(Date.now() * 0.01 + i) * 24 + 10)
              : isListening
              ? Math.max(4, (audioLevel / 100) * 28 + (i % 3) * 4)
              : 4;

            return (
              <div
                key={i}
                className="w-1.5 rounded-full transition-all duration-75 bg-gradient-to-t from-cyan-500 to-blue-400"
                style={{ height: `${h}px` }}
              />
            );
          })}
        </div>

        {/* Status Text Banner */}
        <div className="flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? (isSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400') : 'bg-slate-600'
            }`}
          />
          <span>{voiceStatus}</span>
        </div>
      </div>

      {/* Real-Time Transcript & Dialogue Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
          Live Session Transcript
        </div>
        {conversationLogs.map((log, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-xl text-xs rounded-2xl p-3.5 space-y-1 ${
              log.role === 'user'
                ? 'ml-auto bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm'
                : 'mr-auto bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-sm'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] opacity-75 font-semibold">
              <span>{log.role === 'user' ? 'You (Voice / Text)' : 'COSMORA Live AI'}</span>
              <span>{log.time}</span>
            </div>
            <p className="leading-relaxed whitespace-pre-wrap">{log.text}</p>
          </div>
        ))}
      </div>

      {/* Quick Text Input (Fallback / Multi-modal input for Live API) */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/90 flex items-center gap-2">
        <input
          type="text"
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendTextMessage()}
          placeholder={isConnected ? 'Or type your question to send to the Live session...' : 'Connect session above or type prompt...'}
          className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={sendTextMessage}
          disabled={!typedMessage.trim()}
          className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
