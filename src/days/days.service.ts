import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDayDto } from './dto/create-day.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateActionDto } from './dto/create-action.dto';
import { FindOneDayServiceDto } from './dto/find-one-day-service.dto';
import { UpdateDayDto } from './dto/update-day.dto';
import { DateUtils } from 'src/@shared/Date.utils';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class DaysService {
  constructor(private _prisma: PrismaService) {}

  async create(createDayDto: CreateDayDto) {
    const userSettings = await this._prisma.settings.findFirst({
      where: {
        userId: createDayDto.userId,
      },
    });

    const day = await this._prisma.day.create({
      data: {
        date: createDayDto.date,
        userId: createDayDto.userId,
        truckPlate: userSettings?.defaultTruckPlate,
        trailerPlate: userSettings?.defaultTrailerPlate,
      },
    });

    return day;
  }

  async delete(dayId: string) {
    await this._prisma.day.delete({
      where: {
        id: dayId,
      },
      include: {
        actions: {
          where: {
            dayId,
          },
        },
      },
    });
  }

  async update(updateDayDto: UpdateDayDto) {
    const day = await this._prisma.day.update({
      data: {
        weekStart: updateDayDto.weekStart,
        departureKm: updateDayDto.departureKm,
        arriveKm: updateDayDto.arriveKm,
        drivingMinutes: updateDayDto.drivingMinutes,
        truckPlate: updateDayDto.truckPlate,
        trailerPlate: updateDayDto.trailerPlate,
        observations: updateDayDto.observations,
      },
      where: {
        id: updateDayDto.dayId,
      },
    });

    return day;
  }

  async createAction(createActionDto: CreateActionDto) {
    if (createActionDto.action === 'Pausa 9H') {
      const all9HBreakInThisWeek = await this._prisma.dayAction.findMany({
        where: {
          action: 'Pausa 9H',
          date: {
            gte: new Date(
              DateUtils.getStartOfWeek(new Date(createActionDto.date)),
            ),
            lte: new Date(
              DateUtils.getEndOfWeek(new Date(createActionDto.date)),
            ),
          },
        },
      });

      // Em uma semana não podemos ter mais de 3 pausas de 9 Horas
      if (all9HBreakInThisWeek.length === 3) {
        throw new HttpException(
          'Já existem 3 pausas de 9 horas nessa semana!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const action = await this._prisma.dayAction.create({
      data: {
        ...createActionDto,
      },
    });

    return action;
  }

  async deleteAction(actionId: string) {
    const action = await this._prisma.dayAction.delete({
      where: {
        id: actionId,
      },
    });

    return action;
  }

  async updateAction(updateActionDto: UpdateActionDto) {
    const action = await this._prisma.dayAction.update({
      data: {
        local: updateActionDto.local,
        date: updateActionDto.date,
      },
      where: {
        id: updateActionDto.actionId,
      },
    });

    return action;
  }

  async findAll(userId: string) {
    const days = await this._prisma.day.findMany({
      where: {
        userId,
      },
      include: {
        actions: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return days;
  }

  async findOne(data: FindOneDayServiceDto) {
    const days = await this._prisma.day.findUnique({
      where: {
        userId: data.userId,
        id: data.dayId,
      },
      include: {
        actions: {
          orderBy: {
            date: 'asc',
          },
        },
      },
    });

    return days;
  }

  async weekHours(userId: string) {
    const days = await this._prisma.day.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const weeklyData = days.reduce((acc, day) => {
      const date = new Date(day.createdAt);

      const startOfWeekDate = DateUtils.getStartOfWeek(date);
      const startOfWeekStr = startOfWeekDate.toISOString().split('T')[0];

      if (!acc[startOfWeekStr]) {
        acc[startOfWeekStr] = 0;
      }

      acc[startOfWeekStr] += day.drivingMinutes;

      return acc;
    }, {});

    const array = [];
    Object.entries(weeklyData).forEach(([weekStart, drivingMinutes]) => {
      const weekEndDate = DateUtils.getEndOfWeek(new Date(weekStart));
      const weekEndStr = weekEndDate.toISOString().split('T')[0];

      const formattedWeekStart = new Date(weekStart).toLocaleDateString(
        'pt-BR',
      );
      const formattedWeekEnd = new Date(weekEndStr).toLocaleDateString('pt-BR');

      array.push({
        weekStart: formattedWeekStart,
        weekEnd: formattedWeekEnd,
        drivingMinutes,
      });
    });

    return array;
  }
}
