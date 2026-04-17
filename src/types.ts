export type RoomType = 'Coworking' | 'Private Office' | 'Meeting Room' | 'Lounge';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  description: string;
  pricePerHour: number;
  imageUrl: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  residentSince: string;
  contactEmail: string;
}

export interface Booking {
  id: string;
  roomId: string;
  companyId: string;
  date: string; // ISO format
  startTime: string; // Formato HH:mm
  endTime: string; // Formato HH:mm
  status: 'confirmed' | 'cancelled';
}

export interface WaitlistEntry {
  id: string;
  roomId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
