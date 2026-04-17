import { useState } from 'react';
import { Save, Shield, Clock, Globe, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminSettings() {
  const [appName, setAppName] = useState('WorkSpace Central');
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [isAutoConfirm, setIsAutoConfirm] = useState(true);

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-black mb-1">Configurações do Sistema</h1>
        <p className="text-gray-500 text-sm">Gerencie as regras globais e preferências da plataforma.</p>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-bold mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-3 text-gray-400" />
            Preferências Gerais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Nome da Plataforma</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Idioma Padrão</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black appearance-none">
                <option>Português (BR)</option>
                <option>English (US)</option>
                <option>Español</option>
              </select>
            </div>
          </div>
        </section>

        {/* Operating Hours */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-bold mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-3 text-gray-400" />
            Horários de Funcionamento
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Abertura</label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Fechamento</label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>
        </section>

        {/* Security / System Logic */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-bold mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-3 text-gray-400" />
            Regras de Negócio
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <p className="text-sm font-bold text-black">Autoconfimação de Reservas</p>
                <p className="text-xs text-gray-400">Permitir que reservas sem conflito sejam confirmadas instantaneamente.</p>
              </div>
              <button
                onClick={() => setIsAutoConfirm(!isAutoConfirm)}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  isAutoConfirm ? "bg-black" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  isAutoConfirm ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <p className="text-sm font-bold text-black">Notificações por Email</p>
                <p className="text-xs text-gray-400">Enviar lembretes automáticos para empresas residentes.</p>
              </div>
              <Bell className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4 pb-12">
            <button className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center hover:bg-gray-800 transition-all shadow-xl hover:shadow-black/20">
                <Save className="w-5 h-5 mr-2" />
                Salvar Todas as Configurações
            </button>
        </div>
      </div>
    </div>
  );
}
