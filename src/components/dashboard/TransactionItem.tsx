import React from 'react';
import { Group, Text, ThemeIcon, Paper } from '@mantine/core';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isCredit = transaction.type === 'CREDIT';
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF', // Changed from EUR to XOF
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <Paper 
      p="md" 
      withBorder 
      radius="md"
      mb="sm"
    >
      <Group position="apart">
        <Group>
          <ThemeIcon 
            color={isCredit ? 'green' : 'red'} 
            variant="light" 
            size="lg" 
            radius="xl"
          >
            {isCredit ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
          </ThemeIcon>
          
          <div>
            <Text size="sm">{isCredit ? 'Dépôt' : 'Retrait'}</Text>
            <Text size="xs" color="dimmed">{formatDate(transaction.dateTransaction)}</Text>
          </div>
        </Group>
        
        <Text 
          weight={700} 
          color={isCredit ? 'green' : 'red'}
        >
          {isCredit ? '+' : '-'}{formatCurrency(transaction.montant)}
        </Text>
      </Group>
    </Paper>
  );
};

export default TransactionItem;
