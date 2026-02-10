import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { UserService } from './../../authentication/user/user.service';
import { HabitService } from '../habit/habit.service';
import { TodayFilterDto } from './dto/today-filter.dto';
import moment from 'moment';
import { Task } from '../tasks/entities/task.entity';
import { ConsistencyHeatI, HabitStatsI } from './me.model';
import { HabitI } from '../habit/habit.model';
import { HabitCompletion } from '../habit/entities/habit-completion.entity';
import { User } from './../../authentication/user/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { HashService } from 'src/authentication/hash/hash.service';

@Injectable()
export class MeService {
  constructor(
    private readonly userService: UserService,
    private readonly tasksService: TasksService,
    private readonly habitService: HabitService,
    private readonly hashService: HashService,
  ) {}
  async getDayTasksAndHabits(
    userId: string,
    filter: TodayFilterDto,
  ): Promise<{
    habits: [HabitI[], number];
    tasks: [Task[], number];
  }> {
    filter.date = filter?.date
      ? moment(filter.date).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD');
    // get tasks for the day
    const tasks = await this.tasksService.findAll(userId, filter);

    // get habits active for the day [0,1,2,3,4,5,6]
    const day = moment(filter.date).day();
    const habits = await this.habitService.findAll(userId, {
      date: [day],
    });

    return {
      habits,
      tasks,
    };
  }

  async getLowerAttendedHabits(userId: string): Promise<HabitStatsI[]> {
    // get habits
    const [habits] = await this.habitService.findAll(
      userId,
      {},
      undefined,
      true,
    );

    // get the number of times each habit suppose to be completed
    let habitStats: HabitStatsI[] = [];
    if (habits?.length) {
      habitStats = this.getHabitStats(habits);
    }

    // get habits that are lower than 50% completed
    let habitsWithRequirement: HabitStatsI[] = [];
    if (habitStats?.length) {
      habitsWithRequirement = habitStats?.filter(
        (habit) => habit.completionPercentage < 50,
      );
    }
    return habitsWithRequirement;
  }

  async getConsistencyHeat(userId: string): Promise<ConsistencyHeatI> {
    // get habits
    const [habits] = await this.habitService.findAll(
      userId,
      {},
      undefined,
      true,
    );
    let habitStats: HabitStatsI[] = [];
    if (habits?.length) {
      habitStats = this.getHabitStats(habits);
    }

    // get tasks
    const [tasks] = await this.tasksService.findAll(userId, {
      isCompleted: true,
    });

    // get the percentage at which the user do tasks or habit for each day: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY (0-100%)
    const consistencyHeat = {
      MONDAY: 0,
      TUESDAY: 0,
      WEDNESDAY: 0,
      THURSDAY: 0,
      FRIDAY: 0,
      SATURDAY: 0,
      SUNDAY: 0,
    };

    tasks?.forEach((task) => {
      // const day = moment(task?.date).day();
      if (task.isCompleted) {
        consistencyHeat[moment(task?.date).format('dddd').toUpperCase()] =
          consistencyHeat[moment(task?.date).format('dddd').toUpperCase()] + 1;
      }
    });

    habitStats?.forEach((habit) => {
      if (habit?.completions?.length) {
        habit?.completions?.forEach((completion) => {
          consistencyHeat[
            moment(completion?.completedAt).format('dddd').toUpperCase()
          ] =
            consistencyHeat[
              moment(completion?.completedAt).format('dddd').toUpperCase()
            ] + 1;
        });
      }
    });

    return consistencyHeat;
  }

  async getMe(userId: string): Promise<User> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.password;
    delete user.fcmToken;
    delete user.refreshToken;
    delete user.otp;
    delete user.otpExpireTime;
    return user;
  }

  private getHabitStats(habits: HabitI[]): HabitStatsI[] {
    const result = habits?.map((habit) => {
      const supposedDateLength =
        moment().diff(moment(habit.createdAt), 'weeks') + 1;
      const day = moment().day();
      let supposedCompletionTimes =
        (supposedDateLength || 1) * habit.customDays?.length;
      if (day > habit?.customDays[habit.customDays?.length - 1]) {
        const startIndex = habit?.customDays.findIndex((item) => item >= day);
        const extraDays = habit?.customDays?.length - startIndex;
        const extraCompletionTimes = (supposedDateLength || 1) * extraDays;
        supposedCompletionTimes -= extraCompletionTimes;
      }
      return {
        id: habit.id,
        name: habit?.name,
        supposedCompletion: supposedCompletionTimes,
        actualCompletion: habit?.completions?.length as number,
        completions: habit?.completions as HabitCompletion[],
        completionPercentage:
          ((habit?.completions?.length || 0) / supposedCompletionTimes) * 100,
        createdAt: moment(habit.createdAt).format('YYYY-MM-DD'),
      };
    });
    return result;
  }

  public async deleteAccount(userId: string): Promise<void> {
    const user = await this.findOneOrFail(userId);
    return this.userService.delete(user);
  }

  public async changePassword(
    userId: string,
    passwordData: ChangePasswordDto,
  ): Promise<User> {
    const user = await this.findOneOrFail(userId);
    const oldPasswordIsCorrect = await this.hashService.confirmHash(
      passwordData.oldPassword,
      user?.password as string,
    );
    if (oldPasswordIsCorrect) {
      user.password = passwordData?.newPassword;
      return this.userService.update(user);
    } else {
      throw new HttpException('Wrong Password', HttpStatus.CONFLICT);
    }
  }

  private async findOneOrFail(userId: string): Promise<User> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
