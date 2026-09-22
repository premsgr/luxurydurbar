import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/time.util';

@Injectable()
export class HallsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapHall(hall: {
    id: string;
    name: string;
    slug: string;
    capacity: number;
    description: string;
    amenities: string[];
    sortOrder: number;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    images: {
      id: string;
      url: string;
      caption: string | null;
      sortOrder: number;
    }[];
  }) {
    return {
      id: hall.id,
      name: hall.name,
      slug: hall.slug,
      capacity: hall.capacity,
      description: hall.description,
      amenities: hall.amenities,
      sortOrder: hall.sortOrder,
      published: hall.published,
      images: hall.images
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((img) => ({
          id: img.id,
          url: img.url,
          caption: img.caption,
          sortOrder: img.sortOrder,
        })),
      createdAt: hall.createdAt.toISOString(),
      updatedAt: hall.updatedAt.toISOString(),
    };
  }

  async listPublic() {
    const halls = await this.prisma.hall.findMany({
      where: { published: true },
      include: { images: true },
      orderBy: { sortOrder: 'asc' },
    });
    return halls.map((h) => this.mapHall(h));
  }

  async listAll() {
    const halls = await this.prisma.hall.findMany({
      include: { images: true },
      orderBy: { sortOrder: 'asc' },
    });
    return halls.map((h) => this.mapHall(h));
  }

  async getByIdOrSlug(idOrSlug: string, publishedOnly = false) {
    const hall = await this.prisma.hall.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        ...(publishedOnly ? { published: true } : {}),
      },
      include: { images: true },
    });
    if (!hall) throw new NotFoundException('Hall not found');
    return this.mapHall(hall);
  }

  async create(data: {
    name: string;
    capacity: number;
    description: string;
    amenities?: string[];
    sortOrder?: number;
    published?: boolean;
    images?: { url: string; caption?: string; sortOrder?: number }[];
    slug?: string;
  }) {
    const slug = data.slug || slugify(data.name);
    const existing = await this.prisma.hall.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Hall slug already exists');

    const hall = await this.prisma.hall.create({
      data: {
        name: data.name,
        slug,
        capacity: data.capacity,
        description: data.description,
        amenities: data.amenities ?? [],
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
        images: data.images?.length
          ? {
              create: data.images.map((img, i) => ({
                url: img.url,
                caption: img.caption,
                sortOrder: img.sortOrder ?? i,
              })),
            }
          : undefined,
      },
      include: { images: true },
    });
    return this.mapHall(hall);
  }

  async update(
    id: string,
    data: {
      name?: string;
      capacity?: number;
      description?: string;
      amenities?: string[];
      sortOrder?: number;
      published?: boolean;
      slug?: string;
      images?: { url: string; caption?: string; sortOrder?: number }[];
    },
  ) {
    const existing = await this.prisma.hall.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Hall not found');

    if (data.slug && data.slug !== existing.slug) {
      const clash = await this.prisma.hall.findUnique({
        where: { slug: data.slug },
      });
      if (clash) throw new ConflictException('Hall slug already exists');
    }

    const hall = await this.prisma.$transaction(async (tx) => {
      if (data.images) {
        await tx.hallImage.deleteMany({ where: { hallId: id } });
        await tx.hallImage.createMany({
          data: data.images.map((img, i) => ({
            hallId: id,
            url: img.url,
            caption: img.caption,
            sortOrder: img.sortOrder ?? i,
          })),
        });
      }
      return tx.hall.update({
        where: { id },
        data: {
          name: data.name,
          capacity: data.capacity,
          description: data.description,
          amenities: data.amenities,
          sortOrder: data.sortOrder,
          published: data.published,
          slug: data.slug,
        },
        include: { images: true },
      });
    });
    return this.mapHall(hall);
  }

  async remove(id: string) {
    const existing = await this.prisma.hall.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Hall not found');
    await this.prisma.hall.delete({ where: { id } });
    return { ok: true };
  }
}
