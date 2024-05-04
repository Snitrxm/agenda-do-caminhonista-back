import { IsOptional, IsString } from 'class-validator';

export class CreateActionDto {
  dayId: string;

  @IsString()
  action: string;

  @IsString()
  local: string;

  @IsString()
  date: string | Date;

  @IsString()
  @IsOptional()
  additionalInformations: string | undefined;
}
