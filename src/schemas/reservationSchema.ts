
import { z } from "zod";

// Définir les règles de validation du formulaire
export const reservationSchema = z
  .object({
    // Une salle et une date sont obligatoires
    salleId: z.string().min(1, "Choisissez une salle"),
    date: z.string().min(1, "Choisissez une date"),

    // Les heures doivent être renseignées
    heureDebut: z.string().min(1, "Indiquez l'heure de début"),
    heureFin: z.string().min(1, "Indiquez l'heure de fin"),

    // Le nombre de personnes doit être un entier positif
    nombrePersonnes: z
      .number()
      .int("Le nombre de personnes doit être un entier")
      .min(1, "Il faut au moins une personne"),
  })
  // Vérifier que l'heure de fin est après l'heure de début
  .refine(
    (reservation) => reservation.heureFin > reservation.heureDebut,
    {
      message: "L'heure de fin doit être après l'heure de début",
      path: ["heureFin"],
    }
  );
