import { useWorkspace } from '../../context/WorkspaceContext';
import { motion } from 'motion/react';
import {
  DoorOpen,
  Building2,
  CalendarDays,
  ListOrdered,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Briefcase,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { rooms, companies, bookings, waitlist } = useWorkspace();

  const activeBookings = bookings.filter(b => b.status === 'confirmed');
  const today = format(new Date(), 'yyyy-MM-dd');
  const bookingsToday = activeBookings.filter(b => b.date === today);

  const stats = [
    { name: 'Total de Salas', value: rooms.length, icon: DoorOpen, color: 'text-blue-600', bg: 'bg-blue-50', path: '/admin/rooms' },
    { name: 'Reservas Hoje', value: bookingsToday.length, icon: CalendarDays, color: 'text-green-600', bg: 'bg-green-50', path: '/admin/bookings' },
    { name: 'Empresas Residentes', value: companies.length, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50', path: '/admin/companies' },
    { name: 'Lista de Espera', value: waitlist.length, icon: ListOrdered, color: 'text-orange-600', bg: 'bg-orange-50', path: '/admin/waitlist' },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-black mb-2">Painel de Controle</h1>
        <p className="text-gray-500 text-sm">Resumo operacional do seu empreendimento empresarial.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={stat.path} className="block group">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-black">{stat.value}</p>
                <div className="mt-4 flex items-center text-[10px] font-bold text-green-600 uppercase tracking-tighter">
                   <TrendingUp className="w-3 h-3 mr-1" />
                   +12.5% em relação ao mês anterior
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-base font-bold flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              Próximas Reservas
            </h2>
            <Link to="/admin/bookings" className="text-xs font-bold text-black hover:underline uppercase tracking-widest">Ver Todas</Link>
          </div>
          <div className="px-6 py-2 flex-grow overflow-y-auto max-h-[400px]">
            {activeBookings.length > 0 ? (
              activeBookings.slice(0, 5).map((booking) => {
                const room = rooms.find(r => r.id === booking.roomId);
                const company = companies.find(c => c.id === booking.companyId);
                return (
                  <div key={booking.id} className="py-4 border-b border-gray-50 last:border-0 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 shrink-0">
                         <Briefcase className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black">{company?.name}</p>
                        <p className="text-xs text-gray-400">{room?.name} · {booking.startTime} - {booking.endTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-black">{format(new Date(booking.date), 'dd/MM')}</p>
                       <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Confirmada</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-400">Nenhuma reserva encontrada para hoje.</p>
              </div>
            )}
          </div>
        </div>

        {/* System Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
           <div className="p-6 border-b border-gray-50">
            <h2 className="text-base font-bold flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
              Atividade Recente
            </h2>
          </div>
          <div className="p-6 flex-grow">
            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[1px] before:bg-gray-100">
               {[
                 { action: 'Nova Empresa Registrada', detail: 'GreenDesign Studio mudou-se para o 3º andar.', time: '2h atrás', icon: Building2 },
                 { action: 'Nova Reserva Confirmada', detail: 'TechFlow Solutions reservou Boardroom Alfa para amanhã.', time: '4h atrás', icon: CalendarDays },
                 { action: 'Entrada na Lista de Espera', detail: 'Um novo usuário demonstrou interesse na Suite 101.', time: '6h atrás', icon: ListOrdered },
                 { action: 'Configurações de Prédio Alteradas', detail: 'Horário de funcionamento estendido para o feriado.', time: '1 dia atrás', icon: Settings },
               ].map((activity, i) => (
                 <div key={i} className="relative pl-8">
                   <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center z-10">
                      <activity.icon className="w-3 h-3 text-gray-400" />
                   </div>
                   <p className="text-sm font-bold text-black">{activity.action}</p>
                   <p className="text-xs text-gray-500 mt-1">{activity.detail}</p>
                   <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">{activity.time}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
