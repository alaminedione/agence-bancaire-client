import React, { useEffect, useState } from 'react';
import { Title, Text, Group, Button, Grid, Alert, Modal, Skeleton } from '@mantine/core'; // Import Skeleton
import { Plus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getClients, deleteClient } from '../api/clients';
import ClientCard from '../components/clients/ClientCard';
import MainLayout from '../components/layout/MainLayout';
import { Client } from '../types';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State to track if data has been fetched at least once
  const [hasFetched, setHasFetched] = useState(false);
  
  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      setClients(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Erreur lors du chargement des clients.');
    } finally {
      setLoading(false);
      setHasFetched(true); // Mark as fetched
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Show loading skeleton only on initial load
  if (loading && !hasFetched) {
    return (
      <MainLayout>
        <Group position="apart" mb="lg">
          <Title order={2}>Gestion des clients</Title>
          <Button
            component={Link}
            to="/clients/new"
            leftSection={<Plus size={16} />}
            disabled // Disable button while loading
          >
            Nouveau client
          </Button>
        </Group>
        <Skeleton height={100} radius="md" mb="md" />
        <Skeleton height={100} radius="md" mb="md" />
        <Skeleton height={100} radius="md" mb="md" />
      </MainLayout>
    );
  }
  
  const handleDeleteClick = (matricule: string) => {
    setClientToDelete(matricule);
    setDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      setDeleteLoading(true);
      await deleteClient(clientToDelete);
      setClients(clients.filter(client => client.matricule !== clientToDelete));
      setDeleteModalOpen(false);
      setClientToDelete(null);
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Erreur lors de la suppression du client.');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <Group position="apart" mb="lg">
        <Title order={2}>Gestion des clients</Title>
        
        <Button 
          component={Link}
          to="/clients/new"
          leftSection={<Plus size={16} />}
        >
          Nouveau client
        </Button>
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

      {/* Show loading text only after initial fetch if refetching */}
      {loading && hasFetched && <Text>Mise à jour des clients...</Text>}

      {!loading && clients.length === 0 ? (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Aucun client"
          color="blue"
        >
          Vous n'avez pas encore de clients. Créez votre premier client en cliquant sur le bouton "Nouveau client".
        </Alert>
      ) : (
        <Grid>
          {clients.map((client) => (
            <Grid.Col key={client.matricule} span={{ base: 12, sm: 6, lg: 4 }}>
              <ClientCard
                client={client}
                onDelete={handleDeleteClick}
              />
            </Grid.Col>
          ))}
        </Grid>
      )}

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmer la suppression"
        centered
      >
        <Text mb="lg">
          Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible
          et supprimera également tous les comptes associés.
        </Text>

        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleConfirmDelete} loading={deleteLoading}>
            Supprimer
          </Button>
        </Group>
      </Modal>
    </MainLayout>
  );
};

export default ClientsPage;
