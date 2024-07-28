import { IsOptional, IsString } from 'class-validator';

export class UpdateActionDto {
  actionId: string;

  @IsString()
  @IsOptional()
  local?: string;

  @IsString()
  @IsOptional()
  date?: string;
}
