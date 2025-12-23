import { CategoryE } from '../interfaces/category.enum';
import { PriorityE } from '../interfaces/priority.enum';
import { DateEntity } from './../../../common/entities/date.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubTask } from './sub-task.entity';
import { Label } from './label.entity';
import { User } from './../../../authentication/user/user.entity';

@Entity('tasks')
export class Task extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isCompleted: boolean;

  @Column({
    type: 'enum',
    enum: CategoryE,
    nullable: false,
  })
  category: CategoryE;

  @Column({
    type: 'enum',
    enum: PriorityE,
    nullable: false,
  })
  priority: PriorityE;

  @Column({
    type: 'date',
    nullable: true,
  })
  date?: Date;

  @Column({
    type: 'uuid',
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: false,
  })
  user: User;

  @OneToMany(() => SubTask, (subTask) => subTask.task, {
    cascade: true,
    nullable: true,
  })
  subTasks?: SubTask[];

  @OneToMany(() => Label, (label) => label.task, {
    cascade: true,
    nullable: true,
  })
  labels?: Label[];
}
