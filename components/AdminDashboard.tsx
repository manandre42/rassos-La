import React, { useState } from 'react';
import { AdminConfig, AdminStats, ServiceProvider } from '../types';
import { Users, Briefcase, DollarSign, Percent, Settings, CheckCircle, XCircle, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';

interface Props {
  stats: AdminStats;
  config: AdminConfig;
  providers: ServiceProvider[];
  onUpdateConfig: (newConfig: AdminConfig) => void;
  onUpdateProviderStatus: (id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => void;
}

export const AdminDashboard: React.FC<Props> = ({ stats, config, providers, onUpdateConfig, onUpdateProviderStatus }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'finance'>('overview');

  const pendingProviders = providers.filter(p => p.status === 'PENDING');
  const activeProviders = providers.filter(p => p.status === 'APPROVED');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Painel Administrativo</h2>
          <p className="text-gray-500">Gestão global da plataforma ProfiAngola</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-md border border-gray-200 shadow-sm">
           {['overview', 'providers', 'finance'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                 activeTab === tab 
                   ? 'bg-carbon-900 text-white shadow-sm' 
                   : 'text-gray-600 hover:bg-gray-50'
               }`}
             >
               {tab === 'overview' ? 'Visão Geral' : tab === 'providers' ? 'Profissionais' : 'Finanças'}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4">
          <StatCard 
            title="Total Usuários" 
            value={stats.totalUsers.toLocaleString()} 
            icon={Users} 
            color="bg-blue-600" 
          />
          <StatCard 
            title="Profissionais" 
            value={stats.totalProviders.toLocaleString()} 
            icon={Briefcase} 
            color="bg-purple-600" 
          />
          <StatCard 
            title="Volume Transacionado" 
            value={`${(stats.totalTransactionVolume / 1000000).toFixed(1)}M Kz`} 
            icon={DollarSign} 
            color="bg-green-600" 
          />
          <StatCard 
            title="Comissão Acumulada" 
            value={`${(stats.totalCommission / 1000).toFixed(1)} Mil Kz`} 
            icon={Percent} 
            color="bg-orange-500" 
          />
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Pending Requests */}
          {pendingProviders.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-sm p-6">
               <h3 className="flex items-center gap-2 text-lg font-bold text-orange-800 mb-4">
                 <AlertTriangle size={20} />
                 Aprovações Pendentes ({pendingProviders.length})
               </h3>
               <div className="grid gap-4">
                  {pendingProviders.map(p => (
                    <div key={p.id} className="bg-white p-4 border border-orange-100 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                       <div className="flex items-center gap-4">
                          <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-gray-900">{p.name}</p>
                            <p className="text-sm text-gray-500">{p.category} • {p.municipality}</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                         <button 
                           onClick={() => onUpdateProviderStatus(p.id, 'APPROVED')}
                           className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-sm font-medium rounded-sm"
                         >
                           <CheckCircle size={16} /> Aprovar
                         </button>
                         <button 
                            onClick={() => onUpdateProviderStatus(p.id, 'REJECTED')}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm font-medium rounded-sm"
                         >
                           <XCircle size={16} /> Rejeitar
                         </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Active List */}
          <div className="bg-white border border-gray-200 shadow-sm">
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
               <h3 className="font-bold text-gray-800">Profissionais Ativos</h3>
             </div>
             <div className="divide-y divide-gray-100">
               {activeProviders.map(p => (
                 <div key={p.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${p.available ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                       <span className="font-medium text-gray-900 w-40">{p.name}</span>
                       <span className="text-sm text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">{p.category}</span>
                       <span className="text-sm text-gray-400">{p.hourlyRate} Kz/h</span>
                    </div>
                    <button 
                      onClick={() => onUpdateProviderStatus(p.id, 'SUSPENDED')}
                      className="text-red-600 hover:text-red-800 text-sm font-medium underline"
                    >
                      Suspender
                    </button>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="max-w-2xl animate-in fade-in">
           <div className="bg-white border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings size={20} />
                Configuração de Comissões
              </h3>
              
              <div className="space-y-6">
                {/* Toggle */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                   <div>
                     <p className="font-medium text-gray-900">Cobrança de Comissão</p>
                     <p className="text-sm text-gray-500">Ativar ou desativar a taxa sobre serviços.</p>
                   </div>
                   <button 
                     onClick={() => onUpdateConfig({...config, commissionEnabled: !config.commissionEnabled})}
                     className={`transition-colors ${config.commissionEnabled ? 'text-green-600' : 'text-gray-400'}`}
                   >
                     {config.commissionEnabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                   </button>
                </div>

                {/* Percentage */}
                <div className="pb-6 border-b border-gray-100">
                   <div className="flex justify-between mb-2">
                     <label className="font-medium text-gray-900">Taxa (%)</label>
                     <span className="font-bold text-blue-600">{config.commissionRate}%</span>
                   </div>
                   <input 
                     type="range" 
                     min="0" 
                     max="30" 
                     step="0.5"
                     disabled={!config.commissionEnabled}
                     value={config.commissionRate}
                     onChange={(e) => onUpdateConfig({...config, commissionRate: parseFloat(e.target.value)})}
                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                   />
                </div>

                {/* Platform Wallet */}
                <div>
                   <p className="font-medium text-gray-900 mb-4">Carteiras de Destino (Admin)</p>
                   <div className="space-y-3">
                      <WalletInput 
                        label="Unitel Money" 
                        value={config.platformWallet.unitelMoney || ''} 
                        onChange={(v) => onUpdateConfig({...config, platformWallet: {...config.platformWallet, unitelMoney: v}})}
                      />
                      <WalletInput 
                        label="Afrimoney" 
                        value={config.platformWallet.afrimoney || ''} 
                        onChange={(v) => onUpdateConfig({...config, platformWallet: {...config.platformWallet, afrimoney: v}})}
                      />
                      <WalletInput 
                        label="IBAN (e-Kwanza)" 
                        value={config.platformWallet.bankAccount || ''} 
                        onChange={(v) => onUpdateConfig({...config, platformWallet: {...config.platformWallet, bankAccount: v}})}
                      />
                   </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{title: string, value: string, icon: React.ElementType, color: string}> = ({title, value, icon: Icon, color}) => (
  <div className="bg-white p-6 border-l-4 border-transparent hover:border-l-4 hover:border-gray-800 shadow-sm transition-all group">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</span>
      <div className={`p-2 rounded-full ${color} text-white opacity-80 group-hover:opacity-100`}>
        <Icon size={18} />
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </div>
);

const WalletInput: React.FC<{label: string, value: string, onChange: (v: string) => void}> = ({label, value, onChange}) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
    <label className="text-sm text-gray-600 w-32">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 border border-gray-400 bg-white text-black px-3 py-2 text-sm focus:border-blue-500 outline-none rounded-sm placeholder-gray-500 shadow-sm"
      placeholder="Não definido"
    />
  </div>
);