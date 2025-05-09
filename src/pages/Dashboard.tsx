import React, { useEffect, useState } from 'react';
import { Title, Text, Group, Button, Grid, Skeleton, Alert, Card, Badge } from '@mantine/core'; // Import Card and Badge
import { Plus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getClients } from '../api/clients';
import MainLayout from '../components/layout/MainLayout';
import useAuthStore from '../store/authStore';
import { Client } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get all clients
        const clientsData = await getClients();
        setClients(clientsData);

        setError(null); // Clear previous errors
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Tableau de bord</Title>
          <Text c="dimmed">Bienvenue, {user?.email}</Text> {/* Use user.email as name might not be available */}
        </div>

        <Group>
          <Button
            component={Link}
            to="/clients/new"
            leftSection={<Plus size={16} />}
            variant="outline"
          >
            Nouveau client
          </Button>

          {/* Removed "Nouveau compte" button from Dashboard */}
        </Group>
      </Group>

      {error && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erreur"
          color="red"
          mb="md"
        >
          {error}
        </Alert>
      )}

      <Title order={3} mb="md">Clients ({clients.length})</Title>
      {loading ? (
        <Skeleton height={50} radius="md" mb="xl" />
      ) : clients.length === 0 ? (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Aucun client"
          color="blue"
          mb="xl"
        >
          Vous n'avez pas encore de clients. Commencez par créer un nouveau client.
        </Alert>
      ) : (
        <Grid mb="xl">
          {clients.map((client) => (
            <Grid.Col key={client.matricule} span={{ base: 12, md: 6, lg: 4 }}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                component={Link} // Make the card a link
                to={`/clients/${client.matricule}`}
              >
                <Group justify="space-between" mb="xs">
                  <Text weight={500}>{client.prenom} {client.nom}</Text>
                  <Badge color={client.sexe === 'M' ? 'blue' : 'pink'} variant="light">
                    {client.sexe === 'M' ? 'Homme' : 'Femme'}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  Matricule: {client.matricule}
                </Text>
                <Text size="sm" c="dimmed">
                  Comptes: {client.comptes?.length || 0}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}

      {/* Removed Accounts List section */}

    </MainLayout>
  );
};

export default Dashboard;
