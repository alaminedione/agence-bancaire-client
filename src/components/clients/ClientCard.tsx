import React from 'react';
import { Card, Text, Group, Badge, ActionIcon, Stack } from '@mantine/core';
import { Edit, Trash, CreditCard, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Client } from '../../types';

interface ClientCardProps {
  client: Client;
  onDelete: (matricule: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Group>
            <User size={20} />
            <Text fw={500}>{client.prenom} {client.nom}</Text>
          </Group>
          <Group spacing={8}>
            <ActionIcon
              component={Link}
              to={`/clients/${client.matricule}/edit`}
              variant="light"
              color="blue"
              size="sm"
              aria-label="Modifier"
            >
              <Edit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="red"
              size="sm"
              aria-label="Supprimer"
              onClick={() => onDelete(client.matricule)}
            >
              <Trash size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Card.Section>
      
      <Stack mt="md" spacing="xs">
        <Group position="apart">
          <Text size="sm" color="dimmed">Matricule</Text>
          <Text size="sm" weight={500}>{client.matricule}</Text>
        </Group>
        
        <Group position="apart">
          <Text size="sm" color="dimmed">Téléphone</Text>
          <Text size="sm">{client.numero_telephone}</Text>
        </Group>
        
        <Group position="apart">
          <Text size="sm" color="dimmed">Âge</Text>
          <Text size="sm">{client.age} ans</Text>
        </Group>
        
        <Group position="apart">
          <Text size="sm" color="dimmed">Sexe</Text>
          <Badge color={client.sexe === 'M' ? 'blue' : 'pink'} size="sm">
            {client.sexe === 'M' ? 'Homme' : 'Femme'}
          </Badge>
        </Group>
        
        <Group position="apart">
          <Text size="sm" color="dimmed">Comptes</Text>
          <Group spacing={5}>
            <CreditCard size={16} />
            <Text size="sm">{client.comptes?.length || 0}</Text>
          </Group>
        </Group>
      </Stack>
      
      <Group mt="md" position="apart">
        <Text size="sm" color="dimmed">Adresse</Text>
      </Group>
      <Text size="sm" color="dimmed">{client.adresse}</Text>
      
      <Group mt="xl" position="right">
        <ActionIcon
          component={Link}
          to={`/clients/${client.matricule}`}
          variant="filled"
          color="blue"
          size="lg"
          radius="md"
          aria-label="Voir détails"
        >
          <CreditCard size={20} />
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default ClientCard;