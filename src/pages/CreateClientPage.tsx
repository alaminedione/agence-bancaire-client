import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Alert } from '@mantine/core';
import { AlertCircle } from 'lucide-react';
import { createClient } from '../api/clients';
import ClientForm from '../components/clients/ClientForm';
import MainLayout from '../components/layout/MainLayout';
import { Client } from '../types';

const CreateClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (values: Omit<Client, 'comptes'>) => {
    try {
      setLoading(true);
      const newClient = await createClient(values);
      navigate(`/clients/${newClient.matricule}`);
    } catch (err) {
      console.error('Error creating client:', err);
      setError('Erreur lors de la création du client. Veuillez réessayer.');
      setLoading(false);
    }
  };
  
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
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </Paper>
    </MainLayout>
  );
};

export default CreateClientPage;