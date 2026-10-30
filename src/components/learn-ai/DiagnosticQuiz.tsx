import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_DIAGNOSTIC_QUIZ } from '../../data/mockData';
import { QuizQuestion } from '../../types';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BarChart3,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export const DiagnosticQuiz: React.FC = () => {
  const { addXp, unlockBadge, setLearnAiTab, user, addToast } = useApp();

  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Filter questions based on difficulty
  const questions: QuizQuestion[] =
    difficultyFilter === 'All'
      ? SAMPLE_DIAGNOSTIC_QUIZ
      : SAMPLE_DIAGNOSTIC_QUIZ.filter((q) => q.difficulty === difficultyFilter);

  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  const handleSelectOption = (index: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedAnswerIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswerIndex === null) return;
    setHasSubmittedAnswer(true);

    const isCorrect = selectedAnswerIndex === currentQuestion.correctIndex;
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedAnswerIndex }));

    if (isCorrect) {
      addXp(25, `Correct Answer: ${currentQuestion.topic}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setHasSubmittedAnswer(false);
    } else {
      // Calculate final score
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
    unlockBadge('b-1'); // Unlock "First Quiz Completed"

    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    if (percent >= 90) {
      unlockBadge('b-4'); // Unlock Quiz Master
    }

    addXp(100, `Completed Diagnostic Quiz with score: ${percent}%`);
    addToast('success', 'Diagnostic Quiz Completed! 🎯', `Your score: ${percent}% (${correctCount}/${questions.length})`);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setHasSubmittedAnswer(false);
    setUserAnswers({});
    setQuizCompleted(false);
  };

  // Score summary
  const score = Object.keys(userAnswers).reduce((acc, qId) => {
    const q = questions.find((item) => item.id === Number(qId));
    return q && userAnswers[Number(qId)] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const percentScore = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // Identify weak topics (answered incorrectly)
  const weakTopics = questions
    .filter((q) => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.correctIndex)
    .map((q) => q.topic);

  const strongTopics = questions
    .filter((q) => userAnswers[q.id] !== undefined && userAnswers[q.id] === q.correctIndex)
    .map((q) => q.topic);

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Quiz Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Diagnostic Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white">Curriculum Diagnostic Assessment</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test conceptual retention and diagnose weak syllabus areas for {user?.department?.split('(')[1]?.replace(')', '') || 'Engineering'}.
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setDifficultyFilter(diff);
                handleRestart();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                difficultyFilter === diff
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {!quizCompleted ? (
        /* ACTIVE QUESTION CARD */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-indigo-900/30 backdrop-blur-xl space-y-6 shadow-2xl">
          {/* Progress bar & Question metadata */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 text-[10px]">
                  Topic: {currentQuestion.topic}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentQuestion.difficulty === 'Advanced'
                      ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                      : currentQuestion.difficulty === 'Intermediate'
                      ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
                      : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let optionStyle =
                'bg-slate-800/60 border-slate-700/80 hover:border-slate-500 text-slate-200';

              if (hasSubmittedAnswer) {
                if (idx === currentQuestion.correctIndex) {
                  optionStyle =
                    'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50';
                } else if (idx === selectedAnswerIndex) {
                  optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                } else {
                  optionStyle = 'opacity-50 bg-slate-900 border-slate-800 text-slate-400';
                }
              } else if (selectedAnswerIndex === idx) {
                optionStyle =
                  'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/50';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer transition-all ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {hasSubmittedAnswer && idx === currentQuestion.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {hasSubmittedAnswer &&
                    idx === selectedAnswerIndex &&
                    idx !== currentQuestion.correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                </div>
              );
            })}
          </div>

          {/* Explanation Box (Revealed after submitting answer) */}
          {hasSubmittedAnswer && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Lightbulb className="w-4 h-4" />
                <span>COSMORA Diagnostic Explanation:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Immediate answer validation & syllabus feedback
            </span>

            {!hasSubmittedAnswer ? (
              <button
                disabled={selectedAnswerIndex === null}
                onClick={handleSubmitAnswer}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>{currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Performance Analysis'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* QUIZ COMPLETED & SUMMARY SCREEN */
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl text-center space-y-6 shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Assessment Summary
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-1">Quiz Completed!</h3>
            <p className="text-slate-300 text-sm mt-1">
              You scored <span className="text-cyan-300 font-bold">{score}</span> out of{' '}
              <span className="text-white font-bold">{questions.length}</span> ({percentScore}% Accuracy)
            </p>
          </div>

          {/* Identified Topics Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong Topics Demonstrated</span>
              </span>
              {strongTopics.length > 0 ? (
                <ul className="text-xs text-slate-300 space-y-1">
                  {strongTopics.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">Review foundational units to establish strength.</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Topics Needing Improvement</span>
              </span>
              {weakTopics.length > 0 ? (
                <ul className="text-xs text-slate-300 space-y-1">
                  {weakTopics.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-400 font-semibold">Perfect retention! No critical weaknesses.</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Diagnostic Quiz</span>
            </button>

            <button
              onClick={() => setLearnAiTab('analysis')}
              className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Open Detailed Analytics</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
