import { HabitCompletion } from '../habit/entities/habit-completion.entity';

export interface HabitStatsI {
  id: string;
  name: string;
  supposedCompletion: number;
  actualCompletion: number;
  completionPercentage: number;
  completions: HabitCompletion[];
}

export interface ConsistencyHeatI {
  MONDAY: number;
  TUESDAY: number;
  WEDNESDAY: number;
  THURSDAY: number;
  FRIDAY: number;
  SATURDAY: number;
  SUNDAY: number;
}
