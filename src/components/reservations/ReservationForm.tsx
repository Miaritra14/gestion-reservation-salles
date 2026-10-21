
import type { FormEvent } from "react";
import type { Salle } from "../../types";

import Button from "../common/Button";
import Message from "../common/Message";

interface ReservationFormProps {
  nomUtilisateur: string;
  salles: Salle[];
  salleId: string;
  setSalleId: (valeur: string) => void;
  date: string;
  setDate: (valeur: string) => void;
  heureDebut: string;
  setHeureDebut: (valeur: string) => void;
  heureFin: string;
  setHeureFin: (valeur: string) => void;
  nombrePersonnes: string;
  setNombrePersonnes: (valeur: string) => void;
  chargement: boolean;
  erreur: string;
  message: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function ReservationForm({
  nomUtilisateur,
  salles,
  salleId,
  setSalleId,
  date,
  setDate,
  heureDebut,
  setHeureDebut,
  heureFin,
  setHeureFin,
  nombrePersonnes,
  setNombrePersonnes,
  chargement,
  erreur,
  message,
  onSubmit,
}: ReservationFormProps) {
  // Définir la date minimale autorisée : aujourd'hui
  const maintenant = new Date();
  const dateMinimum = [
    maintenant.getFullYear(),
    String(maintenant.getMonth() + 1).padStart(2, "0"),
    String(maintenant.getDate()).padStart(2, "0"),
  ].join("-");

  // Classes communes aux champs et aux étiquettes
  const classeLabel = "mb-1 block text-xs font-medium text-gray-700";

  const classeChamp =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#83AEA7] focus:ring-1 focus:ring-[#83AEA7]/30 disabled:bg-gray-100";

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Nouvelle réservation
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Utilisateur : {nomUtilisateur || "Non connecté"}
        </p>
      </div>

      <Message texte={erreur} type="error" />
      <Message texte={message} type="success" />

      <div>
        <label htmlFor="salleId" className={classeLabel}>
          Salle
        </label>
        <select
          id="salleId"
          value={salleId}
          onChange={(e) => setSalleId(e.target.value)}
          required
          disabled={chargement || salles.length === 0}
          className={classeChamp}
        >
          <option value="">-- Choisir une salle --</option>
          {salles.map((salle) => (
            <option key={salle.id} value={String(salle.id)}>
              {salle.nom} — capacité : {salle.capacite} personnes
            </option>
          ))}
        </select>

        {salles.length === 0 && (
          <p className="mt-1 text-xs text-red-600">
            Aucune salle disponible dans la liste.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="date" className={classeLabel}>
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          min={dateMinimum}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={chargement}
          className={classeChamp}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="heureDebut" className={classeLabel}>
            Heure de début
          </label>
          <input
            id="heureDebut"
            type="time"
            value={heureDebut}
            onChange={(e) => setHeureDebut(e.target.value)}
            required
            disabled={chargement}
            className={classeChamp}
          />
        </div>

        <div>
          <label htmlFor="heureFin" className={classeLabel}>
            Heure de fin
          </label>
          <input
            id="heureFin"
            type="time"
            value={heureFin}
            min={heureDebut || undefined}
            onChange={(e) => setHeureFin(e.target.value)}
            required
            disabled={chargement}
            className={classeChamp}
          />
        </div>
      </div>

      <div>
        <label htmlFor="nombrePersonnes" className={classeLabel}>
          Nombre de personnes
        </label>
        <input
          id="nombrePersonnes"
          type="number"
          min="1"
          step="1"
          value={nombrePersonnes}
          onChange={(e) => setNombrePersonnes(e.target.value)}
          required
          disabled={chargement}
          className={classeChamp}
        />
      </div>

      <Button
        type="submit"
        disabled={chargement || !nomUtilisateur || salles.length === 0}
      >
        {chargement ? "Envoi en cours..." : "Envoyer la demande"}
      </Button>
    </form>
  );
}

export default ReservationForm;
