import React, { useState, useEffect } from 'react';
import { 
  Flame, Plus, Sparkles, Book, Clock, X, ChefHat, Camera, Dumbbell, 
  Code, Trash2, PenTool, ClipboardList, MessageSquare, PlusCircle, CheckCircle, Play
} from 'lucide-react';
import { Skill, SkillLog } from '../types';

interface SkillsViewProps {
  skills: Skill[];
  onAddSkill: (skill: Skill) => void;
  onLogSkillHours: (skillId: string, hours: number) => void;
  onAddSkillLog: (skillId: string, hours: number, remark: string, progressPercent: number) => void;
  onDeleteSkill: (skillId: string) => void;
  onDeleteSkillLog: (skillId: string, logId: string) => void;
}

export default function SkillsView({
  skills,
  onAddSkill,
  onLogSkillHours,
  onAddSkillLog,
  onDeleteSkill,
  onDeleteSkillLog,
}: SkillsViewProps) {
  // Modal toggle state for new skill creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Culinary Arts');
  const [iconName, setIconName] = useState('ChefHat');
  const [initialPercentage, setInitialPercentage] = useState(10);

  // Active selected skill for report analysis and remarks management
  const [activeSkillId, setActiveSkillId] = useState<string>(() => {
    return skills[0]?.id || '';
  });

  const activeSkill = skills.find(s => s.id === activeSkillId) || skills[0];

  // Forms state for compiling a learning/progress report
  const [reportHours, setReportHours] = useState(2);
  const [reportRemark, setReportRemark] = useState('');
  const [reportPercentage, setReportPercentage] = useState(50);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Synchronize report percentage & details when active skill changes
  const activeId = activeSkill?.id || '';
  const currentPercentage = activeSkill?.percentage || 0;

  useEffect(() => {
    if (activeSkill) {
      setReportPercentage(currentPercentage);
    }
  }, [activeId, currentPercentage]);

  const handleSubmitNewSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSkill: Skill = {
      id: `skill_${Date.now()}`,
      name: name.trim(),
      percentage: Number(initialPercentage) || 10,
      iconName,
      category,
      level: 1,
      hoursSpent: 0,
      logs: []
    };

    onAddSkill(newSkill);
    setActiveSkillId(newSkill.id);
    setIsModalOpen(false);

    // Reset fields
    setName('');
    setCategory('Culinary Arts');
    setIconName('ChefHat');
    setInitialPercentage(10);
  };

  const getLucideIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case 'chefhat':
        return <ChefHat className="w-5 h-5 text-primary" />;
      case 'camera':
        return <Camera className="w-5 h-5 text-secondary" />;
      case 'dumbbell':
        return <Dumbbell className="w-5 h-5 text-tertiary" />;
      case 'book':
        return <Book className="w-5 h-5 text-primary" />;
      case 'code':
        return <Code className="w-5 h-5 text-secondary" />;
      default:
        return <Flame className="w-5 h-5 text-primary" />;
    }
  };

  const totalHrs = skills.reduce((sum, s) => sum + (s.hoursSpent || 0), 0);

  // Submits a detailed remark entry / knowledge report for learning progress
  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSkill) return;

    onAddSkillLog(
      activeSkill.id, 
      Number(reportHours) || 0, 
      reportRemark.trim() || 'Accomplished learning objectives.', 
      Number(reportPercentage)
    );

    setSubmitSuccess(true);
    setReportRemark('');
    setReportHours(2);
    
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 2500);
  };

  const getDifficultyLevelLabel = (percentage: number) => {
    if (percentage < 30) return 'Initiating Fundamentals';
    if (percentage < 60) return 'Intermediate Competency';
    if (percentage < 85) return 'Advanced Applications';
    return 'Master/Architect';
  };

  return (
    <div className="px-4 md:px-12 pb-16 w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header and counter panel widgets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div>
          <h2 className="font-display text-2xl lg:text-3xl font-black text-primary tracking-tight">
            Versatile Skills Directory
          </h2>
          <p className="text-xs text-on-surface-variant font-bold mt-1">
            Catalogue your creative interests, log practice sessions, update mastery percentages, and write key learnings
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/95 text-on-primary font-sans font-bold text-xs px-5 py-3 rounded-full flex items-center gap-2 self-start cursor-pointer hover:scale-102 transition-transform active:scale-97 shadow-sm"
          id="add-new-skill-btn"
        >
          <Plus className="w-4 h-4" />
          Register New Skill
        </button>
      </div>

      {/* Stats Counter Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="soft-card p-5 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/15 text-primary">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-primary">Core Skills</h4>
            <p className="text-xs text-on-surface-variant font-bold">{skills.length} Skills Tracked</p>
          </div>
        </div>

        <div className="soft-card p-5 rounded-lg bg-secondary-container/20 border border-secondary-container/40 flex items-center gap-4">
          <div className="p-3 rounded-full bg-secondary/15 text-secondary">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-secondary">Invested Practice Time</h4>
            <p className="text-xs text-on-surface-variant font-bold">{totalHrs} Hours of Dedicated practice</p>
          </div>
        </div>

        <div className="soft-card p-5 rounded-lg bg-tertiary-container/15 border border-tertiary-container/30 flex items-center gap-4">
          <div className="p-3 rounded-full bg-tertiary/15 text-tertiary">
            <Book className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-on-tertiary-container">Target Focus</h4>
            <p className="text-xs text-on-surface-variant font-bold">1% daily skill acceleration</p>
          </div>
        </div>
      </div>

      {/* Modern Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Skill Selector Cards (takes 5 cols of 12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <h3 className="font-display font-extrabold text-sm text-primary uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Skillset Portfolio
            </h3>
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              {skills.length} Items
            </span>
          </div>

          {skills.length === 0 ? (
            <div className="soft-card p-8 rounded-lg bg-white/50 border border-dashed border-outline-variant/60 text-center space-y-3">
              <p className="text-xs text-on-surface-variant font-medium">No registered skills yet.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs bg-primary/10 hover:bg-primary/20 text-primary font-bold px-4 py-2 rounded-full cursor-pointer"
              >
                + Register First Skill
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
              {skills.map((skill) => {
                const isActive = activeSkill?.id === skill.id;
                return (
                  <div 
                    key={skill.id}
                    onClick={() => setActiveSkillId(skill.id)}
                    className={`soft-card p-4 rounded-lg bg-white transition-all flex items-center justify-between gap-3 border cursor-pointer select-none ${
                      isActive 
                        ? 'border-primary ring-2 ring-primary/20 shadow-md translate-x-1' 
                        : 'border-outline-variant/15 hover:border-primary/40 hover:bg-surface-container-lowest/40'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold tracking-wider uppercase text-on-surface-variant/80 bg-surface-container-low px-2 py-0.5 rounded">
                          {skill.category || 'Culinary Arts'}
                        </span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
                        )}
                      </div>
                      
                      <h4 className="font-display font-black text-sm text-on-surface truncate">
                        {skill.name}
                      </h4>

                      <div className="flex gap-2 items-center text-[10px] text-on-surface-variant font-bold">
                        <span className="text-primary">{skill.percentage}% Mastery</span>
                        <span>•</span>
                        <span>{skill.hoursSpent || 0} hrs logs</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Percent Visualizer */}
                      <div className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/20 flex items-center justify-center relative">
                        {getLucideIcon(skill.iconName)}
                        <div 
                          className="absolute inset-0 rounded-full border-2 border-primary"
                          style={{
                            clipPath: `polygon(50% 50%, 50% 0%, ${skill.percentage >= 25 ? '100% 0%,' : ''}${skill.percentage >= 50 ? '100% 100%,' : ''}${skill.percentage >= 75 ? '0% 100%,' : ''}${skill.percentage >= 100 ? '0% 0%,' : ''} 50% 0%)`,
                            opacity: skill.percentage > 0 ? 0.35 : 0
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Reports & Remarks Management (takes 7 cols of 12) */}
        <div className="lg:col-span-7">
          {activeSkill ? (
            <div className="space-y-6">
              
              {/* Active Skill Info & Actions Banner */}
              <div className="soft-card p-6 rounded-lg bg-gradient-to-br from-primary-container/20 to-secondary-container/10 border border-outline-variant/20 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                      {getLucideIcon(activeSkill.iconName)}
                      <span>{activeSkill.category} System</span>
                    </div>
                    <h3 className="font-display font-black text-xl text-primary tracking-tight">
                      {activeSkill.name}
                    </h3>
                  </div>

                  {/* General deletion for correct curriculum pruning */}
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove the skill "${activeSkill.name}" and all of its logged reports?`)) {
                        onDeleteSkill(activeSkill.id);
                      }
                    }}
                    className="p-1.5 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                    title="Prune this skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-outline-variant/20">
                  <div className="bg-white/60 rounded-lg p-3 text-center border border-outline-variant/10">
                    <span className="block text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Expertise Index</span>
                    <span className="font-display font-black text-lg text-primary">{activeSkill.percentage}%</span>
                    <span className="block text-[9px] text-on-surface-variant font-semibold">{getDifficultyLevelLabel(activeSkill.percentage)}</span>
                  </div>

                  <div className="bg-white/60 rounded-lg p-3 text-center border border-outline-variant/10">
                    <span className="block text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Learning Volume</span>
                    <span className="font-display font-black text-lg text-secondary">{activeSkill.hoursSpent || 0} Hours</span>
                    <span className="block text-[9px] text-on-surface-variant font-semibold">{activeSkill.logs?.length || 0} Reports Filed</span>
                  </div>
                </div>
              </div>

              {/* Add Progress Report & Remarks Area */}
              <div className="soft-card p-6 rounded-lg bg-white border border-outline-variant/20 space-y-4 relative">
                <div className="absolute inset-0 paper-grain pointer-events-none opacity-4"></div>
                
                <div className="flex items-center gap-2 border-b border-outline-variant/15 pb-2">
                  <PenTool className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-extrabold text-sm text-on-surface uppercase tracking-wider">
                    Compile Progress Report & Practice Remarks
                  </h3>
                </div>

                <form onSubmit={handleAddReport} className="space-y-4 font-sans text-xs relative z-10">
                  {submitSuccess && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg font-bold flex items-center gap-2 animate-bounce">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Practice log registered & saved dynamically!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-on-surface-variant mb-1">
                        Dedicated Practice Hours
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        required
                        value={reportHours}
                        onChange={(e) => setReportHours(Number(e.target.value))}
                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary/45 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-on-surface-variant mb-1">
                        Update Mastery Level: <span className="text-primary font-black">{reportPercentage}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={reportPercentage}
                        onChange={(e) => setReportPercentage(Number(e.target.value))}
                        className="w-full accent-primary mt-3 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-on-surface-variant mb-1">
                      Remarks, Key Learnings, or Practice Notes
                    </label>
                    <textarea
                      required
                      placeholder="Write notes about what was completed, flavor notes, technique improvements, challenges, or goals for the next session..."
                      rows={3}
                      value={reportRemark}
                      onChange={(e) => setReportRemark(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-3 focus:ring-2 focus:ring-primary/45 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/95 text-on-primary font-bold py-2.5 rounded-full flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-transform"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Register Practice Session Log
                  </button>
                </form>
              </div>

              {/* Remarks History / Journal Timeline */}
              <div className="soft-card p-6 rounded-lg bg-white border border-outline-variant/20 space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant/15 pb-2">
                  <h3 className="font-display font-extrabold text-sm text-primary uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Practice Session logs & Remarks ledger
                  </h3>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                    {activeSkill.logs?.length || 0} Sessions
                  </span>
                </div>

                {!activeSkill.logs || activeSkill.logs.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-outline-variant/30 rounded-lg">
                    <p className="text-xs text-on-surface-variant font-medium">No practice logs registered for {activeSkill.name} yet.</p>
                    <span className="text-[10px] text-on-surface-variant/70 mt-1 block">Fill out the report above to start record-keeping.</span>
                  </div>
                ) : (
                  <div className="space-y-4 relative before:absolute before:inset-y-1 before:left-3 before:w-0.5 before:bg-outline-variant/20">
                    {activeSkill.logs.map((log) => (
                      <div key={log.id} className="relative pl-8 animate-in fade-in slide-in-from-left-3">
                        {/* Bullet circle index indicator */}
                        <span className="absolute left-1.5 top-1.5 w-3.5 h-3.5 bg-primary-container border-2 border-primary rounded-full flex items-center justify-center">
                          <span className="w-1 h-1 bg-primary rounded-full"></span>
                        </span>

                        <div className="soft-card p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/15 space-y-2 relative group-hover:scale-101 transition-all">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[10px] text-on-surface-variant font-bold flex items-center gap-1">
                              📅 {log.date}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                                +{log.hours} hrs session
                              </span>
                              <span className="text-[9px] bg-secondary/15 text-secondary font-extrabold px-2 py-0.5 rounded">
                                {log.progressPercent}% mastery
                              </span>
                              
                              <button
                                onClick={() => {
                                  if (confirm('Delete this practice report?')) {
                                    onDeleteSkillLog(activeSkill.id, log.id);
                                  }
                                }}
                                className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                                title="Delete log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-on-surface font-sans leading-relaxed">
                            {log.remark}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="soft-card p-12 rounded-lg bg-surface-container-low border border-dashed border-outline-variant/40 text-center space-y-4">
              <ClipboardList className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
              <div>
                <h4 className="font-display font-black text-sm text-on-surface-variant">No Active Focus Selected</h4>
                <p className="text-xs text-on-surface-variant/70 mt-1 max-w-xs mx-auto">
                  Acquire or choose a specific skill from the directory selection to inspect your feedback remarks and practice logs!
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Introduce New Skill Pop-up Modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full shadow-2xl overflow-hidden relative border border-primary-container p-6 animate-in fade-in zoom-in-95">
            <div className="absolute inset-0 paper-grain pointer-events-none opacity-4"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-display font-black text-lg text-primary">Register New Skill</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewSkill} className="space-y-4 relative z-10 font-sans text-xs">
              <div>
                <label className="block font-bold text-on-surface-variant mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. French Pastry Lamination"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary/45 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1">
                    Classification
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary/45 focus:outline-none focus:bg-white"
                  >
                    <option value="Culinary Arts">Culinary Arts</option>
                    <option value="Creative Arts">Creative Arts</option>
                    <option value="Tech & Programming">Tech & Programming</option>
                    <option value="Physical & Fitness">Physical & Fitness</option>
                    <option value="Languages & Literature">Languages / Lit</option>
                    <option value="Other Skills">Other Skills</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-on-surface-variant mb-1">
                    Initial Mastery (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={initialPercentage}
                    onChange={(e) => setInitialPercentage(Number(e.target.value))}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-1.5 focus:ring-2 focus:ring-primary/45 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-2">
                  Associate Vector Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'ChefHat', label: 'Culinary' },
                    { id: 'Camera', label: 'Photos' },
                    { id: 'Dumbbell', label: 'Fitness' },
                    { id: 'Book', label: 'Lit' },
                    { id: 'Code', label: 'Coding' },
                  ].map((ic) => (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setIconName(ic.id)}
                      className={`py-2 rounded-lg text-[10px] font-bold transition-all border flex flex-col items-center gap-1 ${
                        iconName === ic.id 
                          ? 'bg-primary-container border-primary text-on-primary-container shadow-xs' 
                          : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {getLucideIcon(ic.id)}
                      <span className="text-[9px] font-semibold mt-0.5">{ic.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-surface-container text-on-surface-variant rounded-full font-bold hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary rounded-full font-bold hover:brightness-97 shadow-md"
                >
                  Create Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
