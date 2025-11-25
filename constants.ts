import { ServiceCategory, ServiceProvider, PaymentProvider, Municipality, AdminStats, AdminConfig } from './types';
import { Wallet, Smartphone, Banknote, CreditCard } from 'lucide-react';

export const MUNICIPALITIES = Object.values(Municipality);

export const PROVIDERS: ServiceProvider[] = [
  {
    id: '1',
    name: 'João Manuel',
    category: ServiceCategory.ELECTRICIAN,
    location: 'Maianga',
    municipality: Municipality.LUANDA,
    rating: 4.8,
    reviews: 124,
    verified: true,
    status: 'APPROVED',
    hourlyRate: 5000,
    imageUrl: 'https://picsum.photos/200/200?random=1',
    description: 'Especialista em instalações residenciais e manutenção industrial. 10 anos de experiência.',
    available: true,
    joinedDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Maria António',
    category: ServiceCategory.PLUMBER,
    location: 'Cidade Financeira',
    municipality: Municipality.TALATONA,
    rating: 4.9,
    reviews: 89,
    verified: true,
    status: 'APPROVED',
    hourlyRate: 6000,
    imageUrl: 'https://picsum.photos/200/200?random=2',
    description: 'Resolução rápida de fugas, desentupimentos e instalação de loiça sanitária.',
    available: true,
    joinedDate: '2023-02-20'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    category: ServiceCategory.PAINTER,
    location: 'Zango 3',
    municipality: Municipality.VIANA,
    rating: 4.5,
    reviews: 45,
    verified: false,
    status: 'APPROVED',
    hourlyRate: 3500,
    imageUrl: 'https://picsum.photos/200/200?random=3',
    description: 'Pintura interior e exterior. Acabamentos finos e texturas.',
    available: true,
    joinedDate: '2023-05-10'
  },
  {
    id: '4',
    name: 'Ana Bela',
    category: ServiceCategory.TECH_SUPPORT,
    location: 'Centralidade do Kilamba',
    municipality: Municipality.KILAMBA_KIAXI,
    rating: 5.0,
    reviews: 210,
    verified: true,
    status: 'APPROVED',
    hourlyRate: 8000,
    imageUrl: 'https://picsum.photos/200/200?random=4',
    description: 'Reparação de computadores, instalação de redes e configuração de software.',
    available: false,
    joinedDate: '2023-06-01'
  },
  {
    id: '5',
    name: 'Carlos Sampaio',
    category: ServiceCategory.AC_REPAIR,
    location: 'Patriota',
    municipality: Municipality.TALATONA,
    rating: 4.7,
    reviews: 67,
    verified: true,
    status: 'APPROVED',
    hourlyRate: 5500,
    imageUrl: 'https://picsum.photos/200/200?random=5',
    description: 'Instalação e manutenção de Ar Condicionado. Carga de gás.',
    available: true,
    joinedDate: '2023-07-15'
  },
  {
    id: '6',
    name: 'Sofia Miguel',
    category: ServiceCategory.CARPENTER,
    location: 'Hoji-ya-Henda',
    municipality: Municipality.CAZENGA,
    rating: 4.6,
    reviews: 32,
    verified: false,
    status: 'PENDING',
    hourlyRate: 4000,
    imageUrl: 'https://picsum.photos/200/200?random=6',
    description: 'Móveis por medida, reparação de portas e janelas.',
    available: true,
    joinedDate: '2024-02-10'
  }
];

export const PAYMENT_METHODS = [
  {
    id: PaymentProvider.UNITEL_MONEY,
    name: 'Unitel Money',
    color: 'bg-orange-500',
    textColor: 'text-white',
    icon: Smartphone,
    description: 'Pague com seu saldo Unitel'
  },
  {
    id: PaymentProvider.E_KWANZA,
    name: 'e-Kwanza',
    color: 'bg-blue-600',
    textColor: 'text-white',
    icon: CreditCard,
    description: 'BAI e-Kwanza digital'
  },
  {
    id: PaymentProvider.AFRIMONEY,
    name: 'Afrimoney',
    color: 'bg-red-600',
    textColor: 'text-white',
    icon: Wallet,
    description: 'Africell Money'
  },
  {
    id: PaymentProvider.CASH,
    name: 'Dinheiro',
    color: 'bg-green-600',
    textColor: 'text-white',
    icon: Banknote,
    description: 'Pagamento presencial'
  }
];

export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 1250,
  totalProviders: 84,
  totalTransactionVolume: 45000000, // 45 Milhões Kz
  totalCommission: 2250000 // 2.25 Milhões Kz
};

export const INITIAL_ADMIN_CONFIG: AdminConfig = {
  commissionEnabled: true,
  commissionRate: 5, // 5%
  platformWallet: {
    unitelMoney: '923000000',
    afrimoney: '955000000',
    bankAccount: 'AO06.0040.0000.0000.0000.0'
  }
};
