import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Title,
  Text,
  Group,
  Button,
  Grid,
  Paper,
  Stack,
  Divider,
  Alert,
  Badge,
  Tabs,
} from '@mantine/core';
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CreditCard,
  User,
  Calendar,
} from 'lucide-react';
import { getAccountByNumber, getAccountTransactions } from '../api/accounts';
import { getClientByMatricule } from '../api/clients';
import TransactionItem from '../components/dashboard/TransactionItem';
import MainLayout from '../components/layout/MainLayout';
import { Account, CheckingAccount, SavingsAccount, Transaction, Client } from '../types';

const AccountDetailPage: React.FC = () => {
  const { accountNumber } = useParams<{ accountNumber: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accountNumber) return;

      try {
        setLoading(true);

        // Fetch account details
        const accountData = await getAccountByNumber(accountNumber);
        setAccount(accountData);

        // Fetch client details if client information is available
        if (accountData.client?.matricule) {
          const clientData = await getClientByMatricule(accountData.client.matricule);
          setClient(clientData);
        }

        // Fetch transactions
        const transactionsData = await getAccountTransactions(accountNumber);
        setTransactions(transactionsData);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF', // Changed from EUR to XOF
    }).format(amount);
  };

  const isCheckingAccount = account && 'decouvertAutorise' in account;
  const isSavingsAccount = account && 'tauxInteret' in account;

  if (loading) {
    return (
      <MainLayout>
        <Paper p="xl" radius="md" withBorder>
          <Stack align="center">
            <Text>Chargement des données du compte...</Text>
          </Stack>
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
          <Button component={Link} to="/dashboard" leftSection={<ArrowLeft size={16} />}>
            Retour au tableau de bord
          </Button>
        </Paper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Group justify="space-between" mb="lg">
        <div>
          <Group spacing="sm">
            <Title order={2}>{account.libelle}</Title>
            <Badge color={isCheckingAccount ? 'blue' : 'green'}>
              {isCheckingAccount ? 'Compte Courant' : 'Compte Épargne'}
            </Badge>
          </Group>
          <Text color="dimmed">N° {account.numero_compte}</Text>
        </div>

        <Group>
          <Button
            component={Link}
            to={`/accounts/${account.numero_compte}/deposit`}
            leftSection={<ArrowDownCircle size={16} />}
            color="green"
          >
            Dépôt
          </Button>

          <Button
            component={Link}
            to={`/accounts/${account.numero_compte}/withdraw`}
            leftSection={<ArrowUpCircle size={16} />}
            color="red"
            variant="outline"
          >
            Retrait
          </Button>
        </Group>
      </Group>

      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="md" radius="md" withBorder>
            <Stack spacing="md">
              <Group>
                <CreditCard size={20} />
                <Title order={4}>Détails du compte</Title>
              </Group>

              <Divider />

              <Group position="apart">
                <Text size="sm" color="dimmed">Solde actuel</Text>
                <Text size="lg" weight={700} color={account.solde >= 0 ? 'green' : 'red'}>
                  {formatCurrency(account.solde)}
                </Text>
              </Group>

              {isCheckingAccount && (
                <Group position="apart">
                  <Text size="sm" color="dimmed">Découvert autorisé</Text>
                  <Text>
                    {formatCurrency((account as CheckingAccount).decouvertAutorise)}
                  </Text>
                </Group>
              )}

              {isSavingsAccount && (
                <Group position="apart">
                  <Text size="sm" color="dimmed">Taux d'intérêt</Text>
                  <Text>
                    {((account as SavingsAccount).tauxInteret * 100).toFixed(2)}%
                  </Text>
                </Group>
              )}

              <Group position="apart">
                <Text size="sm" color="dimmed">Date de création</Text>
                <Group spacing="xs">
                  <Calendar size={16} />
                  <Text>
                    {new Date(account.date_creation).toLocaleDateString('fr-FR')}
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Paper>

          {client && (
            <Paper p="md" radius="md" withBorder mt="md">
              <Stack spacing="md">
                <Group>
                  <User size={20} />
                  <Title order={4}>Titulaire</Title>
                </Group>

                <Divider />

                <Button
                  component={Link}
                  to={`/clients/${client.matricule}`}
                  variant="subtle"
                  fullWidth
                  styles={{
                    root: {
                      height: 'auto',
                      padding: '10px',
                    }
                  }}
                >
                  <div>
                    <Text weight={500}>{client.prenom} {client.nom}</Text>
                    <Text size="xs" color="dimmed">
                      {client.matricule}
                    </Text>
                  </div>
                </Button>
              </Stack>
            </Paper>
          )}
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Tabs defaultValue="transactions">
            <Tabs.List>
              <Tabs.Tab value="transactions" leftSection={<Clock size={16} />}>
                Transactions ({transactions.length})
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="transactions" pt="md">
              {transactions.length === 0 ? (
                <Alert
                  icon={<AlertCircle size={16} />}
                  title="Aucune transaction"
                  color="blue"
                >
                  Ce compte n'a pas encore de transactions. Effectuez un dépôt ou un retrait.
                </Alert>
              ) : (
                <Stack spacing="sm">
                  {transactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </Stack>
              )}
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>
    </MainLayout>
  );
};

export default AccountDetailPage;
