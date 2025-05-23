import React from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { NumberInput, Button, Box, Stack, Title, Text, Alert } from '@mantine/core';
import { AlertCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { transactionSchema } from '../../schemas/validation';
import { DepositWithdrawPayload } from '../../types';

interface TransactionFormProps {
  accountNumber: string;
  accountBalance: number;
  type: 'deposit' | 'withdrawal';
  onSubmit: (values: DepositWithdrawPayload) => void;
  isLoading: boolean;
  error: string | null;
  client?: Client; // Add client prop
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  accountNumber,
  accountBalance,
  type,
  onSubmit,
  isLoading,
  error,
  client // Destructure client prop
}) => {
  const form = useForm({
    initialValues: {
      montant: 0,
    },
    validate: zodResolver(transactionSchema),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF', // Changed from EUR to XOF
    }).format(amount);
  };

  return (
    <Box>
      {/* Display Client Information if available */}
      {client && (
        <Paper p="md" radius="md" withBorder mb="lg">
          <Stack spacing="sm">
            <Group>
              <User size={20} />
              <Title order={4}>Titulaire</Title>
            </Group>
            <Text weight={500}>{client.prenom} {client.nom}</Text>
            <Text size="sm" color="dimmed">Matricule: {client.matricule}</Text>
          </Stack>
        </Paper>
      )}

      <Stack align="center" mb="lg">
        {type === 'deposit' ? (
          <ArrowDownCircle size={48} color="#40c057" />
        ) : (
          <ArrowUpCircle size={48} color="#fa5252" />
        )}
        <Title order={3}>
          {type === 'deposit' ? 'Dépôt' : 'Retrait'}
        </Title>
      </Stack>

      <Text mb="md">Compte: {accountNumber}</Text>
      <Text mb="lg" size="lg" weight={500}>
        Solde actuel: {formatCurrency(accountBalance)}
      </Text>

      {error && (
        <Alert icon={<AlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="md">
          <NumberInput
            label={`Montant à ${type === 'deposit' ? 'déposer' : 'retirer'}`}
            placeholder="0.00"
            required
            min={1}
            precision={2}
            {...form.getInputProps('montant')}
            size="lg"
          />

          <Button 
            type="submit" 
            loading={isLoading}
            size="lg"
            fullWidth
            color={type === 'deposit' ? 'green' : 'red'}
          >
            {type === 'deposit' ? 'Effectuer le dépôt' : 'Effectuer le retrait'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default TransactionForm;
