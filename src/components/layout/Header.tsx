import React from 'react';
import { 
  AppShell, 
  Group, 
  Container, 
  Button, 
  Title, 
  Menu, 
  Text,
  Divider
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { LogOut, User, ChevronDown, CreditCard, Home, Users } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  
  return (
    <AppShell.Header p="md">
      <Container size="xl">
        <Group justify="space-between">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Group>
              <CreditCard size={28} />
              <Title order={3}>BankApp</Title>
            </Group>
          </Link>
          
          {isAuthenticated ? (
            <Group>
              <Button
                component={Link}
                to="/dashboard"
                variant="subtle"
                leftSection={<Home size={18} />}
              >
                Tableau de bord
              </Button>
              
              <Button
                component={Link}
                to="/clients"
                variant="subtle"
                leftSection={<Users size={18} />}
              >
                Clients
              </Button>
              
              <Menu position="bottom-end" shadow="md">
                <Menu.Target>
                  <Button 
                    variant="subtle"
                    rightSection={<ChevronDown size={16} />}
                    leftSection={<User size={18} />}
                  >
                    {user?.email || 'Utilisateur'}
                  </Button>
                </Menu.Target>
                
                <Menu.Dropdown>
                  <Menu.Label>Profil</Menu.Label>
                  <Menu.Item leftSection={<User size={16} />}>
                    Mon compte
                  </Menu.Item>
                  <Divider />
                  <Menu.Item 
                    leftSection={<LogOut size={16} />} 
                    color="red"
                    onClick={logout}
                  >
                    Se déconnecter
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          ) : (
            <Group>
              <Button
                component={Link}
                to="/login"
                variant="subtle"
              >
                Se connecter
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="filled"
              >
                Créer un compte
              </Button>
            </Group>
          )}
        </Group>
      </Container>
    </AppShell.Header>
  );
};

export default Header;