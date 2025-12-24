import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { HabitFrequency } from '../habit.model';
import { DateEntity } from './../../../common/entities/date.entity';
import { User } from './../../../authentication/user/user.entity';
import { HabitCompletion } from './habit-completion.entity';

@Entity('habits')
@Unique(['name', 'userId'])
export class Habit extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: HabitFrequency,
    nullable: false,
  })
  frequency: HabitFrequency;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'int',
    nullable: true,
    array: true,
  })
  customDays: number[];

  @Column({
    type: 'time',
    nullable: true,
  })
  reminderTime: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.habits)
  user: User;

  @OneToMany(() => HabitCompletion, (completion) => completion.habit)
  completions: HabitCompletion[];
}
