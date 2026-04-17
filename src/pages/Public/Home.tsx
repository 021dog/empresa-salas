import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, MapPin, Users, Building2, CalendarDays } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-black leading-[1.1] mb-6">
                O futuro do trabalho agora é <span className="text-gray-400">sob medida</span>.
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg">
                Espaços de trabalho inspiradores para mentes brilhantes. De escritórios privativos a salas de reunião vibrantes, temos o lugar perfeito para sua empresa crescer.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/salas"
                  className="inline-flex justify-center items-center px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all text-lg group"
                >
                  Ver salas disponíveis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/empresas"
                  className="inline-flex justify-center items-center px-8 py-4 border-2 border-black text-black font-bold rounded-lg hover:bg-gray-50 transition-all text-lg"
                >
                  Explorar Comunidade
                </Link>
              </div>
              <div className="mt-12 flex items-center space-x-8 text-sm text-gray-500 font-medium">
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-gray-400 mr-2" />
                  Cancelamento flexível
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-gray-400 mr-2" />
                  Tudo incluso
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 lg:mt-0 relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://picsum.photos/seed/wework-style/1200/1500"
                  alt="Modern Coworking Space"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs md:block hidden">
                <div className="flex items-center mb-4">
                  <div className="flex -space-x-2 mr-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">+50 Empresas</span>
                </div>
                <p className="text-sm font-medium text-black">
                  "O melhor ambiente que já trabalhamos. Produtividade subiu 40%."
                </p>
                <p className="text-xs text-gray-500 mt-2">— TechFlow Solutions</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Espaços</h2>
            <p className="text-3xl md:text-5xl font-bold tracking-tight text-black">Uma solução para cada etapa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Escritórios Privativos',
                desc: 'Para equipes de todos os tamanhos, com total privacidade e personalização.',
                icon: Building2,
                image: 'https://picsum.photos/seed/office/800/600'
              },
              {
                title: 'Espaços Compartilhados',
                desc: 'A energia da comunidade com a flexibilidade que você precisa diariamente.',
                icon: Users,
                image: 'https://picsum.photos/seed/community/800/600'
              },
              {
                title: 'Salas de Reunião',
                desc: 'Ambientes profissionais equipados para suas apresentações mais importantes.',
                icon: CalendarDays,
                image: 'https://picsum.photos/seed/meeting/800/600'
              }
            ].map((sol, i) => (
              <Link key={i} to="/salas" className="group">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-48 overflow-hidden">
                    <img src={sol.image} alt={sol.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold mb-3">{sol.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{sol.desc}</p>
                    <span className="text-black font-bold text-sm flex items-center group-hover:underline underline-offset-4">
                      Saiba mais <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Localização</h2>
              <p className="text-3xl md:text-5xl font-bold tracking-tight text-black">No coração do negócio.</p>
            </div>
            <Link to="/salas" className="text-black font-bold flex items-center hover:underline underline-offset-4">
              Ver no mapa <MapPin className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="aspect-[21/9] rounded-[40px] overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl">
            <img
              src="https://picsum.photos/seed/city/1920/800"
              alt="City Location"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
              <div className="text-white">
                <p className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Nosso Prédio Central</p>
                <h3 className="text-4xl font-bold">Avenida Paulista, 1000 · SP</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
