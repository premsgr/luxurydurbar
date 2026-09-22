import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';
import { BlockedSlotsService } from './blocked-slots.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

class CreateBlockedDto {
  @IsString()
  hallId!: string;

  @IsDateString()
  date!: string;

  @Matches(TIME_RE)
  startTime!: string;

  @Matches(TIME_RE)
  endTime!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

@Controller('blocked-slots')
@UseGuards(JwtAuthGuard)
export class BlockedSlotsController {
  constructor(private readonly blocked: BlockedSlotsService) {}

  @Get()
  list(@Query('hallId') hallId?: string) {
    return this.blocked.list(hallId);
  }

  @Post()
  create(@Body() body: CreateBlockedDto) {
    return this.blocked.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blocked.remove(id);
  }
}
