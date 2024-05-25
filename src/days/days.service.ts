import { Injectable } from '@nestjs/common';
import { CreateDayDto } from './dto/create-day.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateActionDto } from './dto/create-action.dto';
import { FindOneDayServiceDto } from './dto/find-one-day-service.dto';
import { UpdateDayDto } from './dto/update-day.dto';

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
      },
      where: {
        id: updateDayDto.dayId,
      },
    });

    return day;
  }

  async createAction(createActionDto: CreateActionDto) {
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
}
