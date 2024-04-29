import { Injectable } from '@nestjs/common';
import { CreateDayDto } from './dto/create-day.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DaysService {
  constructor(private _prisma: PrismaService) {}

  async create(createDayDto: CreateDayDto) {
    const day = await this._prisma.day.create({
      data: createDayDto,
    });

    return day;
  }

  async findAll(userId: string) {
    const days = await this._prisma.day.findMany({
      where: {
        userId,
      },
    });

    return days;
  }

  findOne(id: number) {
    return `This action returns a #${id} day`;
  }

  remove(id: number) {
    return `This action removes a #${id} day`;
  }
}
