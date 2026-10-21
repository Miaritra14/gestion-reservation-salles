
import { useEffect, useState } from "react";
import axios from "axios";

interface Reservation {
  id: string | number;
  salleId: string | number;
  nomUtilisateur: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  nombrePersonnes: number;
  statut: "En attente" | "Acceptée" | "Refusée";
}

interface Salle {
  id: string | number;
  nom: string;
}

const API_RESERVATIONS = "http://localhost:3001/reservations";
const API_SALLES = "http://localhost:3001/salles";

function ValidationReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);

  async function chargerDonnees() {
    try {
      const [reponseReservations, reponseSalles] = await Promise.all([
        axios.get<Reservation[]>(API_RESERVATIONS),
        axios.get<Salle[]>(API_SALLES),
      ]);

      setReservations(reponseReservations.data);
      setSalles(reponseSalles.data);
      setErreur("");
    } catch {
      setErreur("Impossible de charger les réservations.");
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    chargerDonnees();
  }, []);

  async function changerStatut(
    reservation: Reservation,
    statut: "Acceptée" | "Refusée"
  ) {
    setErreur("");

    try {
      // Vérifier les conflits avant d'accepter une demande
      if (statut === "Acceptée") {
        const conflit = reservations.some((autre) => {
          return (
            String(autre.id) !== String(reservation.id) &&
            String(autre.salleId) === String(reservation.salleId) &&
            autre.date === reservation.date &&
            autre.statut === "Acceptée" &&
            reservation.heureDebut < autre.heureFin &&
            reservation.heureFin > autre.heureDebut
          );
        });

        if (conflit) {
          setErreur(
            "Impossible d'accepter : ce créneau est déjà confirmé pour cette salle."
          );
          return;
        }
      }

      // Vérifier les conflits avant d'accepter
      if (statut === "Acceptée") {
        const reponse = await axios.get<Reservation[]>(API_RESERVATIONS);

        const conflit = reponse.data.some((autre) => {
          // Ignorer la réservation que l'on est en train de modifier
          if (String(autre.id) === String(reservation.id)) {
            return false;
          }

          const memeSalle =
            String(autre.salleId) === String(reservation.salleId);

          const memeDate = autre.date === reservation.date;

          // Seules les réservations déjà acceptées bloquent le créneau
          const dejaAcceptee = autre.statut === "Acceptée";

          const horairesSeChevauchent =
            reservation.heureDebut < autre.heureFin &&
            reservation.heureFin > autre.heureDebut;

          return (
            memeSalle &&
            memeDate &&
            dejaAcceptee &&
            horairesSeChevauchent
          );
        });

        if (conflit) {
          alert(
            "Impossible d'accepter cette demande : une autre réservation est déjà acceptée sur ce créneau."
          );
          return;
        }
      }

      // Modifier le statut dans JSON Server
      await axios.patch(
        `${API_RESERVATIONS}/${reservation.id}`,
        { statut }
      );

      await chargerDonnees();
    } catch {
      setErreur("Erreur lors de la modification du statut.");
    }
  }

  if (chargement) {
    return <p>Chargement des réservations...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Validation des réservations</h2>

      {erreur && <p style={{ color: "red" }}>{erreur}</p>}

      {reservations.length === 0 ? (
        <p>Aucune réservation enregistrée.</p>
      ) : (
        reservations.map((reservation) => {
          const salle = salles.find(
            (s) => String(s.id) === String(reservation.salleId)
          );

          return (
            <div
              key={reservation.id}
              style={{
                backgroundColor: "white",
                padding: "15px",
                marginBottom: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <h3>{salle?.nom || `Salle ${reservation.salleId}`}</h3>

              <p>Utilisateur : {reservation.nomUtilisateur}</p>
              <p>Date : {reservation.date}</p>
              <p>
                Horaire : {reservation.heureDebut} - {reservation.heureFin}
              </p>
              <p>Nombre de personnes : {reservation.nombrePersonnes}</p>
              <p>
                Statut : <strong>{reservation.statut}</strong>
              </p>

              {reservation.statut === "En attente" && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() =>
                      changerStatut(reservation, "Acceptée")
                    }
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      padding: "8px 12px",
                    }}
                  >
                    Accepter
                  </button>

                  <button
                    onClick={() =>
                      changerStatut(reservation, "Refusée")
                    }
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      padding: "8px 12px",
                    }}
                  >
                    Refuser
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default ValidationReservations;
