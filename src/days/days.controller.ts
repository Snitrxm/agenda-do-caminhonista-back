import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DaysService } from './days.service';
import { CreateDayDto } from './dto/create-day.dto';
import { AuthGuard } from 'src/guards/auth';
import { CreateActionDto } from './dto/create-action.dto';

@UseGuards(AuthGuard)
@Controller('days')
export class DaysController {
  constructor(private readonly daysService: DaysService) {}

  @Post()
  create(@Body() createDayDto: CreateDayDto, @Request() request) {
    return this.daysService.create({
      ...createDayDto,
      userId: request.user.id,
    });
  }

  @Post(':dayId/actions')
  createAction(
    @Param('dayId') dayId: string,
    @Body() createActionDto: CreateActionDto,
  ) {
    return this.daysService.createAction({
      ...createActionDto,
      dayId,
    });
  }

  @Get()
  findAll(@Request() request) {
    return this.daysService.findAll(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() request) {
    return this.daysService.findOne({
      dayId: id,
      userId: request.user.id,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.daysService.remove(+id);
  }
}
