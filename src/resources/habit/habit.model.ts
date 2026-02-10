import { HabitCompletion } from './entities/habit-completion.entity';

export enum HabitFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  CUSTOM = 'CUSTOM',
}

export interface HabitI {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  customDays: number[];
  completions?: HabitCompletion[];
  reminderTime?: string;
  userId: string;
  isCompletedToday?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
