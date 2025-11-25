import React, { useState, useEffect } from 'react';
import { PaymentState, PaymentProvider } from '../types';
import { PAYMENT_METHODS } from '../constants';
import { X, Smartphone, Check, Loader2 } from 'lucide-react';

interface Props {
  state: PaymentState;
  onClose: () => void;
  onUpdateState: (newState: PaymentState) => void;
}

export const PaymentModal: React.FC<Props> = ({ state, onClose, onUpdateState }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  
  if (!state.isOpen || !state.provider) return null;

  const handleSelectMethod = (methodId: PaymentProvider) => {
    onUpdateState({ ...state, selectedMethod: methodId, step: 'PHONE' });
  };

  const handlePaymentProcess = () => {
    onUpdateState({ ...state, step: 'PROCESSING' });
    // Simulate API delay for USSD/App confirmation
    setTimeout(() => {
      onUpdateState({ ...state, step: 'SUCCESS' });
    }, 3000);
  };

  const selectedMethodConfig = PAYMENT_METHODS.find(m => m.id === state.selectedMethod);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-white w-full max-w-md relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-carbon-900 text-white">
          <div>
            <h3 className="text-lg font-bold">Pagamento Seguro</h3>
            <p className="text-xs text-gray-400">Contratar: {state.provider.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          
          {/* STEP 1: SELECT */}
          {state.step === 'SELECT' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Escolha a sua carteira digital preferida:</p>
              <div className="grid gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleSelectMethod(method.id)}
                    className="flex items-center p-4 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                  >
                    <div className={`p-3 rounded-full mr-4 ${method.color} ${method.textColor}`}>
                      <method.icon size={20} />
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900 group-hover:text-blue-700">{method.name}</span>
                      <span className="text-xs text-gray-500">{method.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PHONE INPUT */}
          {state.step === 'PHONE' && selectedMethodConfig && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 bg-gray-50 p-3 border border-gray-200">
                 <div className={`p-2 rounded-full ${selectedMethodConfig.color} text-white`}>
                   <selectedMethodConfig.icon size={16} />
                 </div>
                 <span className="font-bold text-sm">{selectedMethodConfig.name}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de Telefone (Angola)</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 text-sm">+244</span>
                  <input 
                    type="tel"
                    placeholder="9XX XXX XXX"
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Você receberá uma solicitação de pagamento no seu telemóvel.</p>
              </div>

              <div className="flex gap-3 mt-8">
                 <button 
                   onClick={() => onUpdateState({...state, step: 'SELECT'})}
                   className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                 >
                   Voltar
                 </button>
                 <button 
                   onClick={handlePaymentProcess}
                   disabled={phoneNumber.length < 9}
                   className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                 >
                   Confirmar
                 </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING */}
          {state.step === 'PROCESSING' && (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
               <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
               <h4 className="text-lg font-bold text-gray-900">A processar...</h4>
               <p className="text-sm text-gray-500 max-w-xs mt-2">
                 Verifique o seu telemóvel para confirmar a transação no {selectedMethodConfig?.name}.
               </p>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {state.step === 'SUCCESS' && (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                 <Check size={32} className="text-green-600" />
               </div>
               <h4 className="text-xl font-bold text-gray-900">Pagamento Confirmado!</h4>
               <p className="text-sm text-gray-500 max-w-xs mt-2 mb-6">
                 O prestador {state.provider.name} será notificado e entrará em contacto em breve.
               </p>
               <button 
                 onClick={onClose}
                 className="w-full py-3 bg-carbon-900 text-white font-bold hover:bg-carbon-800 transition-colors"
               >
                 Fechar
               </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
