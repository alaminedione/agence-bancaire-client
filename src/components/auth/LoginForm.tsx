import React from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Stack, 
  Title, 
  Text,
  Anchor,
  Alert,
} from '@mantine/core';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loginSchema } from '../../schemas/validation';
import useAuthStore from '../../store/authStore';
import type { LoginCredentials } from '../../types';

const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuthStore();
  
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(loginSchema),
  });
  
  const handleSubmit = (values: LoginCredentials) => {
    login(values);
  };
  
  return (
    <Stack spacing="lg">
      <div>
        <Title order={2} mb="xs">Connexion</Title>
        <Text c="dimmed" size="sm">
          Pas encore de compte ?{' '}
          <Anchor component={Link} to="/register" size="sm">
            Créer un compte
          </Anchor>
        </Text>
      </div>
      
      {error && (
        <Alert icon={<AlertCircle size={16} />} color="red" title="Erreur">
          {error}
        </Alert>
      )}
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <TextInput
            label="Email"
            placeholder="votre@email.com"
            required
            {...form.getInputProps('email')}
          />
          
          <PasswordInput
            label="Mot de passe"
            placeholder="Votre mot de passe"
            required
            {...form.getInputProps('password')}
          />
          
          <Button 
            type="submit" 
            loading={isLoading}
            fullWidth
          >
            Se connecter
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default LoginForm;