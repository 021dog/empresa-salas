import React, { useState } from 'react';
import { Save, Shield, Clock, Globe, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function AdminSettings() {
  const { settings, updateSettings } = useWorkspace();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings(formData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-black mb-1">Configurações do Sistema</h1>
        <p className="text-gray-500 text-sm">Gerencie as regras globais e preferências da plataforma.</p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <p className="text-sm font-bold">Configurações salvas com sucesso!</p>
          <button onClick={() => setShowSuccess(false)} className="text-green-700 hover:text-green-900 font-bold">FECHAR</button>
        </div>
      )}

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
                value={formData.appName}
                onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
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
                value={formData.operatingHours.open}
                onChange={(e) => setFormData({ ...formData, operatingHours: { ...formData.operatingHours, open: e.target.value } })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Fechamento</label>
              <input
                type="time"
                value={formData.operatingHours.close}
                onChange={(e) => setFormData({ ...formData, operatingHours: { ...formData.operatingHours, close: e.target.value } })}
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
                onClick={() => setFormData({ ...formData, publicBookingEnabled: !formData.publicBookingEnabled })}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  formData.publicBookingEnabled ? "bg-black" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  formData.publicBookingEnabled ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <p className="text-sm font-bold text-black">Notificações por Email</p>
                <p className="text-xs text-gray-400">Enviar lembretes automáticos para empresas residentes.</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, notificationsEnabled: !formData.notificationsEnabled })}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  formData.notificationsEnabled ? "bg-black" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  formData.notificationsEnabled ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4 pb-12">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center hover:bg-gray-800 transition-all shadow-xl hover:shadow-black/20 disabled:opacity-50"
            >
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Todas as Configurações'}
            </button>
        </div>
      </div>
    </div>
  );
}
