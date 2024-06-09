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

  async weekHours(userId: string) {
    function getStartOfWeek(date: Date) {
      const diaSemana = date.getDay(); // 0 para domingo, 1 para segunda-feira, etc.
      const primeiroDia = new Date(date); // Cria uma cópia da data fornecida

      // Se não for segunda-feira (dia 1), ajuste para o último domingo (dia 0)
      if (diaSemana !== 1) {
        primeiroDia.setDate(
          date.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1),
        );
      }

      // Retorna o primeiro dia da semana
      return primeiroDia;
    }

    function getEndOfWeek(date: Date) {
      const ultimoDia = getStartOfWeek(date); // Obtém o primeiro dia da semana
      ultimoDia.setDate(ultimoDia.getDate() + 6); // Adiciona 6 dias para obter o último dia da semana

      // Retorna o último dia da semana
      return ultimoDia;
    }

    const days = await this._prisma.day.findMany({
      where: {
        userId,
      },
    });

    const weeklyData = days.reduce((acc, day) => {
      const date = new Date(day.createdAt);

      // Encontrar o início da semana (segunda-feira) para formar a chave
      const startOfWeekDate = getStartOfWeek(date);
      const startOfWeekStr = startOfWeekDate.toISOString().split('T')[0];

      if (!acc[startOfWeekStr]) {
        acc[startOfWeekStr] = 0;
      }

      acc[startOfWeekStr] += day.drivingMinutes;

      return acc;
    }, {});

    // Formatar os dados em um array com início e fim da semana
    const array = [];
    Object.entries(weeklyData).forEach(([weekStart, drivingMinutes]) => {
      // Encontrar o final da semana (domingo)
      const weekEndDate = getEndOfWeek(new Date(weekStart));
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
