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
  <div className="min-h-screen bg-slate-100 p-6">
    <div className="mx-auto max-w-3xl">

      {/* Titre */}
      <h1 className="mb-2 text-3xl font-bold text-slate-800">
        Disponibilité des salles
      </h1>

      <p className="mb-6 text-slate-500">
        Choisissez une date et un horaire pour rechercher les salles disponibles.
      </p>

      {/* Formulaire de recherche */}
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="font-medium text-slate-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="heureDebut" className="font-medium text-slate-700">
            Heure de début
          </label>
          <input
            id="heureDebut"
            type="time"
            value={heureDebut}
            onChange={(e) => setHeureDebut(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="heureFin" className="font-medium text-slate-700">
            Heure de fin
          </label>
          <input
            id="heureFin"
            type="time"
            value={heureFin}
            onChange={(e) => setHeureFin(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
          />
        </div>

        <button
          type="button"
          onClick={handleVerifier}
          className="mt-2 rounded-lg bg-[#83AEA7] px-4 py-3 font-semibold text-white transition hover:bg-[#6F9992]"
        >
          Vérifier la disponibilité
        </button>
      </div>

      {/* Résultats */}
      <h2 className="mb-4 text-2xl font-bold text-slate-800">
        Salles disponibles
      </h2>

      {sallesDisponibles.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-slate-500 shadow-sm">
          Aucune salle disponible pour ce créneau.
        </div>
      ) : (
        <div className="space-y-4">
          {sallesDisponibles.map((salle) => (
            <div
              key={salle.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-semibold text-slate-800">
                {salle.nom}
              </h3>

              <p className="mb-2 text-slate-600">
                <strong>Capacité :</strong> {salle.capacite} personnes
              </p>

              <p className="text-slate-600">
                <strong>Équipements :</strong>{" "}
                {salle.equipements.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);


}

export default DisponibilitesPage;