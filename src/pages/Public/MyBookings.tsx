import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, XCircle, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MyBookings() {
  const { bookings, rooms, user, cancelBooking } = useWorkspace();

  // Filter bookings for the current user
  const userBookings = bookings.filter(b => b.userId === user?.id);

  const getRoomName = (roomId: string) => {
    return rooms.find(r => r.id === roomId)?.name || 'Sala desconhecida';
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      await cancelBooking(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold tracking-tighter text-black mb-2">Minhas Reservas</h1>
        <p className="text-gray-500">Gerencie seus agendamentos de salas e espaços.</p>
      </motion.div>

      {userBookings.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-black mb-2">Nenhuma reserva encontrada</h3>
          <p className="text-gray-500 mb-6">Você ainda não realizou nenhum agendamento de sala.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {userBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-white border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                booking.status === 'cancelled' ? 'opacity-60 border-gray-200 bg-gray-50' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${
                  booking.status === 'cancelled' ? 'bg-gray-200 text-gray-500' : 'bg-black text-white'
                }`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">{getRoomName(booking.roomId)}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(parseISO(booking.date), "dd 'de' MMMM", { locale: ptBR })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                  {booking.status === 'cancelled' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-2">
                      Cancelada
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {booking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancelar
                  </button>
                )}
                <div className="md:hidden pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                  <Info className="w-3 h-3" />
                  Status: {booking.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
