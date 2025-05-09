import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Alert, Text, Center, Loader } from '@mantine/core';
import { AlertCircle } from 'lucide-react';
import { getClientByMatricule, updateClient } from '../api/clients';
import ClientForm from '../components/clients/ClientForm';
import MainLayout from '../components/layout/MainLayout';
import { Client } from '../types';

const EditClientPage: React.FC = () => {
  const { matricule } = useParams<{ matricule: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!matricule) return;

      try {
        setLoading(true);
        const clientData = await getClientByMatricule(matricule);
        setClient(clientData);
        setError(null);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError('Erreur lors du chargement des données du client.');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [matricule]);

  const handleSubmit = async (values: Omit<Client, 'comptes'>) => {
    if (!matricule) return;

    try {
      setSaving(true);
      await updateClient(matricule, values);
      navigate(`/clients/${matricule}`);
    } catch (err: any) {
      console.error('Error updating client:', err);
      const message = err.response?.data?.message || 'Erreur lors de la mise à jour du client. Veuillez réessayer.';
      setError(message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Center style={{ height: 'calc(100vh - 140px)' }}>
          <Stack align="center">
            <Loader size="lg" />
            <Text>Chargement des données du client...</Text>
          </Stack>
        </Center>
      </MainLayout>
    );
  }

  if (error || !client) {
    return (
      <MainLayout>
        <Paper p="xl" radius="md" withBorder>
          <Alert
            icon={<AlertCircle size={16} />}
            title="Erreur"
            color="red"
          >
            {error || "Client non trouvé."}
          </Alert>
        </Paper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Paper p="xl" radius="md" withBorder>
        {error && (
          <Alert
            icon={<AlertCircle size={16} />}
            title="Erreur"
            color="red"
            mb="lg"
          >
            {error}
          </Alert>
        )}

        <ClientForm
          initialValues={client}
          onSubmit={handleSubmit}
          isLoading={saving}
        />
      </Paper>
    </MainLayout>
  );
};

export default EditClientPage;
