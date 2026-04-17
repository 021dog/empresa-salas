import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Building2, Search, Mail, ExternalLink, Filter, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CompanyDirectory() {
  const { companies, rooms } = useWorkspace();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-20">
      <header className="mb-20 text-center max-w-3xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-black text-black tracking-tighter mb-6">Comunidade Vibrante</h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Conheça as empresas que escolheram o WorkSpace Central para impulsionar seus negócios. Networking e colaboração em um só lugar.
          </p>
        </motion.div>
      </header>

      {/* Search and Filters */}
      <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
          <input 
            type="text"
            placeholder="Buscar por nome ou setor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Setores
        </button>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCompanies.map((company, i) => (
            <motion.div
              layout
              key={company.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 p-4 transition-transform group-hover:rotate-3">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <h3 className="text-xl font-bold text-black mb-3">{company.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                {company.description}
              </p>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center text-xs text-gray-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-2 shrink-0" />
                  <span>Residente desde {format(new Date(company.residentSince), 'MMMM \'de\' yyyy', { locale: ptBR })}</span>
                </div>
                <div className="flex items-center text-xs text-gray-400 font-medium truncate">
                  <Mail className="w-3.5 h-3.5 mr-2 shrink-0" />
                  <span>{company.contactEmail}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCompanies.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-400 font-medium italic">Nenhuma empresa encontrada com este critério.</p>
        </div>
      )}
    </div>
  );
}
