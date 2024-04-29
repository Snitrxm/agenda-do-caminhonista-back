import { IsString } from 'class-validator';

export class CreateDayDto {
  userId: string;

  @IsString()
  date: Date;
}
