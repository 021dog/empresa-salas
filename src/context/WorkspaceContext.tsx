import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Company, Booking, WaitlistEntry, User } from '../types';
import { MOCK_ROOMS, MOCK_COMPANIES, MOCK_BOOKINGS, MOCK_WAITLIST } from '../data/mockData';
import { isBefore, isAfter, parse, format, isEqual } from 'date-fns';

interface WorkspaceContextType {
  rooms: Room[];
  companies: Company[];
  bookings: Booking[];
  waitlist: WaitlistEntry[];
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  // CRUD Rooms
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  // CRUD Companies
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  // Bookings
  createBooking: (booking: Omit<Booking, 'id' | 'status'>) => { success: boolean, message: string };
  cancelBooking: (id: string) => void;
  // Waitlist
  addToWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'createdAt'>) => void;
  removeFromWaitlist: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(MOCK_WAITLIST);
  const [user, setUser] = useState<User | null>(null);

  // Auth logic
  const login = async (email: string) => {
    // Mock login - anyone is admin for demo
    if (email.includes('@')) {
      setUser({ id: 'admin-1', name: 'Administrador', email, role: 'admin' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  // Room CRUD
  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom = { ...room, id: Math.random().toString(36).substr(2, 9) };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (id: string, room: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...room } : r));
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  // Company CRUD
  const addCompany = (company: Omit<Company, 'id'>) => {
    const newCompany = { ...company, id: Math.random().toString(36).substr(2, 9) };
    setCompanies(prev => [...prev, newCompany]);
  };

  const updateCompany = (id: string, company: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...company } : c));
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  // Booking logic with conflict control
  const createBooking = (newBooking: Omit<Booking, 'id' | 'status'>) => {
    // Conflict check
    const hasConflict = bookings.some(b => {
      if (b.status === 'cancelled') return false;
      if (b.roomId !== newBooking.roomId) return false;
      if (b.date !== newBooking.date) return false;

      const existingStart = parse(b.startTime, 'HH:mm', new Date());
      const existingEnd = parse(b.endTime, 'HH:mm', new Date());
      const newStart = parse(newBooking.startTime, 'HH:mm', new Date());
      const newEnd = parse(newBooking.endTime, 'HH:mm', new Date());

      // (StartA < EndB) and (EndA > StartB)
      return (newStart < existingEnd) && (newEnd > existingStart);
    });

    if (hasConflict) {
      return { success: false, message: 'Já existe uma reserva para esta sala neste horário.' };
    }

    const booking: Booking = {
      ...newBooking,
      id: Math.random().toString(36).substr(2, 9),
      status: 'confirmed'
    };
    setBookings(prev => [...prev, booking]);
    return { success: true, message: 'Reserva realizada com sucesso!' };
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  // Waitlist
  const addToWaitlist = (entry: Omit<WaitlistEntry, 'id' | 'createdAt'>) => {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setWaitlist(prev => [...prev, newEntry]);
  };

  const removeFromWaitlist = (id: string) => {
    setWaitlist(prev => prev.filter(e => e.id !== id));
  };

  return (
    <WorkspaceContext.Provider value={{
      rooms, companies, bookings, waitlist, user,
      login, logout,
      addRoom, updateRoom, deleteRoom,
      addCompany, updateCompany, deleteCompany,
      createBooking, cancelBooking,
      addToWaitlist, removeFromWaitlist
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
