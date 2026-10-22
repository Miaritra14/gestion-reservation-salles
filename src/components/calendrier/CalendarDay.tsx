
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
  // Transformer la date en format YYYY-MM-DD.
  const dateISO = [
    jour.getFullYear(),
    String(jour.getMonth() + 1).padStart(2, "0"),
    String(jour.getDate()).padStart(2, "0"),
  ].join("-");

  // Garder uniquement les réservations de cette journée.
  const reservationsDuJour = reservations.filter(
    (reservation) => reservation.date === dateISO
  );

  return (
    <div className="min-w-0 border-r border-gray-200">
      {/* Zone des heures et des réservations */}
      <div
        className="relative"
        style={{ height: `${heures.length * hauteurHeure}px` }}
      >
        {/* Afficher les lignes horaires */}
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

        {/* Afficher les réservations à leur bon horaire */}
        {reservationsDuJour.map((reservation) => {
          const [heureDebut, minuteDebut] =
            reservation.heureDebut.split(":").map(Number);

          const [heureFin, minuteFin] =
            reservation.heureFin.split(":").map(Number);

          const debut = heureDebut * 60 + minuteDebut;
          const fin = heureFin * 60 + minuteFin;

          const debutJournee = heures[0] * 60;
          const finJournee =
            (heures[heures.length - 1] + 1) * 60;

          // Ignorer les réservations hors de la plage affichée.
          if (
            debut >= finJournee ||
            fin <= debutJournee ||
            fin <= debut
          ) {
            return null;
          }

          // Calculer la position verticale et la hauteur du bloc.
          const positionHaut =
            ((Math.max(debut, debutJournee) - debutJournee) /
              60) *
            hauteurHeure;

          const hauteur =
            ((Math.min(fin, finJournee) -
              Math.max(debut, debutJournee)) /
              60) *
            hauteurHeure;

          // Trouver le nom de la salle.
          const salle = salles.find(
            (item) =>
              String(item.id) === String(reservation.salleId)
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
