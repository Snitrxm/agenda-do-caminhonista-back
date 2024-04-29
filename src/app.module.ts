import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DaysModule } from './days/days.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [UsersModule, DaysModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
