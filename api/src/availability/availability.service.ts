import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  formatDateOnly,
  timeToMinutes,
  timesOverlap,
  toDateOnly,
} from '../common/time.util';

const DAY_SLOTS = [
  { startTime: '09:00', endTime: '14:00' },
  { startTime: '15:00', endTime: '22:00' },
  { startTime: '09:00', endTime: '22:00' },
];

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async checkConflict(params: {
    hallId: string;
    eventDate: string | Date;
    startTime: string;
    endTime: string;
    excludeBookingId?: string;
  }) {
    const date = toDateOnly(params.eventDate);
    const [bookings, blocks] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          hallId: params.hallId,
          eventDate: date,
          status: 'confirmed',
          ...(params.excludeBookingId
            ? { id: { not: params.excludeBookingId } }
            : {}),
        },
      }),
      this.prisma.blockedSlot.findMany({
        where: { hallId: params.hallId, date },
      }),
    ]);

    for (const b of bookings) {
      if (
        timesOverlap(params.startTime, params.endTime, b.startTime, b.endTime)
      ) {
        return {
          conflict: true as const,
          reason: 'booking' as const,
          id: b.id,
        };
      }
    }
    for (const bl of blocks) {
      if (
        timesOverlap(params.startTime, params.endTime, bl.startTime, bl.endTime)
      ) {
        return {
          conflict: true as const,
          reason: 'blocked' as const,
          id: bl.id,
        };
      }
    }
    return { conflict: false as const };
  }

  async getAvailability(hallId: string, dateStr: string) {
    const hall = await this.prisma.hall.findFirst({
      where: { OR: [{ id: hallId }, { slug: hallId }], published: true },
    });
    if (!hall) throw new NotFoundException('Hall not found');

    const date = toDateOnly(dateStr);
    const slots = [];
    for (const slot of DAY_SLOTS) {
      const result = await this.checkConflict({
        hallId: hall.id,
        eventDate: date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      slots.push({
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: !result.conflict,
        reason: result.conflict ? result.reason : undefined,
      });
    }

    const fullDay = slots.find(
      (s) => s.startTime === '09:00' && s.endTime === '22:00',
    );

    return {
      hallId: hall.id,
      date: formatDateOnly(date),
      slots,
      available: fullDay?.available ?? slots.some((s) => s.available),
    };
  }

  async findPendingConflicts(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return this.checkConflict({
      hallId: booking.hallId,
      eventDate: booking.eventDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      excludeBookingId: booking.id,
    });
  }

  /** Helper for duration validation */
  assertValidRange(startTime: string, endTime: string) {
    return timeToMinutes(endTime) > timeToMinutes(startTime);
  }
}
