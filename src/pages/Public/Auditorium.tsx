import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Calendar, Users, Target, ShieldCheck, ArrowRight, Music, Mic2, Tv } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function AuditoriumPage() {
  const { rooms } = useWorkspace();
  const auditorium = rooms.find(r => r.type === 'Auditorium') || rooms.find(r => r.type === 'Meeting Room' && r.capacity >= 20);

  const perks = [
    { icon: Mic2, title: 'Sonorização Digital', description: 'Microfones sem fio e sistema de som JBL de alta fidelidade.' },
    { icon: Tv, title: 'Projeção 4K', description: 'Telão retrátil e projetor a laser para apresentações nítidas.' },
    { icon: Music, title: 'Acústica Premium', description: 'Tratamento acústico completo para palestras e workshops.' },
    { icon: ShieldCheck, title: 'Suporte Técnico', description: 'Equipe dedicada para auxiliar na configuração do seu evento.' },
  ];

  if (!auditorium) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Auditório em Manutenção</h2>
        <p className="text-gray-500 mt-2">Este espaço não está disponível para visualização no momento.</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] rounded-[3rem] overflow-hidden mb-20 shadow-2xl">
        <img 
          src={auditorium.imageUrl} 
          alt="Auditório" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12 lg:p-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30 mb-6 inline-block">
              Espaço Premium
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6">
              Palco para suas <br /> <span className="text-gray-300">Grandes Ideias</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl leading-relaxed">
              O auditório do WorkSpace Central é o local perfeito para palestras, seminários e eventos corporativos de alto impacto.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Details & Info */}
      <div className="container mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">O que o espaço oferece</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-10">
                Localizado no coração do empreendimento, nosso auditório combina tecnologia de ponta com conforto excepcional. Com capacidade para até {auditorium.capacity} pessoas sentado, o espaço foi desenhado para proporcionar uma experiência imersiva tanto para o palestrante quanto para a audiência.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {perks.map((perk, i) => (
                  <motion.div 
                    key={perk.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                      <perk.icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black mb-1">{perk.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{perk.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-10 bg-black rounded-[2.5rem] text-white">
               <h3 className="text-2xl font-bold mb-4">Pronto para reservar?</h3>
               <p className="text-gray-400 mb-8 max-w-lg">
                 Consulte a disponibilidade em tempo real e garanta sua data agora mesmo através do nosso sistema simplificado.
               </p>
               <Link 
                to={`/room/${auditorium.id}`}
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all group"
               >
                 Verificar Cronograma
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>

          <div className="lg:col-span-1 sticky top-32">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl space-y-8">
              <h3 className="text-xl font-bold border-b border-gray-50 pb-6">Informações Rápidas</h3>
              
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center text-gray-500 text-sm font-medium">
                     <Users className="w-4 h-4 mr-3" />
                     Capacidade
                   </div>
                   <span className="font-bold">{auditorium.capacity} pessoas</span>
                 </div>
                 
                 <div className="flex items-center justify-between">
                   <div className="flex items-center text-gray-500 text-sm font-medium">
                     <Target className="w-4 h-4 mr-3" />
                     Ar Condicionado
                   </div>
                   <span className="font-bold">Sim (Central)</span>
                 </div>

                 <div className="flex items-center justify-between">
                   <div className="flex items-center text-gray-500 text-sm font-medium">
                     <Calendar className="w-4 h-4 mr-3" />
                     Locação Mínima
                   </div>
                   <span className="font-bold">2 horas</span>
                 </div>

                 <div className="pt-6 border-t border-gray-50">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">A partir de</div>
                    <div className="text-4xl font-black text-black text-center">R${auditorium.pricePerHour}<span className="text-sm font-normal text-gray-400">/hora</span></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
