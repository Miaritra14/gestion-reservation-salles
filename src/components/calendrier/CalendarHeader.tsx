
interface CalendarHeaderProps {
  titreSemaine: string;
  onPrecedent: () => void;
  onSuivant: () => void;
  onAujourdhui: () => void;
}

function CalendarHeader({
  titreSemaine,
  onPrecedent,
  onSuivant,
  onAujourdhui,
}: CalendarHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Calendrier des réservations
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {titreSemaine}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrecedent}
          className="rounded-lg border px-3 py-2 hover:bg-gray-100"
        >
          Précédent
        </button>

        <button
          onClick={onAujourdhui}
          className="rounded-lg bg-[#83AEA7] px-3 py-2 text-white hover:opacity-90"
        >
          Aujourd'hui
        </button>

        <button
          onClick={onSuivant}
          className="rounded-lg border px-3 py-2 hover:bg-gray-100"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export default CalendarHeader;
