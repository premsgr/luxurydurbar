import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HallsModule } from './halls/halls.module';
import { BookingsModule } from './bookings/bookings.module';
import { AvailabilityModule } from './availability/availability.module';
import { BlockedSlotsModule } from './blocked-slots/blocked-slots.module';
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
    HallsModule,
    BookingsModule,
    AvailabilityModule,
    BlockedSlotsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
