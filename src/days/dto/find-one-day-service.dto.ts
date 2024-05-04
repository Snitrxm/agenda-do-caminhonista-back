import { IsString } from 'class-validator';

export class FindOneDayServiceDto {
  @IsString()
  dayId: string;

  @IsString()
  userId: string;
}
