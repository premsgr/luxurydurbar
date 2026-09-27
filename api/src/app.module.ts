import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { AvailabilityModule } from './availability/availability.module';
import { BlockedSlotsModule } from './blocked-slots/blocked-slots.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(__dirname, '../.env'), '.env'],
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    BookingsModule,
    AvailabilityModule,
    BlockedSlotsModule,
    UsersModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
