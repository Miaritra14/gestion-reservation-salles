
import type { Reservation, Salle } from "../../types";
import CalendarDay from "./CalendarDay";

/** Affiche la grille du calendrier avec les jours, heures et réservations par salle */
interface CalendarGridProps {
  jours: Date[];
  reservations: Reservation[];
  salles: Salle[];
  heures: number[];
  hauteurHeure: number;
}

function CalendarGrid({
  jours,
  reservations,
  salles,
  heures,
  hauteurHeure,
}: CalendarGridProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <div className="min-w-[900px]">
        {/* Première ligne : les jours de la semaine */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "80px repeat(7, minmax(0, 1fr))",
          }}
        >
          <div className="h-16 border-b border-r bg-gray-50" />

          {jours.map((jour) => (
            <div
              key={jour.toISOString()}
              className="flex h-16 flex-col items-center justify-center border-b border-r"
            >
              <span className="text-sm text-gray-500">
                {jour.toLocaleDateString("fr-FR", {
                  weekday: "short",
                })}
              </span>

              <span className="text-lg font-semibold text-gray-800">
                {jour.getDate()}
              </span>
            </div>
          ))}
        </div>

        {/* Deuxième partie : heures à gauche, réservations à droite */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "80px repeat(7, minmax(0, 1fr))",
          }}
        >
          {/* Colonne des heures */}
          <div className="border-r bg-gray-50">
            {heures.map((heure) => (
              <div
                key={heure}
                className="relative border-b border-gray-200"
                style={{ height: `${hauteurHeure}px` }}
              >
                <span className="absolute right-2 top-0 -translate-y-1/2 text-xs text-gray-500">
                  {String(heure).padStart(2, "0")}:00
                </span>
              </div>
            ))}

            <div className="relative h-0">
              <span className="absolute right-2 top-0 -translate-y-1/2 text-xs text-gray-500">
                18:00
              </span>
            </div>
          </div>

          {/* Une colonne par jour */}
          {jours.map((jour) => (
            <CalendarDay
              key={jour.toISOString()}
              jour={jour}
              reservations={reservations}
              salles={salles}
              heures={heures}
              hauteurHeure={hauteurHeure}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarGrid;
