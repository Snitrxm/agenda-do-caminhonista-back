import { Module } from '@nestjs/common';
import { DaysService } from './days.service';
import { DaysController } from './days.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [DaysController],
  providers: [DaysService, PrismaService],
})
export class DaysModule {}
