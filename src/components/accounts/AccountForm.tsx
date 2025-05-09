import React, { useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { 
  TextInput, 
  NumberInput, 
  Button, 
  Group, 
  Box, 
  Stack,
  Title,
  SegmentedControl,
  Text
} from '@mantine/core';
import { checkingAccountSchema, savingsAccountSchema } from '../../schemas/validation';
import { CheckingAccount, SavingsAccount } from '../../types';

interface AccountFormProps {
  clientMatricule: string;
  onSubmitChecking: (values: Omit<CheckingAccount, 'date_creation' | 'client' | 'transactions'>) => void;
  onSubmitSavings: (values: Omit<SavingsAccount, 'date_creation' | 'client' | 'transactions'>) => void;
  isLoading: boolean;
}

const defaultCheckingValues = {
  numero_compte: '',
  libelle: '',
  solde: 0,
  decouvertAutorise: 0
};

const defaultSavingsValues = {
  numero_compte: '',
  libelle: '',
  solde: 0,
  tauxInteret: 0
};

const AccountForm: React.FC<AccountFormProps> = ({ 
  clientMatricule,
  onSubmitChecking,
  onSubmitSavings,
  isLoading
}) => {
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');
  
  const checkingForm = useForm({
    initialValues: defaultCheckingValues,
    validate: zodResolver(checkingAccountSchema),
  });
  
  const savingsForm = useForm({
    initialValues: defaultSavingsValues,
    validate: zodResolver(savingsAccountSchema),
  });
  
  const handleSubmit = () => {
    if (accountType === 'checking') {
      onSubmitChecking(checkingForm.values);
    } else {
      onSubmitSavings(savingsForm.values);
    }
  };
  
  return (
    <Box>
      <Title order={3} mb="md">Nouveau compte</Title>
      <Text mb="lg">Client ID: {clientMatricule}</Text>
      
      <SegmentedControl
        value={accountType}
        onChange={(value) => setAccountType(value as 'checking' | 'savings')}
        data={[
          { label: 'Compte Courant', value: 'checking' },
          { label: 'Compte Épargne', value: 'savings' },
        ]}
        mb="lg"
        fullWidth
      />
      
      {accountType === 'checking' ? (
        <form onSubmit={checkingForm.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="Numéro de compte"
              placeholder="Ex: CC123456789"
              required
              {...checkingForm.getInputProps('numero_compte')}
            />

            <TextInput
              label="Libellé"
              placeholder="Ex: Compte Courant Principal"
              required
              {...checkingForm.getInputProps('libelle')}
            />
            
            <NumberInput
              label="Solde initial"
              placeholder="0"
              required
              min={0}
              precision={2}
              {...checkingForm.getInputProps('solde')}
            />
            
            <NumberInput
              label="Découvert autorisé"
              placeholder="0"
              required
              min={0}
              precision={2}
              {...checkingForm.getInputProps('decouvertAutorise')}
            />
            
            <Group position="right" mt="md">
              <Button type="submit" loading={isLoading}>
                Créer le compte courant
              </Button>
            </Group>
          </Stack>
        </form>
      ) : (
        <form onSubmit={savingsForm.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="Numéro de compte"
              placeholder="Ex: CE987654321"
              required
              {...savingsForm.getInputProps('numero_compte')}
            />

            <TextInput
              label="Libellé"
              placeholder="Ex: Compte Épargne Projets"
              required
              {...savingsForm.getInputProps('libelle')}
            />
            
            <NumberInput
              label="Solde initial"
              placeholder="0"
              required
              min={0}
              precision={2}
              {...savingsForm.getInputProps('solde')}
            />
            
            <NumberInput
              label="Taux d'intérêt"
              placeholder="0.02"
              description="Entrez le taux en décimal (ex: 0.02 pour 2%)"
              required
              min={0}
              max={1}
              step={0.001}
              precision={3}
              {...savingsForm.getInputProps('tauxInteret')}
            />
            
            <Group position="right" mt="md">
              <Button type="submit" loading={isLoading}>
                Créer le compte épargne
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Box>
  );
};

export default AccountForm;
