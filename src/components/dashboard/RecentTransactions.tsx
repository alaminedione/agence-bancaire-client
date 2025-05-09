import React from 'react';
import { Card, Title, Text, Stack, Button, Center, Loader } from '@mantine/core';
import { History } from 'lucide-react';
import { Transaction } from '../../types';
import TransactionItem from './TransactionItem';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  accountId: string;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  isLoading, 
  error,
  accountId
}) => {
  if (isLoading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Transactions récentes</Title>
        <Center p="xl">
          <Loader />
        </Center>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Transactions récentes</Title>
        <Text color="red">{error}</Text>
      </Card>
    );
  }
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} mb="md">Transactions récentes</Title>
      
      {transactions.length === 0 ? (
        <Text color="dimmed" align="center" py="md">
          Aucune transaction récente
        </Text>
      ) : (
        <Stack spacing="xs">
          {transactions.slice(0, 5).map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
          
          {transactions.length > 5 && (
            <Button 
              variant="subtle" 
              leftIcon={<History size={16} />}
              component="a"
              href={`/accounts/${accountId}/transactions`}
            >
              Voir toutes les transactions
            </Button>
          )}
        </Stack>
      )}
    </Card>
  );
};

export default RecentTransactions;