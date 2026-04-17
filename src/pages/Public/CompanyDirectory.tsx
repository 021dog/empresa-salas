import { useWorkspace } from '../../context/WorkspaceContext';
import { motion } from 'motion/react';
import { Building2, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function CompanyDirectory() {
  const { companies } = useWorkspace();

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Ecossistema</h2>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black">Diretório de Empresas</h1>
          <p className="text-gray-500 mt-4 max-w-2xl text-lg">
            Conheça as mentes brilhantes e empresas inovadoras que chamam o WorkSpace Central de casa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gray-50 rounded-3xl p-8 border border-transparent hover:border-black/10 hover:bg-white hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm border border-gray-100">
                  <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold tracking-tight">{company.name}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white border border-gray-100 px-2.5 py-1 rounded-full group-hover:border-black group-hover:text-black transition-colors">
                      Residente
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {company.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center text-xs text-gray-400">
                      <Mail className="w-3.5 h-3.5 mr-2" />
                      {company.contactEmail}
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5 mr-2" />
                      Desde {format(new Date(company.residentSince), 'MMMM yyyy')}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Banner */}
        <div className="mt-24 p-12 bg-black rounded-[40px] text-white overflow-hidden relative">
          <div className="relative z-10 md:max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Traga sua empresa para nossa rede.</h2>
            <p className="text-gray-400 mb-10 text-lg">
              Mais do que um metro quadrado, oferecemos a conexão necessária para o sucesso.
            </p>
            <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest text-sm">
              Solicitar Proposta
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 hidden md:block">
             <img src="https://picsum.photos/seed/community2/800/800" alt="community" className="w-full h-full object-cover grayscale invert" />
          </div>
        </div>
      </div>
    </div>
  );
}
