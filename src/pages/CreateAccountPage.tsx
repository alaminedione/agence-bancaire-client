import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Alert } from '@mantine/core';
import { AlertCircle } from 'lucide-react';
import { createCheckingAccount, createSavingsAccount } from '../api/accounts';
import AccountForm from '../components/accounts/AccountForm';
import MainLayout from '../components/layout/MainLayout';
import { CheckingAccount, SavingsAccount } from '../types';

const CreateAccountPage: React.FC = () => {
  const { matricule } = useParams<{ matricule: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmitChecking = async (values: Omit<CheckingAccount, 'date_creation' | 'client' | 'transactions'>) => {
    if (!matricule) return;

    try {
      setLoading(true);
      await createCheckingAccount(matricule, values);
      navigate(`/clients/${matricule}`);
    } catch (err: any) {
      console.error('Error creating checking account:', err);
      const message = err.response?.data?.message || 'Erreur lors de la création du compte courant. Veuillez réessayer.';
      setError(message);
      setLoading(false);
    }
  };

  const handleSubmitSavings = async (values: Omit<SavingsAccount, 'date_creation' | 'client' | 'transactions'>) => {
    if (!matricule) return;

    try {
      setLoading(true);
      await createSavingsAccount(matricule, values);
      navigate(`/clients/${matricule}`);
    } catch (err: any) {
      console.error('Error creating savings account:', err);
      const message = err.response?.data?.message || 'Erreur lors de la création du compte épargne. Veuillez réessayer.';
      setError(message);
      setLoading(false);
    }
  };
  
  if (!matricule) {
    return (
      <MainLayout>
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erreur"
          color="red"
        >
          Client non spécifié.
        </Alert>
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
        
        <AccountForm 
          clientMatricule={matricule}
          onSubmitChecking={handleSubmitChecking}
          onSubmitSavings={handleSubmitSavings}
          isLoading={loading}
        />
      </Paper>
    </MainLayout>
  );
};

export default CreateAccountPage;
