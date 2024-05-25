import { Injectable } from '@nestjs/common';
import { Settings } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateSettingDTO } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private _prisma: PrismaService) {}

  public async findOne(userId: string): Promise<Settings> {
    const settings = this._prisma.settings.findFirst({
      where: {
        userId,
      },
    });

    return settings;
  }

  public async update(settingId: string, updateSettingDto: UpdateSettingDTO) {
    await this._prisma.settings.update({
      data: updateSettingDto,
      where: {
        id: settingId,
      },
    });
  }
}
