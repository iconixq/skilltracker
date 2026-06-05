import { useState, useEffect } from 'react';
import { Compass, FolderGit2, CheckSquare, Flame, Sparkles, Plus, Menu, X, Rocket, Layers } from 'lucide-react';
import DashboardView from './DashboardView';
import SkillsView from './SkillsView';
import ProjectsView from './ProjectsView';
import FocusSession from './FocusSession';
import TasksView from './TasksView';
import SettingsView from './SettingsView';
import SupportView from './SupportView';
import Sidebar from './Sidebar';
import { Task, Project, Skill, Goal, UserProfile, ProjectIdea } from './types';

// Initial Mock records structured to support diverse practice areas (Culinary, Creative, Tech)
const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj_cook_1',
    name: 'Artisanal Sourdough Baking',
    description: 'Perfecting sourdough yeast cultivation, baker percentages, long cold-fermentation, and steam baking methods.',
    dueDateStr: 'ON TRACK',
    percentage: 65,
    tags: ['Culinary', 'Baking'],
    teamCount: 1,
    icon: 'ChefHat',
  },
  {
    id: 'proj_photo_2',
    name: 'Golden Hour Photography',
    description: 'Deep practice in street portraits, golden hour exposure settings, and capturing high dynamic contrasts.',
    dueDateStr: 'DUE IN 4D',
    percentage: 30,
    tags: ['Creative', 'Art'],
    teamCount: 2,
    icon: 'Camera',
  },
  {
    id: 'proj_ts_3',
    name: 'Interactive Cooking Assistant App',
    description: 'Building a fully-typed client-side meal preparation assistant with real-time timers and scale multipliers.',
    dueDateStr: 'ON TRACK',
    percentage: 45,
    tags: ['Tech', 'Productivity'],
    teamCount: 3,
    icon: 'Code',
  }
];

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task_bake_1',
    text: 'Feed starter and monitor temperature curves',
    project: 'Artisanal Sourdough Baking',
    priority: 'HIGH',
    completed: false,
  },
  {
    id: 'task_photo_2',
    text: 'Practice 3-point portrait session with softbox',
    project: 'Golden Hour Photography',
    priority: 'MED',
    completed: true,
  },
  {
    id: 'task_code_3',
    text: 'Draft type schemas for scale multiplier helper',
    project: 'Interactive Cooking Assistant App',
    priority: 'MED',
    completed: false,
  }
];

const DEFAULT_SKILLS: Skill[] = [
  {
    id: 'skill_cook_1',
    name: 'Culinary Arts & Baking',
    percentage: 45,
    iconName: 'ChefHat',
    hoursSpent: 16,
    category: 'Culinary Arts',
    logs: [
      {
        id: 'log_cook_1',
        date: 'Jun 1, 2026',
        hours: 6,
        remark: 'Practiced hand-mixing sourdough dough, autolyse schedule, and coil-folds. Achieved moderate crumb density.',
        progressPercent: 35,
      },
      {
        id: 'log_cook_2',
        date: 'Jun 3, 2026',
        hours: 10,
        remark: 'Monitored dough development during bulk rise inside proofing box. Scoring and steam injection resulted in an excellent ear.',
        progressPercent: 45,
      }
    ]
  },
  {
    id: 'skill_photo_2',
    name: 'Digital Photography',
    percentage: 30,
    iconName: 'Camera',
    hoursSpent: 8,
    category: 'Creative Arts',
    logs: [
      {
        id: 'log_photo_1',
        date: 'Jun 2, 2026',
        hours: 8,
        remark: 'Deep research into camera exposure triangles (ISO, aperture, shutter speed) and practical focus tracking methods.',
        progressPercent: 30,
      }
    ]
  },
  {
    id: 'skill_tech_3',
    name: 'TypeScript Programming',
    percentage: 75,
    iconName: 'Code',
    hoursSpent: 12,
    category: 'Tech & Programming',
    logs: [
      {
        id: 'log_tech_1',
        date: 'May 28, 2026',
        hours: 12,
        remark: 'Explored type parameters, conditional typings, and type guards to build bulletproof type contract rules.',
        progressPercent: 75,
      }
    ]
  }
];

