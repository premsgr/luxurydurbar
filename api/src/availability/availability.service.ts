import { Injectable, NotFoundException } from '@nestjs/common';
import {
  VENUES,
  getVenue,
  type EventType,
  type HallOccupancy,
  type MonthDayStatus,
  type MonthOccupancy,
  type OccupancyOverview,
  type OccupancySlot,
} from '@luxurydurbar/shared';
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

/** Morning / evening only — used by the public occupancy board */
const OVERVIEW_SLOTS = [
  { startTime: '09:00', endTime: '14:00' },
  { startTime: '15:00', endTime: '22:00' },
];

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async checkConflict(params: {
    hallSlug: string;
    eventDate: string | Date;
    startTime: string;
    endTime: string;
    excludeBookingId?: string;
  }) {
    const date = toDateOnly(params.eventDate);
    const [bookings, blocks] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          hallSlug: params.hallSlug,
          eventDate: date,
          status: 'confirmed',
          ...(params.excludeBookingId
            ? { id: { not: params.excludeBookingId } }
            : {}),
        },
      }),
      this.prisma.blockedSlot.findMany({
        where: { hallSlug: params.hallSlug, date },
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

  async getAvailability(hallSlug: string, dateStr: string) {
    const venue = getVenue(hallSlug);
    if (!venue) throw new NotFoundException('Hall not found');

    const date = toDateOnly(dateStr);
    const slots = [];
    for (const slot of DAY_SLOTS) {
      const result = await this.checkConflict({
        hallSlug: venue.slug,
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
      hallSlug: venue.slug,
      date: formatDateOnly(date),
      slots,
      available: fullDay?.available ?? slots.some((s) => s.available),
    };
  }

  /**
   * Public occupancy board: all halls for a date, morning + evening only.
   * Confirmed bookings expose eventType; blocked slots show as unavailable.
   * No customer PII.
   */
  async getOverview(dateStr: string): Promise<OccupancyOverview> {
    const date = toDateOnly(dateStr);
    const [bookings, blocks] = await Promise.all([
      this.prisma.booking.findMany({
        where: { eventDate: date, status: 'confirmed' },
        select: {
          hallSlug: true,
          startTime: true,
          endTime: true,
          eventType: true,
        },
      }),
      this.prisma.blockedSlot.findMany({
        where: { date },
        select: { hallSlug: true, startTime: true, endTime: true },
      }),
    ]);

    const halls: HallOccupancy[] = VENUES.map((venue) => {
      const hallBookings = bookings.filter((b) => b.hallSlug === venue.slug);
      const hallBlocks = blocks.filter((b) => b.hallSlug === venue.slug);

      const slots: OccupancySlot[] = OVERVIEW_SLOTS.map((slot) => {
        const block = hallBlocks.find((bl) =>
          timesOverlap(slot.startTime, slot.endTime, bl.startTime, bl.endTime),
        );
        if (block) {
          return {
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: 'blocked' as const,
          };
        }

        const booking = hallBookings.find((b) =>
          timesOverlap(slot.startTime, slot.endTime, b.startTime, b.endTime),
        );
        if (booking) {
          return {
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: 'booked' as const,
            eventType: booking.eventType as EventType,
          };
        }

        return {
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'open' as const,
        };
      });

      return {
        hallSlug: venue.slug,
        hallName: venue.name,
        slots,
      };
    });

    return { date: formatDateOnly(date), halls };
  }

  /**
   * Public month summary for the occupancy calendar.
   * Orange (booked) = any confirmed booking that day; green (open) otherwise.
   * No customer PII.
   */
  async getMonthSummary(fromStr: string, toStr: string): Promise<MonthOccupancy> {
    const from = toDateOnly(fromStr);
    const to = toDateOnly(toStr);

    const bookings = await this.prisma.booking.findMany({
      where: {
        eventDate: { gte: from, lte: to },
        status: 'confirmed',
      },
      select: { eventDate: true },
    });

    const bookedDates = new Set(bookings.map((b) => formatDateOnly(b.eventDate)));

    const days: MonthDayStatus[] = [];
    const cursor = new Date(from.getTime());
    while (cursor.getTime() <= to.getTime()) {
      const date = formatDateOnly(cursor);
      days.push({
        date,
        status: bookedDates.has(date) ? 'booked' : 'open',
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return {
      from: formatDateOnly(from),
      to: formatDateOnly(to),
      days,
    };
  }

  async findPendingConflicts(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return this.checkConflict({
      hallSlug: booking.hallSlug,
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
