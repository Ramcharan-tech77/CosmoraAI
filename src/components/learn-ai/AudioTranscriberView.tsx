import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Upload,
  FileAudio,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Send,
  Volume2,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const AudioTranscriberView: React.FC = () => {
  const { addXp, setLearnAiTab, addChatMessage } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptResult, setTranscriptResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      setTranscriptResult(null);
      setAudioBlob(null);
      setAudioUrl(null);
      setAudioFileName('Live Microphone Recording');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Mic record error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      setTranscriptResult(null);
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setIsTranscribing(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const response = await fetch('/api/ai/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: audioBlob.type || 'audio/webm',
          }),
        });

        const data = await response.json();
        if (data.success && data.transcript) {
          setTranscriptResult(data.transcript);
          addXp(25, 'Transcribed academic speech using gemini-3.5-transcribe');
        } else {
          setTranscriptResult(`⚠️ Error: ${data.message || 'Failed to transcribe audio'}`);
        }
        setIsTranscribing(false);
      };
    } catch (err: any) {
      console.error('Transcription error:', err);
      setIsTranscribing(false);
      setTranscriptResult(`⚠️ Transcription error: ${err?.message || 'Network error'}`);
    }
  };

  const handleCopy = () => {
    if (transcriptResult) {
      navigator.clipboard.writeText(transcriptResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sendToAiTutor = () => {
    if (!transcriptResult) return;
    addChatMessage({
      id: 'user_transcribe_' + Date.now(),
      role: 'user',
      content: `I transcribed this lecture note using gemini-3.5-transcribe. Please explain these concepts further:\n\n${transcriptResult.slice(0, 400)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setLearnAiTab('tutor');
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI AUDIO & LECTURE TRANSCRIBER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Microphone & Audio Speech-to-Text
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Transcribes classroom lectures, professor explanations, and voice study notes using dedicated <span className="text-cyan-400 font-semibold font-mono">gemini-3.5-transcribe</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>gemini-3.5-transcribe</span>
        </div>
      </div>

      {/* Audio Capture Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Mic Recorder Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse shadow-red-500/40 scale-110'
                : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            {isRecording ? <Mic className="w-9 h-9" /> : <MicOff className="w-9 h-9" />}
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Record with Microphone</h3>
            <p className="text-xs text-slate-400 mt-1">
              {isRecording ? `Recording in progress... (${formatSeconds(recordingDuration)})` : 'Click record to capture academic speech'}
            </p>
          </div>

          <div>
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-6 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <MicOff className="w-4 h-4" />
                <span>Stop Recording</span>
              </button>
            )}
          </div>
        </div>

        {/* File Upload Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-inner">
            <Upload className="w-9 h-9" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Upload Audio File</h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports .mp3, .wav, .webm, or .m4a audio recordings
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <FileAudio className="w-4 h-4 text-cyan-400" />
              <span>Choose Audio File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audio Playback & Transcribe Action */}
      {audioUrl && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">{audioFileName || 'Ready to Transcribe'}</span>
              <audio src={audioUrl} controls className="h-7 mt-1 max-w-xs" />
            </div>
          </div>

          <button
            onClick={handleTranscribe}
            disabled={isTranscribing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isTranscribing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Transcribing Audio...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Transcribe with Gemini 3.5</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Transcription Results Card */}
      {transcriptResult && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Verbatim Transcript & Academic Extraction
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={sendToAiTutor}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Study in AI Tutor</span>
              </button>
            </div>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            {transcriptResult}
          </div>
        </div>
      )}
    </div>
  );
};
