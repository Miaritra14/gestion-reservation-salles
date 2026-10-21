
import { useState, useEffect } from "react";
import axios from "axios";
// bibliothèque affiche un calendrier
import Calendar from "react-calendar";
// style du calendrier ou mettre en forme
import "react-calendar/dist/Calendar.css";

// Informations d'une salle
interface Salle {
  id: string | number;
  nom: string;
}

// Informations d'une réservation
interface Reservation {
  id: string | number;
  salleId: string | number;
  nomUtilisateur: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  statut: "En attente" | "Acceptée" | "Refusée" | "Annulée";
}

const API_RESERVATIONS = "http://localhost:3001/reservations";
const API_SALLES = "http://localhost:3001/salles";

function CalendrierAdmin() {
  // Date sélectionnée dans le calendrier
  const [date, setDate] = useState(new Date());

  // Listes des données
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);

  //  Gérer les messages d'erreurs
  const [erreur, setErreur] = useState("");

  // Charger les réservations et les salles
  useEffect(() => {
    // fonction récupère les reservations et les salles
    async function chargerDonnees() {
      try {
        // contient reponse requete reservation et tableau salle
        const [repReservations, repSalles] = await Promise.all([
          axios.get<Reservation[]>(API_RESERVATIONS),
          axios.get<Salle[]>(API_SALLES),
        ]);

        setReservations(repReservations.data);
        setSalles(repSalles.data);
      } catch {
        setErreur("Impossible de charger les données.");
      }
    }

    chargerDonnees();
  }, []);

  // Transformer la date choisie au format AAAA-MM-JJ
  const dateChoisie = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

  // Garder les réservations de la date choisie
  // et ignorer celles qui sont refusées ou annulées
  const reservationsDuJour = reservations.filter(
    (reservation) =>
      reservation.date === dateChoisie &&
      reservation.statut !== "Refusée" &&
      reservation.statut !== "Annulée"
  );

 
return (
  <div className="min-h-screen bg-slate-100 p-6">
    <div className="mx-auto max-w-4xl">

      {/* Titre */}
      <h1 className="mb-2 text-3xl font-bold text-slate-800">
        Calendrier des réservations
      </h1>

      <p className="mb-6 text-slate-500">
        Consultez les réservations selon la date choisie.
      </p>

      {/* Message d'erreur */}
      {erreur && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
          {erreur}
        </p>
      )}

      {/* Calendrier */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-700">
          Choisir une date
        </h2>

        <div className="flex justify-center">
          <Calendar
            value={date}
            onChange={(value) => {
              if (value instanceof Date) {
                setDate(value);
              }
            }}
          />
        </div>
      </div>

      {/* Réservations du jour */}
      <h2 className="mb-4 text-2xl font-bold text-slate-800">
        Réservations du {dateChoisie}
      </h2>

      {reservationsDuJour.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-slate-500">
            Aucune réservation pour cette date.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservationsDuJour.map((reservation) => {
            // Retrouver le nom de la salle avec son ID
            const salle = salles.find(
              (s) => String(s.id) === String(reservation.salleId)
            );

            return (
              <div
                key={reservation.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <h3 className="mb-3 text-lg font-semibold text-slate-800">
                  {salle?.nom || `Salle ${reservation.salleId}`}
                </h3>

                <p className="mb-2 text-slate-600">
                  <strong>Utilisateur :</strong>{" "}
                  {reservation.nomUtilisateur}
                </p>

                <p className="mb-2 text-slate-600">
                  <strong>Horaire :</strong>{" "}
                  {reservation.heureDebut} - {reservation.heureFin}
                </p>

                <p className="text-slate-700">
                  <strong>Statut :</strong>{" "}
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                      reservation.statut === "Acceptée"
                        ? "bg-green-100 text-green-700"
                        : reservation.statut === "Refusée"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {reservation.statut}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);


}

export default CalendrierAdmin;
