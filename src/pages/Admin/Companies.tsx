import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Plus, Edit3, Trash2, X, Building2, User } from 'lucide-react';
import { Company } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export default function AdminCompanies() {
  const { companies, addCompany, updateCompany, deleteCompany } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Omit<Company, 'id'>>({
    name: '',
    logo: 'https://picsum.photos/seed/company' + Math.floor(Math.random() * 1000) + '/200/200',
    description: '',
    residentSince: format(new Date(), 'yyyy-MM-dd'),
    contactEmail: '',
  });

  const handleOpenModal = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      setFormData({ ...company });
    } else {
      setEditingCompany(null);
      setFormData({
        name: '',
        logo: 'https://picsum.photos/seed/company' + Math.floor(Math.random() * 1000) + '/200/200',
        description: '',
        residentSince: format(new Date(), 'yyyy-MM-dd'),
        contactEmail: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (editingCompany) {
        updateCompany(editingCompany.id, formData);
      } else {
        addCompany(formData);
      }
      setIsSaving(false);
      setIsModalOpen(false);
    }, 600);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a empresa "${name}"? Esta ação é irreversível.`)) {
      deleteCompany(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black mb-1">Empresas Residentes</h1>
          <p className="text-gray-500 text-sm">Diretório de parceiros e membros da comunidade.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Empresa
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Empresa</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Contato</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Residente Desde</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-10 h-10 rounded-lg object-cover mr-4"
                    />
                    <div>
                        <p className="font-bold text-black">{company.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">{company.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-2 text-gray-400" />
                        {company.contactEmail}
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                    {format(new Date(company.residentSince), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleOpenModal(company)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(company.id, company.name)}
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
                <h2 className="text-xl font-bold">{editingCompany ? 'Editar Empresa' : 'Nova Empresa'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nome da Empresa</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email de Contato</label>
                  <input
                    required
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Data de Início da Residência</label>
                  <input
                    required
                    type="date"
                    value={formData.residentSince}
                    onChange={(e) => setFormData({ ...formData, residentSince: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Descrição / Atividade</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800 transition-all text-sm uppercase tracking-widest disabled:opacity-50"
                  >
                    {isSaving ? 'Registrando...' : (editingCompany ? 'Salvar Alterações' : 'Registrar Empresa')}
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
