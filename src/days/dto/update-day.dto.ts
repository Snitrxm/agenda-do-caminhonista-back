import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateDayDto {
  dayId: string;

  @IsBoolean()
  @IsOptional()
  weekStart?: boolean;

  @IsNumber()
  @IsOptional()
  departureKm?: number;

  @IsNumber()
  @IsOptional()
  arriveKm?: number;
}
