export interface Salle {
  id: number;
  nom: string;
  capacite: number;
  equipements: string[];
  description?: string;
}

export interface Reservation {
  id: number;
  salleId: number;
  nomUtilisateur: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  motif?: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  nom: string;
  role: string;
}