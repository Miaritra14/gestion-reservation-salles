import axios from "axios";
import { Salle, Reservation, User } from "../types";

const API = axios.create({
  baseURL: "http://localhost:3001",
});

// Récupérer toutes les salles
export const getSalles = async (): Promise<Salle[]> => {
  const res = await API.get("/salles");
  return res.data;
};

// Créer une salle
export const createSalle = async (salle: Omit<Salle, "id">): Promise<Salle> => {
  const res = await API.post("/salles", salle);
  return res.data;
};

// Récupérer toutes les réservations
export const getReservations = async (): Promise<Reservation[]> => {
  const res = await API.get("/reservations");
  return res.data;
};

// Créer une réservation
export const createReservation = async (
  reservation: Omit<Reservation, "id">
): Promise<Reservation> => {
  const res = await API.post("/reservations", reservation);
  return res.data;
};
// ===== UTILISATEURS (CONNEXION) =====
export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    // On récupère tous les utilisateurs
    const res = await API.get("/users");
    const users: User[] = res.data;

    // On cherche l'utilisateur qui correspond
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    return user || null;
  } catch (error) {
    console.error("Erreur de connexion :", error);
    return null;
  }
};
// Vérifier si une salle est disponible
export const isSalleDisponible = (
  salleId: number,
  date: string,
  heureDebut: string,
  heureFin: string,
  reservations: Reservation[]
): boolean => {
  return !reservations.some((r) => {
    if (r.salleId !== salleId || r.date !== date) return false;

    return (
      (heureDebut >= r.heureDebut && heureDebut < r.heureFin) ||
      (heureFin > r.heureDebut && heureFin <= r.heureFin) ||
      (heureDebut <= r.heureDebut && heureFin >= r.heureFin)
    );
  });
};

export const deleteReservation = async (id: number | string): Promise<void> => {
  await API.delete(`/reservations/${id}`);
};
