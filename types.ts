export interface Task {
  id: string;
  text: string;
  project: string;
  priority: 'LOW' | 'MED' | 'HIGH';
  completed: boolean;
  dueDate?: string;
  theme?: string; // Add customizable theme color ID
}

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name, e.g. 'Brain', 'PenTool', 'Database'
  dueDateStr: string;
  percentage: number;
  tags: string[];
  teamCount?: number;
}

export interface SkillLog {
  id: string;
  date: string;
  hours: number;
  remark: string;
  progressPercent: number;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number; // 0 to 100
  iconName: string; // Lucide icon
  level?: number;
  category?: string;
  hoursSpent?: number;
  logs?: SkillLog[];
}

export interface Goal {
  title: string;
  dedicatedHours: number;
  targetHours: number;
  category: string;
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  level: number;
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MODERATE' | 'HARD';
  vibe: string;
  excitementLevel: number; // 1-5 rating
  createdAt: string;
}

