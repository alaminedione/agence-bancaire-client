import { z } from 'zod';

export const clientSchema = z.object({
  matricule: z.string().min(3, "Le matricule doit contenir au moins 3 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  numero_telephone: z.string().min(8, "Le numéro de téléphone doit être valide"),
  sexe: z.enum(["M", "F"], {
    errorMap: () => ({ message: "Le sexe doit être 'M' ou 'F'" }),
  }),
  age: z.number().min(18, "L'âge doit être d'au moins 18 ans"),
  adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
});

const baseAccountSchema = z.object({
  numero_compte: z.string().min(5, "Le numéro de compte doit contenir au moins 5 caractères"),
  libelle: z.string().min(3, "Le libellé doit contenir au moins 3 caractères"),
  solde: z.number().min(0, "Le solde initial doit être positif ou nul"),
});

export const checkingAccountSchema = baseAccountSchema.extend({
  decouvertAutorise: z.number().min(0, "Le découvert autorisé doit être positif ou nul"),
});

export const savingsAccountSchema = baseAccountSchema.extend({
  tauxInteret: z.number().min(0, "Le taux d'intérêt doit être positif ou nul"),
});

export const transactionSchema = z.object({
  montant: z.number()
    .positive("Le montant doit être positif")
    .min(1, "Le montant minimum est de 1"),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = loginSchema;
