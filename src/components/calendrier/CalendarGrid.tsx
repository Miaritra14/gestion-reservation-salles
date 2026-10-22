
import type { Reservation, Salle } from "../../types";
import CalendarDay from "./CalendarDay";

// Informations nécessaires pour afficher le calendrier
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
  // Date d'aujourd'hui
  const aujourdhui = new Date().toDateString();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        {/* Largeur minimale du calendrier */}
        <div className="min-w-[700px]">
          {/* En-tête des jours */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `64px repeat(${jours.length}, minmax(0, 1fr))`,
            }}
          >
            {/* Case vide au-dessus des heures */}
            <div className="h-12 border-b border-r border-gray-200 bg-[#CCCCFF]" />

            {jours.map((jour) => {
              // Vérifier si le jour correspond à aujourd'hui
              const estAujourdhui =
                jour.toDateString() === aujourdhui;

              return (
                <div
                  key={jour.toDateString()}
                  className="flex h-12 flex-col items-center justify-center border-b border-r border-gray-200 bg-[#CCCCFF] px-1 last:border-r-0"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#527D75]">
                    {jour.toLocaleDateString("fr-FR", {
                      weekday: "short",
                    })}
                  </span>

                  <span
                    className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                      estAujourdhui
                        ? "bg-[#83AEA7] font-bold text-white"
                        : "font-semibold text-gray-800"
                    }`}
                  >
                    {jour.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Corps du calendrier */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `64px repeat(${jours.length}, minmax(0, 1fr))`,
            }}
          >
            {/* Heures à gauche */}
            <div className="border-r border-gray-200 bg-gray-50">
              {heures.map((heure) => (
                <div
                  key={heure}
                  className="relative border-b border-gray-200/80"
                  style={{ height: `${hauteurHeure}px` }}
                >
                  <span className="absolute right-1 top-0 -translate-y-1/2 bg-gray-50 px-0.5 text-[10px] text-gray-500 sm:right-2 sm:text-xs">
                    {String(heure).padStart(2, "0")}:00
                  </span>
                </div>
              ))}

              {/* Dernière heure */}
              <div className="relative h-0">
                <span className="absolute right-1 top-0 -translate-y-1/2 bg-gray-50 px-0.5 text-[10px] text-gray-500 sm:right-2 sm:text-xs">
                  {String(heures[heures.length - 1] + 1).padStart(2, "0")}:00
                </span>
              </div>
            </div>

            {/* Une colonne pour chaque jour */}
            {jours.map((jour) => (
              <CalendarDay
                key={jour.toDateString()}
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
    </div>
  );
}

export default CalendarGrid;
