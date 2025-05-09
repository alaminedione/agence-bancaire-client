import React, { useEffect } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import CreateClientPage from './pages/CreateClientPage';
import CreateAccountPage from './pages/CreateAccountPage';
import AccountDetailPage from './pages/AccountDetailPage';
import TransactionPage from './pages/TransactionPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import useAuthStore from './store/authStore';

// Create a custom theme
const theme = createTheme({
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  primaryColor: 'blue',
  colors: {
    // Custom color palette could be defined here
  },
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
  },
});

function App() {
  const { setUser, isAuthenticated } = useAuthStore();
  
  // Check if user is already authenticated
  useEffect(() => {
    const authHeader = localStorage.getItem('auth_header');
    if (authHeader) {
      try {
        const [email] = atob(authHeader).split(':');
        setUser({ email, isAuthenticated: true });
      } catch (err) {
        console.error('Error parsing auth header:', err);
        localStorage.removeItem('auth_header');
      }
    }
  }, [setUser]);
  
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/clients" element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/clients/new" element={
            <ProtectedRoute>
              <CreateClientPage />
            </ProtectedRoute>
          } />
          
          <Route path="/clients/:matricule" element={
            <ProtectedRoute>
              <ClientDetailPage />
            </ProtectedRoute>
          } />
          
          <Route path="/clients/:matricule/accounts/new" element={
            <ProtectedRoute>
              <CreateAccountPage />
            </ProtectedRoute>
          } />
          
          <Route path="/accounts/:accountNumber" element={
            <ProtectedRoute>
              <AccountDetailPage />
            </ProtectedRoute>
          } />
          
          <Route path="/accounts/:accountNumber/:type" element={
            <ProtectedRoute>
              <TransactionPage />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;