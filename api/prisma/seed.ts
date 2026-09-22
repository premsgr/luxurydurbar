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
  await prisma.hallImage.deleteMany();
  await prisma.hall.deleteMany();

  const royal = await prisma.hall.create({
    data: {
      name: 'Royal Durbar Hall',
      slug: 'royal-durbar-hall',
      capacity: 800,
      description:
        'Our flagship banquet hall with crystal chandeliers, grand stage, and space for up to 800 guests. Ideal for weddings and large celebrations.',
      amenities: [
        'Crystal chandeliers',
        'LED stage lighting',
        'Bridal suite',
        'Valet parking',
        'In-house catering kitchen',
      ],
      sortOrder: 1,
      published: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b2?w=1600',
            caption: 'Grand ballroom',
            sortOrder: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600',
            caption: 'Evening reception',
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const peacock = await prisma.hall.create({
    data: {
      name: 'Peacock Garden Hall',
      slug: 'peacock-garden-hall',
      capacity: 350,
      description:
        'An elegant mid-size hall with garden terrace views — perfect for receptions, engagements, and corporate evenings.',
      amenities: [
        'Garden terrace',
        'Natural light',
        'AV system',
        'Dedicated bar area',
      ],
      sortOrder: 2,
      published: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1478144592103-25e218a04891?w=1600',
            caption: 'Garden ambiance',
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.hall.create({
    data: {
      name: 'Emerald Chamber',
      slug: 'emerald-chamber',
      capacity: 120,
      description:
        'An intimate chamber for private dinners, birthdays, and exclusive gatherings.',
      amenities: ['Private entrance', 'Lounge seating', 'Custom décor'],
      sortOrder: 3,
      published: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600',
            caption: 'Intimate dining',
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const inTwoWeeks = new Date();
  inTwoWeeks.setUTCDate(inTwoWeeks.getUTCDate() + 14);
  inTwoWeeks.setUTCHours(0, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);
  nextWeek.setUTCHours(0, 0, 0, 0);

  await prisma.booking.createMany({
    data: [
      {
        hallId: royal.id,
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
        hallId: peacock.id,
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
