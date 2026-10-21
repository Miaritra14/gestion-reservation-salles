
import type { Salle, Reservation } from "../../types";

interface ReservationCardProps {
  reservation: Reservation;
  salles: Salle[];
}

function ReservationCard({
  reservation,
  salles,
}: ReservationCardProps) {
  // Retrouver la salle correspondant à la réservation
  const salle = salles.find(
    (element) => String(element.id) === String(reservation.salleId)
  );

  // Définir une couleur selon le statut de la réservation
  const couleursStatut: Record<string, string> = {
    "En attente": "bg-yellow-50 text-yellow-700 border-yellow-200",
    Acceptée: "bg-[#E8F0EE] text-[#527D75] border-[#D2E3DF]",
    Refusée: "bg-red-50 text-red-700 border-red-200",
    Annulée: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const couleur =
    couleursStatut[reservation.statut] ??
    "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-3">
      {/* Nom de la salle et statut */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-800">
          {salle?.nom ?? "Salle inconnue"}
        </h3>

        <span
          className={`rounded border px-2 py-1 text-xs font-medium ${couleur}`}
        >
          {reservation.statut}
        </span>
      </div>

      {/* Informations de la réservation */}
      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <strong className="font-medium text-gray-700">Date :</strong>{" "}
          {reservation.date}
        </p>

        <p>
          <strong className="font-medium text-gray-700">Horaire :</strong>{" "}
          {reservation.heureDebut} - {reservation.heureFin}
        </p>

        <p>
          <strong className="font-medium text-gray-700">
            Nombre de personnes :
          </strong>{" "}
          {reservation.nombresPersonnes ?? "Non précisé"}
        </p>

        <p>
          <strong className="font-medium text-gray-700">Demandeur :</strong>{" "}
          {reservation.nomUtilisateur}
        </p>
      </div>
    </article>
  );
}

export default ReservationCard;
