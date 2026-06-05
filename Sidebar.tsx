import React from 'react';
import { 
  Dribbble, 
  FolderGit2, 
  CheckSquare, 
  Flame, 
  Settings, 
  PlusCircle, 
  Compass, 
  HeartHandshake, 
  LogOut 
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewGoalClick: () => void;
  pendingTasksCount: number;
  userProfile: UserProfile;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onNewGoalClick,
  pendingTasksCount,
  userProfile,
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined 
    },
    { id: 'skills', label: 'Skills', icon: Flame },
  ];

  return (
    <aside 
      className="hidden md:flex h-screen w-72 rounded-r-lg fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container-lowest shadow-[8px_0_24px_rgba(120,85,94,0.1)] flex-col py-10 justify-between z-40"
      id="sidebar-container"
    >
      <div className="space-y-8 flex-1 flex flex-col">
        {/* Brand/User profile profile */}
        <div className="px-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden border border-primary-container flex-shrink-0">
            <img 
              alt="User profile avatar" 
              className="w-8 h-8 rounded-full object-cover" 
              src={userProfile.avatarUrl}
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-base font-bold text-primary truncate" title={userProfile.name}>{userProfile.name}</h1>
            <p className="font-sans text-[10px] font-bold text-on-surface-variant/70 tracking-wide uppercase truncate" title={`Level ${userProfile.level} - ${userProfile.title}`}>
              LVL {userProfile.level} • {userProfile.title}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5" id="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between gap-4 px-6 py-4 rounded-full transition-all duration-300 group text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-black scale-102 shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant/40 hover:text-primary'
                }`}
                id={`nav-${item.id}`}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-on-primary-container fill-primary-container/20' : 'text-on-surface-variant/80'
                    }`} 
                  />
                  <span className="font-sans font-bold text-sm tracking-wide">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-primary hover:bg-primary-hover text-white text-[11px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Call to action "New Goal" */}
        <div className="px-6 py-2">
          <button
            onClick={onNewGoalClick}
            className="w-full bg-primary hover:bg-primary/95 text-on-primary font-sans font-bold text-[14px] py-4 rounded-full flex items-center justify-center gap-2 hover:scale-103 transition-transform shadow-md active:scale-97 cursor-pointer"
            id="sidebar-new-goal-btn"
          >
            <PlusCircle className="w-5 h-5" />
            New Goal
          </button>
        </div>
      </div>

      {/* Footer Settings Links */}
      <div className="px-4 pt-4 border-t border-outline-variant/30 space-y-1">
        <button
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center gap-4 px-6 py-3 rounded-full transition-all text-left text-on-surface-variant hover:text-primary ${
            activeTab === 'settings' ? 'bg-surface-variant/40 text-primary font-bold' : ''
          }`}
          id="nav-settings"
        >
          <Settings className="w-4 h-4" />
          <span className="font-sans text-xs font-bold tracking-wide">Settings</span>
        </button>

        <button
          onClick={() => onTabChange('support')}
          className={`w-full flex items-center gap-4 px-6 py-3 rounded-full transition-all text-left text-on-surface-variant hover:text-primary ${
            activeTab === 'support' ? 'bg-surface-variant/40 text-primary font-bold' : ''
          }`}
          id="nav-support"
        >
          <HeartHandshake className="w-4 h-4" />
          <span className="font-sans text-xs font-bold tracking-wide">Support</span>
        </button>
      </div>

      {/* 
        =======================================================================
        GOOGLE ADSENSE - SIDEBAR ACCENT BANNER (PASTE YOUR UNIT JSX HERE)
        Replace the placeholder contents below with your actual AdSense element tag.
        =======================================================================
      */}
      <div className="px-5 mt-4" id="adsense-sidebar-placement">
        <div className="p-3.5 rounded-2xl bg-primary-container/5 border border-dashed border-primary-container/20 flex flex-col items-center justify-center text-center select-none">
          <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-primary/40 mb-1.5">
            SUPPORT SKILLTRACKER
          </span>
          <div className="w-full min-h-[110px] flex items-center justify-center bg-white/65 rounded-xl overflow-hidden border border-outline-variant/10">
            
            {/* 
              When pasting your code, replace the placeholder below.
              You will need to use JSX-compatible syntax (attributes camelCased, style objects rather than strings).
              E.g:
              <ins className="adsbygoogle"
                   style={{ display: 'block', minHeight: '110px' }}
                   data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                   data-ad-slot="YYYYYYYYYY"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            */}

            <div className="p-3 text-[10px] font-sans text-on-surface-variant leading-relaxed">
              <span className="font-semibold text-primary block mb-1">Google AdSense Area</span>
              <span className="text-[9px] opacity-80 block">Insert your <strong>&lt;ins&gt;</strong> tag here to activate live advertising payouts.</span>
            </div>
            
          </div>
        </div>
      </div>
    </aside>
  );
}
