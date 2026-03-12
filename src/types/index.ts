export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isFavorite: boolean;
}

export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface MoodConfig {
  emoji: string;
  label: string;
  color: string;
}

export const MOODS: Record<Mood, MoodConfig> = {
  great: { emoji: '✦', label: 'Отлично', color: '#A8E6CF' },
  good: { emoji: '◆', label: 'Хорошо', color: '#B8D4F0' },
  neutral: { emoji: '●', label: 'Нейтрально', color: '#C8C8C8' },
  bad: { emoji: '◈', label: 'Плохо', color: '#F0C8B8' },
  terrible: { emoji: '✸', label: 'Ужасно', color: '#F0A8A8' },
};
