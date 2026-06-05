import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, X, Coffee, Brain, Timer, Check, Sparkles } from 'lucide-react';
import { Project, Skill } from '../types';

interface FocusSessionProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  skills: Skill[];
  onLogHours: (categoryType: 'project' | 'skill', id: string, hours: number) => void;
}

export default function FocusSession({
  isOpen,
  onClose,
  projects,
  skills,
  onLogHours,
}: FocusSessionProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  const [focusTarget, setFocusTarget] = useState<{ type: 'project' | 'skill'; id: string } | null>(null);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Sound cue or visual celebration
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleSessionComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Handle setting active presets
  const handlePreset = (minutes: number, type: 'work' | 'break') => {
    setIsRunning(false);
    setSessionType(type);
    setInitialTime(minutes * 60);
    setTimeLeft(minutes * 60);
  };

  const handleSessionComplete = () => {
    setShowCelebration(true);
    setCompletedSessions((prev) => prev + 1);

    // If focused on a target, log 0.5 hours automatically (or equivalent of the timer)
    if (focusTarget) {
      const hours = Math.round((initialTime / 3600) * 10) / 10 || 0.4;
      onLogHours(focusTarget.type, focusTarget.id, hours);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress circle Math
  const circumference = 2 * Math.PI * 40;
  const progressPercent = ((initialTime - timeLeft) / initialTime) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white/95 rounded-lg max-w-md w-full shadow-2xl overflow-hidden relative border border-primary-container"
        id="focus-session-modal"
      >
        {/* Grain overlay */}
        <div className="absolute inset-0 paper-grain pointer-events-none opacity-5"></div>

        {/* Header */}
        <div className="p-6 pb-2 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-lg text-primary">Focus Session</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            id="close-focus-timer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center relative z-10 flex flex-col items-center">
          {/* Preset Buttons */}
          <div className="flex justify-center gap-2 mb-6 w-full">
            <button
              onClick={() => handlePreset(25, 'work')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                initialTime === 25 * 60 && sessionType === 'work'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-primary-container/30 text-on-surface-variant'
              }`}
            >
              <Brain className="w-3 h-3" />
              25m Focus
            </button>
            <button
              onClick={() => handlePreset(50, 'work')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                initialTime === 50 * 60 && sessionType === 'work'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-primary-container/30 text-on-surface-variant'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              50m Focus
            </button>
            <button
              onClick={() => handlePreset(5, 'break')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                initialTime === 5 * 60 && sessionType === 'break'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'bg-surface-container hover:bg-secondary-container/30 text-on-surface-variant'
              }`}
            >
              <Coffee className="w-3 h-3" />
              5m Break
            </button>
          </div>

          {/* Large Countdown Ring */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              {/* Back Circle */}
              <circle
                cx="96"
                cy="96"
                r="80"
                className="stroke-surface-container fill-none"
                strokeWidth="8"
              />
              {/* Progress Ring */}
              <motion.circle
                cx="96"
                cy="96"
                r="80"
                className={`fill-none ${sessionType === 'work' ? 'stroke-primary' : 'stroke-secondary'}`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 80}
                animate={{
                  strokeDashoffset: (2 * Math.PI * 80) - (progressPercent / 100) * (2 * Math.PI * 80)
                }}
                transition={{ duration: 0.3 }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-black text-4xl text-on-surface tracking-tight">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs uppercase tracking-widest text-on-surface-variant/70 font-bold mt-1">
                {sessionType === 'work' ? 'Focusing' : 'Short Break'}
              </span>
            </div>
          </div>

          {/* Current Focus Target Dropdown */}
          {sessionType === 'work' && (
            <div className="mb-6 w-full text-left bg-surface-container-low p-3 rounded-lg border border-outline-variant/25">
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                Focus target (Logs hours to this on completion)
              </label>
              <select
                className="w-full bg-white border border-outline-variant/40 rounded-full px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                value={focusTarget ? `${focusTarget.type}:${focusTarget.id}` : ''}
                onChange={(e) => {
                  if (!e.target.value) {
                    setFocusTarget(null);
                  } else {
                    const [type, id] = e.target.value.split(':');
                    setFocusTarget({ type: type as 'project' | 'skill', id });
                  }
                }}
              >
                <option value="">-- No specific tracker --</option>
                <optgroup label="Projects">
                  {projects.map((p) => (
                    <option key={p.id} value={`project:${p.id}`}>
                      💼 {p.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Skills">
                  {skills.map((s) => (
                    <option key={s.id} value={`skill:${s.id}`}>
                      🎯 {s.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          {/* Dynamic Ambient Animation when Running */}
          {isRunning && (
            <div className="flex gap-1 justify-center items-center h-4 mb-4">
              <span className={`w-1 h-3 rounded-full animate-bounce bg-primary`} style={{ animationDelay: '0ms' }} />
              <span className={`w-1 h-4 rounded-full animate-bounce bg-secondary`} style={{ animationDelay: '150ms' }} />
              <span className={`w-1 h-2 rounded-full animate-bounce bg-tertiary`} style={{ animationDelay: '300ms' }} />
              <span className={`w-1 h-3.5 rounded-full animate-bounce bg-primary-container`} style={{ animationDelay: '450ms' }} />
            </div>
          )}

          {/* Timer Controls */}
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(initialTime);
              }}
              className="p-3 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-full hover:scale-105 active:scale-95 transition-all"
              title="Reset Timer"
              id="reset-focus-timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-5 text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg ${
                isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary/95'
              }`}
              id="toggle-focus-timer"
            >
              {isRunning ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Celebration Notification Overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 bg-primary-container/95 flex flex-col items-center justify-center p-6 text-center z-20"
            >
              <Sparkles className="w-12 h-12 text-primary animate-spin mb-3" />
              <h4 className="font-display font-bold text-2xl text-on-primary-container mb-2">Beautiful work! 🎉</h4>
              <p className="text-sm text-on-primary-container/85 mb-6 max-w-xs">
                You've successfully completed your focus interval! 
                {focusTarget ? ' Progress has been updated and hours logged successfully on your tracker!' : ' Rest up before clicking into your next productivity sprint.'}
              </p>
              <button
                onClick={() => {
                  setShowCelebration(false);
                  setTimeLeft(initialTime);
                }}
                className="px-6 py-2 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
              >
                Let's Keep Going
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
