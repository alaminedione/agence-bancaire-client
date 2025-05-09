import React from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { 
  TextInput, 
  NumberInput, 
  Radio, 
  Button, 
  Group, 
  Box, 
  Textarea,
  Stack,
  Title
} from '@mantine/core';
import { clientSchema } from '../../schemas/validation';
import { Client } from '../../types';

interface ClientFormProps {
  initialValues?: Partial<Client>;
  onSubmit: (values: Omit<Client, 'comptes'>) => void;
  isLoading: boolean;
}

const defaultValues = {
  matricule: '',
  nom: '',
  prenom: '',
  numero_telephone: '',
  sexe: 'M',
  age: 18,
  adresse: ''
};

const ClientForm: React.FC<ClientFormProps> = ({ 
  initialValues, 
  onSubmit, 
  isLoading 
}) => {
  const form = useForm({
    initialValues: { ...defaultValues, ...initialValues },
    validate: zodResolver(clientSchema),
  });
  
  return (
    <Box>
      <Title order={3} mb="md">
        {initialValues?.matricule ? 'Modifier le client' : 'Nouveau client'}
      </Title>
      
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="md">
          <TextInput
            label="Matricule"
            placeholder="Entrez le matricule du client"
            required
            {...form.getInputProps('matricule')}
            disabled={!!initialValues?.matricule}
          />
          
          <Group grow>
            <TextInput
              label="Nom"
              placeholder="Nom"
              required
              {...form.getInputProps('nom')}
            />
            
            <TextInput
              label="Prénom"
              placeholder="Prénom"
              required
              {...form.getInputProps('prenom')}
            />
          </Group>
          
          <Group grow>
            <TextInput
              label="Numéro de téléphone"
              placeholder="+33 6 XX XX XX XX"
              required
              {...form.getInputProps('numero_telephone')}
            />
            
            <NumberInput
              label="Âge"
              placeholder="Âge"
              min={18}
              max={120}
              required
              {...form.getInputProps('age')}
            />
          </Group>
          
          <Radio.Group
            name="sexe"
            label="Sexe"
            required
            {...form.getInputProps('sexe')}
          >
            <Group mt="xs">
              <Radio value="M" label="Homme" />
              <Radio value="F" label="Femme" />
            </Group>
          </Radio.Group>
          
          <Textarea
            label="Adresse"
            placeholder="Adresse complète"
            required
            minRows={3}
            {...form.getInputProps('adresse')}
          />
          
          <Group position="right" mt="md">
            <Button type="submit" loading={isLoading}>
              {initialValues?.matricule ? 'Enregistrer' : 'Créer'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default ClientForm;