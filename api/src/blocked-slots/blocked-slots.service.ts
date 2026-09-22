import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { formatDateOnly, timeToMinutes, toDateOnly } from '../common/time.util';

@Injectable()
export class BlockedSlotsService {
  constructor(private readonly prisma: PrismaService) {}

  private map(slot: {
    id: string;
    hallId: string;
    date: Date;
    startTime: string;
    endTime: string;
    reason: string | null;
    createdAt: Date;
    hall?: { id: string; name: string; slug: string };
  }) {
    return {
      id: slot.id,
      hallId: slot.hallId,
      hall: slot.hall
        ? { id: slot.hall.id, name: slot.hall.name, slug: slot.hall.slug }
        : undefined,
      date: formatDateOnly(slot.date),
      startTime: slot.startTime,
      endTime: slot.endTime,
      reason: slot.reason,
      createdAt: slot.createdAt.toISOString(),
    };
  }

  async list(hallId?: string) {
    const slots = await this.prisma.blockedSlot.findMany({
      where: hallId ? { hallId } : undefined,
      include: { hall: { select: { id: true, name: true, slug: true } } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
    return slots.map((s) => this.map(s));
  }

  async create(data: {
    hallId: string;
    date: string;
    startTime: string;
    endTime: string;
    reason?: string;
  }) {
    if (timeToMinutes(data.endTime) <= timeToMinutes(data.startTime)) {
      throw new BadRequestException('endTime must be after startTime');
    }
    const hall = await this.prisma.hall.findUnique({
      where: { id: data.hallId },
    });
    if (!hall) throw new NotFoundException('Hall not found');

    const slot = await this.prisma.blockedSlot.create({
      data: {
        hallId: data.hallId,
        date: toDateOnly(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        reason: data.reason,
      },
      include: { hall: { select: { id: true, name: true, slug: true } } },
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
