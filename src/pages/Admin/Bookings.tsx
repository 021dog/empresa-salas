import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Calendar as CalendarIcon, Clock, Building2, X, Plus, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminBookings() {
  const { bookings, rooms, companies, createBooking, cancelBooking } = useWorkspace();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' as 'success' | 'error' });

  // Form State
  const [formData, setFormData] = useState({
    roomId: '',
    companyId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
  });

  const activeBookings = bookings.filter(b => b.status === 'confirmed');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayBookings = (day: Date) => {
    return activeBookings.filter(b => isSameDay(new Date(b.date + 'T12:00:00'), day));
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = createBooking(formData);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setTimeout(() => {
          setIsModalOpen(false);
          setMessage({ text: '', type: 'success' });
      }, 1500);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black mb-1">Mapa de Reservas</h1>
          <p className="text-gray-500 text-sm">Controle de ocupação e novos agendamentos.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Reserva
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Calendar Column */}
        <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </h2>
                    <div className="flex space-x-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-px mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d} className="pb-4">{d}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-4">
                    {/* Padding for first day of month if needed */}
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => <div key={`empty-${i}`} />)}

                    {calendarDays.map((day) => {
                        const dayBookings = getDayBookings(day);
                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "aspect-square rounded-2xl p-2 border transition-all flex flex-col",
                                    isToday(day) ? "border-black font-bold ring-2 ring-black/5" : "border-gray-100",
                                    dayBookings.length > 0 ? "bg-gray-50/50" : "bg-white"
                                )}
                            >
                                <span className={cn("text-xs mb-1", isToday(day) ? "text-black" : "text-gray-500")}>
                                    {format(day, 'd')}
                                </span>
                                <div className="flex-1 overflow-hidden space-y-1">
                                    {dayBookings.map(b => (
                                        <div key={b.id} className="h-1.5 w-full bg-black rounded-full" title={b.startTime} />
                                    ))}
                                    {dayBookings.length > 3 && <div className="text-[8px] text-gray-400 font-bold">+{dayBookings.length - 3}</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* List Column */}
        <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h2 className="text-base font-bold">Reservas Confirmadas</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {activeBookings.length > 0 ? (
                        activeBookings.map((booking) => {
                            const room = rooms.find(r => r.id === booking.roomId);
                            const company = companies.find(c => c.id === booking.companyId);
                            return (
                                <div key={booking.id} className="p-4 m-2 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm font-bold text-black">{company?.name}</p>
                                        <button
                                            onClick={() => cancelBooking(booking.id)}
                                            className="text-[10px] text-red-400 hover:text-red-600 font-bold uppercase tracking-wider"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Building2 className="w-3 h-3 mr-2" />
                                            {room?.name}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <CalendarIcon className="w-3 h-3 mr-2" />
                                            {format(new Date(booking.date + 'T12:00:00'), 'dd/MM/yyyy')}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Clock className="w-3 h-3 mr-2" />
                                            {booking.startTime} - {booking.endTime}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="p-12 text-center text-sm text-gray-400 text-balance italic">Sem reservas ativas no sistema.</p>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* New Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold">Agendar Espaço</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                    <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {message.text && (
                        <div className={cn(
                            "p-4 rounded-xl text-sm flex items-center",
                            message.type === 'success' ? "bg-green-50 text-green-700 font-medium" : "bg-red-50 text-red-700 font-medium"
                        )}>
                            {message.type === 'error' && <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />}
                            {message.text}
                        </div>
                    )}
                    <div className="space-y-5">
                       <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Sala</label>
                            <select
                                required
                                value={formData.roomId}
                                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black appearance-none"
                            >
                                <option value="">Selecione uma sala...</option>
                                {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Empresa</label>
                            <select
                                required
                                value={formData.companyId}
                                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black appearance-none"
                            >
                                <option value="">Selecione uma empresa...</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Data</label>
                            <input
                                required
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Início</label>
                                <input
                                    required
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fim</label>
                                <input
                                    required
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800 transition-all text-sm uppercase tracking-widest"
                        >
                            Confirmar Reserva
                        </button>
                    </div>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
