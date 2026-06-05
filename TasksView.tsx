import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Calendar, Filter, Sparkles, ChevronRight, X, Layers, Palette } from 'lucide-react';
import { Task, Project } from '../types';

export const THEME_OPTIONS = [
  { id: 'indigo', name: 'Indigo Accent', bg: 'bg-indigo-50/90 border-indigo-250 text-indigo-950', ring: 'ring-indigo-500', bubbleBg: 'bg-indigo-500 hover:bg-indigo-600' },
  { id: 'emerald', name: 'Emerald Sage', bg: 'bg-emerald-50/90 border-emerald-250 text-emerald-950', ring: 'ring-emerald-500', bubbleBg: 'bg-emerald-500 hover:bg-emerald-600' },
  { id: 'rose', name: 'Ruby Crimson', bg: 'bg-rose-50/90 border-rose-250 text-rose-950', ring: 'ring-rose-500', bubbleBg: 'bg-rose-500 hover:bg-rose-600' },
  { id: 'amber', name: 'Amber Sunset', bg: 'bg-amber-50/90 border-amber-250 text-amber-950', ring: 'ring-amber-500', bubbleBg: 'bg-amber-500 hover:bg-amber-600' },
  { id: 'violet', name: 'Amethyst Violet', bg: 'bg-purple-50/90 border-purple-250 text-purple-950', ring: 'ring-purple-500', bubbleBg: 'bg-purple-500 hover:bg-purple-600' },
  { id: 'cyan', name: 'Ocean Cyan', bg: 'bg-cyan-50/90 border-cyan-250 text-cyan-950', ring: 'ring-cyan-500', bubbleBg: 'bg-cyan-500 hover:bg-cyan-600' },
];

interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TasksView({
  tasks,
  projects,
  onToggleTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: TasksViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create state for new tasks form
  const [text, setText] = useState('');
  const [projectStr, setProjectStr] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MED' | 'HIGH'>('MED');
  const [taskTheme, setTaskTheme] = useState('indigo');
  const [activeColorPickerTaskId, setActiveColorPickerTaskId] = useState<string | null>(null);

  // Filtering state
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [activePriorityFilter, setActivePriorityFilter] = useState<'ALL' | 'HIGH' | 'MED' | 'LOW'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      text,
      project: projectStr || 'Algorithm Prep',
      priority,
      completed: false,
      theme: taskTheme,
    };

    onAddTask(newTask);
    setIsModalOpen(false);

    // Reset fields
    setText('');
    setProjectStr('');
    setPriority('MED');
    setTaskTheme('indigo');
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.project.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      activeFilter === 'ALL' ||
      (activeFilter === 'PENDING' && !t.completed) ||
      (activeFilter === 'COMPLETED' && t.completed);

    const matchesPriority =
      activePriorityFilter === 'ALL' ||
      t.priority === activePriorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="px-6 lg:px-12 pb-12 w-full max-w-7xl mx-auto space-y-8">
      
      {/* Header and counter panels */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div>
          <h2 className="font-display text-2xl lg:text-3xl font-black text-primary tracking-tight">
            Comprehensive Task Board
          </h2>
          <p className="text-xs text-on-surface-variant font-bold mt-1">
            Maintain daily focus margins and view active dependencies
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/95 text-on-primary font-sans font-bold text-xs px-5 py-3 rounded-full flex items-center gap-2 self-start cursor-pointer transition-transform hover:scale-102 active:scale-97"
          id="create-task-main-btn"
        >
          <Plus className="w-4 h-4" />
          Add Today's Task
        </button>
      </div>

      {/* Grid Filter Bar and search */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        
        {/* Toggle Status Cards */}
        <div className="flex bg-white/60 p-1 rounded-full border border-outline-variant/20 self-start">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'ALL' 
                ? 'bg-primary text-on-primary shadow-xs' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'PENDING' 
                ? 'bg-primary text-on-primary shadow-xs' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveFilter('COMPLETED')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'COMPLETED' 
                ? 'bg-primary text-on-primary shadow-xs' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Priority Filter and Search Box */}
        <div className="flex flex-col sm:flex-row gap-2 mt-1 lg:mt-0 items-stretch sm:items-center">
          <div className="flex bg-white/60 p-1 rounded-full border border-outline-variant/20 items-center">
            <span className="text-[10px] font-black text-on-surface-variant tracking-wider uppercase pl-3 pr-1">Priority:</span>
            {['ALL', 'HIGH', 'MED', 'LOW'].map((prio) => (
              <button
                key={prio}
                onClick={() => setActivePriorityFilter(prio as any)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activePriorityFilter === prio 
                    ? 'bg-secondary text-on-secondary shadow-xs' 
                    : 'text-on-surface-variant hover:text-secondary'
                }`}
              >
                {prio}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/80 border border-outline-variant/30 rounded-full px-5 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

      </div>

      {/* Task Rows List View */}
      {filteredTasks.length === 0 ? (
        <div className="soft-card p-12 text-center text-on-surface-variant bg-white/70 max-w-md mx-auto">
          <CheckSquare className="w-14 h-14 text-outline/30 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-on-surface">No Tasks Match Filter</h3>
          <p className="text-xs mt-1">Try toggling filters or adjust search criteria to see listed duties.</p>
        </div>
      ) : (
        <div className="space-y-3" id="tasks-list">
          {filteredTasks.map((task) => {
            const customTheme = THEME_OPTIONS.find(o => o.id === task.theme) || THEME_OPTIONS[0];
            return (
              <div 
                key={task.id} 
                className={`soft-card p-5 rounded-lg flex items-center justify-between gap-4 border select-none hover:translate-x-1 transition-all ${customTheme.bg}`}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id)}
                    className="custom-checkbox w-6 h-6 rounded-full border-2 border-primary-container text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer"
                  />
                  
                  <div className="min-w-0">
                    <p className={`font-sans font-bold text-sm lg:text-base leading-snug truncate ${
                      task.completed ? 'line-through opacity-50 text-on-surface-variant' : 'text-on-surface'
                    }`}>
                      {task.text}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-on-surface-variant tracking-wider uppercase bg-surface-container px-2 py-0.5 rounded">
                        {task.project}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges & Actions */}
                <div className="flex items-center gap-3">
                  {/* Theme Button Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveColorPickerTaskId(activeColorPickerTaskId === task.id ? null : task.id);
                      }}
                      className="p-1 px-2.5 rounded-full bg-white/80 hover:bg-white text-on-surface-variant hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer border border-on-surface-variant/10 text-xs font-bold"
                      title="Choose Task Theme"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      Theme
                    </button>

                    {activeColorPickerTaskId === task.id && (
                      <div className="absolute right-0 bottom-8 z-30 bg-white p-2.5 rounded-2xl shadow-2xl border border-outline-variant/30 flex gap-1.5 animate-in fade-in slide-in-from-bottom-2">
                        {THEME_OPTIONS.map((themeOpt) => (
                          <button
                            key={themeOpt.id}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onUpdateTask(task.id, { theme: themeOpt.id });
                              setActiveColorPickerTaskId(null);
                            }}
                            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${themeOpt.bubbleBg} cursor-pointer hover:scale-110 active:scale-95 transition-transform flex items-center justify-center text-white text-[10px] font-bold leading-none`}
                            title={themeOpt.name}
                          >
                            {task.theme === themeOpt.id || (!task.theme && themeOpt.id === 'indigo') ? '✓' : ''}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                    task.priority === 'HIGH' 
                      ? 'bg-red-150 text-red-800' 
                      : task.priority === 'MED' 
                      ? 'bg-amber-150 text-amber-850' 
                      : 'bg-slate-150 text-slate-800'
                  }`}>
                    {task.priority}
                  </span>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 text-on-surface-variant/40 hover:text-red-650 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete Task"
                    id={`del-task-${task.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Write New Task Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full shadow-2xl overflow-hidden relative border border-primary-container p-6 animate-in fade-in zoom-in-95">
            <div className="absolute inset-0 paper-grain pointer-events-none opacity-4"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-display font-black text-lg text-primary">Add New Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-on-surface-variant hover:bg-surface-container rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Task Duty / Goal
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement attention mechanism"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Associate Project / Theme
                </label>
                <select
                  value={projectStr}
                  onChange={(e) => setProjectStr(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
                >
                  <option value="">Algorithm Prep (Default)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                  Choose Task Color Accent (Theme)
                </label>
                <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
                  {THEME_OPTIONS.map((themeOpt) => (
                    <button
                      key={themeOpt.id}
                      type="button"
                      onClick={() => setTaskTheme(themeOpt.id)}
                      className={`w-7 h-7 sm:w-8 h-8 rounded-full ${themeOpt.bubbleBg} cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-white text-[11px] font-black shadow-xs ${
                        taskTheme === themeOpt.id ? 'ring-2 ring-primary ring-offset-1 scale-102' : ''
                      }`}
                      title={themeOpt.name}
                    >
                      {taskTheme === themeOpt.id ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2">
                  System Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LOW', 'MED', 'HIGH'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-full text-xs font-bold transition-all border ${
                        priority === p 
                          ? 'bg-primary border-primary text-on-primary font-black shadow-xs' 
                          : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-surface-container text-on-surface-variant rounded-full text-xs font-bold hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary rounded-full text-xs font-bold hover:brightness-97 shadow-md"
                >
                  Confirm Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