const DEFAULT_GOAL: Goal = {
  title: 'Achieve Perfect Crumb & Rim Lighting',
  dedicatedHours: 12,
  targetHours: 15,
  category: 'Weekly Practice Focus',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex',
  title: 'Curious Lifelong Learner',
  bio: 'A passionate generalist tracking skills from gourmet baking to street photography and type-safe systems.',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
  level: 4,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('skilltracker_profile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Ignored
      }
    }
    const legacyName = localStorage.getItem('skilltracker_username') || 'Alex';
    return {
      ...DEFAULT_PROFILE,
      name: legacyName
    };
  });
  const [goal, setGoal] = useState<Goal>(() => {
    const cached = localStorage.getItem('skilltracker_goal');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Ignored
      }
    }
    return DEFAULT_GOAL;
  });
  
  // Core lists states with local-storage fallback
  const [projects, setProjects] = useState<Project[]>(() => {
    const cached = localStorage.getItem('skilltracker_projects');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Ignored fallback
      }
    }
    return DEFAULT_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const cached = localStorage.getItem('skilltracker_tasks');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Ignored fallback
      }
    }
    return DEFAULT_TASKS;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const cached = localStorage.getItem('skilltracker_skills');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Ignored fallback
      }
    }
    return DEFAULT_SKILLS;
  });

  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>(() => {
    const cached = localStorage.getItem('skilltracker_project_ideas');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Ignored
      }
    }
    return [
      {
        id: 'idea_1',
        title: 'Authentic Ramen Broth Chemistry',
        description: 'Experimenting with pork femur collagen extraction times, alkaline water ratios for hand-pulled noodles, and compound dashi layers.',
        difficulty: 'HARD',
        vibe: 'Culinary Arts',
        excitementLevel: 5,
        createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      },
      {
        id: 'idea_2',
        title: 'Sourdough Croissant Lamination',
        description: 'Mastering temperature control for 27 flaky butter layers, flour gluten scores, and outdoor proofing chambers.',
        difficulty: 'HARD',
        vibe: 'Culinary Arts',
        excitementLevel: 5,
        createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      },
      {
        id: 'idea_3',
        title: 'Landscape Cyanotype Print Series',
        description: 'Using natural sunlight and UV exposure to craft intense Prussian blue photographic prints on cold-pressed textile boards.',
        difficulty: 'EASY',
        vibe: 'Creative Arts',
        excitementLevel: 4,
        createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      }
    ];
  });

  // Maintain consistent cache of Weekly Focus Goal inside local storage
  useEffect(() => {
    localStorage.setItem('skilltracker_goal', JSON.stringify(goal));
  }, [goal]);

  // Save changes block
  useEffect(() => {
    localStorage.setItem('skilltracker_profile', JSON.stringify(userProfile));
    localStorage.setItem('skilltracker_username', userProfile.name);
  }, [userProfile]);


  // Save changes to localStorage on any updates
  useEffect(() => {
    localStorage.setItem('skilltracker_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('skilltracker_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('skilltracker_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('skilltracker_project_ideas', JSON.stringify(projectIdeas));
  }, [projectIdeas]);

  // Modal Overlays state triggers
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isFocusSessionOpen, setIsFocusSessionOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // New goal form state
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTargetHours, setNewGoalTargetHours] = useState(15);
  const [newGoalCategory, setNewGoalCategory] = useState('Weekly Learning Focus');

  // Trigger quick hours calculation
  const handleLogHours = (categoryType: 'project' | 'skill', id: string, hours: number) => {
    // Increase goal dedicated hours
    const updatedGoal = {
      ...goal,
      dedicatedHours: goal.dedicatedHours + hours
    };
    setGoal(updatedGoal);
    localStorage.setItem('skilltracker_goal', JSON.stringify(updatedGoal));

    if (categoryType === 'project') {
      setProjects((prev) => 
        prev.map((proj) => {
          if (proj.id === id) {
            // Logs of hours also increase project completion milestone percentage gently!
            const addedPercent = Math.min(100, Math.round(proj.percentage + (hours * 1.5)));
            return {
              ...proj,
              percentage: addedPercent
            };
          }
          return proj;
        })
      );
    } else {
      setSkills((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            const addedPercent = Math.min(100, Math.round(s.percentage + (hours * 2)));
            // Create a generic automatic log entry for simplicity in focus mode quick log
            const newLog = {
              id: `log_${Date.now()}`,
              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
              hours,
              remark: `Logged training session for ${hours} hours of study.`,
              progressPercent: addedPercent
            };
            const updatedLogs = s.logs ? [...s.logs, newLog] : [newLog];
            return {
              ...s,
              hoursSpent: (s.hoursSpent || 0) + hours,
              percentage: addedPercent,
              logs: updatedLogs
            };
          }
          return s;
        })
      );
    }
  };

  const handleAddSkillLog = (skillId: string, hours: number, remark: string, progressPercent: number) => {
    // Increase goal dedicated hours
    const updatedGoal = {
      ...goal,
      dedicatedHours: goal.dedicatedHours + hours
    };
    setGoal(updatedGoal);
    localStorage.setItem('skilltracker_goal', JSON.stringify(updatedGoal));

    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === skillId) {
          const newLog = {
            id: `log_${Date.now()}`,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            hours,
            remark: remark.trim() || 'Logged study session',
            progressPercent
          };
          const updatedLogs = s.logs ? [...s.logs, newLog] : [newLog];
          return {
            ...s,
            hoursSpent: (s.hoursSpent || 0) + hours,
            percentage: progressPercent,
            logs: updatedLogs
          };
        }
        return s;
      })
    );
  };

  const handleDeleteSkill = (skillId: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  const handleDeleteSkillLog = (skillId: string, logId: string) => {
    setSkills((prev) => 
      prev.map((s) => {
        if (s.id === skillId && s.logs) {
          const targetLog = s.logs.find(l => l.id === logId);
          const hoursToSubtract = targetLog ? targetLog.hours : 0;
          const updatedLogs = s.logs.filter(l => l.id !== logId);
          
          let latestPercent = s.percentage;
          if (updatedLogs.length > 0) {
            latestPercent = updatedLogs[updatedLogs.length - 1].progressPercent;
          } else {
            latestPercent = 0;
          }

          return {
            ...s,
            hoursSpent: Math.max(0, (s.hoursSpent || 0) - hoursToSubtract),
            percentage: latestPercent,
            logs: updatedLogs
          };
        }
        return s;
      })
    );
  };

  // Restores standard starter data
  const handleResetData = () => {
    setProjects(DEFAULT_PROJECTS);
    setTasks(DEFAULT_TASKS);
    setSkills(DEFAULT_SKILLS);
    setGoal(DEFAULT_GOAL);
    setUserProfile(DEFAULT_PROFILE);
    localStorage.clear();
    setActiveTab('dashboard');
  };

  // Toggle Checkboxes automatically coordinates with Project percentages if linked
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) => 
      prev.map((task) => {
        if (task.id === taskId) {
          const nextCompletedStatus = !task.completed;
          
          // Let's make an intuitive connection: Toggling a task completed increases the matching project completion score!
          if (nextCompletedStatus) {
            // Find matched project containing title name
            setProjects((prevProjs) => 
              prevProjs.map((p) => {
                if (task.project === p.name || p.name.includes(task.project)) {
                  return { ...p, percentage: Math.min(100, p.percentage + 4) };
                }
                return p;
              })
            );
          } else {
            // Decrease matching project score a bit
            setProjects((prevProjs) => 
              prevProjs.map((p) => {
                if (task.project === p.name || p.name.includes(task.project)) {
                  return { ...p, percentage: Math.max(0, p.percentage - 4) };
                }
                return p;
              })
            );
          }

          return { ...task, completed: nextCompletedStatus };
        }
        return task;
      })
    );
  };

  const handleUpdateUserProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const handleUpdateGoal = (updated: Goal) => {
    setGoal(updated);
    localStorage.setItem('skilltracker_goal', JSON.stringify(updated));
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === id) {
        return { ...t, ...updates };
      }
      return t;
    }));
  };

  // Modal New Goal submit
  const handleCreateGoal = (e: any) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const updatedGoal: Goal = {
      title: newGoalTitle,
      targetHours: Number(newGoalTargetHours) || 15,
      category: newGoalCategory || 'Weekly Learning Focus',
      dedicatedHours: 0, // Reset logging focus for this new target focus
    };

    handleUpdateGoal(updatedGoal);
    setIsNewGoalModalOpen(false);

    // Reset fields
    setNewGoalTitle('');
    setNewGoalCategory('Weekly Learning Focus');
  };

  // Filter pending task counts for side menu badges
  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen relative overflow-x-hidden pb-12 font-sans md:pb-0 select-none">
      {/* Decorative backdrop and paper grain */}
      <div className="paper-grain opacity-3 pointer-events-none z-50"></div>

      {/* Responsive mobile sidebar triggers */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white/75 backdrop-blur border-b border-primary-container z-40 sticky top-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden">
            <img 
              alt="Cute pixel avatar" 
              className="w-6 h-6 rounded-full object-cover" 
              src={userProfile.avatarUrl}
            />
          </div>
          <h1 className="font-display font-black text-sm text-primary">SkillTracker</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Focus rocket session launcher */}
          <button 
            onClick={() => setIsFocusSessionOpen(true)}
            className="p-2 text-primary hover:text-primary-hover flex items-center gap-1.5 focus:outline-none"
            title="Start Focus Timer"
          >
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-wider">Timer</span>
          </button>

          <button 
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 text-on-surface hover:text-primary hover:bg-surface-container rounded-full focus:outline-none"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Framework structure */}
      <div className="flex relative">
        
        {/* Core Side navigation rails */}
        <Sidebar 
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsMobileNavOpen(false);
          }}
          onNewGoalClick={() => {
            // Starts the Goal quick modal parameters
            setNewGoalTitle(goal.title);
            setNewGoalTargetHours(goal.targetHours);
            setNewGoalCategory(goal.category);
            setIsNewGoalModalOpen(true);
            setIsMobileNavOpen(false);
          }}
          pendingTasksCount={pendingTasksCount}
          userProfile={userProfile}
        />

        {/* Mobile menu panel drawer overlay */}
        {isMobileNavOpen && (
          <div className="fixed inset-x-0 top-14 bg-white/95 backdrop-blur-md border-b border-primary-container p-6 z-40 transition-all shadow-xl md:hidden overflow-hidden flex flex-col space-y-4">
            <div className="absolute inset-0 paper-grain opacity-4"></div>
            
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <button 
                onClick={() => { setActiveTab('dashboard'); setIsMobileNavOpen(false); }}
                className={`p-4 rounded-xl flex flex-col gap-2 font-bold text-xs ${activeTab === 'dashboard' ? 'bg-primary-container text-on-primary-container font-black' : 'bg-surface-container-low text-on-surface-variant'}`}
              >
                <Compass className="w-5 h-5 text-primary" />
                Dashboard View
              </button>
              <button 
                onClick={() => { setActiveTab('projects'); setIsMobileNavOpen(false); }}
                className={`p-4 rounded-xl flex flex-col gap-2 font-bold text-xs ${activeTab === 'projects' ? 'bg-primary-container text-on-primary-container font-black' : 'bg-surface-container-low text-on-surface-variant'}`}
              >
                <FolderGit2 className="w-5 h-5 text-secondary" />
                Projects Hub
              </button>
              <button 
                onClick={() => { setActiveTab('tasks'); setIsMobileNavOpen(false); }}
                className={`p-4 rounded-xl flex flex-col gap-2 font-bold text-xs ${activeTab === 'tasks' ? 'bg-primary-container text-on-primary-container font-black' : 'bg-surface-container-low text-on-surface-variant'}`}
              >
                <CheckSquare className="w-5 h-5 text-tertiary" />
                Task Board ({pendingTasksCount})
              </button>
              <button 
                onClick={() => { setActiveTab('skills'); setIsMobileNavOpen(false); }}
                className={`p-4 rounded-xl flex flex-col gap-2 font-bold text-xs ${activeTab === 'skills' ? 'bg-primary-container text-on-primary-container font-black' : 'bg-surface-container-low text-on-surface-variant'}`}
              >
                <Flame className="w-5 h-5 text-primary" />
                Skill registry
              </button>
            </div>

            <div className="flex gap-2 pt-2 relative z-10 w-full justify-between items-center bg-transparent border-t border-outline-variant/20">
              <button
                onClick={() => { setActiveTab('settings'); setIsMobileNavOpen(false); }}
                className="text-xs font-bold text-on-surface-variant hover:text-primary"
              >
                ⚙️ Settings
              </button>
              <button
                onClick={() => { setActiveTab('support'); setIsMobileNavOpen(false); }}
                className="text-xs font-bold text-on-surface-variant hover:text-primary"
              >
                💌 Support Notebook
              </button>

              <button
                onClick={() => {
                  setNewGoalTitle(goal.title);
                  setNewGoalTargetHours(goal.targetHours);
                  setNewGoalCategory(goal.category);
                  setIsNewGoalModalOpen(true);
                  setIsMobileNavOpen(false);
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-bold"
              >
                + New Goal
              </button>
            </div>
          </div>
        )}

        {/* Dynamic central canvas layout wrapper */}
        <div className="flex-1 md:ml-72 min-h-screen pt-4 sm:pt-6 bg-transparent" id="main-canvas-area">
          {activeTab === 'dashboard' && (
            <DashboardView 
              userProfile={userProfile}
              onUpdateUserProfile={handleUpdateUserProfile}
              goal={goal}
              onUpdateGoal={handleUpdateGoal}
              projects={projects}
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              skills={skills}
              onToggleTask={handleToggleTask}
              onAddTaskClick={() => setActiveTab('tasks')}
              onStartFocusSession={() => setIsFocusSessionOpen(true)}
              onNavigateToTab={setActiveTab}
              onQuickLogHours={handleLogHours}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView 
              projects={projects}
              onAddProject={(p) => setProjects((prev) => [p, ...prev])}
              onUpdateProjectProgress={(id, percentage) => 
                setProjects((prev) => prev.map((p) => p.id === id ? { ...p, percentage } : p))
              }
              onDeleteProject={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
              projectIdeas={projectIdeas}
              onAddIdea={(newIdea) => setProjectIdeas((prev) => [newIdea, ...prev])}
              onDeleteIdea={(id) => setProjectIdeas((prev) => prev.filter((i) => i.id !== id))}
              skills={skills}
              onQuickLogHours={handleLogHours}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={(t) => setTasks((prev) => [t, ...prev])}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView 
              tasks={tasks}
              projects={projects}
              onToggleTask={handleToggleTask}
              onAddTask={(t) => setTasks((prev) => [t, ...prev])}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsView 
              skills={skills}
              onAddSkill={(s) => setSkills((prev) => [s, ...prev])}
              onLogSkillHours={(id, hrs) => handleLogHours('skill', id, hrs)}
              onAddSkillLog={handleAddSkillLog}
              onDeleteSkill={handleDeleteSkill}
              onDeleteSkillLog={handleDeleteSkillLog}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              userProfile={userProfile}
              onUpdateUserProfile={handleUpdateUserProfile}
              goal={goal}
              onUpdateGoal={handleUpdateGoal}
              onResetApp={handleResetData}
            />
          )}

          {activeTab === 'support' && (
            <SupportView />
          )}
        </div>

      </div>

      {/* Focus Session Pomodoro countdown modal */}
      <FocusSession 
        isOpen={isFocusSessionOpen}
        onClose={() => setIsFocusSessionOpen(false)}
        projects={projects}
        skills={skills}
        onLogHours={handleLogHours}
      />

      {/* Customizable "New Goal" Overlay popup dialog modal */}
      {isNewGoalModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full shadow-2xl overflow-hidden relative border border-primary-container p-6 animate-in fade-in zoom-in-95">
            <div className="absolute inset-0 paper-grain pointer-events-none opacity-4"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-display font-black text-base text-primary">Customize Weekly Focus Goal</h3>
              <button
                onClick={() => setIsNewGoalModalOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Scope Tag / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Learning Focus, Career Shift Goal"
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Goal / Action Objective Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mastering Reactive Patterns"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Required Focus Target Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={newGoalTargetHours}
                  onChange={(e) => setNewGoalTargetHours(Number(e.target.value))}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewGoalModalOpen(false)}
                  className="px-5 py-2 bg-surface-container text-on-surface-variant rounded-full text-xs font-bold hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary rounded-full text-xs font-bold hover:brightness-97 shadow-md"
                >
                  Apply Goal Focus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
