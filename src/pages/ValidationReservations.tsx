
import { useEffect, useState } from "react";
import axios from "axios";

interface Reservation {
  id: string;
  salleId: string;
  nomUtilisateur: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  nombrePersonnes: number;
  statut: "En attente" | "Acceptée" | "Refusée" | "Annulée";
}

interface Salle {
  id: string;
  nom: string;
}

const API_RESERVATIONS = "http://localhost:3001/reservations";
const API_SALLES = "http://localhost:3001/salles";

function ValidationReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerDonnees();
  }, []);

  async function chargerDonnees() {
    try {
      const [resReservations, resSalles] = await Promise.all([
        axios.get<Reservation[]>(API_RESERVATIONS),
        axios.get<Salle[]>(API_SALLES),
      ]);

      setReservations(resReservations.data);
      setSalles(resSalles.data);
      setErreur("");
    } catch {
      setErreur("Impossible de charger les réservations.");
    } finally {
      setChargement(false);
    }
  }

  async function changerStatut(
    reservation: Reservation,
    statut: "Acceptée" | "Refusée"
  ) {
    setErreur("");

    try {
      if (statut === "Acceptée") {
        const response = await axios.get<Reservation[]>(
          API_RESERVATIONS
        );

        const conflit = response.data.some((autre) => {
          if (
            autre.id === reservation.id ||
            autre.salleId !== reservation.salleId ||
            autre.date !== reservation.date ||
            autre.statut !== "Acceptée"
          ) {
            return false;
          }

          return (
            reservation.heureDebut < autre.heureFin &&
            reservation.heureFin > autre.heureDebut
          );
        });

        if (conflit) {
          setErreur(
            "Cette salle est déjà réservée sur ce créneau."
          );
          return;
        }
      }

      await axios.patch(
        `${API_RESERVATIONS}/${reservation.id}`,
        { statut }
      );

      await chargerDonnees();
    } catch {
      setErreur("Une erreur est survenue. Réessayez.");
    }
  }

  function obtenirNomSalle(salleId: string) {
    return (
      salles.find((salle) => salle.id === salleId)?.nom ??
      "Salle inconnue"
    );
  }

  const enAttente = reservations.filter(
    (r) => r.statut === "En attente"
  ).length;

  if (chargement) {
    return (
      <p className="p-5 text-sm text-gray-500">
        Chargement des réservations...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 text-sm">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Validation des réservations
          </h1>
          <p className="mt-1 text-gray-500">
            Consultez et traitez les demandes.
          </p>
        </div>

        <button
          onClick={chargerDonnees}
          className="rounded-md border border-gray-300 px-3 py-2 text-gray-700 transition hover:bg-gray-100"
        >
          Actualiser
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="min-w-32 rounded-md border border-gray-200 bg-white px-4 py-3">
          <p className="text-gray-500">Total</p>
          <p className="mt-1 text-xl font-semibold text-gray-800">
            {reservations.length}
          </p>
        </div>

        <div className="min-w-32 rounded-md border border-gray-200 bg-white px-4 py-3">
          <p className="text-gray-500">En attente</p>
          <p className="mt-1 text-xl font-semibold text-[#6F9992]">
            {enAttente}
          </p>
        </div>
      </div>

      {erreur && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700">
          {erreur}
        </p>
      )}

      <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
        <table className="w-full min-w-[650px] text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Utilisateur</th>
              <th className="px-4 py-3 font-medium">Salle</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Horaire</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {reservations.map((reservation) => (
              <tr
                key={reservation.id}
                className="transition hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-gray-800">
                  {reservation.nomUtilisateur}
                  <p className="mt-1 text-xs text-gray-500">
                    {reservation.nombrePersonnes} personne(s)
                  </p>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {obtenirNomSalle(reservation.salleId)}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {reservation.date}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {reservation.heureDebut} - {reservation.heureFin}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs ${
                      reservation.statut === "Acceptée"
                        ? "bg-green-50 text-green-700"
                        : reservation.statut === "Refusée"
                        ? "bg-red-50 text-red-700"
                        : reservation.statut === "Annulée"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {reservation.statut}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {reservation.statut === "En attente" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          changerStatut(reservation, "Acceptée")
                        }
                        className="rounded bg-[#83AEA7] px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#6F9992]"
                      >
                        Accepter
                      </button>

                      <button
                        onClick={() =>
                          changerStatut(reservation, "Refusée")
                        }
                        className="rounded border border-gray-300 px-2.5 py-1.5 text-xs text-gray-700 transition hover:bg-gray-100"
                      >
                        Refuser
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Traitée
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {reservations.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  Aucune réservation pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ValidationReservations;
