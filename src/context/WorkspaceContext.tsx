import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Company, Booking, WaitlistEntry, User } from '../types';
import { MOCK_ROOMS, MOCK_COMPANIES, MOCK_BOOKINGS, MOCK_WAITLIST } from '../data/mockData';
import { isBefore, isAfter, parse, format, isEqual, parseISO } from 'date-fns';

interface WorkspaceSettings {
  appName: string;
  operatingHours: { open: string; close: string };
  notificationsEnabled: boolean;
  publicBookingEnabled: boolean;
}

interface WorkspaceContextType {
  rooms: Room[];
  companies: Company[];
  bookings: Booking[];
  waitlist: WaitlistEntry[];
  settings: WorkspaceSettings;
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateSettings: (settings: Partial<WorkspaceSettings>) => void;
  // CRUD Rooms
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  getRoomStatus: (roomId: string) => 'available' | 'busy';
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
  // Persistence Helpers
  const getStored = <T,>(key: string, fallback: T): T => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  };

  const initialSettings: WorkspaceSettings = {
    appName: 'WorkSpace Central',
    operatingHours: { open: '08:00', close: '20:00' },
    notificationsEnabled: true,
    publicBookingEnabled: true,
  };

  const [rooms, setRooms] = useState<Room[]>(() => getStored('rooms', MOCK_ROOMS));
  const [companies, setCompanies] = useState<Company[]>(() => getStored('companies', MOCK_COMPANIES));
  const [bookings, setBookings] = useState<Booking[]>(() => getStored('bookings', MOCK_BOOKINGS));
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => getStored('waitlist', MOCK_WAITLIST));
  const [settings, setSettings] = useState<WorkspaceSettings>(() => getStored('settings', initialSettings));
  const [user, setUser] = useState<User | null>(() => getStored('user', null));

  // Sync to localStorage
  useEffect(() => localStorage.setItem('rooms', JSON.stringify(rooms)), [rooms]);
  useEffect(() => localStorage.setItem('companies', JSON.stringify(companies)), [companies]);
  useEffect(() => localStorage.setItem('bookings', JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem('waitlist', JSON.stringify(waitlist)), [waitlist]);
  useEffect(() => localStorage.setItem('settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('user', JSON.stringify(user)), [user]);

  // Auth logic
  const login = async (email: string) => {
    if (email.includes('@')) {
      setUser({ id: 'admin-1', name: 'Administrador', email, role: 'admin' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const updateSettings = (newSettings: Partial<WorkspaceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Room Status logic
  const getRoomStatus = (roomId: string): 'available' | 'busy' => {
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');
    const currentTime = format(now, 'HH:mm');

    const isOccupied = bookings.some(b => {
      if (b.status === 'cancelled') return false;
      if (b.roomId !== roomId) return false;
      if (b.date !== todayStr) return false;

      return currentTime >= b.startTime && currentTime <= b.endTime;
    });

    return isOccupied ? 'busy' : 'available';
  };

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

  // Booking logic with strict conflict control
  const createBooking = (newBooking: Omit<Booking, 'id' | 'status'>) => {
    // Basic Time Validation
    if (newBooking.endTime <= newBooking.startTime) {
      return { success: false, message: 'O horário de fim deve ser após o horário de início.' };
    }

    // Conflict check
    const hasConflict = bookings.some(b => {
      if (b.status === 'cancelled') return false;
      if (b.roomId !== newBooking.roomId) return false;
      if (b.date !== newBooking.date) return false;

      const existingStart = b.startTime;
      const existingEnd = b.endTime;
      const newStart = newBooking.startTime;
      const newEnd = newBooking.endTime;

      // Overlap logic: (StartA < EndB) and (EndA > StartB)
      return (newStart < existingEnd) && (newEnd > existingStart);
    });

    if (hasConflict) {
      return { success: false, message: 'Conflito de Horário: Esta sala já está reservada para o período selecionado.' };
    }

    const booking: Booking = {
      ...newBooking,
      id: Math.random().toString(36).substr(2, 9),
      status: 'confirmed'
    };
    setBookings(prev => [...prev, booking]);
    return { success: true, message: 'Reserva confirmada com sucesso!' };
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
      rooms, companies, bookings, waitlist, user, settings,
      login, logout, updateSettings,
      addRoom, updateRoom, deleteRoom, getRoomStatus,
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
