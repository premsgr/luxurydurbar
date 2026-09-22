import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, EventType } from '@prisma/client';
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
    hallId: string;
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
    hall?: { id: string; name: string; slug: string };
  }) {
    return {
      id: b.id,
      hallId: b.hallId,
      hall: b.hall
        ? { id: b.hall.id, name: b.hall.name, slug: b.hall.slug }
        : undefined,
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
    hallId: string;
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

    const hall = await this.prisma.hall.findFirst({
      where: {
        OR: [{ id: data.hallId }, { slug: data.hallId }],
        published: true,
      },
    });
    if (!hall) throw new NotFoundException('Hall not found');
    if (data.guestCount > hall.capacity) {
      throw new BadRequestException(
        `Guest count exceeds hall capacity (${hall.capacity})`,
      );
    }

    const booking = await this.prisma.booking.create({
      data: {
        hallId: hall.id,
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
      include: { hall: { select: { id: true, name: true, slug: true } } },
    });

    const dateStr = formatDateOnly(booking.eventDate);
    await Promise.all([
      this.mail.bookingReceived({
        to: booking.customerEmail,
        customerName: booking.customerName,
        hallName: hall.name,
        eventDate: dateStr,
        startTime: booking.startTime,
        endTime: booking.endTime,
      }),
      this.mail.staffNewBooking({
        hallName: hall.name,
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
      include: { hall: { select: { id: true, name: true, slug: true } } },
      orderBy: [{ eventDate: 'asc' }, { startTime: 'asc' }],
    });
    return bookings.map((b) => this.mapBooking(b));
  }

  async get(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { hall: { select: { id: true, name: true, slug: true } } },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    const conflict = await this.availability.checkConflict({
      hallId: booking.hallId,
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
      include: { hall: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (status === 'confirmed') {
      const conflict = await this.availability.checkConflict({
        hallId: booking.hallId,
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
      include: { hall: { select: { id: true, name: true, slug: true } } },
    });

    const dateStr = formatDateOnly(updated.eventDate);
    if (status === 'confirmed') {
      await this.mail.bookingConfirmed({
        to: updated.customerEmail,
        customerName: updated.customerName,
        hallName: updated.hall.name,
        eventDate: dateStr,
      });
    } else if (status === 'rejected') {
      await this.mail.bookingRejected({
        to: updated.customerEmail,
        customerName: updated.customerName,
        hallName: updated.hall.name,
        eventDate: dateStr,
      });
    }

    return this.mapBooking(updated);
  }

  async calendar(from: string, to: string) {
    const fromDate = toDateOnly(from);
    const toDate = toDateOnly(to);

    const [bookings, blocks] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          eventDate: { gte: fromDate, lte: toDate },
          status: { in: ['pending', 'confirmed'] },
        },
        include: { hall: true },
      }),
      this.prisma.blockedSlot.findMany({
        where: { date: { gte: fromDate, lte: toDate } },
        include: { hall: true },
      }),
    ]);

    const items = [
      ...bookings.map((b) => ({
        id: b.id,
        type: 'booking' as const,
        hallId: b.hallId,
        hallName: b.hall.name,
        date: formatDateOnly(b.eventDate),
        startTime: b.startTime,
        endTime: b.endTime,
        title: `${b.customerName} — ${b.eventType}`,
        status: b.status,
      })),
      ...blocks.map((bl) => ({
        id: bl.id,
        type: 'blocked' as const,
        hallId: bl.hallId,
        hallName: bl.hall.name,
        date: formatDateOnly(bl.date),
        startTime: bl.startTime,
        endTime: bl.endTime,
        title: bl.reason || 'Blocked',
      })),
    ];

    return items.sort((a, b) =>
      a.date === b.date
        ? a.startTime.localeCompare(b.startTime)
        : a.date.localeCompare(b.date),
    );
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
        include: { hall: { select: { id: true, name: true, slug: true } } },
        orderBy: { startTime: 'asc' },
      }),
    ]);
    return {
      pendingCount,
      todaysEvents: todaysEvents.map((b) => this.mapBooking(b)),
    };
  }
}
