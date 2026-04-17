export type RoomType = 'Coworking' | 'Private Office' | 'Meeting Room' | 'Lounge' | 'Auditorium';
export type RoomStatus = 'available' | 'busy' | 'maintenance';
export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';
export type WaitlistStatus = 'waiting' | 'served' | 'rejected';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  description: string;
  pricePerHour: number;
  imageUrl: string;
  status?: RoomStatus;
  features?: string[];
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  residentSince: string;
  contactEmail: string;
  website?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  userEmail?: string;
  companyId: string;
  date: string; // ISO format
  startTime: string; // Formato HH:mm
  endTime: string; // Formato HH:mm
  status: BookingStatus;
  notes?: string;
}

export interface WaitlistEntry {
  id: string;
  roomId: string;
  userName: string;
  userEmail: string;
  interestDetails?: string;
  status: WaitlistStatus;
  priorityLevel?: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'management' | 'user';
}
