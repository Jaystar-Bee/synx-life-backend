import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  Unique,
} from 'typeorm';
import { DateEntity } from './../../../common/entities/date.entity';
import { Task } from './task.entity';

@Entity('sub-tasks')
@Unique(['name', 'taskId'])
export class SubTask extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isCompleted: boolean;

  @Column({
    type: 'varchar',
  })
  taskId: string;

  @ManyToOne(() => Task, (task) => task.subTasks, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  task: Task;
}
