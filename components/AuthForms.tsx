import React, { useState } from 'react';
import { ServiceCategory, Municipality } from '../types';
import { User, Briefcase, MapPin, Smartphone, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface Props {
  type: 'login' | 'register-client' | 'register-provider';
  onSuccess: (role?: string) => void;
  onChangeView: (view: string) => void;
}

export const AuthForms: React.FC<Props> = ({ type, onSuccess, onChangeView }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Only for provider registration

  const isProvider = type === 'register-provider';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      onSuccess(isProvider ? 'Profissional' : 'Cliente');
    }, 1500);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  // Render Login or Client Register (Single Step)
  if (!isProvider) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f4f4]">
        <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-lg border-t-4 border-carbon-900">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-600 flex items-center justify-center text-white rounded-sm">
               <User />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {type === 'login' ? 'Bem-vindo de volta' : 'Criar Conta Cliente'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {type === 'login' ? 'Aceda à sua conta para continuar' : 'Encontre os melhores profissionais perto de si'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {type !== 'login' && <InputGroup icon={User} type="text" placeholder="Nome Completo" required />}
              <InputGroup icon={Mail} type="email" placeholder="Email" required />
              <InputGroup icon={Lock} type="password" placeholder="Palavra-passe" required />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold text-white bg-carbon-900 hover:bg-carbon-800 transition-colors disabled:opacity-70"
            >
              {loading ? 'Processando...' : (type === 'login' ? 'Entrar' : 'Criar Conta')}
            </button>

            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600">
                {type === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}
                <button type="button" onClick={() => onChangeView(type === 'login' ? 'register-client' : 'login')} className="ml-1 font-medium text-blue-600 hover:text-blue-500">
                  {type === 'login' ? 'Registar' : 'Entrar'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render Multi-step Provider Registration
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f4f4]">
      <div className="max-w-md w-full bg-white p-8 shadow-lg border-t-4 border-carbon-900">
        
        {/* Progress Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registo Profissional</h2>
          <div className="flex items-center justify-between relative mb-6">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
             
             <div className={`flex flex-col items-center gap-1 bg-white px-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white'}`}>1</div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Pessoal</span>
             </div>
             
             <div className={`flex flex-col items-center gap-1 bg-white px-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white'}`}>2</div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Serviço</span>
             </div>

             <div className={`flex flex-col items-center gap-1 bg-white px-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white'}`}>3</div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Pagamento</span>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <InputGroup icon={User} type="text" placeholder="Nome Completo" autoFocus />
              <InputGroup icon={Mail} type="email" placeholder="Email Profissional" />
              <InputGroup icon={Lock} type="password" placeholder="Palavra-passe" />
              <InputGroup icon={Lock} type="password" placeholder="Confirmar Palavra-passe" />
            </div>
          )}

          {/* STEP 2: Service Info */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 text-gray-500" size={18} />
                <select className="w-full pl-10 pr-3 py-2 border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-black text-sm shadow-sm">
                  <option value="">Selecione sua Categoria Principal</option>
                  {Object.values(ServiceCategory).filter(c => c !== 'Todos').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-500" size={18} />
                <select className="w-full pl-10 pr-3 py-2 border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-black text-sm shadow-sm">
                  <option value="">Município Principal de Atuação</option>
                  {Object.values(Municipality).filter(m => m !== 'Toda Luanda').map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                 <span className="absolute left-3 top-2 text-gray-900 font-bold text-sm">Kz</span>
                 <input type="number" placeholder="Preço Hora (Estimado)" className="w-full pl-10 pr-3 py-2 border border-gray-400 bg-white text-black rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm shadow-sm placeholder-gray-500" />
              </div>

              <div>
                <textarea 
                  placeholder="Descreva sua experiência e serviços (Ex: 5 anos de experiência em redes elétricas residenciais...)"
                  className="w-full p-3 border border-gray-400 bg-white text-black rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-24 resize-none shadow-sm placeholder-gray-500"
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Info */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="bg-blue-50 border border-blue-100 p-3 text-sm text-blue-800 rounded-sm mb-4">
                Estes dados serão usados para receber pagamentos dos clientes.
              </div>
              <InputGroup icon={Smartphone} type="tel" placeholder="Nº Unitel Money (9xx...)" />
              <InputGroup icon={Smartphone} type="tel" placeholder="Nº Afrimoney (9xx...)" />
              <InputGroup icon={Briefcase} type="text" placeholder="IBAN (Opcional)" />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 px-4 border border-gray-300 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Voltar
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 py-3 px-4 bg-carbon-900 text-white font-bold text-sm hover:bg-carbon-800 transition-colors flex items-center justify-center gap-2"
              >
                Próximo <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Criando...' : 'Finalizar'} <CheckCircle size={16} />
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
           <p className="text-gray-600">
             Já tem conta? <button type="button" onClick={() => onChangeView('login')} className="font-medium text-blue-600 hover:text-blue-500">Entrar</button>
           </p>
        </div>

      </div>
    </div>
  );
};

const InputGroup: React.FC<any> = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-500" aria-hidden="true" />
    </div>
    <input
      {...props}
      className="appearance-none rounded-sm relative block w-full px-3 py-2 pl-10 border border-gray-400 placeholder-gray-500 text-black bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors shadow-sm"
    />
  </div>
);