import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.settingsService.findOne(userId);
  }

  @Patch(':settingId')
  update(@Param('settingId') settingId: string, @Body() updateSettingDto: any) {
    return this.settingsService.update(settingId, updateSettingDto);
  }
}
