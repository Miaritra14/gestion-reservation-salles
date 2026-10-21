
import type { FormEvent } from "react";
import type { Salle } from "../../types";

interface SalleFormProps {
  salleEnCours: Salle | null;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onAnnuler: () => void;
  nom: string;
  setNom: (valeur: string) => void;
  capacite: string;
  setCapacite: (valeur: string) => void;
  emplacement: string;
  setEmplacement: (valeur: string) => void;
  equipements: string;
  setEquipements: (valeur: string) => void;
  description: string;
  setDescription: (valeur: string) => void;
}

function SalleForm({
  salleEnCours,
  onSubmit,
  onAnnuler,
  nom,
  setNom,
  capacite,
  setCapacite,
  emplacement,
  setEmplacement,
  equipements,
  setEquipements,
  description,
  setDescription,
}: SalleFormProps) {
  const classeLabel = "mb-1 block text-xs font-medium text-gray-700";

  const classeChamp =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#83AEA7] focus:ring-1 focus:ring-[#83AEA7]/30";

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 border-b border-gray-100 pb-3">
        <h3 className="text-sm font-semibold text-gray-800">
          {salleEnCours ? "Modifier une salle" : "Ajouter une salle"}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Renseignez les informations de la salle.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="nomSalle" className={classeLabel}>
              Nom de la salle
            </label>
            <input
              id="nomSalle"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              placeholder="Salle de réunion A"
              className={classeChamp}
            />
          </div>

          <div>
            <label htmlFor="capaciteSalle" className={classeLabel}>
              Capacité
            </label>
            <input
              id="capaciteSalle"
              type="number"
              min="1"
              step="1"
              value={capacite}
              onChange={(e) => setCapacite(e.target.value)}
              required
              className={classeChamp}
            />
          </div>

          <div>
            <label htmlFor="emplacementSalle" className={classeLabel}>
              Emplacement
            </label>
            <input
              id="emplacementSalle"
              value={emplacement}
              onChange={(e) => setEmplacement(e.target.value)}
              required
              placeholder="Ex. : 1er étage"
              className={classeChamp}
            />
          </div>

          <div>
            <label htmlFor="equipementsSalle" className={classeLabel}>
              Équipements
            </label>
            <input
              id="equipementsSalle"
              value={equipements}
              onChange={(e) => setEquipements(e.target.value)}
              placeholder="Projecteur, tableau"
              className={classeChamp}
            />
          </div>
        </div>

        <div>
          <label htmlFor="descriptionSalle" className={classeLabel}>
            Description
          </label>
          <textarea
            id="descriptionSalle"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Description de la salle..."
            className={classeChamp}
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="submit"
            className="rounded px-4 py-2 text-sm font-medium text-white transition-colors bg-[#83AEA7] hover:bg-[#6F9992]"
          >
            {salleEnCours ? "Enregistrer les modifications" : "Ajouter la salle"}
          </button>

          {salleEnCours && (
            <button
              type="button"
              onClick={onAnnuler}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default SalleForm;
