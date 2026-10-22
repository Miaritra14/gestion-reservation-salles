
interface CalendarHeaderProps {
  titreSemaine: string;
  vue: "jour" | "semaine" | "mois" | "annee";
  recherche: string;
  onChangerVue: (vue: "jour" | "semaine" | "mois" | "annee") => void;
  onChangerRecherche: (valeur: string) => void;
  onRechercher: () => void;
  onPrecedent: () => void;
  onSuivant: () => void;
  onAujourdhui: () => void;
}

function CalendarHeader({
  titreSemaine,
  vue,
  recherche,
  onChangerVue,
  onChangerRecherche,
  onRechercher,
  onPrecedent,
  onSuivant,
  onAujourdhui,
}: CalendarHeaderProps) {
  const vues = [
    { valeur: "jour", label: "Jour" },
    { valeur: "semaine", label: "Semaine" },
    { valeur: "mois", label: "Mois" },
    { valeur: "annee", label: "Année" },
  ] as const;

  return (
    <div className="mb-5 space-y-5">
      {/* Titre et navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Calendrier des réservations
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {titreSemaine}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPrecedent}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100"
          >
            Précédent
          </button>

          <button
            type="button"
            onClick={onAujourdhui}
            className="rounded-lg bg-[#83AEA7] px-3 py-2 text-sm font-medium text-white hover:bg-[#6F9992]"
          >
            Aujourd'hui
          </button>

          <button
            type="button"
            onClick={onSuivant}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100"
          >
            Suivant
          </button>
        </div>
      </div>

      {/* Choix de la vue */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap rounded-lg border border-gray-200 bg-white p-1">
          {vues.map((item) => (
            <button
              key={item.valeur}
              type="button"
              onClick={() => onChangerVue(item.valeur)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                vue === item.valeur
                  ? "bg-[#83AEA7] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Recherche */}
        <form
          className="flex w-full gap-2 sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
            onRechercher();
          }}
        >
          <input
            type="search"
            value={recherche}
            onChange={(e) => onChangerRecherche(e.target.value)}
            placeholder="Rechercher une salle..."
            className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/20 sm:w-64"
          />

          <button
            type="submit"
            className="rounded-lg bg-[#83AEA7] px-4 py-2 text-sm font-medium text-white hover:bg-[#6F9992]"
          >
            Rechercher
          </button>
        </form>
      </div>
    </div>
  );
}

export default CalendarHeader;
