import { DateEntity } from 'src/common/entities/date.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './../../resources/tasks/entities/task.entity';

@Entity('users')
export class User extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: '4',
  })
  @Exclude()
  otp?: string;

  @Column({
    type: 'varchar',
  })
  @Exclude()
  otpExpireTime?: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVerified: boolean;

  @Column({
    type: 'text',
    nullable: true,
  })
  @Exclude()
  refreshToken: string | null;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Exclude()
  password?: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
