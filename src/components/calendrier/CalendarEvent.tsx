
import type { Reservation } from "../../types";

interface CalendarEventProps {
  reservation: Reservation;
  nomSalle: string;
  positionHaut: number;
  hauteur: number;
}

function CalendarEvent({
  reservation,
  nomSalle,
  positionHaut,
  hauteur,
}: CalendarEventProps) {
  // La couleur dépend du statut de la réservation.
  const couleur =
    reservation.statut === "Acceptée"
      ? "border-green-500 bg-green-100 text-green-800"
      : "border-amber-500 bg-amber-100 text-amber-800";

  return (
    <div
      title={`${nomSalle} : ${reservation.heureDebut} - ${reservation.heureFin}`}
      className={`absolute left-1 right-1 z-10 overflow-hidden rounded-md border-l-4 p-1 text-xs ${couleur}`}
      style={{
        top: `${positionHaut}px`,
        height: `${hauteur}px`,
      }}
    >
      <p className="truncate font-semibold">{nomSalle}</p>

      <p>
        {reservation.heureDebut} - {reservation.heureFin}
      </p>

      <p className="truncate">{reservation.nomUtilisateur}</p>
    </div>
  );
}

export default CalendarEvent;
