import React from 'react';
import { ServiceProvider } from '../types';
import { Star, MapPin, CheckCircle, MessageCircle, DollarSign } from 'lucide-react';

interface Props {
  provider: ServiceProvider;
  onContact: (provider: ServiceProvider) => void;
  onPay: (provider: ServiceProvider) => void;
}

export const ProviderCard: React.FC<Props> = ({ provider, onContact, onPay }) => {
  return (
    <div className="group bg-white border border-gray-200 hover:border-blue-500 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
      {/* Verified Badge */}
      {provider.verified && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 z-10 flex items-center gap-1">
          <CheckCircle size={12} />
          VERIFICADO
        </div>
      )}

      {/* Image & Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={provider.imageUrl} 
          alt={provider.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
           <h3 className="text-white font-bold text-lg">{provider.name}</h3>
           <p className="text-gray-300 text-sm flex items-center gap-1">
             <MapPin size={12} /> {provider.location}
           </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-grow flex flex-col gap-3">
        <div className="flex justify-between items-start">
           <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-0.5 uppercase tracking-wide">
             {provider.category}
           </span>
           <div className="flex items-center gap-1 text-yellow-500">
             <Star size={14} fill="currentColor" />
             <span className="text-sm font-bold text-gray-900">{provider.rating}</span>
             <span className="text-xs text-gray-500">({provider.reviews})</span>
           </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {provider.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
           <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
             {provider.hourlyRate.toLocaleString('pt-AO')} Kz <span className="text-xs font-normal text-gray-500">/ hora</span>
           </div>
           
           <div className="grid grid-cols-2 gap-2 mt-2">
             <button 
                onClick={() => onContact(provider)}
                className="flex items-center justify-center gap-2 bg-gray-900 text-white py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
             >
                <MessageCircle size={16} />
                WhatsApp
             </button>
             <button 
                onClick={() => onPay(provider)}
                className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-2 text-sm font-medium hover:bg-blue-50 transition-colors"
             >
                <DollarSign size={16} />
                Contratar
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
