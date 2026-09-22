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
  'other',
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const USER_ROLES = ['admin', 'staff'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface HallImageDto {
  id: string;
  url: string;
  caption: string | null;
  sortOrder: number;
}

export interface HallDto {
  id: string;
  name: string;
  slug: string;
  capacity: number;
  description: string;
  amenities: string[];
  sortOrder: number;
  published: boolean;
  images: HallImageDto[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingDto {
  id: string;
  hallId: string;
  hall?: Pick<HallDto, 'id' | 'name' | 'slug'>;
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
  hallId: string;
  hall?: Pick<HallDto, 'id' | 'name' | 'slug'>;
  date: string;
  startTime: string;
  endTime: string;
  reason: string | null;
  createdAt: string;
}

export interface CreateBookingRequest {
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
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  available: boolean;
  reason?: 'booking' | 'blocked';
}

export interface AvailabilityResponse {
  hallId: string;
  date: string;
  slots: AvailabilitySlot[];
  available: boolean;
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

export interface CalendarItem {
  id: string;
  type: 'booking' | 'blocked';
  hallId: string;
  hallName: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  status?: BookingStatus;
}
