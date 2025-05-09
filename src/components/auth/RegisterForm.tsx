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
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../../schemas/validation';
import useAuthStore from '../../store/authStore';
import type { RegisterCredentials } from '../../types';

const RegisterForm: React.FC = () => {
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(registerSchema),
  });
  
  const handleSubmit = async (values: RegisterCredentials) => {
    await register(values);
    if (!error) {
      navigate('/login');
    }
  };
  
  return (
    <Stack spacing="lg">
      <div>
        <Title order={2} mb="xs">Créer un compte</Title>
        <Text c="dimmed" size="sm">
          Déjà inscrit ?{' '}
          <Anchor component={Link} to="/login" size="sm">
            Se connecter
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
            placeholder="Choisissez un mot de passe"
            required
            {...form.getInputProps('password')}
          />

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
          >
            S'inscrire
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default RegisterForm;
