import React from 'react';
import { Container, Paper } from '@mantine/core';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import useAuthStore from '../store/authStore';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Container size={420} my={40}>
      <Paper radius="md" p="xl" withBorder>
        <LoginForm />
      </Paper>
    </Container>
  );
};

export default LoginPage;