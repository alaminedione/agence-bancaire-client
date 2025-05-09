import React from 'react';
import { Button } from '@mantine/core';
import { LogIn } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const LoginButton: React.FC = () => {
  const { login, isLoading } = useAuthStore();
  
  return (
    <Button
      leftSection={<LogIn size={18} />}
      onClick={login}
      loading={isLoading}
      variant="filled"
      color="blue"
    >
      Se connecter avec Google
    </Button>
  );
};

export default LoginButton;