import {
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
} from 'typeorm';
import { DateEntity } from './../../../common/entities/date.entity';
import { Task } from './task.entity';

@Entity('labels')
@Unique(['name', 'taskId'])
export class Label extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  taskId: string;

  @ManyToOne(() => Task, (task) => task.labels, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  task: Task;
}
