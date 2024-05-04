import { Injectable } from '@nestjs/common';
import { CreateDayDto } from './dto/create-day.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateActionDto } from './dto/create-action.dto';
import { FindOneDayServiceDto } from './dto/find-one-day-service.dto';

@Injectable()
export class DaysService {
  constructor(private _prisma: PrismaService) {}

  async create(createDayDto: CreateDayDto) {
    const day = await this._prisma.day.create({
      data: {
        date: createDayDto.date,
        userId: createDayDto.userId,
      },
    });

    return day;
  }

  async createAction(createActionDto: CreateActionDto) {
    const action = await this._prisma.dayAction.create({
      data: {
        dayId: createActionDto.dayId,
        ...createActionDto,
      },
    });

    return action;
  }

  async findAll(userId: string) {
    const days = await this._prisma.day.findMany({
      where: {
        userId,
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

  remove(id: number) {
    return `This action removes a #${id} day`;
  }
}
