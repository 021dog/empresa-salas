import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Plus, Edit3, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { Room, RoomType } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminRooms() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [formData, setFormData] = useState<Omit<Room, 'id'>>({
    name: '',
    type: 'Coworking',
    capacity: 1,
    description: '',
    pricePerHour: 0,
    imageUrl: 'https://picsum.photos/seed/office' + Math.floor(Math.random() * 1000) + '/800/600',
  });

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({ ...room });
    } else {
      setEditingRoom(null);
      setFormData({
        name: '',
        type: 'Coworking',
        capacity: 1,
        description: '',
        pricePerHour: 0,
        imageUrl: 'https://picsum.photos/seed/office' + Math.floor(Math.random() * 1000) + '/800/600',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      updateRoom(editingRoom.id, formData);
    } else {
      addRoom(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a sala "${name}"?`)) {
      deleteRoom(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black mb-1">Gestão de Salas</h1>
          <p className="text-gray-500 text-sm">Controle de inventário e configurações de espaços.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Sala
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Sala</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Tipo</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Capacidade</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Preço/h</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      className="w-12 h-12 rounded-lg object-cover mr-4 border border-gray-100"
                    />
                    <div>
                      <p className="text-sm font-bold text-black">{room.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{room.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-gray-200">
                    {room.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-black">{room.capacity} pessoas</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-black">R${room.pricePerHour}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleOpenModal(room)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id, room.name)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold">{editingRoom ? 'Editar Sala' : 'Nova Sala'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nome da Sala</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                      placeholder="Ex: Sala de Inovação"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tipo</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomType })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black appearance-none"
                    >
                      <option value="Coworking">Coworking</option>
                      <option value="Private Office">Private Office</option>
                      <option value="Meeting Room">Meeting Room</option>
                      <option value="Lounge">Lounge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Capacidade</label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Preço por Hora (R$)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.pricePerHour}
                      onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Descrição</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                      placeholder="Destaque as principais características..."
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800 transition-all text-sm uppercase tracking-widest"
                  >
                    {editingRoom ? 'Salvar Alterações' : 'Criar Sala'}
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
