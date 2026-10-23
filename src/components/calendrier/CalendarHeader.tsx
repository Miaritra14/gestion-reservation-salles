
import type { FormEvent } from "react";
import type { Salle } from "../../types";

// Définir les informations et actions de l'en-tête
interface CalendarHeaderProps {
  titreSemaine: string;
  vue: "jour" | "semaine" | "mois" | "annee";
  recherche: string;
  salleId: string;
  salles: Salle[];
  onChangerVue: (vue: "jour" | "semaine" | "mois" | "annee") => void;
  onChangerRecherche: (valeur: string) => void;
  onChangerSalle: (valeur: string) => void;
  onRechercher: () => void;
  onPrecedent: () => void;
  onSuivant: () => void;
  onAujourdhui: () => void;
  onReserver: () => void;
}

function CalendarHeader({
  titreSemaine,
  vue,
  recherche,
  salleId,
  salles,
  onChangerVue,
  onChangerRecherche,
  onChangerSalle,
  onRechercher,
  onPrecedent,
  onSuivant,
  onAujourdhui,
  onReserver,
}: CalendarHeaderProps) {
  const vues = [
    { valeur: "jour", label: "Jour" },
    { valeur: "semaine", label: "Semaine" },
    { valeur: "mois", label: "Mois" },
    { valeur: "annee", label: "Année" },
  ] as const;

  function soumettreRecherche(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onRechercher();
  }

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Titre et bouton de réservation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Calendrier des réservations
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            {titreSemaine}
          </p>
        </div>

        <button
          type="button"
          onClick={onReserver}
          className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          + Réserver
        </button>
      </div>

      {/* Navigation entre les dates et les vues */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrecedent}
            aria-label="Période précédente"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={onAujourdhui}
            className="rounded-full border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Aujourd'hui
          </button>

          <button
            type="button"
            onClick={onSuivant}
            aria-label="Période suivante"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            ›
          </button>
        </div>

        <div className="flex rounded-full bg-gray-100 p-1">
          {vues.map((item) => (
            <button
              key={item.valeur}
              type="button"
              onClick={() => onChangerVue(item.valeur)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                vue === item.valeur
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recherche et filtre par salle */}
      <form
        onSubmit={soumettreRecherche}
        className="flex flex-col gap-2 px-4 pb-3 sm:flex-row sm:px-5"
      >
        <input
          type="search"
          value={recherche}
          onChange={(e) => onChangerRecherche(e.target.value)}
          placeholder="Rechercher une salle..."
          className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/20"
        />

        <select
          value={salleId}
          onChange={(e) => onChangerSalle(e.target.value)}
          aria-label="Filtrer par salle"
          className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#83AEA7]"
        >
          <option value="">Toutes les salles</option>
          {salles.map((salle) => (
            <option key={salle.id} value={String(salle.id)}>
              {salle.nom}
            </option>
          ))}
        </select>
      </form>
    </section>
  );
}

export default CalendarHeader;
