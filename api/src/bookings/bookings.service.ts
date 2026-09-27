import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, EventType } from '@prisma/client';
import { getVenue } from '@luxurydurbar/shared';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { MailService } from '../mail/mail.service';
import { formatDateOnly, toDateOnly } from '../common/time.util';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availability: AvailabilityService,
    private readonly mail: MailService,
  ) {}

  private mapBooking(b: {
    id: string;
    hallSlug: string;
    eventDate: Date;
    startTime: string;
    endTime: string;
    guestCount: number;
    eventType: EventType;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string | null;
    status: BookingStatus;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const venue = getVenue(b.hallSlug);
    return {
      id: b.id,
      hallSlug: b.hallSlug,
      hall: venue
        ? { name: venue.name, slug: venue.slug }
        : { name: b.hallSlug, slug: b.hallSlug },
      eventDate: formatDateOnly(b.eventDate),
      startTime: b.startTime,
      endTime: b.endTime,
      guestCount: b.guestCount,
      eventType: b.eventType,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      notes: b.notes,
      status: b.status,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    };
  }

  async createPublic(data: {
    hallSlug: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    guestCount: number;
    eventType: EventType;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
  }) {
    if (!this.availability.assertValidRange(data.startTime, data.endTime)) {
      throw new BadRequestException('endTime must be after startTime');
    }

    const venue = getVenue(data.hallSlug);
    if (!venue) throw new NotFoundException('Hall not found');
    if (data.guestCount > venue.capacity) {
      throw new BadRequestException(
        `Guest count exceeds hall capacity (${venue.capacity})`,
      );
    }

    const booking = await this.prisma.booking.create({
      data: {
        hallSlug: venue.slug,
        eventDate: toDateOnly(data.eventDate),
        startTime: data.startTime,
        endTime: data.endTime,
        guestCount: data.guestCount,
        eventType: data.eventType,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        notes: data.notes,
        status: 'pending',
      },
    });

    const dateStr = formatDateOnly(booking.eventDate);
    await Promise.all([
      this.mail.bookingReceived({
        to: booking.customerEmail,
        customerName: booking.customerName,
        hallName: venue.name,
        eventDate: dateStr,
        startTime: booking.startTime,
        endTime: booking.endTime,
      }),
      this.mail.staffNewBooking({
        hallName: venue.name,
        customerName: booking.customerName,
        eventDate: dateStr,
        bookingId: booking.id,
      }),
    ]);

    return this.mapBooking(booking);
  }

  async list(status?: BookingStatus) {
    const bookings = await this.prisma.booking.findMany({
      where: status ? { status } : undefined,
      orderBy: [{ eventDate: 'asc' }, { startTime: 'asc' }],
    });
    return bookings.map((b) => this.mapBooking(b));
  }

  async get(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    const conflict = await this.availability.checkConflict({
      hallSlug: booking.hallSlug,
      eventDate: booking.eventDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      excludeBookingId: booking.id,
    });
    return { ...this.mapBooking(booking), conflict };
  }

  async updateStatus(id: string, status: BookingStatus) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const venue = getVenue(booking.hallSlug);
    const hallName = venue?.name ?? booking.hallSlug;

    if (status === 'confirmed') {
      const conflict = await this.availability.checkConflict({
        hallSlug: booking.hallSlug,
        eventDate: booking.eventDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        excludeBookingId: booking.id,
      });
      if (conflict.conflict) {
        throw new ConflictException(
          `Cannot confirm: conflicts with ${conflict.reason}`,
        );
      }
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status },
    });

    const dateStr = formatDateOnly(updated.eventDate);
    if (status === 'confirmed') {
      await this.mail.bookingConfirmed({
        to: updated.customerEmail,
        customerName: updated.customerName,
        hallName,
        eventDate: dateStr,
      });
    } else if (status === 'rejected') {
      await this.mail.bookingRejected({
        to: updated.customerEmail,
        customerName: updated.customerName,
        hallName,
        eventDate: dateStr,
      });
    }

    return this.mapBooking(updated);
  }

  async dashboard() {
    const today = toDateOnly(new Date());
    const [pendingCount, todaysEvents] = await Promise.all([
      this.prisma.booking.count({ where: { status: 'pending' } }),
      this.prisma.booking.findMany({
        where: {
          eventDate: today,
          status: { in: ['pending', 'confirmed'] },
        },
        orderBy: { startTime: 'asc' },
      }),
    ]);
    return {
      pendingCount,
      todaysEvents: todaysEvents.map((b) => this.mapBooking(b)),
    };
  }

  /** Staff month grid: booked if pending/confirmed; else blocked if any block; else open. */
  async monthAgenda(fromStr: string, toStr: string) {
    const from = toDateOnly(fromStr);
    const to = toDateOnly(toStr);

    const [bookings, blocks] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          eventDate: { gte: from, lte: to },
          status: { in: ['pending', 'confirmed'] },
        },
        select: { eventDate: true },
      }),
      this.prisma.blockedSlot.findMany({
        where: { date: { gte: from, lte: to } },
        select: { date: true },
      }),
    ]);

    const bookedDates = new Set(bookings.map((b) => formatDateOnly(b.eventDate)));
    const blockedDates = new Set(blocks.map((b) => formatDateOnly(b.date)));

    const days: { date: string; status: 'open' | 'booked' | 'blocked' }[] = [];
    const cursor = new Date(from.getTime());
    while (cursor.getTime() <= to.getTime()) {
      const date = formatDateOnly(cursor);
      let status: 'open' | 'booked' | 'blocked' = 'open';
      if (bookedDates.has(date)) status = 'booked';
      else if (blockedDates.has(date)) status = 'blocked';
      days.push({ date, status });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return {
      from: formatDateOnly(from),
      to: formatDateOnly(to),
      days,
    };
  }

  /** Staff day popup: full bookings (incl. notes) + blocked slots. */
  async dayAgenda(dateStr: string) {
    const date = toDateOnly(dateStr);
    const [bookings, blocks] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          eventDate: date,
          status: { in: ['pending', 'confirmed'] },
        },
        orderBy: [{ startTime: 'asc' }],
      }),
      this.prisma.blockedSlot.findMany({
        where: { date },
        orderBy: [{ startTime: 'asc' }],
      }),
    ]);

    return {
      date: formatDateOnly(date),
      bookings: bookings.map((b) => this.mapBooking(b)),
      blockedSlots: blocks.map((slot) => {
        const venue = getVenue(slot.hallSlug);
        return {
          id: slot.id,
          hallSlug: slot.hallSlug,
          hall: venue
            ? { name: venue.name, slug: venue.slug }
            : { name: slot.hallSlug, slug: slot.hallSlug },
          date: formatDateOnly(slot.date),
          startTime: slot.startTime,
          endTime: slot.endTime,
          reason: slot.reason,
          createdAt: slot.createdAt.toISOString(),
        };
      }),
    };
  }
}
