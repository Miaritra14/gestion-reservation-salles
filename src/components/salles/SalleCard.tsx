
import type { Salle } from "../../types";

// Informations nécessaires pour afficher une salle
interface SalleCardProps {
  salle: Salle;
  onModifier: (salle: Salle) => void;
  onSupprimer: (id: string | number) => void;
}

function SalleCard({
  salle,
  onModifier,
  onSupprimer,
}: SalleCardProps) {
  // Accepter les équipements sous forme de texte ou de tableau
  const equipementsTexte = Array.isArray(salle.equipements)
    ? salle.equipements.join(", ")
    : salle.equipements;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="mb-2 text-lg font-bold text-slate-800">
        {salle.nom}
      </h4>

      <p className="text-slate-600">
        Capacité : {salle.capacite} personnes
      </p>

      <p className="text-slate-600">
        Emplacement : {salle.emplacement}
      </p>

      <p className="text-slate-600">
        Équipements : {equipementsTexte || "Non précisés"}
      </p>

      <p className="mb-4 text-slate-600">
        Description : {salle.description || "Aucune description"}
      </p>

      {/* Boutons de modification et de suppression */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onModifier(salle)}
          className="rounded-lg bg-[#83AEA7] px-4 py-2 text-white hover:bg-[#6F9992]"
        >
          Modifier
        </button>

        <button
          type="button"
          onClick={() => onSupprimer(salle.id)}
          className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default SalleCard;
