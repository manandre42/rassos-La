export enum ServiceCategory {
  ALL = 'Todos',
  ELECTRICIAN = 'Eletricista',
  PLUMBER = 'Canalizador',
  PAINTER = 'Pintor',
  CARPENTER = 'Carpinteiro',
  TECH_SUPPORT = 'Técnico Informático',
  AC_REPAIR = 'Climatização'
}

export enum Municipality {
  ALL = 'Toda Luanda',
  BELAS = 'Belas',
  CAZENGA = 'Cazenga',
  ICOLO_BENGO = 'Icolo e Bengo',
  LUANDA = 'Luanda (Centro)',
  QUICAMA = 'Quiçama',
  CACUACO = 'Cacuaco',
  VIANA = 'Viana',
  TALATONA = 'Talatona',
  KILAMBA_KIAXI = 'Kilamba Kiaxi'
}

export enum PaymentProvider {
  UNITEL_MONEY = 'Unitel Money',
  E_KWANZA = 'e-Kwanza',
  AFRIMONEY = 'Afrimoney',
  CASH = 'Dinheiro'
}

export enum UserRole {
  CLIENT = 'Cliente',
  PROVIDER = 'Profissional',
  ADMIN = 'Administrador'
}

export interface PaymentCredentials {
  unitelMoney?: string;
  afrimoney?: string;
  bankAccount?: string; // IBAN for e-Kwanza/Transfer
}

export interface ServiceProvider {
  id: string;
  name: string;
  email?: string;
  category: ServiceCategory;
  location: string; // Text description
  municipality: Municipality;
  rating: number;
  reviews: number;
  verified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  hourlyRate: number; // In Kz
  imageUrl: string;
  description: string;
  available: boolean;
  paymentCredentials?: PaymentCredentials;
  joinedDate: string;
}

export interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalTransactionVolume: number;
  totalCommission: number;
}

export interface AdminConfig {
  commissionEnabled: boolean;
  commissionRate: number; // Percentage (e.g., 10 for 10%)
  platformWallet: PaymentCredentials;
}

export interface PaymentState {
  isOpen: boolean;
  provider: ServiceProvider | null;
  step: 'SELECT' | 'PHONE' | 'PROCESSING' | 'SUCCESS';
  selectedMethod: PaymentProvider | null;
}

export interface AppNotification {
  id: string;
  type: 'PAYMENT' | 'REQUEST' | 'SYSTEM';
  title: string;
  message: string;
  date: string;
  read: boolean;
  amount?: number;
}