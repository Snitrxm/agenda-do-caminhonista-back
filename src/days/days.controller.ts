import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DaysService } from './days.service';
import { CreateDayDto } from './dto/create-day.dto';
import { AuthGuard } from 'src/guards/auth';

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

  @Get()
  findAll(@Request() request) {
    return this.daysService.findAll(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.daysService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.daysService.remove(+id);
  }
}
