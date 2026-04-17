import { useWorkspace } from '../../context/WorkspaceContext';
import { format } from 'date-fns';
import { Mail, Trash2, Clock, User, ListOrdered, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { WaitlistStatus } from '../../types';

export default function AdminWaitlist() {
  const { waitlist, rooms, removeFromWaitlist, updateWaitlistStatus } = useWorkspace();

  const getStatusColor = (status: WaitlistStatus) => {
    switch (status) {
      case 'waiting': return 'bg-amber-100 text-amber-700';
      case 'served': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: WaitlistStatus) => {
    switch (status) {
      case 'waiting': return 'Aguardando';
      case 'served': return 'Atendido';
      case 'rejected': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-black mb-1">Lista de Espera</h1>
        <p className="text-gray-500 text-sm">Controle de interessados e leads comerciais.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {waitlist.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Interessado / Prioridade</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Espaço / Detalhes</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Registrado em</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {waitlist.sort((a, b) => (b.priorityLevel || 0) - (a.priorityLevel || 0)).map((entry) => {
                const room = rooms.find(r => r.id === entry.roomId);
                return (
                  <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 relative">
                           <User className="w-4 h-4 text-gray-400" />
                           {entry.priorityLevel && entry.priorityLevel > 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                              {entry.priorityLevel}
                            </div>
                           )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black">{entry.userName}</p>
                          <p className="text-xs text-gray-400 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {entry.userEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-black bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          {room?.name}
                        </span>
                        {entry.interestDetails && (
                          <p className="text-[11px] text-gray-500 max-w-[200px] truncate" title={entry.interestDetails}>
                            {entry.interestDetails}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tight", getStatusColor(entry.status))}>
                        {getStatusLabel(entry.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5 mr-2" />
                        {format(new Date(entry.createdAt), 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center space-x-2">
                        {entry.status === 'waiting' && (
                          <>
                            <button
                              onClick={() => updateWaitlistStatus(entry.id, 'served')}
                              className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                              title="Marcar como Atendido"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateWaitlistStatus(entry.id, 'rejected')}
                              className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                              title="Cancelar Interesse"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => removeFromWaitlist(entry.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Excluir Registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-32 text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ListOrdered className="w-8 h-8 text-gray-200" />
             </div>
             <p className="text-gray-400 font-medium italic">A lista de espera está vazia no momento.</p>
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
         <h3 className="text-blue-800 font-bold mb-2 flex items-center text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Dica do Administrador
         </h3>
         <p className="text-blue-700/80 text-xs leading-relaxed">
            Usuários na lista de espera recebem prioridade automática quando uma reserva é cancelada na sala de interesse. Você pode entrar em contato diretamente via email.
         </p>
      </div>
    </div>
  );
}
