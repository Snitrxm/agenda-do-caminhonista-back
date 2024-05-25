import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DaysModule } from './days/days.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [UsersModule, DaysModule, SettingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
