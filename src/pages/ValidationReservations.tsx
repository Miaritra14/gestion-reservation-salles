
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
  const [traitementId, setTraitementId] = useState<string | null>(null);

  // Charger les réservations et les salles
  async function chargerDonnees() {
    try {
      const [resReservations, resSalles] = await Promise.all([
        axios.get<Reservation[]>(API_RESERVATIONS),
        axios.get<Salle[]>(API_SALLES),
      ]);

      setReservations(resReservations.data);
      setSalles(resSalles.data);
      setErreur("");
    } catch (error) {
      console.error("Erreur de chargement :", error);
      setErreur("Impossible de charger les données. Vérifiez le serveur.");
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    void chargerDonnees();
  }, []);

  // Accepter ou refuser une réservation
  async function changerStatut(
    reservation: Reservation,
    statut: "Acceptée" | "Refusée"
  ) {
    setErreur("");
    setTraitementId(reservation.id);

    try {
      // Vérifier les conflits avant d'accepter
      if (statut === "Acceptée") {
        const response = await axios.get<Reservation[]>(
          API_RESERVATIONS
        );

        const conflit = response.data.some((autre) => {
          if (
            String(autre.id) === String(reservation.id) ||
            String(autre.salleId) !== String(reservation.salleId) ||
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
            "Cette salle possède déjà une réservation acceptée sur ce créneau."
          );
          return;
        }
      }

      await axios.patch(
        `${API_RESERVATIONS}/${reservation.id}`,
        { statut }
      );

      await chargerDonnees();
    } catch (error) {
      console.error("Erreur de modification :", error);
      setErreur("Impossible de modifier le statut. Réessayez.");
    } finally {
      setTraitementId(null);
    }
  }

async function supprimerReservation(reservation: Reservation) {
  // Demander confirmation avant de supprimer
  const confirmation = window.confirm(
    `Voulez-vous vraiment supprimer la réservation de ${reservation.nomUtilisateur} ?`
  );

  if (!confirmation) return;

  setErreur("");
  setTraitementId(reservation.id);

  try {
    await axios.delete(
      `${API_RESERVATIONS}/${reservation.id}`
    );

    // Actualiser la liste après la suppression
    await chargerDonnees();
  } catch (error) {
    console.error("Erreur de suppression :", error);
    setErreur("Impossible de supprimer la réservation.");
  } finally {
    setTraitementId(null);
  }
}


  // Retrouver le nom de la salle
  function obtenirNomSalle(salleId: string) {
    return (
      salles.find((salle) => String(salle.id) === String(salleId))
        ?.nom ?? "Salle inconnue"
    );
  }

  // Compter les réservations par statut
  const enAttente = reservations.filter(
    (r) => r.statut === "En attente"
  ).length;

  const acceptees = reservations.filter(
    (r) => r.statut === "Acceptée"
  ).length;

  const refusees = reservations.filter(
    (r) => r.statut === "Refusée"
  ).length;

  // Couleur du badge selon le statut
  function obtenirCouleurStatut(statut: Reservation["statut"]) {
    switch (statut) {
      case "Acceptée":
        return "bg-[#E8F0EE] text-[#426D64]";
      case "Refusée":
        return "bg-red-50 text-red-700";
      case "Annulée":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-[#F1EFFF] text-[#6855A5]";
    }
  }

  if (chargement) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-gray-500">
          Chargement des réservations...
        </p>
      </div>
    );
  }



return (
  <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">

    {/* Titre */}
    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
      <div>
        <p className="text-xs font-semibold uppercase text-[#6F9992]">
          Administration
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-800">
          Validation des réservations
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Gérez les demandes de réservation des salles.
        </p>
      </div>

      <button
        type="button"
        onClick={() => void chargerDonnees()}
        className="rounded-lg border px-4 py-2 text-sm shadow-sm transition hover:bg-gray-50 hover:shadow-md"
      >
        Actualiser
      </button>
    </div>

    {/* Statistiques */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
        <p className="text-sm text-gray-500">Total</p>
        <p className="mt-2 text-3xl font-bold text-gray-800">
          {reservations.length}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
        <p className="text-sm text-gray-500">En attente</p>
        <p className="mt-2 text-3xl font-bold text-[#6855A5]">
          {enAttente}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
        <p className="text-sm text-gray-500">Acceptées</p>
        <p className="mt-2 text-3xl font-bold text-[#6F9992]">
          {acceptees}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
        <p className="text-sm text-gray-500">Refusées</p>
        <p className="mt-2 text-3xl font-bold text-red-600">
          {refusees}
        </p>
      </div>

    </div>

    {/* Message d'erreur */}
    {erreur && (
      <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {erreur}
      </p>
    )}

    {/* Tableau des réservations */}
    <div className="overflow-hidden rounded-xl border bg-white shadow-md">

      <div className="border-b p-5">
        <h2 className="font-semibold text-gray-800">
          Liste des réservations
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {reservations.length} réservation(s)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">

          <thead className="bg-[#CCCCFF] text-[#45415F]">
            <tr>
              <th className="px-4 py-3">Utilisateur</th>
              <th className="px-4 py-3">Salle</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Horaire</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {reservations.map((reservation) => {
              const enCours = traitementId === reservation.id;

              return (
                <tr
                  key={reservation.id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800">
                      {reservation.nomUtilisateur}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {reservation.nombrePersonnes} personne(s)
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    {obtenirNomSalle(reservation.salleId)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    {reservation.date}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    {reservation.heureDebut} – {reservation.heureFin}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        reservation.statut === "Acceptée"
                          ? "bg-[#E8F0EE] text-[#426D64]"
                          : reservation.statut === "Refusée"
                          ? "bg-red-50 text-red-700"
                          : reservation.statut === "Annulée"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-[#F1EFFF] text-[#6855A5]"
                      }`}
                    >
                      {reservation.statut}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">

                      {/* Boutons de validation */}
                      {reservation.statut === "En attente" && (
                        <>
                          <button
                            type="button"
                            disabled={traitementId !== null}
                            onClick={() =>
                              void changerStatut(reservation, "Acceptée")
                            }
                            className="rounded-md bg-[#83AEA7] px-3 py-2 text-xs text-white shadow-sm transition hover:bg-[#6F9992] hover:shadow-md disabled:opacity-50"
                          >
                            {enCours ? "En cours..." : "Accepter"}
                          </button>

                          <button
                            type="button"
                            disabled={traitementId !== null}
                            onClick={() =>
                              void changerStatut(reservation, "Refusée")
                            }
                            className="rounded-md border px-3 py-2 text-xs shadow-sm transition hover:bg-gray-100 hover:shadow-md disabled:opacity-50"
                          >
                            Refuser
                          </button>
                        </>
                      )}

                      {/* Bouton de suppression */}
                      <button
                        type="button"
                        disabled={traitementId !== null}
                        onClick={() =>
                          void supprimerReservation(reservation)
                        }
                        className="rounded-md border border-red-200 px-3 py-2 text-xs text-red-600 shadow-sm transition hover:bg-red-50 hover:shadow-md disabled:opacity-50"
                      >
                        {enCours ? "En cours..." : "Supprimer"}
                      </button>

                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Message si aucune réservation */}
            {reservations.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-gray-500"
                >
                  Aucune réservation pour le moment.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>

  </div>
);
}

export default ValidationReservations;
