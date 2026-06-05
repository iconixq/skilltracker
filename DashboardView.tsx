import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Bell, 
  Brain, 
  Sparkles, 
  FolderGit2, 
  CheckSquare, 
  PenTool, 
  MoreHorizontal, 
  Terminal, 
  Wrench, 
  Layers, 
  Rocket, 
  Heart, 
  Plus, 
  ChevronRight,
  TrendingUp,
  UserCheck,
  User,
  X,
  Palette
} from 'lucide-react';
import { Task, Project, Skill, Goal, UserProfile } from '../types';

export const THEME_OPTIONS = [
  { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-50/95 border-indigo-250 text-indigo-950', ring: 'ring-indigo-500', text: 'text-indigo-900', bubbleBg: 'bg-indigo-500 hover:bg-indigo-600' },
  { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-50/95 border-emerald-250 text-emerald-950', ring: 'ring-emerald-500', text: 'text-emerald-900', bubbleBg: 'bg-emerald-500 hover:bg-emerald-600' },
  { id: 'rose', name: 'Rose', bg: 'bg-rose-50/95 border-rose-250 text-rose-950', ring: 'ring-rose-500', text: 'text-rose-900', bubbleBg: 'bg-rose-500 hover:bg-rose-600' },
  { id: 'amber', name: 'Amber', bg: 'bg-amber-50/95 border-amber-250 text-amber-950', ring: 'ring-amber-500', text: 'text-amber-900', bubbleBg: 'bg-amber-500 hover:bg-amber-600' },
  { id: 'violet', name: 'Violet', bg: 'bg-purple-50/95 border-purple-250 text-purple-950', ring: 'ring-purple-500', text: 'text-purple-900', bubbleBg: 'bg-purple-500 hover:bg-purple-600' },
  { id: 'cyan', name: 'Cyan', bg: 'bg-cyan-50/95 border-cyan-250 text-cyan-950', ring: 'ring-cyan-500', text: 'text-cyan-900', bubbleBg: 'bg-cyan-500 hover:bg-cyan-600' },
];

interface DashboardViewProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (profile: UserProfile) => void;
  goal: Goal;
  onUpdateGoal: (goal: Goal) => void;
  projects: Project[];
  tasks: Task[];
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  skills: Skill[];
  onToggleTask: (taskId: string) => void;
  onAddTaskClick: () => void;
  onStartFocusSession: () => void;
  onNavigateToTab: (tab: string) => void;
  onQuickLogHours: (categoryType: 'project' | 'skill', id: string, hours: number) => void;
}

export default function DashboardView({
  userProfile,
  onUpdateUserProfile,
  goal,
  onUpdateGoal,
  projects,
  tasks,
  onUpdateTask,
  skills,
  onToggleTask,
  onAddTaskClick,
  onStartFocusSession,
  onNavigateToTab,
  onQuickLogHours,
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  // Edit Goal modal states
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editGoalTitle, setEditGoalTitle] = useState(goal.title);
  const [editGoalCategory, setEditGoalCategory] = useState(goal.category || 'Weekly Learning Focus');
  const [editGoalTarget, setEditGoalTarget] = useState(goal.targetHours || 15);
  const [editGoalDedicated, setEditGoalDedicated] = useState(goal.dedicatedHours || 0);

  // Task inline theme color picker state
  const [activeColorPickerTaskId, setActiveColorPickerTaskId] = useState<string | null>(null);

  // Sync edits if goal changes externally
  React.useEffect(() => {
    setEditGoalTitle(goal.title);
    setEditGoalCategory(goal.category || 'Weekly Learning Focus');
    setEditGoalTarget(goal.targetHours || 15);
    setEditGoalDedicated(goal.dedicatedHours || 0);
  }, [goal]);

  // Edit Profile form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editTitle, setEditTitle] = useState(userProfile.title || 'Fullstack Apprentice');
  const [editBio, setEditBio] = useState(userProfile.bio || '');
  const [editLevel, setEditLevel] = useState(userProfile.level || 4);
  const [editAvatar, setEditAvatar] = useState(userProfile.avatarUrl);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);

  const presetAvatars = [
    {
      name: 'Cute Purple Tabby Cat',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwMad1kI0T-hTX93GRk9nwHXMmNQENWjmzHtgiwDPiLw0_xOA1V_J-VggRrZOl1hHLmVwbzd4c3Q2gHx97zTlIM7TaLAOrzDuZy87WJjoES8Iq3jl4UDaExg0mrMtg_pp-NPyws2MMdgqNrxYEDkvr5OWtqAbZ_UhL5lsLp6FWR3H_2fzlG2zzNXnqZK3F2gYjj12efBg8hLaFIwyYdc5SAy_NstLKclQhhbp8pNj7OZ4e5a1VL6NOO7kTf1ilCuc4QM12pEhDn9k',
    },
    {
      name: 'Cybernetic Voyager',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg9Akv_cb_g8VnYk_YGVNF_XzgiUXZTlsqQgFppoK0w9aT-Ge2TMBNwpl8fMXIN9yu4Ou6JwLA9YkgScGiJfIthnjS2WtIMvhPULEQjqPJgMIX_5WbrzcpBrEkxh2uDCeDEz_8hSVjTLC2ZgSmVt50qr1Z3T8BBR4Dc60GtFtAhTo6hzf1cc39RLEUt5D8IaD5aUspnzBIqTWdr2C_2kEDXOpDqAekXh9INF4RHVHn0WTSkX9UziyvgOb4bUPi4occOf2dr6qMsv8',
    },
    {
      name: 'Tech Enthusiast (Unsplash)',
      url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    },
    {
      name: 'Pioneering Innovator (Unsplash)',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    {
      name: 'Visual Creative (Unsplash)',
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    },
    {
      name: 'Geometric Gradient (Unsplash)',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop',
    }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserProfile({
      name: editName.trim() || 'Alex',
      title: editTitle.trim() || 'Fullstack Apprentice',
      bio: editBio.trim() || 'Keep on learning!',
      avatarUrl: editAvatar,
      level: Number(editLevel) || 4,
    });
    setIsEditModalOpen(false);
  };

  // Sync edits if profile changes externally (e.g. settings restore default)
  React.useEffect(() => {
    setEditName(userProfile.name);
    setEditTitle(userProfile.title);
    setEditBio(userProfile.bio);
    setEditLevel(userProfile.level);
    setEditAvatar(userProfile.avatarUrl);
  }, [userProfile]);

  // Filter tasks & projects by search
  const filteredTasks = tasks.filter(task => 
    task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projects.filter(proj => 
    proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proj.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Goal Progress Math
  const goalProgress = Math.min(100, Math.round((goal.dedicatedHours / goal.targetHours) * 100));

  // Dynamic message based on progress
  const getProgressMessage = () => {
    if (goalProgress >= 100) return "Incredible! You've crushed your learning goal for this week! 🏆";
    const remaining = goal.targetHours - goal.dedicatedHours;
    return `You've dedicated ${goal.dedicatedHours} hours this week. Keep going, you're only ${remaining} hours away from your goal! 🚀`;
  };

  // Helper to render dynamic Lucide icons for projects
  const renderProjectIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'brain':
      case 'neurology':
        return <Brain className="w-5 h-5 text-secondary" />;
      case 'pentool':
      case 'edit_note':
        return <PenTool className="w-5 h-5 text-tertiary" />;
      default:
        return <FolderGit2 className="w-5 h-5 text-primary" />;
    }
  };

  // Helper to render skill circular progress ring
  const renderSkillRing = (skill: Skill, index: number) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    // Mastered percent
    const offset = circumference - (skill.percentage / 100) * circumference;

    const mainColorClass = index % 2 === 0 ? 'text-primary' : 'text-secondary';
    const isOdd = index % 2 !== 0;

    return (
      <div key={skill.id} className="flex flex-col items-center gap-4 bg-white/40 p-4 rounded-lg border border-outline-variant/10">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle 
              className="text-surface-container stroke-currentfill-none" 
              cx="48" 
              cy="48" 
              r={radius} 
              fill="transparent" 
              strokeWidth="6"
            />
            {/* Foreground circle */}
            <circle 
              className={`${mainColorClass} progress-ring-circle stroke-current`} 
              cx="48" 
              cy="48" 
              r={radius} 
              fill="transparent" 
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isOdd ? (
              <Wrench className="w-6 h-6 text-secondary" />
            ) : (
              <Terminal className="w-6 h-6 text-primary" />
            )}
          </div>
        </div>
        <div className="text-center">
          <p className="font-sans font-bold text-sm text-on-surface">{skill.name}</p>
          <span className="font-sans text-xs text-on-surface-variant font-bold">{skill.percentage}% Mastered</span>
        </div>
        {/* Short inline action */}
        <button
          onClick={() => onQuickLogHours('skill', skill.id, 1)}
          className="text-[10px] px-2.5 py-1 bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container rounded-full transition-colors font-bold mt-1"
        >
          +1 Hr Study
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar AppBar */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center px-6 lg:px-12 py-6 w-full max-w-7xl mx-auto gap-6 border-b border-surface-variant/20">
        
        {/* Dynamic User Banner - Click-to-edit trigger */}
        <div className="flex items-center gap-4 group">
          <div 
            onClick={() => setIsEditModalOpen(true)}
            className="w-14 h-14 rounded-full border-2 border-primary p-0.5 select-none hover:scale-105 active:scale-95 transition-all cursor-pointer relative flex-shrink-0 shadow-sm"
            title="Update Profile Fields"
          >
            <img 
              alt="User dynamic profile avatar" 
              className="w-full h-full rounded-full object-cover" 
              src={userProfile.avatarUrl}
            />
            <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <PenTool className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h2 className="font-display text-2xl lg:text-3xl font-black text-primary tracking-tight">
                Good Morning, {userProfile.name}! ✨
              </h2>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="text-[10px] px-2.5 py-1 bg-primary-container text-on-primary-container hover:brightness-95 rounded-full transition-all font-sans font-extrabold flex items-center gap-1 cursor-pointer self-center"
                id="dashboard-edit-profile-action-btn"
              >
                <PenTool className="w-3 h-3" />
                Edit Profile
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
              <span className="text-[10px] font-black tracking-widest text-[#5e17eb] bg-primary-container-high/40 px-2 py-0.5 rounded uppercase font-mono">
                LVL {userProfile.level} • {userProfile.title}
              </span>
              <span className="text-xs text-on-surface-variant/85 font-semibold max-w-md line-clamp-1 italic">
                "{userProfile.bio}"
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
          <div className="relative flex-1 sm:flex-initial">
            <input 
              className="bg-white/75 backdrop-blur border-none rounded-full px-6 py-2.5 pr-10 w-full sm:w-64 focus:ring-2 focus:ring-primary-container text-xs transition-all shadow-inner placeholder-on-surface-variant/50 focus:outline-none" 
              placeholder="Filter goals and keys..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          </div>

          <div className="flex items-center gap-2">
            {/* Notification button */}
            <button 
              onClick={() => setShowNotificationBadge(false)}
              className="p-2 bg-white/75 hover:bg-primary-container/20 rounded-full transition-all relative cursor-pointer"
            >
              <Bell className="w-4 h-4 text-on-surface-variant" />
              {showNotificationBadge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border border-background"></span>
              )}
            </button>

            {/* Favorite emoji heart sticker */}
            <button className="p-2 bg-white/75 hover:bg-primary-container/20 rounded-full transition-all text-rose-300 hover:text-rose-500">
              <Heart className="w-4 h-4 fill-current" />
            </button>

            {/* Quick click profile shortcut */}
            <div 
              onClick={() => setIsEditModalOpen(true)}
              className="w-10 h-10 rounded-full border-2 border-primary-container p-0.5 ml-1 select-none hover:scale-105 active:scale-95 transition-transform cursor-pointer overflow-hidden flex-shrink-0"
              title="Fast Profile Editor"
            >
              <img 
                alt="User profile background sticker avatar" 
                className="w-full h-full rounded-full object-cover" 
                src={userProfile.avatarUrl}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content Column Canvas */}
      <div className="px-6 lg:px-12 pb-12 w-full max-w-7xl mx-auto space-y-10">
        
        {/* Weekly Focus Hero Summary Card */}
        <section 
          className="soft-card p-6 lg:p-10 rounded-xl relative overflow-hidden bg-gradient-to-br from-primary-container/30 to-tertiary-container/20 border-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6"
          id="focus-carousel-dashboard"
        >
          {/* Whimsical design accents */}
          <div className="absolute -right-8 -top-8 opacity-10 transform rotate-12 pointer-events-none">
            <Sparkles className="w-48 h-48 text-primary" />
          </div>

          <div className="space-y-4 max-w-xl z-10 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-sans text-xs font-bold leading-normal">
                {goal.category || 'Weekly Learning Focus'}
              </span>
              <button 
                type="button"
                onClick={() => {
                  setEditGoalCategory(goal.category || 'Weekly Learning Focus');
                  setEditGoalTitle(goal.title);
                  setEditGoalTarget(goal.targetHours || 15);
                  setEditGoalDedicated(goal.dedicatedHours || 0);
                  setIsGoalModalOpen(true);
                }}
                className="p-1 px-2.5 rounded-full bg-white/80 text-primary hover:bg-primary/10 transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer border border-outline-variant/10 shadow-xs"
                title="Edit Focus Goal"
                id="edit-goal-dashboard-btn"
              >
                <PenTool className="w-3 h-3" />
                Edit Goal
              </button>
            </div>
            <h3 className="font-display font-bold text-2xl lg:text-3xl text-primary leading-tight">
              {goal.title || 'Mastering Reactive Patterns'}
            </h3>
            <p className="font-sans text-sm lg:text-base text-on-primary-container font-medium leading-relaxed">
              {getProgressMessage()}
            </p>

            <div className="pt-2">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-primary">Progress Target</span>
                <span className="font-display font-extrabold text-lg text-primary">{goalProgress}%</span>
              </div>
              <div className="h-3 bg-white/60 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Render 3D Abstract sphere shape from static URL */}
          <div className="hidden lg:flex items-center justify-center pointer-events-none z-10 select-none">
            <img 
              alt="Decorative 3D abstract sphere in pastel soft clay style" 
              className="w-40 h-40 opacity-90 animate-pulse" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZY9d7cawg09_u3LhIryhVIT_19-teZNx8R6tdOmIHDCfDuuVIk5_u1c1wcNyY0dAPei6TtkiuoPQ9GmS0Cjy9RwMDs5NQp3HAbeut_EP5zUZ-iHExssLy8DUMnBfV-r2jnzXg0ioD_L4li1K5GqSxRW92OjiZMIeICTa0QxcbY1JYRnOwtwyMZIm8ZsRZPFDa19jQNUhopIWD0POI4fuK9GX09lyRVkIKmuePhT8c4DA7vGyaIqwRCmN9xjZN9n9T-7BijXqmMgg"
              style={{ animationDuration: '6s' }}
            />
          </div>
        </section>

        {/* Bento Board Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Projects (Bento-style Cards Left column) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex justify-between items-center bg-transparent">
              <div>
                <h3 className="font-display font-bold text-xl text-on-surface">Active Projects</h3>
                <p className="text-xs text-on-surface-variant/80 font-bold">Track milestone completion ratios</p>
              </div>
              <button 
                onClick={() => onNavigateToTab('projects')}
                className="text-primary hover:text-primary/80 font-sans text-xs font-bold flex items-center gap-1 cursor-pointer bg-white/65 py-1.5 px-3 rounded-full shadow-xs"
              >
                View All
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="soft-card p-8 rounded-lg text-center text-on-surface-variant">
                <FolderGit2 className="w-12 h-12 text-outline/35 mx-auto mb-2" />
                <p className="text-sm font-bold">No active projects matching filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.slice(0, 2).map((project) => (
                  <div key={project.id} className="soft-card p-6 rounded-lg group hover:scale-[1.01] transition-transform relative overflow-hidden bg-white/70">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-secondary-container/60 text-secondary rounded-lg">
                        {renderProjectIcon(project.icon)}
                      </div>
                      <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[11px] font-extrabold rounded-full tracking-wide">
                        {project.dueDateStr}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-base text-on-surface mb-2 group-hover:text-primary transition-colors">
                      {project.name}
                    </h4>
                    <p className="text-on-surface-variant text-xs line-clamp-2 leading-relaxed mb-6">
                      {project.description}
                    </p>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-on-surface-variant/80 uppercase tracking-wider text-[10px]">Architecture phase</span>
                        <span className="text-on-surface">{project.percentage}%</span>
                      </div>
                      <div className="h-2 bg-surface-container rounded-full overflow-hidden p-0.5">
                        <div 
                          className="h-full bg-secondary rounded-full transition-all duration-300" 
                          style={{ width: `${project.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      {/* Avatar Stack from HTML Mock with real picture hotlinks */}
                      <div className="flex -space-x-2">
                        <img 
                          alt="Team member 1" 
                          className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB_u7copmlhkFV3frecPYgEmuYzsCfmvV9VuH_h8YAE8a9Saj_OWgXk4Rrb_8Xy6-UNW5DoXl9Bdyy5FQb6BNcQTDXwreI3_zEwmINEoJlH25ovfWZ55FyMIR1Jv-4Wqg7rec8WBgU1kAIIvQWE9zB-rB8zyCinVBnZD0Be6KJDPQd7bGjwfbfF2H6BbdJ_4eCStyOLaYpQQnElEEk2CoEAaw7wMbGI5nk-t1m_WU93e8ZzIwitD5zcSsWtknCeL6Ecj7Gj1INhR8"
                        />
                        <img 
                          alt="Team member 2" 
                          className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3Cx4J-h-A0pxyOVrPW_pkKfmP8YAw26hU26IwVCcnpljk0q2mKeoSufiC5rTgkOJRen2Y10DKtYiwXUBtanpDfNSuIOtKUbyYP8O5yEtWfJVtP2e4fmTtsW5zGGopg7JMEErhvwR7_rJ3vVXiLY207U5rqar_nBgPx_MwUpJmSN5FPc5s7eGLJ0BCLGnu-1QSvFAuNK8tnV7aXMjbhoJW8N2oZlcN2zRr08Ae8MfZDeJvlkI1naoZaNJeEZytbqSNDZpT4Hod2kU"
                        />
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-extrabold border-2 border-white text-on-primary-fixed">
                          +{project.teamCount || 3}
                        </div>
                      </div>

                      {/* Log study progress */}
                      <button
                        onClick={() => onQuickLogHours('project', project.id, 5)}
                        className="text-[10px] px-3 py-1 bg-secondary-container text-on-secondary-container hover:brightness-95 rounded-full transition-all font-bold cursor-pointer"
                        id={`quick-log-${project.id}`}
                      >
                        +5% Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Today's Tasks Component Area */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-xl text-on-surface">Today's Top Tasks</h3>
                  <p className="text-xs text-on-surface-variant/80 font-bold">Tick progress off to update systems</p>
                </div>
                <button 
                  onClick={onAddTaskClick}
                  className="p-2 bg-white/75 hover:bg-primary-container/20 rounded-full transition-colors flex items-center justify-center border border-outline-variant/10 shadow-xs cursor-pointer"
                  title="Add Task"
                  id="add-task-quick"
                >
                  <Plus className="w-5 h-5 text-primary" />
                </button>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="soft-card p-8 rounded-lg text-center text-on-surface-variant">
                  <CheckSquare className="w-12 h-12 text-outline/35 mx-auto mb-2" />
                  <p className="text-sm font-bold">Checklist clear! Tap the '+' button to add today's tasks.</p>
                </div>
              ) : (
                <div className="space-y-3" id="tasks-checklist-box">
                  {filteredTasks.slice(0, 4).map((task) => {
                    const customTheme = THEME_OPTIONS.find(o => o.id === task.theme) || THEME_OPTIONS[0];
                    return (
                      <div 
                        key={task.id} 
                        className={`soft-card p-4 rounded-lg flex items-center justify-between gap-4 group select-none hover:translate-x-1 transition-all border ${customTheme.bg}`}
                      >
                        <label className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer">
                          <input 
                            className="custom-checkbox w-6 h-6 rounded-full border-2 border-primary-container text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer" 
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onToggleTask(task.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs sm:text-sm lg:text-base font-bold transition-colors truncate ${task.completed ? 'line-through opacity-50 text-on-surface-variant/70' : 'text-on-surface'}`}>
                              {task.text}
                            </p>
                            <span className="text-[10px] sm:text-[11px] font-bold text-on-surface-variant/70 tracking-wide uppercase block">
                              {task.project}
                            </span>
                          </div>
                        </label>
                        
                        {/* Theme option picker and Priority Tag */}
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 relative">
                          {/* Palette popup button */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveColorPickerTaskId(activeColorPickerTaskId === task.id ? null : task.id);
                              }}
                              className="p-1 sm:p-1.5 rounded-full bg-white/85 hover:bg-white text-on-surface-variant hover:text-primary transition-all flex items-center justify-center cursor-pointer border border-on-surface-variant/10 shadow-xs"
                              title="Customize Task Theme"
                            >
                              <Palette className="w-3.5 h-3.5" />
                            </button>

                            {activeColorPickerTaskId === task.id && (
                              <div className="absolute right-0 bottom-8 z-30 bg-white p-2 rounded-xl shadow-xl border border-outline-variant/20 flex gap-1 animate-in fade-in slide-in-from-bottom-2">
                                {THEME_OPTIONS.map((themeOpt) => (
                                  <button
                                    key={themeOpt.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      onUpdateTask?.(task.id, { theme: themeOpt.id });
                                      setActiveColorPickerTaskId(null);
                                    }}
                                    className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full ${themeOpt.bubbleBg} cursor-pointer hover:scale-110 active:scale-95 transition-transform flex items-center justify-center text-white text-[10px] font-bold leading-none`}
                                    title={themeOpt.name}
                                  >
                                    {task.theme === themeOpt.id || (!task.theme && themeOpt.id === 'indigo') ? '✓' : ''}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-wider sm:tracking-widest uppercase ${
                            task.priority === 'HIGH' 
                              ? 'bg-red-100 text-red-700' 
                              : task.priority === 'MED' 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar columns widget column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Skills in Progress */}
            <div className="soft-card p-6 lg:p-8 rounded-lg bg-white/75 flex flex-col justify-between">
              <h3 className="font-display font-bold text-lg text-on-surface mb-6">Skills in Progress</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {skills.slice(0, 2).map((skill, index) => renderSkillRing(skill, index))}
              </div>

              {/* System design status levels */}
              <div className="mt-8 pt-6 border-t border-outline-variant/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-sans font-bold text-sm text-on-surface">System Design</h4>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wide">Infrastructure Core</p>
                  </div>
                  <span className="font-display font-extrabold text-xs text-tertiary bg-tertiary-container/30 px-3 py-1 rounded-full border border-tertiary-container/40">
                    LVL 4
                  </span>
                </div>
                <div className="h-3.5 bg-surface-container rounded-full overflow-hidden p-0.5 mb-5">
                  <div className="h-full bg-tertiary w-[55%] rounded-full shadow-xs" />
                </div>
                
                <button 
                  onClick={() => onNavigateToTab('skills')}
                  className="w-full py-3 bg-tertiary-container hover:bg-tertiary-container/90 text-on-tertiary-container rounded-full font-sans font-bold text-xs hover:brightness-98 transition-all tracking-wide cursor-pointer"
                  id="explore-paths-dashboard"
                >
                  Explore New Paths
                </button>
              </div>
            </div>

            {/* Daily inspiration & streak sticker wall */}
            <div className="soft-card p-6 rounded-lg bg-surface-container-low/60 border border-white/50 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary-fixed-dim" />
                <h4 className="font-display font-bold text-sm text-on-surface">Learning Streak</h4>
              </div>

              {/* Weekly visual day grid with bubble dots */}
              <div className="flex items-center justify-around gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                  const isCompleted = idx < 4; // M, T, W, T are completed in screenshot
                  return (
                    <div 
                      key={idx} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs select-none shadow-xs transition-all ${
                        isCompleted 
                          ? 'bg-primary text-on-primary font-black scale-105' 
                          : 'bg-surface-variant text-on-surface-variant/40 hover:scale-102'
                      }`}
                      title={isCompleted ? `${day} completed!` : `${day} incomplete`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Playful graphic display overlay card */}
              <div className="p-4 bg-white/40 rounded-lg flex items-center gap-4 border border-outline-variant/10">
                <div className="w-12 h-12 flex-shrink-0 relative overflow-hidden flex items-center justify-center select-none">
                  {/* Heart pixel art shape */}
                  <img 
                    alt="Pixel art sticker graphic" 
                    className="w-full h-full pixel-heart object-contain hover:scale-110 transition-transform cursor-grab" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmExdHcKmFzr5zlXaEJTR0I34alCG6iGXj2zRuNRHmSdOK4VGQn_E5Q6yFT8ANINggdrWo___3-XzJ49BU6APY9xPdeAyKIM-HcZuTV3lXTn3sr3RE01GGscFBwCc__yOUl7jPycg6e7ZU_lEkmYgmyED2QBy55r7SVDoqNaxmUwPJwA1spA19og-HytoLeg_a85YvSoQBn7lsDRn58awFgLjEOwlwELL1aesMtMetSFh9YL-WpulTrTAcnvRJxKE_yNKKfkX9Nd8"
                  />
                </div>
                <blockquote className="text-xs italic text-on-surface-variant/90 leading-relaxed font-semibold">
                  "Comparison is the thief of joy. Focus on your 1% better every day."
                </blockquote>
              </div>
            </div>

            {/* Pomodoro quick session launcher */}
            <div 
              onClick={onStartFocusSession}
              className="p-6 rounded-lg bg-primary-container/20 border-2 border-dashed border-primary-container/60 text-center group cursor-pointer hover:bg-primary-container/30 transition-all select-none"
              id="cta-pomodoro-box"
            >
              <Rocket className="w-8 h-8 text-primary mx-auto mb-2 group-hover:rotate-12 group-hover:-translate-y-1 transition-transform" />
              <p className="font-display font-extrabold text-sm text-primary">Start a Focus Session</p>
              <p className="text-xs text-on-primary-container/80 font-bold mt-1">Sync with Pomodoro timer & log hours</p>
            </div>

          </div>

        </div>

        {/* 
          =======================================================================
          GOOGLE ADSENSE - HORIZONTAL FOOTER LEADERBOARD BANNER (JSX INJECTION SLOT)
          =======================================================================
        */}
        <div className="mt-8 max-w-5xl mx-auto px-4 sm:px-6 w-full" id="adsense-dashboard-footer-banner">
          <div className="p-4 rounded-xl bg-surface-variant/10 border border-dashed border-outline-variant/20 flex flex-col items-center justify-center select-none shadow-xs text-center">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#5e17eb]/50 mb-2">
              SPONSORED HIGHLIGHT
            </span>
            <div className="w-full min-h-[90px] flex items-center justify-center bg-white/70 rounded-lg overflow-hidden border border-on-surface-variant/5">
              
              {/* 
                Paste your block code below. Set responsive variables on the <ins> tag.
                E.g.
                <ins className="adsbygoogle"
                     style={{ display: 'block', minHeight: '90px' }}
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                     data-ad-slot="ZZZZZZZZZZ"
                     data-ad-format="horizontal"
                     data-full-width-responsive="true"></ins>
              */}

              <div className="p-4 text-[11px] font-sans text-on-surface-variant max-w-lg leading-relaxed">
                <span className="font-bold text-[#5e17eb] block text-xs mb-1">Interactive Banner Placement Card</span>
                Connect your Google publisher accounts to load high-yield display marketing banners here seamlessly. 
                <span className="text-[10px] opacity-75 block mt-0.5 font-mono text-[#5e17eb]/60">ID: adsense-dashboard-footer-banner</span>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Profile Editor overlay dialog modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl overflow-hidden relative border border-primary-container p-6 animate-in fade-in zoom-in-95">
            <div className="absolute inset-0 paper-grain pointer-events-none opacity-4"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-display font-black text-lg text-primary flex items-center gap-2">
                <User className="w-5 h-5 animate-pulse" />
                Customize Skill Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors"
                id="close-profile-editor-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 relative z-10 font-sans">
              
              {/* Main parameters in grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none placeholder-on-surface-variant/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Focus Level Index
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={editLevel}
                    onChange={(e) => setEditLevel(Number(e.target.value) || 1)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Professional Title / Goal Track
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Fullstack Developer Apprentice"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none placeholder-on-surface-variant/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Motto / Learning Bio
                </label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share your personal philosophy or active objective..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none resize-none placeholder-on-surface-variant/40"
                />
              </div>

              {/* Avatar choosing segment */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2.5">
                  Choose Your Character Style
                </label>
                
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-3">
                  {presetAvatars.map((preset) => {
                    const isSelected = editAvatar === preset.url;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setEditAvatar(preset.url);
                          setShowCustomAvatarInput(false);
                        }}
                        className={`p-1 rounded-xl border-2 transition-all relative group overflow-hidden cursor-pointer ${
                          isSelected ? 'border-primary bg-primary/5 scale-105 shadow-xs' : 'border-outline-variant/20 hover:border-primary/50'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-12 h-12 rounded-lg mx-auto object-cover" />
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>

                {/* Open/Close custom url input */}
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                    className="text-[11px] text-primary hover:underline font-bold cursor-pointer"
                  >
                    {showCustomAvatarInput ? '← Hide Custom URL Option' : '→ Use Direct Image Link URL Instead'}
                  </button>
                </div>

                {showCustomAvatarInput && (
                  <div className="space-y-2 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 mb-3 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider">
                      Paste Absolute Avatar Image Link URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customAvatarUrl}
                        onChange={(e) => {
                          setCustomAvatarUrl(e.target.value);
                          if (e.target.value) {
                            setEditAvatar(e.target.value);
                          }
                        }}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 bg-white border border-outline-variant/40 rounded-full px-4 py-1.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none text-on-surface"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customAvatarUrl) {
                            setEditAvatar(customAvatarUrl);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-primary text-white text-[11px] font-bold rounded-full hover:brightness-95 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Active visual preview display card */}
              <div className="p-3 bg-primary-container/10 rounded-xl border border-primary-container/20 flex items-center gap-3">
                <img src={editAvatar} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-primary p-0.5 bg-white" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black tracking-widest text-[#5e17eb] uppercase">Real-Time Profile Preview</p>
                  <p className="text-xs font-bold text-on-surface truncate">
                    {editName || 'Alex'} • LVL {editLevel} ({editTitle || 'Apprentice'})
                  </p>
                </div>
              </div>

              {/* Action operations buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-full text-xs font-bold text-on-surface transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary/95 text-white rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-primary/20"
                >
                  <UserCheck className="w-4 h-4" />
                  Save Profile
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal Overlay */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl overflow-hidden relative border border-primary-container p-6 animate-in fade-in zoom-in-95">
            <div className="absolute inset-0 paper-grain pointer-events-none opacity-4"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10 w-full">
              <h3 className="font-display font-black text-lg text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                Customize Learning Focus Goal
              </h3>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors"
                id="close-goal-editor-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateGoal({
                  title: editGoalTitle.trim() || 'Achieve Perfect Crumb & Rim Lighting',
                  category: editGoalCategory.trim() || 'Weekly Learning Focus',
                  targetHours: Number(editGoalTarget) || 15,
                  dedicatedHours: Number(editGoalDedicated) || 0,
                });
                setIsGoalModalOpen(false);
              }} 
              className="space-y-4 relative z-10 font-sans"
            >
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Goal Title / Focus Description
                </label>
                <input
                  type="text"
                  required
                  value={editGoalTitle}
                  onChange={(e) => setEditGoalTitle(e.target.value)}
                  placeholder="e.g. Mastering Modern React Design"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none placeholder-on-surface-variant/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Category Tag Name
                </label>
                <input
                  type="text"
                  required
                  value={editGoalCategory}
                  onChange={(e) => setEditGoalCategory(e.target.value)}
                  placeholder="e.g. Tech & Programming, Culinary Arts..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none placeholder-on-surface-variant/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Target Hours This Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    required
                    value={editGoalTarget}
                    onChange={(e) => setEditGoalTarget(Number(e.target.value) || 15)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Hours Already Dedicated
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="168"
                    required
                    value={editGoalDedicated}
                    onChange={(e) => setEditGoalDedicated(Number(e.target.value) || 0)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-full text-xs font-bold text-on-surface transition-all cursor-pointer"
                  id="cancel-goal-editor-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary/95 text-white rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-primary/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Save Focus Goal
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
