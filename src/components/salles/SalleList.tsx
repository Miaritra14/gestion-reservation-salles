
import type { Salle } from "../../types";

// Informations nécessaires pour afficher la liste
interface SalleListProps {
  salles: Salle[];
  onModifier: (salle: Salle) => void;
  onSupprimer: (id: string | number) => void;
}

function SalleList({
  salles,
  onModifier,
  onSupprimer,
}: SalleListProps) {
  return (
    <section className="w-full rounded-lg border border-gray-200 bg-white">
      {/* En-tête du tableau */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Liste des salles
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Consultez et gérez les salles enregistrées.
          </p>
        </div>

        <span className="shrink-0 rounded-md bg-[#E8F0EE] px-2.5 py-1 text-xs font-medium text-[#527D75]">
          {salles.length} salle(s)
        </span>
      </div>

      {/* Message si aucune salle n'est enregistrée */}
      {salles.length === 0 ? (
        <p className="p-6 text-center text-sm text-gray-500">
          Aucune salle enregistrée.
        </p>
      ) : (
        <div className="w-full">
          <table className="w-full table-fixed text-left text-xs">
            <thead className="bg-[#F1F5F4] text-gray-600">
              <tr>
                <th className="w-[12%] px-2 py-3 font-semibold">
                  Nom
                </th>
                <th className="w-[12%] px-2 py-3 font-semibold">
                  Capacité
                </th>
                <th className="w-[14%] px-2 py-3 font-semibold">
                  Emplacement
                </th>
                <th className="w-[16%] px-2 py-3 font-semibold">
                  Équipements
                </th>
                <th className="w-[19%] px-2 py-3 font-semibold">
                  Description
                </th>
                <th className="w-[27%] px-2 py-3 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {salles.map((salle) => {
                // Accepter les équipements sous forme de texte ou de tableau
                const equipementsTexte = Array.isArray(salle.equipements)
                  ? salle.equipements.join(", ")
                  : salle.equipements;

                return (
                  <tr
                    key={salle.id}
                    className="transition-colors hover:bg-[#F1F5F4]/70"
                  >
                    <td className="break-words px-2 py-3 font-medium text-gray-800">
                      {salle.nom}
                    </td>

                    <td className="break-words px-2 py-3 text-gray-600">
                      <span className="inline-block rounded bg-[#E8F0EE] px-1.5 py-1 text-xs font-medium text-[#527D75]">
                        {salle.capacite} pers.
                      </span>
                    </td>

                    <td className="break-words px-2 py-3 text-gray-600">
                      {salle.emplacement}
                    </td>

                    <td className="break-words px-2 py-3 text-gray-600">
                      {equipementsTexte || "Non précisés"}
                    </td>

                    <td className="break-words px-2 py-3 text-gray-600">
                      {salle.description || "Aucune description"}
                    </td>

                    {/* Boutons contenus dans la cellule */}
                    <td className="px-1 py-3">
                      <div className="flex flex-wrap items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onModifier(salle)}
                          className="rounded bg-[#83AEA7] px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#6F9992]"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onSupprimer(salle.id)}
                          className="rounded border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default SalleList;
