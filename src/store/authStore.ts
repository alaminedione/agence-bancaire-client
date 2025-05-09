import { create } from 'zustand';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { type AuthState, type LoginCredentials, type RegisterCredentials } from '../types';

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // Create Basic auth header
      const authHeader = btoa(`${credentials.email}:${credentials.password}`);
      
      // Make login request
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        credentials,
        {
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.status === 200) {
        // Store auth header for future requests
        localStorage.setItem('auth_header', authHeader);
        
        // Set user state
        set({ 
          user: { email: credentials.email, isAuthenticated: true },
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        notifications.show({
          title: 'Connexion réussie',
          message: 'Bienvenue dans votre espace bancaire',
          color: 'green',
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de la connexion';
      set({ error: message, isLoading: false });
      
      notifications.show({
        title: 'Erreur de connexion',
        message,
        color: 'red',
      });
    }
  },
  
  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.status === 200) {
        notifications.show({
          title: 'Inscription réussie',
          message: 'Vous pouvez maintenant vous connecter',
          color: 'green',
        });
        
        set({ isLoading: false, error: null });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      set({ error: message, isLoading: false });
      
      notifications.show({
        title: 'Erreur d\'inscription',
        message,
        color: 'red',
      });
    }
  },
  
  logout: () => {
    // Clear stored auth header
    localStorage.removeItem('auth_header');
    
    // Reset auth state
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false, 
      error: null 
    });
    
    notifications.show({
      title: 'Déconnexion',
      message: 'Vous avez été déconnecté avec succès',
      color: 'blue',
    });
    
    // Redirect to home
    window.location.href = '/';
  },
  
  setUser: (user) => {
    set({ 
      user, 
      isAuthenticated: true, 
      isLoading: false 
    });
  },
}));

export default useAuthStore;