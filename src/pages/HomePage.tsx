import React from 'react';
import { Title, Text, Button, Group, Stack, Image, Container, Paper, SimpleGrid } from '@mantine/core';
import { ArrowRight, ShieldCheck, CreditCard, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <Container size="xl">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40} pt={40}>
        <Stack justify="center" spacing="lg">
          <Title order={1} size={48}>
            Gérez vos comptes <span style={{ color: '#1C7ED6' }}>en toute simplicité</span>
          </Title>
          
          <Text size="lg" maw={600}>
            Notre application bancaire vous permet de gérer facilement vos comptes, 
            effectuer des transactions et suivre vos finances en temps réel.
          </Text>
          
          <Group mt="xl">
            {isAuthenticated ? (
              <Button 
                component={Link}
                to="/dashboard"
                size="lg"
                rightSection={<ArrowRight size={18} />}
              >
                Accéder à mon espace
              </Button>
            ) : (
              <Group>
                <Button
                  component={Link}
                  to="/login"
                  size="lg"
                  variant="filled"
                >
                  Se connecter
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  size="lg"
                  variant="outline"
                >
                  Créer un compte
                </Button>
              </Group>
            )}
          </Group>
        </Stack>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Image 
            src="https://images.pexels.com/photos/6347729/pexels-photo-6347729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Banking app illustration"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
      </SimpleGrid>
      
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing="xl"
        mt={80}
        mb={40}
      >
        <Paper p="lg" radius="md" withBorder>
          <ShieldCheck size={32} color="#1C7ED6" style={{ marginBottom: '16px' }} />
          <Title order={3} mb="sm">Sécurité avancée</Title>
          <Text size="sm">
            Vos données sont protégées avec les dernières technologies de sécurité et de cryptage.
          </Text>
        </Paper>
        
        <Paper p="lg" radius="md" withBorder>
          <CreditCard size={32} color="#1C7ED6" style={{ marginBottom: '16px' }} />
          <Title order={3} mb="sm">Gestion simple</Title>
          <Text size="sm">
            Créez et gérez facilement vos comptes courants et d'épargne en quelques clics.
          </Text>
        </Paper>
        
        <Paper p="lg" radius="md" withBorder>
          <TrendingUp size={32} color="#1C7ED6" style={{ marginBottom: '16px' }} />
          <Title order={3} mb="sm">Suivi en temps réel</Title>
          <Text size="sm">
            Suivez vos transactions et l'évolution de vos finances en temps réel avec des rapports détaillés.
          </Text>
        </Paper>
      </SimpleGrid>
    </Container>
  );
};

export default HomePage;