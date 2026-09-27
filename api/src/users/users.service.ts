import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private toDto(user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async list() {
    const users = await this.prisma.user.findMany({
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
      select: { id: true, email: true, name: true, role: true },
    });
    return users.map((u) => this.toDto(u));
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
  }) {
    const email = data.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        name: data.name.trim(),
        passwordHash,
        role: data.role ?? 'staff',
      },
    });
    return this.toDto(user);
  }

  async remove(id: string, actorId: string) {
    if (id === actorId) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'admin') {
      const adminCount = await this.prisma.user.count({
        where: { role: 'admin' },
      });
      if (adminCount <= 1) {
        throw new ForbiddenException('Cannot delete the last admin');
      }
    }

    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }
}
