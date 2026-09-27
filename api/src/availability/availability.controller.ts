import { Controller, Get, Query } from '@nestjs/common';
import { IsDateString, IsString } from 'class-validator';
import { AvailabilityService } from './availability.service';

class AvailabilityQuery {
  @IsString()
  hallSlug!: string;

  @IsDateString()
  date!: string;
}

class OverviewQuery {
  @IsDateString()
  date!: string;
}

class MonthQuery {
  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;
}

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availability: AvailabilityService) {}

  @Get('overview')
  overview(@Query() query: OverviewQuery) {
    return this.availability.getOverview(query.date);
  }

  @Get('month')
  month(@Query() query: MonthQuery) {
    return this.availability.getMonthSummary(query.from, query.to);
  }

  @Get()
  check(@Query() query: AvailabilityQuery) {
    return this.availability.getAvailability(query.hallSlug, query.date);
  }
}
