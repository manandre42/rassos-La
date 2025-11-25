import React, { useState } from 'react';
import { AppNotification, ServiceProvider } from '../types';
import { Bell, Briefcase, Plus, DollarSign, Clock, CheckCircle, Smartphone, Edit2, Settings, Trash2 } from 'lucide-react';

interface Props {
  provider: ServiceProvider;
  notifications: AppNotification[];
  onAddService: () => void;
}

interface ServiceItem {
  id: string;
  category: string;
  description: string;
  municipality: string;
  rate: number;
}

export const ProviderDashboard: React.FC<Props> = ({ provider, notifications, onAddService }) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'services'>('notifications');
  
  // Local state to simulate adding services visually
  const [myServices, setMyServices] = useState<ServiceItem[]>([
    {
      id: '1',
      category: provider.category,
      description: provider.description,
      municipality: provider.municipality,
      rate: provider.hourlyRate
    }
  ]);

  const handleAddServiceLocal = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      category: 'Novo Serviço',
      description: 'Descrição do novo serviço...',
      municipality: provider.municipality,
      rate: 0
    };
    setMyServices([...myServices, newService]);
    onAddService(); // Call parent to show "Action" feedback if needed
  };

  const handleRemoveService = (id: string) => {
    setMyServices(myServices.filter(s => s.id !== id));
  };

  // Calculate generic stats
  const totalEarnings = notifications
    .filter(n => n.type === 'PAYMENT')
    .reduce((sum, n) => sum + (n.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img src={provider.imageUrl} alt={provider.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 p-0.5" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Olá, {provider.name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${provider.status === 'APPROVED' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
              Status: {provider.status === 'APPROVED' ? 'Ativo e Visível' : 'Pendente de Aprovação'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-blue-50 px-4 py-2 rounded-sm border border-blue-100">
             <p className="text-xs text-blue-600 font-bold uppercase">Ganhos Totais</p>
             <p className="text-xl font-bold text-gray-900">{totalEarnings.toLocaleString('pt-AO')} Kz</p>
           </div>
           <div className="bg-gray-50 px-4 py-2 rounded-sm border border-gray-200">
             <p className="text-xs text-gray-600 font-bold uppercase">Serviços</p>
             <p className="text-xl font-bold text-gray-900">{myServices.length}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'notifications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              <Bell size={16} /> Notificações
              {notifications.some(n => !n.read) && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">New</span>}
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'services' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              <Briefcase size={16} /> Meus Serviços
            </button>
          </div>

          {activeTab === 'notifications' && (
            <div className="bg-white border border-gray-200 shadow-sm divide-y divide-gray-100 animate-in fade-in">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>Ainda não tem notificações.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                    <div className={`p-2 rounded-full h-fit flex-shrink-0 ${notif.type === 'PAYMENT' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                       {notif.type === 'PAYMENT' ? <DollarSign size={20} /> : <Briefcase size={20} />}
                    </div>
                    <div className="flex-grow">
                       <div className="flex justify-between items-start">
                         <h4 className="font-bold text-gray-900">{notif.title}</h4>
                         <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12}/> {notif.date}</span>
                       </div>
                       <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                       {notif.amount && (
                         <p className="text-sm font-bold text-green-600 mt-2">+ {notif.amount.toLocaleString()} Kz</p>
                       )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4 animate-in fade-in">
              {myServices.map((service) => (
                <div key={service.id} className="bg-white border border-gray-200 p-5 shadow-sm relative group hover:border-blue-400 transition-colors">
                  <div className="absolute top-4 right-4 flex gap-2">
                     <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                       <CheckCircle size={12} /> Ativo
                     </span>
                     {myServices.length > 1 && (
                        <button onClick={() => handleRemoveService(service.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                     )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{service.category}</h3>
                  <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                      <span className="bg-gray-100 px-2 py-1 rounded-sm">{service.municipality}</span>
                      <span className="flex items-center gap-1"><DollarSign size={14}/> {service.rate > 0 ? service.rate : 'A definir'} Kz/h</span>
                  </div>
                </div>
              ))}

              <button 
                onClick={handleAddServiceLocal}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-sm text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className="bg-gray-200 rounded-full p-2 group-hover:bg-blue-200 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="font-bold text-sm">Adicionar Novo Serviço</span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-carbon-900 text-white p-5 rounded-sm shadow-md">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Smartphone size={20} />
                    Carteiras Digitais
                  </h3>
                  <button onClick={() => alert("Editar carteiras")} className="text-gray-400 hover:text-white transition-colors bg-carbon-800 p-1.5 rounded-sm hover:bg-carbon-700">
                      <Settings size={16} />
                  </button>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                   <p className="text-gray-400 text-xs uppercase mb-1">Unitel Money</p>
                   <div className="flex items-center justify-between bg-carbon-800 p-2 rounded-sm border border-carbon-700">
                      <span className="font-mono text-white tracking-wide text-base">{provider.paymentCredentials?.unitelMoney || '---'}</span>
                   </div>
                </div>
                <div>
                   <p className="text-gray-400 text-xs uppercase mb-1">Afrimoney</p>
                   <div className="flex items-center justify-between bg-carbon-800 p-2 rounded-sm border border-carbon-700">
                      <span className="font-mono text-white tracking-wide text-base">{provider.paymentCredentials?.afrimoney || '---'}</span>
                   </div>
                </div>
              </div>
              <button className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold rounded-sm transition-colors flex items-center justify-center gap-2">
                <Edit2 size={14} /> Editar Dados
              </button>
           </div>

           <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Dica ProfiAngola</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Mantenha seu perfil atualizado e peça aos clientes para avaliarem seu serviço. Perfis com mais de 10 avaliações recebem 3x mais contactos.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};