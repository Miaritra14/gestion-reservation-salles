import { useState, useEffect } from "react";
import { getSalles, getReservations, isSalleDisponible } from "../services/api";
import { Salle, Reservation } from "../types";

function DisponibilitesPage() {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Ce que l'utilisateur choisit
  const [date, setDate] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");

  // Résultat : salles disponibles
  const [sallesDisponibles, setSallesDisponibles] = useState<Salle[]>([]);

  // Charger les données au démarrage
  useEffect(() => {
    const charger = async () => {
      const sallesData = await getSalles();
      const reservationsData = await getReservations();
      setSalles(sallesData);
      setReservations(reservationsData);
    };
    charger();
  }, []);

  // Quand on clique sur "Vérifier"
  const handleVerifier = () => {
    if (!date || !heureDebut || !heureFin) {
      alert("Merci de remplir la date et les heures");
      return;
    }

    // Filtrer les salles qui sont disponibles
    const disponibles = salles.filter((salle) =>
      isSalleDisponible(salle.id, date, heureDebut, heureFin, reservations)
    );

    setSallesDisponibles(disponibles);
  };



return (
  <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
    <div className="mx-auto max-w-5xl space-y-6">

      {/* Titre de la page */}
      <div className="border-b border-gray-200 pb-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#6F9992]">
          Gestion des salles
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
          Disponibilité des salles
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Recherchez les salles disponibles selon la date et l'horaire souhaités.
        </p>
      </div>

      {/* Formulaire de recherche */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

        <h2 className="mb-5 text-lg font-semibold text-gray-800">
          Rechercher une disponibilité
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="date"
              className="text-sm font-medium text-gray-700"
            >
              Date
            </label>

            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
            />
          </div>

          {/* Heure de début */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="heureDebut"
              className="text-sm font-medium text-gray-700"
            >
              Heure de début
            </label>

            <input
              id="heureDebut"
              type="time"
              value={heureDebut}
              onChange={(e) => setHeureDebut(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
            />
          </div>

          {/* Heure de fin */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="heureFin"
              className="text-sm font-medium text-gray-700"
            >
              Heure de fin
            </label>

            <input
              id="heureFin"
              type="time"
              value={heureFin}
              onChange={(e) => setHeureFin(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
            />
          </div>

        </div>

        {/* Bouton de recherche */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleVerifier}
            className="w-full rounded-lg bg-[#83AEA7] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6F9992] hover:shadow-md sm:w-auto"
          >
            Vérifier la disponibilité
          </button>
        </div>
      </div>

      {/* Résultats */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Salles disponibles
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Les salles correspondant à votre recherche.
            </p>
          </div>

          {/* Nombre de résultats */}
          <span className="rounded-full bg-[#E8F0EE] px-3 py-1.5 text-sm font-medium text-[#426D64]">
            {sallesDisponibles.length} salle(s)
          </span>
        </div>

        {/* Aucune salle disponible */}
        {sallesDisponibles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-gray-700">
              Aucune salle disponible
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Essayez une autre date ou un autre horaire.
            </p>
          </div>
        ) : (

          /* Liste des salles disponibles */
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {sallesDisponibles.map((salle) => (
              <div
                key={salle.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                {/* Nom de la salle et statut */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {salle.nom}
                  </h3>

                  <span className="shrink-0 rounded-full bg-[#E8F0EE] px-3 py-1 text-xs font-medium text-[#426D64]">
                    Disponible
                  </span>
                </div>

                {/* Capacité */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500">
                    Capacité
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {salle.capacite} personnes
                  </p>
                </div>

                {/* Équipements */}
                <div className="mt-4">
                  <p className="mb-2 text-sm text-gray-500">
                    Équipements
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(
                      Array.isArray(salle.equipements)
                        ? salle.equipements
                        : String(salle.equipements || "")
                            .split(",")
                            .map((equipement) => equipement.trim())
                            .filter(Boolean)
                    ).map((equipement, index) => (
                      <span
                        key={`${equipement}-${index}`}
                        className="rounded-md bg-[#CCCCFF]/30 px-2.5 py-1 text-xs text-[#45415F]"
                      >
                        {equipement}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  </div>
);



}

export default DisponibilitesPage;