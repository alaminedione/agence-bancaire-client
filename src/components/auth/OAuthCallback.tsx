import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Center, Loader, Text, Stack } from '@mantine/core';
import useAuthStore from '../../store/authStore';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userData = searchParams.get('user');
    
    if (token) {
      // Store the token
      localStorage.setItem('auth_token', token);
      
      try {
        // Parse and set user data if available
        if (userData) {
          const user = JSON.parse(atob(userData));
          setUser({
            id: user.sub || user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            isAuthenticated: true
          });
        }
        
        // Redirect to the dashboard
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to process authentication data');
        console.error(err);
      }
    } else {
      // Handle error case
      const errorMessage = searchParams.get('error') || 'Authentication failed';
      setError(errorMessage);
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [searchParams, setUser, navigate]);

  if (error) {
    return (
      <Center style={{ height: '100vh' }}>
        <Stack align="center" spacing="md">
          <Text color="red" size="lg" weight={500}>
            {error}
          </Text>
          <Text size="sm">Redirection vers la page d'accueil...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Center style={{ height: '100vh' }}>
      <Stack align="center" spacing="md">
        <Loader size="lg" />
        <Text size="lg">Authentification en cours...</Text>
      </Stack>
    </Center>
  );
};

export default OAuthCallback;