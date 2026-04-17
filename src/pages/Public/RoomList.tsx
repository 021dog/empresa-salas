import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { RoomType } from '../../types';
import { motion } from 'motion/react';
import { Users, Filter, ChevronRight, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function RoomList() {
  const { rooms, getRoomStatus } = useWorkspace();
  const [filterType, setFilterType] = useState<RoomType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const roomTypes: (RoomType | 'All')[] = ['All', 'Coworking', 'Private Office', 'Meeting Room', 'Lounge'];

  const filteredRooms = rooms.filter(room => {
    const matchesType = filterType === 'All' || room.type === filterType;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-black mb-4">Escolha seu espaço</h1>
          <p className="text-gray-500 max-w-2xl">
            Encontre o ambiente ideal para suas necessidades. De salas de foco individual a grandes auditórios.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {roomTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  filterType === type
                    ? "bg-black text-white border-black shadow-md ring-2 ring-black/10"
                    : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                )}
              >
                {type === 'All' ? 'Todos' : type}
              </button>
            ))}
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou características..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
        </div>

        {/* Room Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/salas/${room.id}`} className="group block h-full">
                  <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] h-full flex flex-col">
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <img
                        src={room.imageUrl}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm text-black inline-block">
                          {room.type}
                        </span>
                        {getRoomStatus(room.id) === 'busy' ? (
                          <span className="bg-red-500/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm text-white inline-block">
                            Ocupada Agora
                          </span>
                        ) : (
                          <span className="bg-green-500/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm text-white inline-block">
                            Disponível
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold tracking-tight text-black group-hover:text-gray-600 transition-colors">
                          {room.name}
                        </h2>
                        <div className="flex items-center text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                          <Users className="w-4 h-4 mr-1.5" />
                          <span className="text-sm font-bold">{room.capacity}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-8 flex-1">
                        {room.description}
                      </p>
                      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-black">R${room.pricePerHour}</span>
                          <span className="text-gray-400 text-sm"> / hora</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all transform group-hover:translate-x-1">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-6">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Nenhuma sala encontrada</h3>
            <p className="text-gray-400">Tente ajustar seus filtros ou busca.</p>
            <button
              onClick={() => { setFilterType('All'); setSearchQuery(''); }}
              className="mt-6 text-black font-bold underline underline-offset-4"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
