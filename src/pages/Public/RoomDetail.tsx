import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Wifi,
  Coffee,
  Monitor,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, companies, createBooking, addToWaitlist, getRoomStatus } = useWorkspace();
  const room = rooms.find(r => r.id === id);
  const currentStatus = room ? getRoomStatus(room.id) : 'available';

  const [bookingDate, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [isReserving, setIsReserving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' as 'success' | 'error' });

  if (!room) return <div className="py-20 text-center">Sala não encontrada.</div>;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyId) {
      setMessage({ text: 'Selecione uma empresa para a reserva.', type: 'error' });
      return;
    }

    const result = createBooking({
      roomId: room.id,
      companyId: selectedCompanyId,
      date: bookingDate,
      startTime,
      endTime
    });

    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });

    if (result.success) {
      setTimeout(() => {
        navigate('/salas');
      }, 2000);
    }
  };

  const handleWaitlist = () => {
    addToWaitlist({
      roomId: room.id,
      userName: 'Usuário Interessado',
      userEmail: 'interessado@email.com'
    });
    setMessage({ text: 'Adicionado à lista de espera com sucesso!', type: 'success' });
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Top Banner */}
      <div className="h-64 md:h-96 relative overflow-hidden">
        <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
            <Link to="/salas" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para salas
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {room.type}
                  </span>
                  {currentStatus === 'busy' ? (
                    <span className="inline-block bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      Ocupada Agora
                    </span>
                  ) : (
                    <span className="inline-block bg-green-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      Disponível Agora
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">{room.name}</h1>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-white">
                <p className="text-sm font-medium opacity-80 mb-1">A partir de</p>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">R${room.pricePerHour}</span>
                  <span className="ml-1 opacity-80">/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Sobre este espaço</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {room.description} Localizado em uma área privilegiada do nosso complexo empresarial, este espaço foi projetado para maximizar a produtividade e o bem-estar da sua equipe.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: 'Capacidade', value: `${room.capacity} pessoas`, icon: Users },
                  { label: 'Wi-Fi 6G', value: 'Incluso', icon: Wifi },
                  { label: 'Café & Chá', value: 'À vontade', icon: Coffee },
                  { label: 'Monitor 4K', value: 'Disponível', icon: Monitor },
                ].map((amenity, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <amenity.icon className="w-5 h-5 text-black mb-3" />
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{amenity.label}</p>
                    <p className="text-sm font-semibold text-black">{amenity.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Infraestrutura e Regras</h2>
                <div className="space-y-4">
                    {[
                        'Ar condicionado central com controle individual',
                        'Acessos controlados por biometria facial',
                        'Limpeza rigorosa antes e depois do uso',
                        'Suporte técnico presencial em horário comercial',
                        'Mobiliário ergonômico de alta padrão'
                    ].map((rule, i) => (
                        <div key={i} className="flex items-center text-gray-600">
                            <ShieldCheck className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                            <span className="text-sm">{rule}</span>
                        </div>
                    ))}
                </div>
            </section>
          </div>

          {/* Reservation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Reservar Espaço</h3>

              <AnimatePresence mode="wait">
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "p-4 rounded-xl mb-6 flex items-start text-sm",
                      message.type === 'success' ? "bg-green-50 text-green-700 font-medium" : "bg-red-50 text-red-700 font-medium"
                    )}
                  >
                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" /> : <AlertCircle className="w-4 h-4 mr-2 shrink-0" />}
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleBooking} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Sua Empresa</label>
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black appearance-none cursor-pointer"
                  >
                    <option value="">Selecione sua empresa...</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Data</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Início</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Fim</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/20 flex items-center justify-center group"
                >
                  Confirmar Reserva
                  <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-center text-sm text-gray-500 mb-4">Sala ocupada ou sem horários?</p>
                <button
                  onClick={handleWaitlist}
                  className="w-full py-3 border-2 border-black text-black font-bold rounded-xl hover:bg-gray-50 transition-all text-sm"
                >
                  Entrar na Lista de Espera
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
