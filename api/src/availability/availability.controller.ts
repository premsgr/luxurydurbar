import { Controller, Get, Query } from '@nestjs/common';
import { IsDateString, IsString } from 'class-validator';
import { AvailabilityService } from './availability.service';

class AvailabilityQuery {
  @IsString()
  hallId!: string;

  @IsDateString()
  date!: string;
}

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availability: AvailabilityService) {}

  @Get()
  check(@Query() query: AvailabilityQuery) {
    return this.availability.getAvailability(query.hallId, query.date);
  }
}
