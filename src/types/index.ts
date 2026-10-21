export interface Salle {
  id: number | string;
  nom: string;
  capacite: number;
  emplacement: string;
  equipements: string | string[];
  description?: string;
}


// Status possibles d'une réservation
export type StatutReservation = 
  | "En attente"
  | "Acceptée"
  | "Refusée"
  | "Annulée";

export interface Reservation {
  id: string | number;
  salleId: string | number;
  nomUtilisateur: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  nombresPersonnes: number;
  statut: StatutReservation;
}

export interface User {
  id: number;
  email: string;
  password: string;
  nom: string;
  role: string;
}