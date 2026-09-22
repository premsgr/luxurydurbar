import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { BookingStatus, EventType } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

class CreateBookingDto {
  @IsString()
  hallId!: string;

  @IsDateString()
  eventDate!: string;

  @Matches(TIME_RE)
  startTime!: string;

  @Matches(TIME_RE)
  endTime!: string;

  @IsInt()
  @Min(1)
  guestCount!: number;

  @IsEnum(EventType)
  eventType!: EventType;

  @IsString()
  @MinLength(2)
  customerName!: string;

  @IsEmail()
  customerEmail!: string;

  @IsString()
  @MinLength(7)
  customerPhone!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

class UpdateStatusDto {
  @IsEnum(BookingStatus)
  status!: BookingStatus;
}

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(@Body() body: CreateBookingDto) {
    return this.bookings.createPublic(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@Query('status') status?: BookingStatus) {
    return this.bookings.list(status);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  dashboard() {
    return this.bookings.dashboard();
  }

  @Get('calendar')
  @UseGuards(JwtAuthGuard)
  calendar(@Query('from') from: string, @Query('to') to: string) {
    return this.bookings.calendar(from, to);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  get(@Param('id') id: string) {
    return this.bookings.get(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    return this.bookings.updateStatus(id, body.status);
  }
}
