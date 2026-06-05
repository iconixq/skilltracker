import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, Plus, Calendar, Trash2, Edit2, CheckCircle2, ChevronRight, X, 
  Brain, PenTool, Code, Globe, Database, ChefHat, Camera, Dumbbell, Book, 
  Timer, Play, Pause, RotateCcw, Lightbulb, Star, Award, Sparkles, Flame, Check, Bookmark, ArrowUpRight, Palette
} from 'lucide-react';
import { Project, Skill, ProjectIdea, Task } from '../types';

export const PROJECT_THEME_OPTIONS = [
  { id: 'indigo', name: 'Indigo Accent', bg: 'bg-indigo-50/95 border-indigo-250 text-indigo-950', ring: 'ring-indigo-500', bubbleBg: 'bg-indigo-500 hover:bg-indigo-600' },
  { id: 'emerald', name: 'Emerald Sage', bg: 'bg-emerald-50/95 border-emerald-250 text-emerald-950', ring: 'ring-emerald-500', bubbleBg: 'bg-emerald-500 hover:bg-emerald-600' },
  { id: 'rose', name: 'Ruby Crimson', bg: 'bg-rose-50/95 border-rose-250 text-rose-950', ring: 'ring-rose-500', bubbleBg: 'bg-rose-500 hover:bg-rose-600' },
  { id: 'amber', name: 'Amber Sunset', bg: 'bg-amber-50/95 border-amber-250 text-amber-950', ring: 'ring-amber-500', bubbleBg: 'bg-amber-500 hover:bg-amber-600' },
  { id: 'violet', name: 'Amethyst Violet', bg: 'bg-purple-50/95 border-purple-250 text-purple-950', ring: 'ring-purple-500', bubbleBg: 'bg-purple-500 hover:bg-purple-600' },
  { id: 'cyan', name: 'Ocean Cyan', bg: 'bg-cyan-50/95 border-cyan-250 text-cyan-950', ring: 'ring-cyan-500', bubbleBg: 'bg-cyan-500 hover:bg-cyan-600' },
];

