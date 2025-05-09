import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Alert, Button } from '@mantine/core';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { getAccountByNumber, deposit, withdraw } from '../api/accounts';
import TransactionForm from '../components/transactions/TransactionForm';
import MainLayout from '../components/layout/MainLayout';
import { Account, DepositWithdrawPayload } from '../types';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Alert, Button, Stack, Text, Center, Loader } from '@mantine/core'; // Import Stack, Text, Center, Loader
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { getAccountByNumber, deposit, withdraw } from '../api/accounts';
import TransactionForm from '../components/transactions/TransactionForm';
import MainLayout from '../components/layout/MainLayout';
import { Account, DepositWithdrawPayload } from '../types';

const TransactionPage: React.FC = () => {
  const { accountNumber, type } = useParams<{ accountNumber: string; type: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accountNumber) return;

      try {
        setLoading(true);
        const accountData = await getAccountByNumber(accountNumber);
        setAccount(accountData);
        setError(null);
      } catch (err) {
        console.error('Error fetching account details:', err);
        setError('Erreur lors du chargement des données du compte.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountNumber]);

  const handleTransaction = async (values: DepositWithdrawPayload) => {
    if (!accountNumber || !account) return;

    try {
      setActionLoading(true);

      if (type === 'deposit') {
        await deposit(accountNumber, values);
      } else if (type === 'withdraw') {
        await withdraw(accountNumber, values);
      }

      navigate(`/accounts/${accountNumber}`);
    } catch (err: any) {
      console.error('Error processing transaction:', err);

      // Handle specific error for insufficient funds
      if (err.response?.status === 400) {
        setError('Erreur : Fonds insuffisants ou montant invalide.');
      } else {
        setError('Erreur lors du traitement de la transaction. Veuillez réessayer.');
      }

      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Paper p="xl" radius="md" withBorder>
          <Center style={{ height: 'calc(100vh - 140px)' }}>
            <Stack align="center">
              <Loader size="lg" />
              <Text>Chargement des données du compte...</Text>
            </Stack>
          </Center>
        </Paper>
      </MainLayout>
    );
  }

  if (error || !account) {
    return (
      <MainLayout>
        <Paper p="xl" radius="md" withBorder>
          <Alert
            icon={<AlertCircle size={16} />}
            title="Erreur"
            color="red"
            mb="lg"
          >
            {error || "Compte non trouvé."}
          </Alert>
          <Button
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
        </Paper>
      </MainLayout>
    );
  }

  // Validate transaction type
  if (type !== 'deposit' && type !== 'withdraw') {
    return (
      <MainLayout>
        <Paper p="xl" radius="md" withBorder>
          <Alert
            icon={<AlertCircle size={16} />}
            title="Erreur"
            color="red"
            mb="lg"
          >
            Type de transaction invalide.
          </Alert>
          <Button
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate(`/accounts/${account.numero_compte}`)}
          >
            Retour au compte
          </Button>
        </Paper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Paper p="xl" radius="md" withBorder>
        <Button
          leftSection={<ArrowLeft size={16} />}
          variant="subtle"
          onClick={() => navigate(`/accounts/${account.numero_compte}`)}
          mb="lg"
        >
          Retour au compte
        </Button>

        <TransactionForm
          accountNumber={account.numero_compte}
          accountBalance={account.solde}
          type={type as 'deposit' | 'withdrawal'}
          onSubmit={handleTransaction}
          isLoading={actionLoading}
          error={error}
        />
      </Paper>
    </MainLayout>
  );
};

export default TransactionPage;
