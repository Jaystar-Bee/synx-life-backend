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
  reminderTime?: string;
  userId: string;
  isCompletedToday?: boolean;
}
