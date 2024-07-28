import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsNumber()
  @IsOptional()
  drivingMinutes?: number;

  @IsString()
  @IsOptional()
  truckPlate?: string;

  @IsString()
  @IsOptional()
  trailerPlate?: string;

  @IsString()
  @IsOptional()
  observations?: string;
}
