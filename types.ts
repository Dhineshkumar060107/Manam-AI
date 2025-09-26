export enum Mood {
  Happy = 'Happy',
  Calm = 'Calm',
  Neutral = 'Neutral',
  Anxious = 'Anxious',
  Sad = 'Sad',
  Stressed = 'Stressed',
  Excited = 'Excited',
}

export interface MoodEntry {
  id: string;
  mood: Mood;
  notes: string;
  timestamp: Date;
}

export interface AIPattern {
    pattern: string;
    suggestion: string;
}

export interface Goal {
    id: string;
    text: string;
    completed: boolean;
    targetCount: number;
    currentCount: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type AppView = 'Progress Report' | 'Mood Timeline' | 'Insights & Patterns' | 'Coping Strategies';