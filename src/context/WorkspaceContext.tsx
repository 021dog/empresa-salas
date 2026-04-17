import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Room, Company, Booking, WaitlistEntry, User } from '../types';
import { MOCK_ROOMS, MOCK_COMPANIES, MOCK_BOOKINGS, MOCK_WAITLIST } from '../data/mockData';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

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
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateSettings: (settings: Partial<WorkspaceSettings>) => void;
  // CRUD Rooms
  addRoom: (room: Omit<Room, 'id'>) => Promise<void>;
  updateRoom: (id: string, room: Partial<Room>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  getRoomStatus: (roomId: string) => 'available' | 'busy';
  // CRUD Companies
  addCompany: (company: Omit<Company, 'id'>) => Promise<void>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  // Bookings
  createBooking: (booking: Omit<Booking, 'id' | 'status'>) => Promise<{ success: boolean, message: string }>;
  cancelBooking: (id: string) => Promise<void>;
  // Waitlist
  addToWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'createdAt'>) => Promise<void>;
  removeFromWaitlist: (id: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(MOCK_WAITLIST);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initialSettings: WorkspaceSettings = {
    appName: 'WorkSpace Central',
    operatingHours: { open: '08:00', close: '20:00' },
    notificationsEnabled: true,
    publicBookingEnabled: true,
  };
  const [settings, setSettings] = useState<WorkspaceSettings>(initialSettings);

  // Fetch Data from Supabase
  const fetchData = useCallback(async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      const [
        { data: roomsData },
        { data: companiesData },
        { data: bookingsData },
        { data: waitlistData }
      ] = await Promise.all([
        supabase.from('rooms').select('*'),
        supabase.from('companies').select('*'),
        supabase.from('bookings').select('*'),
        supabase.from('waitlist').select('*')
      ]);

      if (roomsData) setRooms(roomsData);
      if (companiesData) setCompanies(companiesData);
      if (bookingsData) setBookings(bookingsData);
      if (waitlistData) setWaitlist(waitlistData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auth Status & Initial Load
  useEffect(() => {
    if (!supabase) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      setIsLoading(false);
      return;
    }

    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch role from profiles
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile?.full_name || session.user.email!.split('@')[0],
              role: (profile?.role as any) || 'user'
            });
          });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.full_name || session.user.email!.split('@')[0],
          role: (profile?.role as any) || 'user'
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    fetchData();

    // Set up Realtime Subscriptions
    const sub = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData())
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(sub);
    };
  }, [fetchData]);

  // Sync settings (still using localStorage for simplicity or can be in Supabase settings table)
  useEffect(() => {
    const stored = localStorage.getItem('settings');
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  // Global Auth logic
  const login = async (email: string, password?: string) => {
    if (!supabase) {
      // Prototype Fallback
      if (email.includes('@')) {
        const adminUser: User = { id: 'admin-1', name: 'Administrador (Demo)', email, role: 'admin' };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return { success: true };
      }
      return { success: false, message: 'Credenciais inválidas' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: password || '' });
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!supabase) return { success: false, message: 'Supabase não configurado' };
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });

    if (error) return { success: false, message: error.message };
    
    // Create profile
    if (data.user) {
      await supabase.from('profiles').insert([
        { id: data.user.id, full_name: name, email, role: 'user' }
      ]);
    }

    return { success: true };
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateSettings = (newSettings: Partial<WorkspaceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // CRUD Implementations with Supabase Persistence
  const addRoom = async (room: Omit<Room, 'id'>) => {
    if (supabase) {
      await supabase.from('rooms').insert([room]);
    } else {
      const newRoom = { ...room, id: Math.random().toString(36).substr(2, 9) };
      setRooms(prev => [...prev, newRoom]);
    }
  };

  const updateRoom = async (id: string, room: Partial<Room>) => {
    if (supabase) {
      await supabase.from('rooms').update(room).eq('id', id);
    } else {
      setRooms(prev => prev.map(r => r.id === id ? { ...r, ...room } : r));
    }
  };

  const deleteRoom = async (id: string) => {
    if (supabase) {
      await supabase.from('rooms').delete().eq('id', id);
    } else {
      setRooms(prev => prev.filter(r => r.id !== id));
    }
  };

  const addCompany = async (company: Omit<Company, 'id'>) => {
    if (supabase) {
      await supabase.from('companies').insert([company]);
    } else {
      const newCompany = { ...company, id: Math.random().toString(36).substr(2, 9) };
      setCompanies(prev => [...prev, newCompany]);
    }
  };

  const updateCompany = async (id: string, company: Partial<Company>) => {
    if (supabase) {
      await supabase.from('companies').update(company).eq('id', id);
    } else {
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...company } : c));
    }
  };

  const deleteCompany = async (id: string) => {
    if (supabase) {
      await supabase.from('companies').delete().eq('id', id);
    } else {
      setCompanies(prev => prev.filter(c => c.id !== id));
    }
  };

  const createBooking = async (newBooking: Omit<Booking, 'id' | 'status'>) => {
    // Conflict check logic remains the same (can also be done in Postgres Trigger)
    const hasConflict = bookings.some(b => {
      if (b.status === 'cancelled') return false;
      if (b.roomId !== newBooking.roomId) return false;
      if (b.date !== newBooking.date) return false;
      return (newBooking.startTime < b.endTime) && (newBooking.endTime > b.startTime);
    });

    if (hasConflict) {
      return { success: false, message: 'Conflito de Horário detectado.' };
    }

    if (supabase) {
      const { error } = await supabase.from('bookings').insert([{ ...newBooking, status: 'confirmed' }]);
      if (error) return { success: false, message: error.message };

      // Trigger Automation via Server
      fetch('/api/automation/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'NEW_BOOKING', data: newBooking })
      }).catch(console.error);

      // Trigger Email Notification via Local Server Proxy
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          to: user?.email || newBooking.userEmail || 'admin@workspace-central.app',
          subject: 'Confirmação de Reserva - WorkSpace Central',
          html: `<h1>Sua reserva foi confirmada!</h1><p>Sala: ${newBooking.roomId}</p><p>Data: ${newBooking.date} às ${newBooking.startTime}</p>`
        })
      }).catch(console.error);

    } else {
      const booking: Booking = { ...newBooking, id: Math.random().toString(36).substr(2, 9), status: 'confirmed' };
      setBookings(prev => [...prev, booking]);
    }

    return { success: true, message: 'Reserva confirmada!' };
  };

  const cancelBooking = async (id: string) => {
    if (supabase) {
      await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    } else {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    }
  };

  const addToWaitlist = async (entry: Omit<WaitlistEntry, 'id' | 'createdAt'>) => {
    if (supabase) {
      await supabase.from('waitlist').insert([entry]);
    } else {
      const newEntry: WaitlistEntry = { ...entry, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
      setWaitlist(prev => [...prev, newEntry]);
    }
  };

  const removeFromWaitlist = async (id: string) => {
    if (supabase) {
      await supabase.from('waitlist').delete().eq('id', id);
    } else {
      setWaitlist(prev => prev.filter(e => e.id !== id));
    }
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

  return (
    <WorkspaceContext.Provider value={{
      rooms, companies, bookings, waitlist, user, settings, isLoading,
      login, signUp, logout, updateSettings,
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
