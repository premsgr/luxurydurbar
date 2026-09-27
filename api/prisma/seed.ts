import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@luxurydurbar.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const name = process.env.SEED_ADMIN_NAME || 'Admin';

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name, role: 'admin' },
    create: { email, passwordHash, name, role: 'admin' },
  });

  await prisma.booking.deleteMany();
  await prisma.blockedSlot.deleteMany();

  const inTwoWeeks = new Date();
  inTwoWeeks.setUTCDate(inTwoWeeks.getUTCDate() + 14);
  inTwoWeeks.setUTCHours(0, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);
  nextWeek.setUTCHours(0, 0, 0, 0);

  await prisma.booking.createMany({
    data: [
      {
        hallSlug: 'royal-durbar-hall',
        eventDate: inTwoWeeks,
        startTime: '15:00',
        endTime: '22:00',
        guestCount: 500,
        eventType: 'wedding',
        customerName: 'Anisha Sharma',
        customerEmail: 'anisha@example.com',
        customerPhone: '+9779800000001',
        notes: 'Prefer gold & ivory décor',
        status: 'confirmed',
      },
      {
        hallSlug: 'peacock-garden-hall',
        eventDate: nextWeek,
        startTime: '09:00',
        endTime: '14:00',
        guestCount: 200,
        eventType: 'corporate',
        customerName: 'Himalayan Tech',
        customerEmail: 'events@himalayantech.example',
        customerPhone: '+9779800000002',
        status: 'pending',
      },
    ],
  });

  console.log('Seed complete.');
  console.log(`Admin: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
