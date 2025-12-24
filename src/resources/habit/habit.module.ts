import { Module } from '@nestjs/common';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { HabitCompletion } from './entities/habit-completion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitCompletion])],
  controllers: [HabitController],
  providers: [HabitService],
})
export class HabitModule {}
