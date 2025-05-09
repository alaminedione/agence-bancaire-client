export interface Client {
  matricule: string;
  nom: string;
  prenom: string;
  numero_telephone: string;
  sexe: string;
  age: number;
  adresse: string;
  comptes?: Account[];
}

export interface Account {
  numero_compte: string;
  solde: number;
  libelle: string;
  date_creation: string;
  client?: Client;
  transactions?: Transaction[];
}

export interface CheckingAccount extends Account {
  decouvertAutorise: number;
}

export interface SavingsAccount extends Account {
  tauxInteret: number;
}

export interface Transaction {
  id: number;
  montant: number;
  type: 'CREDIT' | 'DEBIT';
  dateTransaction: string;
  compte?: Account;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {}

export interface User {
  email: string;
  isAuthenticated: boolean;
  // Optional fields for OAuth login
  id?: string;
  name?: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export interface DepositWithdrawPayload {
  montant: number;
}
