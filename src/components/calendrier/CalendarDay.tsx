
import type { Reservation, Salle } from "../../types";
import CalendarEvent from "./CalendarEvent";

interface CalendarDayProps {
  jour: Date;
  reservations: Reservation[];
  salles: Salle[];
  heures: number[];
  hauteurHeure: number;
}

function CalendarDay({
  jour,
  reservations,
  salles,
  heures,
  hauteurHeure,
}: CalendarDayProps) {
  // Transforme la date en format YYYY-MM-DD.
  const dateISO = [
    jour.getFullYear(),
    String(jour.getMonth() + 1).padStart(2, "0"),
    String(jour.getDate()).padStart(2, "0"),
  ].join("-");

  // Garde uniquement les réservations de cette journée.
  const reservationsDuJour = reservations.filter(
    (reservation) => reservation.date === dateISO
  );

  return (
    <div className="min-w-0 border-r border-gray-200">
      {/* Nom et numéro du jour */}
      <div className="sticky top-0 z-20 h-16 border-b bg-white p-2 text-center">
        <p className="text-xs text-gray-500">
          {jour.toLocaleDateString("fr-FR", { weekday: "short" })}
        </p>

        <p className="font-semibold text-gray-800">
          {jour.getDate()}
        </p>
      </div>

      {/* Zone qui contient les heures et les réservations */}
      <div
        className="relative"
        style={{ height: `${heures.length * hauteurHeure}px` }}
      >
        {/* Lignes horaires */}
        {heures.map((heure) => (
          <div
            key={heure}
            className="absolute left-0 right-0 border-b border-gray-100"
            style={{
              top: `${(heure - heures[0]) * hauteurHeure}px`,
              height: `${hauteurHeure}px`,
            }}
          />
        ))}

        {/* Blocs des réservations */}
        {reservationsDuJour.map((reservation) => {
          const debut =
            Number(reservation.heureDebut.split(":")[0]) * 60 +
            Number(reservation.heureDebut.split(":")[1]);

          const fin =
            Number(reservation.heureFin.split(":")[0]) * 60 +
            Number(reservation.heureFin.split(":")[1]);

          const debutJournee = heures[0] * 60;
          const finJournee = (heures[heures.length - 1] + 1) * 60;

          // Ignore les réservations hors de la plage affichée.
          if (debut >= finJournee || fin <= debutJournee || fin <= debut) {
            return null;
          }

          // Calcule la position et la hauteur du bloc.
          const positionHaut =
            (Math.max(debut, debutJournee) - debutJournee) / 60 *
            hauteurHeure;

          const hauteur =
            (Math.min(fin, finJournee) - Math.max(debut, debutJournee)) /
            60 *
            hauteurHeure;

          const salle = salles.find(
            (item) => String(item.id) === String(reservation.salleId)
          );

          return (
            <CalendarEvent
              key={reservation.id}
              reservation={reservation}
              nomSalle={salle?.nom ?? "Salle inconnue"}
              positionHaut={positionHaut}
              hauteur={Math.max(hauteur, 22)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CalendarDay;