interface ProjectsViewProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
  onUpdateProjectProgress: (projectId: string, newPercentage: number) => void;
  onDeleteProject: (projectId: string) => void;
  projectIdeas: ProjectIdea[];
  onAddIdea: (idea: ProjectIdea) => void;
  onDeleteIdea: (ideaId: string) => void;
  skills: Skill[];
  onQuickLogHours: (categoryType: 'project' | 'skill', id: string, hours: number) => void;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function ProjectsView({
  projects,
  onAddProject,
  onUpdateProjectProgress,
  onDeleteProject,
  projectIdeas = [],
  onAddIdea,
  onDeleteIdea,
  skills = [],
  onQuickLogHours,
  tasks = [],
  onToggleTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: ProjectsViewProps) {
  // Navigation segment state
  const [currentSegment, setCurrentSegment] = useState<'active' | 'session' | 'ideas'>('active');

  // Selected project modal details / inline task creator states
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [inlineTaskText, setInlineTaskText] = useState('');
  const [inlineTaskPriority, setInlineTaskPriority] = useState<'LOW' | 'MED' | 'HIGH'>('MED');
  const [inlineTaskTheme, setInlineTaskTheme] = useState('indigo');
  const [activeColorPickerTaskId, setActiveColorPickerTaskId] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  // Trigger modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  
  // New Project Form State
  const [projName, setProjName] = useState('');
  const [projDescription, setProjDescription] = useState('');
  const [projDueDateStr, setProjDueDateStr] = useState('ON TRACK');
  const [projIcon, setProjIcon] = useState('ChefHat');
  const [projTags, setProjTags] = useState('');
  const [projTeamCount, setProjTeamCount] = useState(1);

  // New Idea Form State
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [ideaDifficulty, setIdeaDifficulty] = useState<'EASY' | 'MODERATE' | 'HARD'>('MODERATE');
  const [ideaVibe, setIdeaVibe] = useState('Culinary Arts');
  const [ideaExcitement, setIdeaExcitement] = useState(5);

  // Focus Timer/Stopwatch State
  const [timerMode, setTimerMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTarget, setTimerTarget] = useState<{ type: 'project' | 'skill'; id: string } | null>(null);
  
  // Stopwatch seconds spent
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  // Session Logs local to this browser session
  const [sessionLogs, setSessionLogs] = useState<Array<{
    id: string;
    targetName: string;
    durationMinutes: number;
    timestamp: string;
    type: string;
  }>>([]);

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState('');

  // Timer Tick implementation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerRunning) {
      if (timerMode === 'countdown') {
        if (timeLeft > 0) {
          interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
          }, 1000);
        } else {
          setTimerRunning(false);
          handleSessionCompletion();
        }
      } else {
        // Stopwatch countup
        interval = setInterval(() => {
          setStopwatchSeconds((prev) => prev + 1);
        }, 1000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft, timerMode]);

  // Handle preset countdown triggers
  const handleCountdownPreset = (minutes: number) => {
    setTimerRunning(false);
    setTimerMode('countdown');
    setInitialTime(minutes * 60);
    setTimeLeft(minutes * 60);
  };

  const currentTargetName = () => {
    if (!timerTarget) return 'No target selected';
    if (timerTarget.type === 'project') {
      const p = projects.find(proj => proj.id === timerTarget.id);
      return p ? `Project: ${p.name}` : 'Project Target';
    } else {
      const s = skills.find(sk => sk.id === timerTarget.id);
      return s ? `Skill: ${s.name}` : 'Skill Target';
    }
  };

  const handleSessionCompletion = () => {
    setTimerRunning(false);
    let secondsSpent = timerMode === 'countdown' ? initialTime : stopwatchSeconds;
    if (secondsSpent < 5) {
      alert("Practice session is too short to log! Keep practicing.");
      return;
    }

    const minutes = Math.round(secondsSpent / 60);
    const hoursLog = Math.max(0.1, Math.round((secondsSpent / 3600) * 10) / 10);
    
    const targetLabel = currentTargetName();

    if (timerTarget) {
      onQuickLogHours(timerTarget.type, timerTarget.id, hoursLog);
    }

    // Register into local log feed
    const newLog = {
      id: `session_log_${Date.now()}`,
      targetName: targetLabel,
      durationMinutes: minutes === 0 ? 1 : minutes,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: timerTarget ? timerTarget.type : 'general',
    };

    setSessionLogs((prev) => [newLog, ...prev]);
    setCelebrationMsg(`Congratulations! Spent ${newLog.durationMinutes} minutes practicing ${targetLabel === 'No target selected' ? 'General Goals' : targetLabel}. progress hours logged securely.`);
    setShowCelebration(true);

    // Reset stopwatch/timers
    setStopwatchSeconds(0);
    setTimeLeft(25 * 60);
    setInitialTime(25 * 60);
  };

  // Render proper icon components
  const renderProjectIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'chefhat':
      case 'cooking':
      case 'culinary':
        return <ChefHat className="w-5 h-5 text-primary" />;
      case 'camera':
      case 'photography':
        return <Camera className="w-5 h-5 text-secondary" />;
      case 'dumbbell':
      case 'fitness':
        return <Dumbbell className="w-5 h-5 text-tertiary" />;
      case 'book':
      case 'reading':
        return <Book className="w-5 h-5 text-primary" />;
      case 'code':
      case 'programming':
      case 'dev':
        return <Code className="w-5 h-5 text-secondary" />;
      case 'brain':
      case 'ideas':
        return <Brain className="w-5 h-5 text-primary" />;
      default:
        return <FolderGit2 className="w-5 h-5 text-on-surface-variant/80" />;
    }
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim() || !projDescription.trim()) return;

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: projName,
      description: projDescription,
      dueDateStr: projDueDateStr || 'ON TRACK',
      percentage: 0,
      tags: projTags ? projTags.split(',').map(t => t.trim()) : ['General'],
      teamCount: Number(projTeamCount) || 1,
      icon: projIcon,
    };

    onAddProject(newProject);
    setIsProjectModalOpen(false);

    // Reset Form Fields
    setProjName('');
    setProjDescription('');
    setProjDueDateStr('ON TRACK');
    setProjIcon('ChefHat');
    setProjTags('');
    setProjTeamCount(1);
  };

  const handleAddIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !ideaDescription.trim()) return;

    const newIdea: ProjectIdea = {
      id: `idea_${Date.now()}`,
      title: ideaTitle,
      description: ideaDescription,
      difficulty: ideaDifficulty,
      vibe: ideaVibe,
      excitementLevel: ideaExcitement,
      createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    onAddIdea(newIdea);
    setIsIdeaModalOpen(false);

    // Reset Form Fields
    setIdeaTitle('');
    setIdeaDescription('');
    setIdeaDifficulty('MODERATE');
    setIdeaVibe('Culinary Arts');
    setIdeaExcitement(5);
  };

  const promoteIdeaToProject = (idea: ProjectIdea) => {
    let matchedIcon = 'ChefHat';
    if (idea.vibe.toLowerCase().includes('photo') || idea.vibe.toLowerCase().includes('art') || idea.vibe.toLowerCase().includes('creative')) {
      matchedIcon = 'Camera';
    } else if (idea.vibe.toLowerCase().includes('tech') || idea.vibe.toLowerCase().includes('coding') || idea.vibe.toLowerCase().includes('script')) {
      matchedIcon = 'Code';
    } else if (idea.vibe.toLowerCase().includes('fit') || idea.vibe.toLowerCase().includes('gym')|| idea.vibe.toLowerCase().includes('body')) {
      matchedIcon = 'Dumbbell';
    } else if (idea.vibe.toLowerCase().includes('lit') || idea.vibe.toLowerCase().includes('word') || idea.vibe.toLowerCase().includes('language')) {
      matchedIcon = 'Book';
    }

    const newProject: Project = {
      id: `proj_promoted_${Date.now()}`,
      name: idea.title,
      description: idea.description,
      dueDateStr: 'ON TRACK (PROMOTED)',
      percentage: 0,
      tags: [idea.vibe, idea.difficulty],
      teamCount: 1,
      icon: matchedIcon
    };

    // Add as active project and delete from brainstorming ideas board
    onAddProject(newProject);
    onDeleteIdea(idea.id);

    setCelebrationMsg(`Successfully promoted "${idea.title}" to an active focused project! You can now track completion milestones and schedule active practices.`);
    setShowCelebration(true);
  };

  const incrementProgress = (project: Project) => {
    const nextVal = Math.min(100, project.percentage + 5);
    onUpdateProjectProgress(project.id, nextVal);
  };

  const decrementProgress = (project: Project) => {
    const prevVal = Math.max(0, project.percentage - 5);
    onUpdateProjectProgress(project.id, prevVal);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-4 lg:px-12 pb-16 w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Dynamic Navigation Segment Tab Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-transparent border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="font-display text-2xl lg:text-3xl font-black text-primary tracking-tight">
            Active Projects & Practice Hub
          </h2>
          <p className="text-xs text-on-surface-variant font-bold mt-1">
            Configure focused projects, track live sessions, and brainstorm raw lifestyle ideas
          </p>
        </div>

        {/* Floating Custom Tab Layout */}
        <div className="flex bg-surface-container-low p-1 rounded-full border border-outline-variant/30 font-sans font-bold text-xs">
          <button
            onClick={() => setCurrentSegment('active')}
            className={`px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer select-none ${
              currentSegment === 'active' 
                ? 'bg-primary text-on-primary shadow-xs' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            Active Projects ({projects.length})
          </button>
          <button
            onClick={() => setCurrentSegment('session')}
            className={`px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer select-none ${
              currentSegment === 'session' 
                ? 'bg-primary text-on-primary shadow-xs' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
            id="projects-tab-ongoing"
          >
            <Timer className="w-3.5 h-3.5 animate-pulse" />
            Ongoing Practice Timer
          </button>
          <button
            onClick={() => setCurrentSegment('ideas')}
            className={`px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer select-none ${
              currentSegment === 'ideas' 
                ? 'bg-primary text-on-primary shadow-xs' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
             id="projects-tab-ideas"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            Ideas Board ({projectIdeas.length})
          </button>
        </div>
      </div>

      {/* SEGMENT 1: MAIN ACTIVE PROJECTS GRID */}
      {currentSegment === 'active' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-transparent">
            <h3 className="font-display font-black text-sm text-primary uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-primary" />
              Focus Project Catalog
            </h3>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-on-primary rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1"
              id="create-project-trigger"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="soft-card p-12 text-center text-on-surface-variant max-w-lg mx-auto bg-white/70">
              <FolderGit2 className="w-16 h-16 text-outline/30 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-on-surface">No Projects Engaged</h3>
              <p className="text-xs mt-1 mb-6">Create structural learning or hobby categories to align with your personal goals.</p>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="px-6 py-3 bg-primary text-on-primary font-bold text-xs rounded-full shadow-md"
              >
                Assemble First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="soft-card p-6 rounded-lg bg-white border border-outline-variant/10 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-primary-container/20 text-primary rounded-lg">
                        {renderProjectIcon(project.icon || 'ChefHat')}
                      </div>
                      <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[11px] font-extrabold rounded-full">
                        {project.dueDateStr}
                      </span>
                    </div>

                    <h3 
                      onClick={() => setSelectedProjectId(project.id)}
                      className="font-display font-black text-base text-on-surface mb-2 hover:text-primary active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between gap-1 group/title"
                      title="Click to view and manage tasks related to this project"
                    >
                      <span className="truncate">{project.name}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-40 group-hover/title:opacity-100 transition-opacity text-primary flex-shrink-0" />
                    </h3>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-6">
                      {project.description}
                    </p>

                    {/* Progress Slider Display */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-on-surface-variant/80 uppercase tracking-wider text-[9px]">Completion status</span>
                        <span className="text-on-surface font-extrabold">{project.percentage}%</span>
                      </div>
                      <div className="h-3 bg-surface-container rounded-full overflow-hidden p-0.5">
                        <div 
                           className="h-full bg-secondary rounded-full transition-all duration-300" 
                          style={{ width: `${project.percentage}%` }}
                        />
                      </div>

                      {/* Manual adjustment buttons */}
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => decrementProgress(project)}
                          className="p-1 px-2.5 bg-surface-container text-on-surface-variant hover:bg-surface-container-high rounded text-[10px] font-bold"
                          title="Decrease 5%"
                        >
                          -5%
                        </button>
                        <button
                          onClick={() => incrementProgress(project)}
                          className="p-1 px-2.5 bg-secondary-container text-on-secondary-container hover:brightness-95 rounded text-[10px] font-bold"
                          title="Increase 5%"
                        >
                          +5%
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footers elements */}
                  <div className="pt-4 border-t border-outline-variant/20 flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10.5px] font-bold text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProjectId(project.id)}
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] rounded-full transition-all flex items-center gap-1 cursor-pointer"
                        title="View & Add Related Tasks"
                        id={`manage-tasks-project-${project.id}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Tasks
                        {(() => {
                          const count = tasks.filter(t => t.project.toLowerCase() === project.name.toLowerCase() || t.project === project.name).length;
                          return count > 0 ? (
                            <span className="ml-1 px-1.5 py-0.5 bg-primary text-white text-[9.5px] font-black rounded-full leading-none">
                              {count}
                            </span>
                          ) : (
                            <span className="ml-1 text-[9.5px] opacity-60">
                              (0)
                            </span>
                          );
                        })()}
                      </button>

                      <button
                        onClick={() => onDeleteProject(project.id)}
                        className="p-2 text-on-surface-variant/60 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                        title="Delete Project"
                        id={`delete-project-${project.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* SEGMENT 2: ONGOING PRACTICING TIMER & STOPWATCH */}
      {currentSegment === 'session' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Active timing terminal (takes 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="soft-card p-6 rounded-lg bg-white border border-outline-variant/20 relative overflow-hidden">
              <div className="absolute inset-0 paper-grain pointer-events-none opacity-4"></div>
              
              <div className="relative z-10 space-y-6 text-center flex flex-col items-center">
                
                {/* Selector Mode Tabs */}
                <div className="flex justify-center bg-surface-container-low p-1 rounded-full border border-outline-variant/25 text-xs font-bold gap-1 w-fit">
                  <button
                    onClick={() => { setTimerRunning(false); setTimerMode('countdown'); }}
                    className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                      timerMode === 'countdown' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    ⏳ Countdown Presets
                  </button>
                  <button
                    onClick={() => { setTimerRunning(false); setTimerMode('stopwatch'); }}
                    className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                      timerMode === 'stopwatch' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                    }`}
                    id="stopwatch-mode-btn"
                  >
                    ⏱️ Free Practice Stopwatch
                  </button>
                </div>

                {/* Target Dropdown Linkage */}
                <div className="w-full text-left bg-surface-container-low p-4 rounded-lg border border-outline-variant/20 max-w-md">
                  <label className="block text-xs font-black text-on-surface-variant/90 mb-1.5 uppercase tracking-wide">
                    Link session with focus area:
                  </label>
                  <select
                    className="w-full bg-white border border-outline-variant/50 rounded-full px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    value={timerTarget ? `${timerTarget.type}:${timerTarget.id}` : ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        setTimerTarget(null);
                      } else {
                        const [type, id] = e.target.value.split(':');
                        setTimerTarget({ type: type as 'project' | 'skill', id });
                      }
                    }}
                    id="timer-linked-target"
                  >
                    <option value="">-- Practice General / No explicit project --</option>
                    {projects.length > 0 && (
                      <optgroup label="Active Projects">
                        {projects.map((p) => (
                          <option key={p.id} value={`project:${p.id}`}>
                            💼 Project: {p.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {skills.length > 0 && (
                      <optgroup label="Skills Directory">
                        {skills.map((s) => (
                          <option key={s.id} value={`skill:${s.id}`}>
                            👑 Skill: {s.name} ({s.category})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <span className="text-[10px] text-on-surface-variant/70 mt-1 block font-semibold text-center italic">
                    Logs practice time directly to selected asset upon completion!
                  </span>
                </div>

                {/* Countdown Options presets */}
                {timerMode === 'countdown' ? (
                  <div className="flex gap-2 flex-wrap justify-center w-full">
                    {[10, 15, 25, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => handleCountdownPreset(mins)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          initialTime === mins * 60
                            ? 'bg-primary-container border-primary text-on-primary-container shadow-xs'
                            : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        ⏱️ {mins}m
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant/80 font-bold bg-surface-container/30 px-4 py-2 rounded-lg">
                    Stopwatch countup mode measurements automatically log on click!
                  </p>
                )}

                {/* Visual Circle Panel */}
                <div className="relative w-56 h-56 flex items-center justify-center bg-surface-container/20 border-4 border-primary/20 rounded-full my-4">
                  <div className="text-center">
                    <span className="font-display font-black text-5xl text-on-surface tracking-tight block">
                      {timerMode === 'countdown' ? formatTimer(timeLeft) : formatTimer(stopwatchSeconds)}
                    </span>
                    <span className="text-[10px] tracking-widest uppercase font-bold text-primary/70 mt-1 block">
                      {timerRunning ? 'Session Live' : 'Session Paused'}
                    </span>
                  </div>
                </div>

                {/* Live ticker animation */}
                {timerRunning && (
                  <div className="flex gap-1 items-center h-4 justify-center">
                    <span className="w-1.5 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-4.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-2 bg-tertiary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}

                {/* Interactive Controls */}
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => {
                      setTimerRunning(false);
                      setTimeLeft(initialTime);
                      setStopwatchSeconds(0);
                    }}
                    className="p-3 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-full cursor-pointer hover:scale-103 transition-transform"
                    title="Reset Session"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`px-8 py-3.5 rounded-full text-white font-sans font-bold text-sm shadow-md cursor-pointer hover:scale-102 transition-all flex items-center gap-2 ${
                      timerRunning ? 'bg-amber-600' : 'bg-primary'
                    }`}
                  >
                    {timerRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-white" />
                        Pause Practice
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        Begin Session
                      </>
                    )}
                  </button>

                  {/* Manual Commit early */}
                  {(timerRunning || (timerMode === 'stopwatch' && stopwatchSeconds > 0) || (timerMode === 'countdown' && timeLeft < initialTime)) && (
                    <button
                      onClick={handleSessionCompletion}
                      className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-full cursor-pointer hover:scale-103 transition-transform"
                      title="Finish and log practice hours"
                      id="timer-save-log-btn"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Right Block: Live session stats and session feed logs (takes 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="soft-card p-6 bg-white border border-outline-variant/20 rounded-lg space-y-4">
              <div className="border-b border-outline-variant/25 pb-2">
                <h4 className="font-display font-extrabold text-sm text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Practice Real-time tracker
                </h4>
                <p className="text-[10px] text-on-surface-variant/80 mt-0.5">Logs committed during this application turn</p>
              </div>

              {sessionLogs.length === 0 ? (
                <div className="py-12 text-center text-on-surface-variant/50 flex flex-col items-center">
                  <Timer className="w-8 h-8 text-outline/30 mb-2" />
                  <p className="text-xs font-bold font-sans">No sessions logged this turn</p>
                  <p className="text-[10px] mt-0.5 max-w-xs">Start the clock above, link to an active cooking or photo milestone, and complete it to save logs!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {sessionLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between gap-3 animate-in slide-in-from-right-3 duration-300"
                    >
                      <div className="space-y-0.5">
                        <h5 className="text-[11.5px] font-black text-on-surface truncate max-w-[180px]">
                          {log.targetName}
                        </h5>
                        <p className="text-[9.5px] text-on-surface-variant font-semibold">
                          Logged at {log.timestamp}
                        </p>
                      </div>

                      <span className="text-[10px] bg-secondary-container text-secondary font-black px-2.5 py-1 rounded-full">
                        +{log.durationMinutes} mins
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* SEGMENT 3: BRAINSTORMING SKILL & PROJECT IDEAS BOARD */}
      {currentSegment === 'ideas' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-transparent">
            <div>
              <h3 className="font-display font-black text-sm text-primary uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                Raw Concept Greenhouse
              </h3>
              <p className="text-[10.5px] text-on-surface-variant mt-0.5">Jot down potential skills, dishes, series, and promote them with 1-click</p>
            </div>
            <button
              onClick={() => setIsIdeaModalOpen(true)}
              className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-on-primary rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1"
              id="create-idea-trigger"
            >
              <Plus className="w-4 h-4" />
              Brainstorm Idea
            </button>
          </div>

          {projectIdeas.length === 0 ? (
            <div className="soft-card p-12 text-center text-on-surface-variant max-w-lg mx-auto bg-white/70">
              <Lightbulb className="w-16 h-16 text-outline/30 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-on-surface font-sans">No raw Ideas logged</h3>
              <p className="text-xs mt-1 mb-6">Found an inspiring recipe, photography site, or project? Seed your idea here before upgrading it.</p>
              <button
                onClick={() => setIsIdeaModalOpen(true)}
                className="px-6 py-3 bg-primary text-on-primary font-bold text-xs rounded-full shadow-md"
              >
                Log First Idea
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectIdeas.map((idea) => (
                <div 
                  key={idea.id} 
                  className="soft-card p-6 rounded-lg bg-white border border-outline-variant/10 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01]"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      {/* Vibe Category tag indicator */}
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded">
                        {idea.vibe}
                      </span>
                      <span className={`px-2 py-0.5 font-bold text-[9px] rounded-full ${
                        idea.difficulty === 'HARD' ? 'bg-red-50 text-red-600 border border-red-200' :
                        idea.difficulty === 'MODERATE' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                        'bg-green-50 text-green-600 border border-green-200'
                      }`}>
                        {idea.difficulty}
                      </span>
                    </div>

                    <h4 className="font-display font-black text-base text-on-surface mb-2">
                      {idea.title}
                    </h4>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed line-clamp-4 mb-6">
                      {idea.description}
                    </p>

                    {/* Star Rating visualization */}
                    <div className="flex items-center gap-1.5 mb-6">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Excitement Index:</span>
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            className={`w-3.5 h-3.5 ${idx < idea.excitementLevel ? 'fill-amber-500 text-amber-500' : 'text-surface-container-high'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="text-[9.5px] font-medium text-on-surface-variant/80">
                      📅 Idea seeded {idea.createdAt}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => promoteIdeaToProject(idea)}
                        className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-105 text-white text-[10.5px] font-black rounded-full flex items-center gap-1 shadow-sm transition-transform cursor-pointer active:scale-97"
                        id={`promote-idea-${idea.id}`}
                      >
                        🚀 Promote
                      </button>
                      
                      <button
                        onClick={() => onDeleteIdea(idea.id)}
                        className="p-2 text-on-surface-variant/60 hover:text-red-600 transition-colors rounded-full hover:bg-red-50 cursor-pointer"
                        title="Delete Idea"
                        id={`delete-idea-${idea.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* POPUP MODAL 1: CREATE PROJECT */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl overflow-hidden relative border border-primary-container p-6 animate-in fade-in zoom-in-95">
            <div className="absolute inset-0 paper-grain pointer-events-none opacity-4"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-display font-black text-lg text-primary">New Project Board</h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="space-y-4 relative z-10 font-sans text-xs">
              <div>
                <label className="block font-bold text-on-surface-variant mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sourdough Mastery Series"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-1">
                  Description / Targets
                </label>
                <textarea
                  required
                  placeholder="What practice recipes, photography guidelines, or projects are you organising?"
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-3 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1">
                    Timeline Target
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DUE IN 4D or ON TRACK"
                    value={projDueDateStr}
                    onChange={(e) => setProjDueDateStr(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1">
                    Practice Size (Collaborators)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={projTeamCount}
                    onChange={(e) => setProjTeamCount(Number(e.target.value))}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-2">
                  Associate Theme Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'ChefHat', label: 'Culinary' },
                    { id: 'Camera', label: 'Creative' },
                    { id: 'Dumbbell', label: 'Fitness' },
                    { id: 'Book', label: 'Lit' },
                    { id: 'Code', label: 'Coding' },
                  ].map((ic) => (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setProjIcon(ic.id)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                        projIcon === ic.id 
                          ? 'bg-primary-container border-primary text-on-primary-container shadow-xs' 
                          : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {renderProjectIcon(ic.id)}
                      <span className="text-[9px] font-medium">{ic.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-1">
                  Tag Keywords (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Baking, Culinary, Creative"
                  value={projTags}
                  onChange={(e) => setProjTags(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-5 py-2.5 bg-surface-container text-on-surface-variant hover:bg-surface-container-high rounded-full text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-full text-xs font-bold hover:brightness-95 shadow-md"
                >
                  Commit Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* POPUP MODAL 2: BRAINSTORM IDEA */}
      {isIdeaModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl overflow-hidden relative border border-primary-container p-6 animate-in fade-in zoom-in-95">
            <div className="absolute inset-0 paper-grain pointer-events-none opacity-4"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-display font-black text-lg text-primary">Brainstorm New Concept</h3>
              <button
                onClick={() => setIsIdeaModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddIdeaSubmit} className="space-y-4 relative z-10 font-sans text-xs">
              <div>
                <label className="block font-bold text-on-surface-variant mb-1">
                  Concept Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crafting Authentic Neapolitan Margherita"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/45 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-1">
                  Concept Details / Inspiration Notes
                </label>
                <textarea
                  required
                  placeholder="Record recipe fractions, lighting rules, location notes, or skill targets..."
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-container-low border border-outline-variant/45 rounded-lg p-3 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1">
                    Vibe Classification
                  </label>
                  <select
                    value={ideaVibe}
                    onChange={(e) => setIdeaVibe(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/45 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none focus:bg-white"
                  >
                    <option value="Culinary Arts">Culinary Arts</option>
                    <option value="Creative Arts">Creative Arts</option>
                    <option value="Tech Practices">Tech Practices</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Other Interests">Other Interests</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={ideaDifficulty}
                    onChange={(e) => setIdeaDifficulty(e.target.value as any)}
                    className="w-full bg-surface-container-low border border-outline-variant/45 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none focus:bg-white"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-1.5">
                  Excitement Intensity (1-5 Star Level)
                </label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setIdeaExcitement(star)}
                      className="p-1.5 text-amber-500 hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= ideaExcitement ? 'fill-amber-500' : 'text-outline-variant/30'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIdeaModalOpen(false)}
                  className="px-5 py-2.5 bg-surface-container text-on-surface-variant hover:bg-surface-container-high rounded-full text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-full text-xs font-bold hover:brightness-95 shadow-md animate-pulse"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* RELATED TASKS MANAGER MODAL FOR THE CLICKED ACTIVE PROJECT */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden relative border border-primary-container p-6 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
            <div className="absolute inset-0 paper-grain pointer-events-none opacity-4"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10 w-full border-b border-outline-variant/15 pb-4">
              <div className="flex gap-3">
                <div className="p-3.5 bg-primary-container/20 text-primary rounded-xl self-start h-fit">
                  {renderProjectIcon(selectedProject.icon || 'ChefHat')}
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-primary flex items-center gap-2">
                    {selectedProject.name}
                  </h3>
                  <p className="text-[11px] font-bold text-on-surface-variant/70 tracking-wide uppercase">
                    Project Goals, Tasks & Status Tracker
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedProjectId(null);
                  setInlineTaskText('');
                  setInlineTaskPriority('MED');
                  setInlineTaskTheme('indigo');
                  setActiveColorPickerTaskId(null);
                }}
                className="p-1 px-2.5 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors animate-in duration-200"
                id="close-project-task-manager"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with scrolling tasks list */}
            <div className="space-y-6 overflow-y-auto pr-1 flex-1 relative z-10 py-1">
              <div>
                <h4 className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/80 mb-1">
                  Project Scope & Targets
                </h4>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed bg-surface-container/25 p-3 rounded-lg border border-outline-variant/10">
                  {selectedProject.description}
                </p>
              </div>

              {/* Inline task addition form */}
              <div className="bg-primary-container/5 border border-primary-container/20 rounded-xl p-4 space-y-3">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 animate-pulse text-amber-500 fill-amber-500/20" />
                  Fast Track a Now-Task relation
                </h4>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!inlineTaskText.trim()) return;
                    
                    const newTask: Task = {
                      id: `task_proj_inline_${Date.now()}`,
                      text: inlineTaskText.trim(),
                      project: selectedProject.name,
                      priority: inlineTaskPriority,
                      completed: false,
                      theme: inlineTaskTheme,
                    };
                    onAddTask(newTask);
                    setInlineTaskText('');
                    setInlineTaskPriority('MED');
                    setInlineTaskTheme('indigo');
                  }}
                  className="space-y-3"
                >
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gather sourdough ingredients, set focus tracking metrics..."
                      value={inlineTaskText}
                      onChange={(e) => setInlineTaskText(e.target.value)}
                      className="flex-1 bg-white border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none placeholder-on-surface-variant/40 shadow-xs"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-sans font-bold text-xs rounded-full cursor-pointer flex items-center justify-center gap-1 transition-all shadow-md shadow-primary/10 flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Add Task
                    </button>
                  </div>

                  {/* Settings and color options in a row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    {/* Theme Pickers Bubble List */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                        Theme Color:
                      </span>
                      <div className="flex gap-1.5">
                        {PROJECT_THEME_OPTIONS.map((themeOpt) => (
                          <button
                            key={themeOpt.id}
                            type="button"
                            onClick={() => setInlineTaskTheme(themeOpt.id)}
                            className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full ${themeOpt.bubbleBg} cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-[10px] font-bold`}
                            title={themeOpt.name}
                          >
                            {inlineTaskTheme === themeOpt.id ? '✓' : ''}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Priority selectors */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                        Priority:
                      </span>
                      <div className="flex bg-surface-container rounded-full p-0.5 border border-outline-variant/10 text-[9px] font-black">
                        {(['LOW', 'MED', 'HIGH'] as const).map((prio) => (
                          <button
                            key={prio}
                            type="button"
                            onClick={() => setInlineTaskPriority(prio)}
                            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                              inlineTaskPriority === prio 
                                ? prio === 'HIGH' 
                                  ? 'bg-red-500 text-white' 
                                  : prio === 'MED' 
                                  ? 'bg-amber-500 text-white' 
                                  : 'bg-slate-500 text-white' 
                                : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                          >
                            {prio}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Tasks List Section */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-transparent border-b border-outline-variant/10 pb-1.5">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/80">
                    Tasks Assigned ({tasks.filter(t => t.project.toLowerCase() === selectedProject.name.toLowerCase() || t.project === selectedProject.name).length})
                  </h4>
                  <span className="text-[10px] text-primary/80 font-bold bg-primary/10 px-2 py-0.5 rounded-full text-center">
                    Gently shifts project completion metrics!
                  </span>
                </div>

                {(() => {
                  const filtered = tasks.filter(t => t.project.toLowerCase() === selectedProject.name.toLowerCase() || t.project === selectedProject.name);
                  if (filtered.length === 0) {
                    return (
                      <div className="py-12 text-center text-on-surface-variant-30 font-sans p-6 border-2 border-dashed border-outline-variant/10 rounded-xl bg-surface-container-low/5">
                        <CheckCircle2 className="w-10 h-10 text-outline-variant/30 text-primary mx-auto mb-2 opacity-50" />
                        <h5 className="font-bold text-xs text-on-surface">Immediate slate is clear</h5>
                        <p className="text-[10.5px] text-on-surface-variant font-medium mt-0.5">Add project-specific tasks above to design checklist guidelines!</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2 max-h-[290px] overflow-y-auto pr-0.5">
                      {filtered.map((task) => {
                        const customTheme = PROJECT_THEME_OPTIONS.find(o => o.id === task.theme) || PROJECT_THEME_OPTIONS[0];
                        return (
                          <div 
                            key={task.id}
                            className={`soft-card p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs border select-none transition-all ${customTheme.bg}`}
                          >
                            <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => onToggleTask(task.id)}
                                className="custom-checkbox w-5 h-5 rounded-full border-2 border-primary-container text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer bg-white"
                              />
                              <div className="min-w-0 flex-1">
                                <span className={`font-sans font-bold leading-normal truncate block text-[12.5px] ${
                                  task.completed ? 'line-through opacity-50 text-on-surface-variant' : 'text-on-surface'
                                }`}>
                                  {task.text}
                                </span>
                              </div>
                            </label>

                            <div className="flex items-center gap-2 flex-shrink-0 relative">
                              {/* Color Picker palette */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveColorPickerTaskId(activeColorPickerTaskId === task.id ? null : task.id);
                                  }}
                                  className="p-1 sm:p-1.5 rounded-full bg-white/80 hover:bg-white text-on-surface-variant hover:text-primary transition-all flex items-center justify-center cursor-pointer border border-on-surface-variant/10 shadow-xs"
                                  title="Change Task Theme"
                                >
                                  <Palette className="w-3.5 h-3.5" />
                                </button>

                                {activeColorPickerTaskId === task.id && (
                                  <div className="absolute right-0 bottom-7 z-30 bg-white p-1.5 rounded-xl shadow-2xl border border-outline-variant/30 flex gap-1 animate-in fade-in slide-in-from-bottom-2">
                                    {PROJECT_THEME_OPTIONS.map((themeOpt) => (
                                      <button
                                        key={themeOpt.id}
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          onUpdateTask(task.id, { theme: themeOpt.id });
                                          setActiveColorPickerTaskId(null);
                                        }}
                                        className={`w-5 h-5 rounded-full ${themeOpt.bubbleBg} cursor-pointer hover:scale-110 active:scale-95 transition-transform flex items-center justify-center text-white text-[9px] font-bold leading-none`}
                                        title={themeOpt.name}
                                      >
                                        {task.theme === themeOpt.id || (!task.theme && themeOpt.id === 'indigo') ? '✓' : ''}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase ${
                                task.priority === 'HIGH' 
                                  ? 'bg-red-100 text-red-700' 
                                  : task.priority === 'MED' 
                                  ? 'bg-amber-100 text-amber-700' 
                                  : 'bg-slate-150 text-slate-700'
                              }`}>
                                {task.priority}
                              </span>

                              <button
                                type="button"
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1.5 text-on-surface-variant/40 hover:text-red-650 rounded-full hover:bg-red-50/70 transition-colors cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

              </div>
            </div>

            {/* Footer action */}
            <div className="pt-4 border-t border-outline-variant/15 flex justify-end gap-2 relative z-10 bg-transparent">
              <button
                type="button"
                onClick={() => {
                  setSelectedProjectId(null);
                  setInlineTaskText('');
                  setInlineTaskPriority('MED');
                  setInlineTaskTheme('indigo');
                  setActiveColorPickerTaskId(null);
                }}
                className="px-6 py-2 bg-surface-container hover:bg-surface-container-high rounded-full text-xs font-black text-on-surface transition-all cursor-pointer"
                id="close-project-task-manager-footer"
              >
                Close Task Board
              </button>
            </div>

          </div>
        </div>
      )}


      {/* CELEBRATION DISMISS PANEL OVERLAY */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center border-2 border-primary-container relative animate-in zoom-in-95 scroll-smooth">
            <Sparkles className="w-12 h-12 text-amber-500 fill-amber-500/10 mx-auto animate-bounce mb-3" />
            <h4 className="font-display font-black text-xl text-primary mb-2">Beautiful Progress! 🎉</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-6 font-medium">
              {celebrationMsg}
            </p>
            <button
              onClick={() => { setShowCelebration(false); setCelebrationMsg(''); }}
              className="w-full py-3 bg-primary text-on-primary font-black rounded-full text-xs cursor-pointer active:scale-98 hover:brightness-97 shadow-md"
            >
              Excellent, keep going
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
