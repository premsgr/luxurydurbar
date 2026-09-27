import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getVenue } from '@luxurydurbar/shared';
import { PrismaService } from '../prisma/prisma.service';
import { formatDateOnly, timeToMinutes, toDateOnly } from '../common/time.util';

@Injectable()
export class BlockedSlotsService {
  constructor(private readonly prisma: PrismaService) {}

  private map(slot: {
    id: string;
    hallSlug: string;
    date: Date;
    startTime: string;
    endTime: string;
    reason: string | null;
    createdAt: Date;
  }) {
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
  }

  async list(hallSlug?: string) {
    const slots = await this.prisma.blockedSlot.findMany({
      where: hallSlug ? { hallSlug } : undefined,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
    return slots.map((s) => this.map(s));
  }

  async create(data: {
    hallSlug: string;
    date: string;
    startTime: string;
    endTime: string;
    reason?: string;
  }) {
    if (timeToMinutes(data.endTime) <= timeToMinutes(data.startTime)) {
      throw new BadRequestException('endTime must be after startTime');
    }
    const venue = getVenue(data.hallSlug);
    if (!venue) throw new NotFoundException('Hall not found');

    const slot = await this.prisma.blockedSlot.create({
      data: {
        hallSlug: venue.slug,
        date: toDateOnly(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        reason: data.reason,
      },
    });
    return this.map(slot);
  }

  async remove(id: string) {
    const existing = await this.prisma.blockedSlot.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Blocked slot not found');
    await this.prisma.blockedSlot.delete({ where: { id } });
    return { ok: true };
  }
}
