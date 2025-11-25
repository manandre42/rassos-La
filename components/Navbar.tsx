import React, { useState } from 'react';
import { Menu, User, Shield, Briefcase, LogOut, X, LayoutDashboard } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  userRole?: UserRole | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView, userRole, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  const isLoggedIn = !!userRole;

  return (
    <nav className="sticky top-0 z-50 bg-carbon-900 text-white border-b border-carbon-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity z-50 relative"
          >
             <div className="bg-blue-600 p-1.5 rounded-sm">
                <Menu className="h-5 w-5 text-white" />
             </div>
             <span className="font-bold text-xl tracking-tight">ProfiAngola</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNav('admin')}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentView === 'admin' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
              <Shield size={14} />
              Admin
            </button>
            
            <div className="h-6 w-px bg-carbon-700"></div>

            {!isLoggedIn ? (
              <>
                <button 
                  onClick={() => handleNav('register-provider')}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Briefcase size={14} />
                  Sou Profissional
                </button>
                
                <div className="flex items-center gap-4 pl-4">
                   <button 
                      onClick={() => handleNav('login')}
                      className="text-sm font-medium hover:text-blue-400 transition-colors"
                   >
                     Entrar
                   </button>
                   <button 
                      onClick={() => handleNav('register-client')}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-bold transition-colors rounded-sm"
                   >
                     Registar
                   </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {userRole === UserRole.PROVIDER && (
                  <button 
                    onClick={() => handleNav('provider-dashboard')}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentView === 'provider-dashboard' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
                  >
                    <LayoutDashboard size={14} />
                    Meu Painel
                  </button>
                )}
                
                <div className="flex items-center gap-3 pl-4 border-l border-carbon-700">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <button 
                    onClick={onLogout}
                    className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden z-50 relative">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-300 hover:text-white">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-carbon-900 flex flex-col min-h-screen pt-20 px-6 animate-in fade-in slide-in-from-top-10 duration-200 md:hidden">
           <div className="flex flex-col space-y-6 text-xl font-medium mt-4">
             <button onClick={() => handleNav('home')} className="py-2 border-b border-carbon-800 text-left text-gray-200">Início</button>
             <button onClick={() => handleNav('admin')} className="py-2 border-b border-carbon-800 text-left flex items-center gap-3 text-gray-400"><Shield size={20}/> Área Admin</button>
             
             {!isLoggedIn ? (
               <>
                 <button onClick={() => handleNav('register-provider')} className="py-2 border-b border-carbon-800 text-left font-bold text-blue-400 flex items-center gap-3"><Briefcase size={20}/> Sou Profissional</button>
                 <div className="pt-8 flex flex-col gap-4">
                    <button onClick={() => handleNav('login')} className="py-4 text-center border border-gray-600 rounded-sm">Entrar</button>
                    <button onClick={() => handleNav('register-client')} className="py-4 bg-blue-600 text-white font-bold rounded-sm">Registar Conta</button>
                 </div>
               </>
             ) : (
               <>
                  {userRole === UserRole.PROVIDER && (
                    <button onClick={() => handleNav('provider-dashboard')} className="py-2 border-b border-carbon-800 text-left flex items-center gap-3 font-bold text-blue-400">
                      <LayoutDashboard size={20}/> Meu Painel
                    </button>
                  )}
                  <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="py-4 text-left flex items-center gap-3 text-red-400 mt-8">
                    <LogOut size={20} /> Terminar Sessão
                  </button>
               </>
             )}
           </div>
        </div>
      )}
    </nav>
  );
};