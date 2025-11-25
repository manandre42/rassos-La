import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProviderCard } from './components/ProviderCard';
import { PaymentModal } from './components/PaymentModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthForms } from './components/AuthForms';
import { ProviderDashboard } from './components/ProviderDashboard';
import { ServiceProvider, ServiceCategory, PaymentState, Municipality, AdminConfig, AdminStats, UserRole, AppNotification } from './types';
import { PROVIDERS, MUNICIPALITIES, MOCK_ADMIN_STATS, INITIAL_ADMIN_CONFIG } from './constants';
import { findBestCategory } from './services/geminiService';
import { Sparkles, Filter, AlertCircle, MapPin } from 'lucide-react';

// Mock Logged In Provider Data
const MOCK_LOGGED_IN_PROVIDER: ServiceProvider = {
  id: '99',
  name: 'António Silva (Você)',
  category: ServiceCategory.ELECTRICIAN,
  location: 'Vila Alice',
  municipality: Municipality.LUANDA,
  rating: 5.0,
  reviews: 0,
  verified: false,
  status: 'PENDING',
  hourlyRate: 7500,
  imageUrl: 'https://picsum.photos/200/200?random=99',
  description: 'Instalação elétrica residencial e predial.',
  available: true,
  joinedDate: '2024-03-01',
  paymentCredentials: {
    unitelMoney: '923999888',
    afrimoney: '955111222'
  }
};

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'PAYMENT',
    title: 'Pagamento Recebido',
    message: 'Recebeu um pagamento de 5.000 Kz de Maria João.',
    amount: 5000,
    date: 'Hoje, 10:30',
    read: false
  },
  {
    id: '2',
    type: 'REQUEST',
    title: 'Novo Pedido de Orçamento',
    message: 'Cliente Pedro nos contactou interessado no serviço de Eletricista em Viana.',
    date: 'Ontem, 14:20',
    read: true
  }
];

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState('home'); 

  // User State
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<ServiceProvider | null>(null);

  // App Data State
  const [providers, setProviders] = useState<ServiceProvider[]>(PROVIDERS);
  const [adminStats, setAdminStats] = useState<AdminStats>(MOCK_ADMIN_STATS);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(INITIAL_ADMIN_CONFIG);
  const [myNotifications, setMyNotifications] = useState<AppNotification[]>([]);

  // Search/Filter State
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(ServiceCategory.ALL);
  const [activeMunicipality, setActiveMunicipality] = useState<Municipality>(Municipality.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  
  // Payment Modal State
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isOpen: false,
    provider: null,
    step: 'SELECT',
    selectedMethod: null
  });

  // Filter Providers logic
  const filteredProviders = providers.filter(p => {
    // Only show approved providers in public view
    if (p.status !== 'APPROVED') return false;

    const matchesCategory = activeCategory === ServiceCategory.ALL || p.category === activeCategory;
    const matchesMunicipality = activeMunicipality === Municipality.ALL || p.municipality === activeMunicipality;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && matchesMunicipality;
  });

  // Handlers
  const handleLoginSuccess = (role: string) => {
     if (role === 'Profissional') {
       setUserRole(UserRole.PROVIDER);
       setCurrentUser(MOCK_LOGGED_IN_PROVIDER);
       setMyNotifications(MOCK_NOTIFICATIONS);
       setCurrentView('provider-dashboard');
     } else {
       setUserRole(UserRole.CLIENT);
       setCurrentView('home');
     }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleSmartSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearchingAI(true);
    setAiSuggestion(null);

    // AI Logic
    const suggestedCategory = await findBestCategory(searchQuery);
    
    setIsSearchingAI(false);
    
    if (suggestedCategory && suggestedCategory !== ServiceCategory.ALL) {
      setActiveCategory(suggestedCategory);
      setAiSuggestion(`A IA sugere: ${suggestedCategory} baseado no seu problema.`);
    } else {
      setAiSuggestion("Não encontramos uma categoria específica, mostrando todos os resultados.");
      setActiveCategory(ServiceCategory.ALL);
    }
  };

  const handleContact = (provider: ServiceProvider) => {
    const message = `Olá ${provider.name}, vi seu perfil no ProfiAngola e gostaria de um orçamento.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handlePay = (provider: ServiceProvider) => {
    setPaymentState({
      isOpen: true,
      provider: provider,
      step: 'SELECT',
      selectedMethod: null
    });
  };

  const handleProviderUpdate = (id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
     setProviders(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleSuccessfulPayment = () => {
     if (paymentState.provider) {
        const amount = paymentState.provider.hourlyRate;
        const commission = adminConfig.commissionEnabled ? (amount * (adminConfig.commissionRate / 100)) : 0;
        
        setAdminStats(prev => ({
           ...prev,
           totalTransactionVolume: prev.totalTransactionVolume + amount,
           totalCommission: prev.totalCommission + commission
        }));

        // In a real app, we would send a notification to the provider here
     }
  };
  
  const handleAddService = () => {
    // This is just a placeholder action to satisfy the dashboard requirement
    // In a real app, this would probably open a modal
    console.log("Adding service...");
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (paymentState.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [paymentState.isOpen]);

  // View Routing
  const renderContent = () => {
    switch (currentView) {
      case 'admin':
        return (
          <AdminDashboard 
            stats={adminStats}
            config={adminConfig}
            providers={providers}
            onUpdateConfig={setAdminConfig}
            onUpdateProviderStatus={handleProviderUpdate}
          />
        );
      case 'provider-dashboard':
        return currentUser ? (
           <ProviderDashboard 
             provider={currentUser}
             notifications={myNotifications}
             onAddService={handleAddService}
           />
        ) : <div>Erro de sessão</div>;
      case 'login':
      case 'register-client':
      case 'register-provider':
        return (
          <AuthForms 
             type={currentView as any} 
             onSuccess={handleLoginSuccess} 
             onChangeView={setCurrentView}
          />
        );
      case 'home':
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="bg-carbon-900 text-white pt-16 pb-24 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                    Encontre profissionais de confiança em <span className="text-blue-400">Luanda</span>.
                  </h1>
                  <p className="text-lg text-gray-300 mb-8 max-w-2xl">
                    De eletricistas a técnicos de informática. Pague com segurança usando Unitel Money, e-Kwanza ou Afrimoney.
                  </p>

                  {/* Smart Search Bar */}
                  <div className="bg-white p-2 rounded-sm shadow-lg max-w-2xl flex flex-col md:flex-row gap-2">
                    <div className="flex-grow relative">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
                        placeholder="Ex: Minha torneira está a pingar..."
                        className="w-full h-12 pl-4 pr-10 text-gray-900 placeholder-gray-500 outline-none"
                      />
                      <Sparkles className={`absolute right-3 top-3.5 text-blue-600 transition-opacity ${isSearchingAI ? 'animate-pulse' : 'opacity-50'}`} size={20} />
                    </div>
                    <button 
                      onClick={handleSmartSearch}
                      disabled={isSearchingAI}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 transition-colors flex items-center justify-center gap-2 whitespace-nowrap rounded-sm"
                    >
                      {isSearchingAI ? 'Analisando...' : 'Pesquisa Inteligente'}
                    </button>
                  </div>
                  
                  {aiSuggestion && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-blue-300 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle size={14} />
                      {aiSuggestion}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Filters Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                  
                  {/* Categories */}
                  <div className="flex space-x-6 h-12 items-center overflow-x-auto min-w-0 no-scrollbar">
                    <Filter size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                    {Object.values(ServiceCategory).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`text-sm font-medium transition-colors whitespace-nowrap ${
                          activeCategory === category 
                            ? 'text-blue-600' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Location Filter */}
                  <div className="flex items-center gap-2 border-l border-gray-200 pl-0 md:pl-4">
                     <MapPin size={16} className="text-gray-400" />
                     <select 
                       className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer hover:text-blue-600"
                       value={activeMunicipality}
                       onChange={(e) => setActiveMunicipality(e.target.value as Municipality)}
                     >
                       {MUNICIPALITIES.map(m => (
                         <option key={m} value={m}>{m}</option>
                       ))}
                     </select>
                  </div>

                </div>
              </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {activeCategory === ServiceCategory.ALL ? 'Profissionais em destaque' : activeCategory}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {filteredProviders.length} profissionais encontrados em {activeMunicipality}
                  </p>
                </div>
              </div>

              {/* Grid */}
              {filteredProviders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  {filteredProviders.map((provider) => (
                    <ProviderCard 
                      key={provider.id} 
                      provider={provider} 
                      onContact={handleContact}
                      onPay={handlePay}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white border border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg">Nenhum profissional encontrado para esta categoria nesta localização.</p>
                  <button 
                    onClick={() => {setActiveCategory(ServiceCategory.ALL); setActiveMunicipality(Municipality.ALL)}} 
                    className="mt-4 text-blue-600 font-medium hover:underline"
                  >
                    Ver todos os profissionais
                  </button>
                </div>
              )}
            </main>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f4f4f4]">
      <Navbar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        userRole={userRole}
        onLogout={handleLogout}
      />

      {renderContent()}

      {/* Footer - Only show on Home */}
      {currentView === 'home' && (
        <footer className="bg-carbon-900 text-white py-12 border-t border-carbon-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ProfiAngola</h3>
              <p className="text-gray-400 text-sm">
                Conectando angolanos aos melhores serviços locais. Simples, rápido e seguro.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-500">Serviços</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Eletricistas</a></li>
                <li><a href="#" className="hover:text-white">Canalizadores</a></li>
                <li><a href="#" className="hover:text-white">Pintores</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-500">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-500">Métodos de Pagamento</h4>
              <div className="flex gap-4 opacity-70">
                <div className="w-8 h-8 rounded-full bg-orange-500" title="Unitel Money"></div>
                <div className="w-8 h-8 rounded-full bg-blue-600" title="e-Kwanza"></div>
                <div className="w-8 h-8 rounded-full bg-red-600" title="Afrimoney"></div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-carbon-800 text-center text-xs text-gray-600">
            &copy; 2024 ProfiAngola. Feito com orgulho em Angola.
          </div>
        </footer>
      )}

      {/* Payment Modal Instance */}
      <PaymentModal 
        state={paymentState} 
        onClose={() => setPaymentState({ ...paymentState, isOpen: false })}
        onUpdateState={(newState) => {
           setPaymentState(newState);
           if (newState.step === 'SUCCESS') handleSuccessfulPayment();
        }}
      />
    </div>
  );
};

export default App;