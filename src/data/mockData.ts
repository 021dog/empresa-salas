import { Room, Company, Booking, WaitlistEntry } from '../types';

export const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    name: 'Boardroom Alfa',
    type: 'Meeting Room',
    capacity: 12,
    description: 'Sala de reuniões executiva com tecnologia de ponta e vista panorâmica.',
    pricePerHour: 150,
    imageUrl: 'https://picsum.photos/seed/office1/800/600',
  },
  {
    id: '2',
    name: 'Open Space Sul',
    type: 'Coworking',
    capacity: 50,
    description: 'Espaço compartilhado vibrante para nômades digitais e freelancers.',
    pricePerHour: 25,
    imageUrl: 'https://picsum.photos/seed/coworking1/800/600',
  },
  {
    id: '3',
    name: 'Executive Suite 101',
    type: 'Private Office',
    capacity: 4,
    description: 'Escritório privativo mobiliado para pequenas equipes focadas.',
    pricePerHour: 80,
    imageUrl: 'https://picsum.photos/seed/suite1/800/600',
  },
  {
    id: '4',
    name: 'Zen Lounge',
    type: 'Lounge',
    capacity: 20,
    description: 'Ambiente relaxante para pausas criativas e networking informal.',
    pricePerHour: 40,
    imageUrl: 'https://picsum.photos/seed/lounge1/800/600',
  },
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    logo: 'https://picsum.photos/seed/techflow/200/200',
    description: 'Sistemas inovadores para o mercado financeiro.',
    residentSince: '2023-01-15',
    contactEmail: 'contact@techflow.com',
  },
  {
    id: '2',
    name: 'GreenDesign Studio',
    logo: 'https://picsum.photos/seed/green/200/200',
    description: 'Arquitetura sustentável e design de interiores.',
    residentSince: '2022-06-10',
    contactEmail: 'hi@greendesign.io',
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    roomId: '1',
    companyId: '1',
    userId: 'admin-1',
    date: '2026-04-20',
    startTime: '09:00',
    endTime: '11:00',
    status: 'confirmed',
  },
];

export const MOCK_WAITLIST: WaitlistEntry[] = [];
