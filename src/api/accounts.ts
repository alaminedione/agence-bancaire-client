import axiosInstance from './axios-config';
import type { Account, CheckingAccount, SavingsAccount, DepositWithdrawPayload } from '../types';

export const getAccountByNumber = async (numeroCompte: string): Promise<Account> => {
  const response = await axiosInstance.get(`/comptes/${numeroCompte}`);
  return response.data;
};

export const getClientAccounts = async (clientMatricule: string): Promise<Account[]> => {
  const response = await axiosInstance.get(`/comptes/client/${clientMatricule}`);
  return response.data;
};

export const createCheckingAccount = async (
  clientMatricule: string,
  account: Omit<CheckingAccount, 'date_creation' | 'client' | 'transactions'>
): Promise<CheckingAccount> => {
  const response = await axiosInstance.post(`/comptes/courant/${clientMatricule}`, account);
  return response.data;
};

export const createSavingsAccount = async (
  clientMatricule: string,
  account: Omit<SavingsAccount, 'date_creation' | 'client' | 'transactions'>
): Promise<SavingsAccount> => {
  const response = await axiosInstance.post(`/comptes/epargne/${clientMatricule}`, account);
  return response.data;
};

export const deleteAccount = async (numeroCompte: string): Promise<void> => {
  await axiosInstance.delete(`/comptes/${numeroCompte}`);
};

export const deposit = async (numeroCompte: string, payload: DepositWithdrawPayload): Promise<Account> => {
  const response = await axiosInstance.post(`/transactions/depot?numeroCompte=${numeroCompte}&montant=${payload.montant}`);
  return response.data;
};

export const withdraw = async (numeroCompte: string, payload: DepositWithdrawPayload): Promise<Account> => {
  const response = await axiosInstance.post(`/transactions/retrait?numeroCompte=${numeroCompte}&montant=${payload.montant}`);
  return response.data;
};

export const getAccountTransactions = async (numeroCompte: string) => {
  // Ensure the URL matches the backend endpoint path
  const response = await axiosInstance.get(`/transactions/compte/${numeroCompte}/transactions`);
  return response.data;
};
