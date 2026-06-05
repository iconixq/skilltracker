import React from 'react';
import { Settings, User, Clock, Star, RefreshCw } from 'lucide-react';
import { Goal, UserProfile } from '../types';

interface SettingsViewProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (updated: UserProfile) => void;
  goal: Goal;
  onUpdateGoal: (updated: Goal) => void;
  onResetApp: () => void;
}

export default function SettingsView({
  userProfile,
  onUpdateUserProfile,
  goal,
  onUpdateGoal,
  onResetApp,
}: SettingsViewProps) {
  const [showCustomAvatarInput, setShowCustomAvatarInput] = React.useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = React.useState('');

  const handleProfileFieldChange = (field: keyof UserProfile, value: any) => {
    onUpdateUserProfile({
      ...userProfile,
      [field]: value
    });
  };

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

  const handleTargetHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = Math.max(1, Number(e.target.value) || 15);
    onUpdateGoal({
      ...goal,
      targetHours: hours
    });
  };

  const handleGoalTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateGoal({
      ...goal,
      title: e.target.value || 'Mastering Reactive Patterns'
    });
  };

  const handleGoalCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateGoal({
      ...goal,
      category: e.target.value || 'Weekly Learning Focus'
    });
  };

  return (
    <div className="px-6 lg:px-12 pb-12 w-full max-w-2xl mx-auto space-y-8">
      {/* Settings Title */}
      <div className="py-4">
        <h2 className="font-display text-2xl lg:text-3xl font-black text-primary tracking-tight">
          System Customization Options
        </h2>
        <p className="text-xs text-on-surface-variant font-bold mt-1">
          Configure profile metrics, goals headers, and threshold counters
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="soft-card p-6 rounded-lg bg-white/80 border border-outline-variant/10 space-y-4">
          <div className="flex items-center gap-2 text-primary font-display font-bold">
            <User className="w-5 h-5" />
            <h3>Personal Profile Customization</h3>
          </div>
          
          <div className="space-y-4 font-sans">
            <div className="flex flex-col sm:flex-row gap-4 items-center p-3.5 bg-primary-container/10 rounded-xl border border-primary-container/20">
              <img src={userProfile.avatarUrl} alt="Your profile avatar selection preview" className="w-16 h-16 rounded-full object-cover border-2 border-primary p-0.5 bg-white shadow-xs" />
              <div className="text-center sm:text-left min-w-0 flex-1">
                <p className="text-sm font-black text-primary truncate">{userProfile.name}</p>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Level {userProfile.level} • {userProfile.title}</p>
                <p className="text-[11px] text-on-surface-variant/80 font-semibold mt-1 italic leading-relaxed line-clamp-2">"{userProfile.bio}"</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Customize Nickname
                </label>
                <input
                  type="text"
                  required
                  value={userProfile.name}
                  onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Current Level Number
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={userProfile.level}
                  onChange={(e) => handleProfileFieldChange('level', Math.max(1, Number(e.target.value) || 1))}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Professional Title / Scope Tracker
              </label>
              <input
                type="text"
                required
                value={userProfile.title}
                onChange={(e) => handleProfileFieldChange('title', e.target.value)}
                placeholder="e.g. Fullstack Developer Apprentice"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Objective Motto / Brief Bio
              </label>
              <textarea
                rows={2}
                value={userProfile.bio}
                onChange={(e) => handleProfileFieldChange('bio', e.target.value)}
                placeholder="Express your focus goal mantra..."
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none resize-none placeholder-on-surface-variant/40 text-on-surface"
              />
            </div>

            {/* Avatar Preset section */}
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2">
                Choose Character Style (Presets)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {presetAvatars.map((preset) => {
                  const isSelected = userProfile.avatarUrl === preset.url;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        handleProfileFieldChange('avatarUrl', preset.url);
                        setShowCustomAvatarInput(false);
                      }}
                      className={`p-1 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden flex items-center justify-center ${
                        isSelected ? 'border-primary bg-primary/5 scale-102 shadow-xs' : 'border-outline-variant/20 hover:border-primary/50'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-10 h-10 rounded-lg object-cover" />
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-2 mb-1">
                <button
                  type="button"
                  onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                  className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                >
                  {showCustomAvatarInput ? '← Hide Direct Link Option' : '→ Provide Direct Image Link URL Instead'}
                </button>
              </div>

              {showCustomAvatarInput && (
                <div className="space-y-1 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 animate-in fade-in slide-in-from-top-1 mb-2">
                  <label className="block text-[9px] font-black text-on-surface-variant uppercase tracking-wide">
                    Paste Image Link URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customAvatarUrl}
                      onChange={(e) => {
                        setCustomAvatarUrl(e.target.value);
                        if (e.target.value) {
                          handleProfileFieldChange('avatarUrl', e.target.value);
                        }
                      }}
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      className="flex-1 bg-white border border-outline-variant/40 rounded-full px-4 py-1.5 text-xs text-on-surface focus:ring-2 focus:ring-primary/45 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customAvatarUrl) {
                          handleProfileFieldChange('avatarUrl', customAvatarUrl);
                        }
                      }}
                      className="px-3.5 py-1.5 bg-primary text-white text-[10px] font-bold rounded-full hover:brightness-95 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Focus Target Card */}
        <div className="soft-card p-6 rounded-lg bg-white/80 border border-outline-variant/10 space-y-4">
          <div className="flex items-center gap-2 text-secondary font-display font-bold">
            <Clock className="w-5 h-5" />
            <h3>Weekly Targets & Categories</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Objective Title
              </label>
              <input
                type="text"
                value={goal.title}
                onChange={handleGoalTitleChange}
                placeholder="e.g. Mastering Reactive Patterns"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Weekly Target (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={goal.targetHours}
                onChange={handleTargetHoursChange}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Objective Subtitle / Scope Tag
            </label>
            <input
              type="text"
              value={goal.category}
              onChange={handleGoalCategoryChange}
              placeholder="e.g. Weekly Learning Focus"
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
            />
          </div>
        </div>

        {/* Danger zone resetting */}
        <div className="soft-card p-6 rounded-lg bg-red-50/50 border border-red-200 space-y-4">
          <div className="flex items-center gap-2 text-red-700 font-display font-bold">
            <RefreshCw className="w-5 h-5" />
            <h3>Maintenance & Core Clear</h3>
          </div>
          
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Resetting clears your custom learning tracks, task ticks, active projects, and restores standard default indicators. This cannot be undone.
          </p>

          <button
            onClick={() => {
              if (window.confirm("Restore default state structures now?")) {
                onResetApp();
              }
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto"
          >
            Reset Systems Data
          </button>
        </div>

      </div>
    </div>
  );
}
