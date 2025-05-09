import React from 'react';
import { Card, Text, Group, Badge, Divider, Stack, Title, ActionIcon } from '@mantine/core';
import { ExternalLink, CreditCard, Calendar } from 'lucide-react'; // Import CreditCard and Calendar
import { Link } from 'react-router-dom';
import { Account, CheckingAccount, SavingsAccount } from '../../types';

interface AccountSummaryProps {
  account: Account;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ account }) => {
  const isCheckingAccount = 'decouvertAutorise' in account;
  const isSavingsAccount = 'tauxInteret' in account;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF', // Changed from EUR to XOF
    }).format(amount);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Group spacing="xs"> {/* Added Group for icon and title */}
            <CreditCard size={20} /> {/* Added icon */}
            <Text fw={500} size="lg">
              {account.libelle}
            </Text>
          </Group>
          <ActionIcon
            component={Link}
            to={`/accounts/${account.numero_compte}`}
            variant="subtle"
            color="blue"
            size="lg"
            aria-label="Voir les détails"
          >
            <ExternalLink size={20} />
          </ActionIcon>
        </Group>
      </Card.Section>

      <Stack mt="md" spacing="xs">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Numéro de compte</Text>
          <Text size="sm">{account.numero_compte}</Text>
        </Group>

        <Group justify="space-between">
          <Text size="sm" c="dimmed">Solde actuel</Text>
          <Text size="lg" fw={700} c={account.solde >= 0 ? 'green' : 'red'}>
            {formatCurrency(account.solde)}
          </Text>
        </Group>

        <Divider my="sm" />

        <Group justify="space-between">
          <Text size="sm" c="dimmed">Type</Text>
          <Badge color={isCheckingAccount ? 'blue' : 'green'}>
            {isCheckingAccount ? 'Compte Courant' : 'Compte Épargne'}
          </Badge>
        </Group>

        {isCheckingAccount && (
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Découvert autorisé</Text>
            <Text size="sm">
              {formatCurrency((account as CheckingAccount).decouvertAutorise)}
            </Text>
          </Group>
        )}

        {isSavingsAccount && (
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Taux d'intérêt</Text>
            <Text size="sm">
              {((account as SavingsAccount).tauxInteret * 100).toFixed(2)}%
            </Text>
          </Group>
        )}

        <Group justify="space-between">
          <Group spacing="xs"> {/* Added Group for icon and text */}
            <Calendar size={16} color="gray" /> {/* Added icon */}
            <Text size="sm" c="dimmed">Date de création</Text>
          </Group>
          <Text size="sm">
            {new Date(account.date_creation).toLocaleDateString('fr-FR')}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};

export default AccountSummary;
