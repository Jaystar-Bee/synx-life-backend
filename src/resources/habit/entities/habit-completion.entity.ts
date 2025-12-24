import { DateEntity } from './../../../common/entities/date.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Habit } from './habit.entity';

@Entity('habit_completions')
export class HabitCompletion extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  completedAt: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  habitId: string;

  @ManyToOne(() => Habit, (habit) => habit.completions, {
    onDelete: 'CASCADE',
  })
  habit: Habit;
}
