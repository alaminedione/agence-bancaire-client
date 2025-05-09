import React from 'react';
import { Card, Text, Group, Badge, ActionIcon, Stack, Box } from '@mantine/core';
import { Edit, Trash, CreditCard, User, Phone, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Client } from '../../types';

interface ClientCardProps {
  client: Client;
  onDelete: (matricule: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      component={Link} // Make the entire card a link
      to={`/clients/${client.matricule}`}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link} // Make the entire card a link
      to={`/clients/${client.matricule}`}
      style={{ cursor: 'pointer' }} // Add cursor style to indicate clickability
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Group>
            <User size={20} />
            <Text fw={500}>{client.prenom} {client.nom}</Text>
          </Group>
          <Group spacing={8}>
            {/* Edit button - keep as ActionIcon */}
            <ActionIcon
              component={Link}
              to={`/clients/${client.matricule}/edit`}
              variant="light"
              color="blue"
              size="sm"
              aria-label="Modifier"
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking icon
            >
              <Edit size={16} />
            </ActionIcon>
            {/* Delete button - keep as ActionIcon */}
            <ActionIcon
              variant="light"
              color="red"
              size="sm"
              aria-label="Supprimer"
              onClick={(e) => { // Prevent card click when clicking icon
                e.stopPropagation();
                onDelete(client.matricule);
              }}
            >
              <Trash size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Card.Section>

      <Stack mt="md" spacing="xs">
        <Group justify="space-between">
          <Group spacing={5}>
            <Text size="sm" c="dimmed">Matricule:</Text>
            <Text size="sm" weight={500}>{client.matricule}</Text>
          </Group>
          <Badge color={client.sexe === 'M' ? 'blue' : 'pink'} size="sm">
            {client.sexe === 'M' ? 'Homme' : 'Femme'}
          </Badge>
        </Group>

        <Group justify="space-between">
          <Group spacing={5}>
            <Phone size={16} color="gray" />
            <Text size="sm" c="dimmed">Téléphone:</Text>
          </Group>
          <Text size="sm">{client.numero_telephone}</Text>
        </Group>

        <Group justify="space-between">
          <Group spacing={5}>
            <Calendar size={16} color="gray" />
            <Text size="sm" c="dimmed">Âge:</Text>
          </Group>
          <Text size="sm">{client.age} ans</Text>
        </Group>

        <Group justify="space-between">
          <Group spacing={5}>
            <CreditCard size={16} color="gray" />
            <Text size="sm" c="dimmed">Comptes:</Text>
          </Group>
          <Text size="sm">{client.comptes?.length || 0}</Text>
        </Group>

        <Group align="flex-start" spacing={5}>
          <MapPin size={16} color="gray" />
          <Text size="sm" c="dimmed">Adresse:</Text>
          <Text size="sm" style={{ flex: 1 }}>{client.adresse}</Text>
        </Group>
      </Stack>

      {/* Removed the separate "Voir détails" ActionIcon as the whole card is now a link */}
    </Card>
  );
};

export default ClientCard;
