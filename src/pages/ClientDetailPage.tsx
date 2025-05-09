import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Title,
  Text,
  Group,
  Button,
  Grid,
  Alert,
  Modal,
  Badge,
  Stack, // Import Stack
} from '@mantine/core';
import {
  AlertCircle,
  Plus,
  Trash,
  Edit, // Import Edit icon
} from 'lucide-react';
import { getClientByMatricule, deleteClient } from '../api/clients';
import { getClientAccounts, deleteAccount } from '../api/accounts';
import MainLayout from '../components/layout/MainLayout';
import AccountSummary from '../components/dashboard/AccountSummary'; // Import AccountSummary
import { Client, Account } from '../types';

const ClientDetailPage: React.FC = () => {
  const { matricule } = useParams<{ matricule: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteClientModalOpen, setDeleteClientModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!matricule) return;

      try {
        setLoading(true);

        // Fetch client details
        const clientData = await getClientByMatricule(matricule);
        setClient(clientData);

        // Fetch client's accounts
        const accountsData = await getClientAccounts(matricule);
        setAccounts(accountsData);

        setError(null);
      } catch (err) {
        console.error('Error fetching client details:', err);
        setError('Erreur lors du chargement des données du client.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [matricule]);

  const handleDeleteClient = async () => {
    if (!client) return;

    try {
      setDeleteLoading(true);
      await deleteClient(client.matricule);
      setDeleteClientModalOpen(false);
      navigate('/clients');
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Erreur lors de la suppression du client.');
      setDeleteLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteAccount(accountToDelete);
      setAccounts(accounts.filter(account => account.numero_compte !== accountToDelete));
      setDeleteAccountModalOpen(false);
      setAccountToDelete(null);
    } catch (err: any) {
      console.error('Error deleting account:', err);
      const message = err.response?.data?.message || 'Erreur lors de la suppression du compte.';
      setError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Text>Chargement des données du client...</Text>
      </MainLayout>
    );
  }

  if (error || !client) {
    return (
      <MainLayout>
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erreur"
          color="red"
        >
          {error || "Client non trouvé."}
        </Alert>
        <Button component={Link} to="/clients" mt="md">
          Retour à la liste des clients
        </Button>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Group justify="space-between" mb="lg">
        <div>
          <Group gap="sm">
            <Title order={2}>{client.prenom} {client.nom}</Title>
            <Badge color={client.sexe === 'M' ? 'blue' : 'pink'}>
              {client.sexe === 'M' ? 'Homme' : 'Femme'}
            </Badge>
          </Group>
          <Text c="dimmed">Matricule: {client.matricule}</Text>
        </div>

        <Group>
          <Button
            component={Link}
            to={`/clients/${client.matricule}/edit`}
            leftSection={<Edit size={16} />}
            variant="outline"
          >
            Modifier
          </Button>

          <Button
            component={Link}
            to={`/clients/${client.matricule}/accounts/new`}
            leftSection={<Plus size={16} />}
            variant="outline"
          >
            Nouveau compte
          </Button>

          <Button
            color="red"
            variant="subtle"
            leftSection={<Trash size={16} />}
            onClick={() => setDeleteClientModalOpen(true)}
          >
            Supprimer
          </Button>
        </Group>
      </Group>

      {/* Accounts List */}
      <Title order={3} mt="xl" mb="md">Comptes</Title>
      {accounts.length > 0 ? (
        <Grid gutter="md">
          {accounts.map(account => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={account.numero_compte}>
              {/* Wrap AccountSummary and delete button */}
              <Stack spacing="sm"> {/* Use Stack for vertical alignment */}
                <AccountSummary account={account} />
                <Group justify="flex-end"> {/* Align button to the right */}
                  <Button
                    variant="outline"
                    color="red"
                    size="sm"
                    leftSection={<Trash size={14} />}
                    onClick={() => {
                      setAccountToDelete(account.numero_compte);
                      setDeleteAccountModalOpen(true);
                    }}
                  >
                    Supprimer le compte
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <Text c="dimmed">Aucun compte trouvé pour ce client.</Text>
      )}


      {/* Delete Client Modal */}
      <Modal
        opened={deleteClientModalOpen}
        onClose={() => setDeleteClientModalOpen(false)}
        title="Confirmer la suppression"
        centered
      >
        <Text mb="lg">
          Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible
          et supprimera également tous les comptes associés.
        </Text>

        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setDeleteClientModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDeleteClient} loading={deleteLoading}>
            Supprimer
          </Button>
        </Group>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        opened={deleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
        title="Confirmer la suppression"
        centered
      >
        <Text mb="lg">
          Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible
          et supprimera également toutes les transactions associées.
        </Text>

        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setDeleteAccountModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDeleteAccount} loading={deleteLoading}>
            Supprimer
          </Button>
        </Group>
      </Modal>
    </MainLayout>
  );
};

export default ClientDetailPage
