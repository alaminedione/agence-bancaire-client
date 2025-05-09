import axiosInstance from './axios-config';
import type { Client } from '../types';

export const getClients = async (): Promise<Client[]> => {
  const response = await axiosInstance.get('/clients');
  return response.data;
};

export const getClientByMatricule = async (matricule: string): Promise<Client> => {
  const response = await axiosInstance.get(`/clients/${matricule}`);
  return response.data;
};

export const createClient = async (client: Omit<Client, 'comptes'>): Promise<Client> => {
  const response = await axiosInstance.post('/clients', client);
  return response.data;
};

export const deleteClient = async (matricule: string): Promise<void> => {
  await axiosInstance.delete(`/clients/${matricule}`);
};