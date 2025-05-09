import React from 'react';
import { Container, Paper } from '@mantine/core';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import useAuthStore from '../store/authStore';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Container size={420} my={40}>
      <Paper radius="md" p="xl" withBorder>
        <RegisterForm />
      </Paper>
    </Container>
  );
};

export default RegisterPage;