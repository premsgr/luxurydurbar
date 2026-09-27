export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'rejected',
  'cancelled',
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const EVENT_TYPES = [
  'wedding',
  'reception',
  'birthday',
  'corporate',
  'engagement',
  'anniversary',
  'bratabandha',
  'annaprashan',
  'festival',
  'other',
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const USER_ROLES = ['admin', 'staff'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface Venue {
  slug: string;
  name: string;
  capacity: number;
  description: string;
  amenities: string[];
  sortOrder: number;
}

/** Static venue catalog — not stored in the database */
export const VENUES: readonly Venue[] = [
  {
    slug: 'royal-durbar-hall',
    name: 'Royal Durbar Hall',
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
  },
  {
    slug: 'peacock-garden-hall',
    name: 'Peacock Garden Hall',
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
  },
  {
    slug: 'emerald-chamber',
    name: 'Emerald Chamber',
    capacity: 120,
    description:
      'An intimate chamber for private dinners, birthdays, and exclusive gatherings.',
    amenities: ['Private entrance', 'Lounge seating', 'Custom décor'],
    sortOrder: 3,
  },
] as const;

export function getVenue(slug: string): Venue | undefined {
  return VENUES.find((v) => v.slug === slug);
}

export function requireVenue(slug: string): Venue {
  const venue = getVenue(slug);
  if (!venue) {
    throw new Error(`Unknown venue slug: ${slug}`);
  }
  return venue;
}

/** Inclusive last day the venue stays under repair and maintenance. */
export const VENUE_MAINTENANCE_UNTIL = '2026-10-31';

/** True for today through {@link VENUE_MAINTENANCE_UNTIL}, inclusive. */
export function isVenueUnderMaintenance(isoDate: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return isoDate >= today && isoDate <= VENUE_MAINTENANCE_UNTIL;
}

/** @deprecated Use Venue — kept for gradual migration of UI types */
export type HallDto = Venue;

export interface BookingDto {
  id: string;
  hallSlug: string;
  hall?: Pick<Venue, 'name' | 'slug'>;
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  eventType: EventType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedSlotDto {
  id: string;
  hallSlug: string;
  hall?: Pick<Venue, 'name' | 'slug'>;
  date: string;
  startTime: string;
  endTime: string;
  reason: string | null;
  createdAt: string;
}

export interface CreateBookingRequest {
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
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  available: boolean;
  reason?: 'booking' | 'blocked';
}

export interface AvailabilityResponse {
  hallSlug: string;
  date: string;
  slots: AvailabilitySlot[];
  available: boolean;
}

export interface OccupancySlot {
  startTime: string;
  endTime: string;
  status: 'open' | 'booked' | 'blocked';
  eventType?: EventType;
}

export interface HallOccupancy {
  hallSlug: string;
  hallName: string;
  slots: OccupancySlot[];
}

export interface OccupancyOverview {
  date: string;
  halls: HallOccupancy[];
}

export interface MonthDayStatus {
  date: string;
  status: 'open' | 'booked';
}

export interface MonthOccupancy {
  from: string;
  to: string;
  days: MonthDayStatus[];
}

/** Staff dashboard calendar — day may be open, have bookings, or only blocks. */
export interface AdminMonthDayStatus {
  date: string;
  status: 'open' | 'booked' | 'blocked';
}

export interface AdminMonthOccupancy {
  from: string;
  to: string;
  days: AdminMonthDayStatus[];
}

export interface AdminDayAgenda {
  date: string;
  bookings: BookingDto[];
  blockedSlots: BlockedSlotDto[];
}

export interface StaffUserDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateStaffRequest {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}
