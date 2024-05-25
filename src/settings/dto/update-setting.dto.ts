import { IsOptional, IsString } from 'class-validator';

export class UpdateSettingDTO {
  userId: string;

  @IsString()
  @IsOptional()
  defaultTruckPlate?: string;

  @IsString()
  @IsOptional()
  defaultTrailerPlate?: string;
}
