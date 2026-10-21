
import { useEffect, useState } from "react";
import axios from "axios";

//  Définir la structure d'une salle
interface Salle {
  id: string | number;
  nom: string;
  capacite: number;
}

//  Définir la structure d'une réservation
interface Reservation {
  id: string | number;
  salleId: string | number;
  nomUtilisateur: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  nombrePersonnes: number;
  statut: "En attente" | "Acceptée" | "Refusée" | "Annulée";
}

//  Adresses de l'API JSON Server
const API_SALLES = "http://localhost:3001/salles";
const API_RESERVATIONS = "http://localhost:3001/reservations";

function ReservationsPage() {
  //  États des données
  const [salles, setSalles] = useState<Salle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  //  États du formulaire
  const [salleId, setSalleId] = useState("");
  const [date, setDate] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [nombrePersonnes, setNombrePersonnes] = useState("1");

  //  États des messages et du chargement
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  //  Récupérer le nom de l'utilisateur connecté
  const nomUtilisateur = localStorage.getItem("utilisateur") || "";

  //  Charger les salles et les réservations au démarrage
  useEffect(() => {
    async function chargerDonnees() {
      try {
        const [reponseSalles, reponseReservations] = await Promise.all([
          axios.get<Salle[]>(API_SALLES),
          axios.get<Reservation[]>(API_RESERVATIONS),
        ]);

        setSalles(reponseSalles.data);
        setReservations(reponseReservations.data);
      } catch {
        setErreur("Impossible de charger les données. Vérifiez JSON Server.");
      }
    }

    chargerDonnees();
  }, []);

  //  Envoyer une demande de réservation
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setErreur("");

    if (chargement) return;

    setChargement(true);

    try {
      // Vérifier que l'utilisateur est connecté
      if (!nomUtilisateur) {
        setErreur("Veuillez vous connecter avant de réserver.");
        return;
      }

      // Vérifier que la salle existe
      const salleChoisie = salles.find(
        (salle) => String(salle.id) === salleId
      );

      if (!salleChoisie) {
        setErreur("Veuillez choisir une salle.");
        return;
      }

      // Vérifier la date
      const aujourdHui = new Date();
      const annee = aujourdHui.getFullYear();
      const mois = String(aujourdHui.getMonth() + 1).padStart(2, "0");
      const jour = String(aujourdHui.getDate()).padStart(2, "0");
      const dateAujourdhui = `${annee}-${mois}-${jour}`;

      if (!date || date < dateAujourdhui) {
        setErreur("Veuillez choisir une date valide, aujourd'hui ou plus tard.");
        return;
      }

      // Vérifier les horaires
      if (!heureDebut || !heureFin || heureFin <= heureDebut) {
        setErreur("L'heure de fin doit être après l'heure de début.");
        return;
      }

      // Vérifier le nombre de personnes
      const nombre = Number(nombrePersonnes);

      if (!Number.isInteger(nombre) || nombre < 1) {
        setErreur("Le nombre de personnes doit être un entier positif.");
        return;
      }

      if (nombre > salleChoisie.capacite) {
        setErreur(
          `Cette salle peut accueillir au maximum ${salleChoisie.capacite} personnes.`
        );
        return;
      }

      // Récupérer les réservations les plus récentes
      const reponse = await axios.get<Reservation[]>(API_RESERVATIONS);
      const reservationsActuelles = reponse.data;

      setReservations(reservationsActuelles);

      // Vérifier si le même créneau est déjà occupé
      const conflit = reservationsActuelles.some((reservation) => {
        const memeSalle = String(reservation.salleId) === salleId;
        const memeDate = reservation.date === date;

        // Ignorer les réservations refusées ou annulées
        const nonAnnulee =
          reservation.statut !== "Refusée" &&
          reservation.statut !== "Annulée";

        // Vérifier si les horaires se chevauchent
        const horairesSeChevauchent =
          heureDebut < reservation.heureFin &&
          heureFin > reservation.heureDebut;

        return (
          memeSalle &&
          memeDate &&
          nonAnnulee &&
          horairesSeChevauchent
        );
      });

      if (conflit) {
        setErreur(
          `La salle ${salleChoisie.nom} est déjà demandée ou réservée sur ce créneau. Choisissez un autre horaire.`
        );
        return;
      }

      // Préparer la nouvelle réservation
      const nouvelleReservation = {
        salleId,
        nomUtilisateur,
        date,
        heureDebut,
        heureFin,
        nombrePersonnes: nombre,
        statut: "En attente" as const,
      };

      // Enregistrer dans JSON Server
      const reponseCreation = await axios.post<Reservation>(
        API_RESERVATIONS,
        nouvelleReservation
      );

      // Ajouter la réservation enregistrée à la liste
      setReservations((anciennesReservations) => [
        ...anciennesReservations,
        reponseCreation.data,
      ]);

      // Réinitialiser le formulaire
      setSalleId("");
      setDate("");
      setHeureDebut("");
      setHeureFin("");
      setNombrePersonnes("1");

      setMessage("Votre demande a été envoyée. Statut : En attente.");
    } catch {
      setErreur(
        "Une erreur est survenue. Vérifiez la connexion à JSON Server et réessayez."
      );
    } finally {
      setChargement(false);
    }
  }

  //  Récupérer uniquement les demandes de l'utilisateur connecté
  const mesReservations = reservations.filter(
    (reservation) => reservation.nomUtilisateur === nomUtilisateur
  );

  //  Afficher la page
return (
  <div className="min-h-screen bg-slate-100 p-6">
    <div className="mx-auto max-w-3xl">

      <h1 className="mb-2 text-3xl font-bold text-slate-800">
        Réserver une salle
      </h1>

      <p className="mb-6 text-slate-500">
        Remplissez les informations pour envoyer votre demande.
      </p>

      {/* Formulaire de réservation */}
      <form
        onSubmit={handleSubmit}
        className="flex max-w-xl flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label htmlFor="utilisateur" className="font-medium text-slate-700">
          Utilisateur
        </label>
        <input
          id="utilisateur"
          value={nomUtilisateur}
          readOnly
          className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600"
        />

        <label htmlFor="salle" className="font-medium text-slate-700">
          Salle
        </label>
        <select
          id="salle"
          value={salleId}
          onChange={(e) => setSalleId(e.target.value)}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
        >
          <option value="">Choisir une salle</option>
          {salles.map((salle) => (
            <option key={salle.id} value={String(salle.id)}>
              {salle.nom} — {salle.capacite} personnes
            </option>
          ))}
        </select>

        <label htmlFor="date" className="font-medium text-slate-700">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          min={(() => {
            const maintenant = new Date();
            const annee = maintenant.getFullYear();
            const mois = String(maintenant.getMonth() + 1).padStart(2, "0");
            const jour = String(maintenant.getDate()).padStart(2, "0");
            return `${annee}-${mois}-${jour}`;
          })()}
          onChange={(e) => setDate(e.target.value)}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
        />

        <label htmlFor="heureDebut" className="font-medium text-slate-700">
          Heure de début
        </label>
        <input
          id="heureDebut"
          type="time"
          value={heureDebut}
          onChange={(e) => setHeureDebut(e.target.value)}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
        />

        <label htmlFor="heureFin" className="font-medium text-slate-700">
          Heure de fin
        </label>
        <input
          id="heureFin"
          type="time"
          value={heureFin}
          onChange={(e) => setHeureFin(e.target.value)}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
        />

        <label htmlFor="nombrePersonnes" className="font-medium text-slate-700">
          Nombre de personnes
        </label>
        <input
          id="nombrePersonnes"
          type="number"
          min="1"
          max={salles.find((salle) => String(salle.id) === salleId)?.capacite}
          value={nombrePersonnes}
          onChange={(e) => setNombrePersonnes(e.target.value)}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
        />

        {erreur && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {erreur}
          </p>
        )}

        {message && (
          <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={chargement}
          className="mt-3 rounded-lg bg-[#83AEA7] px-4 py-3 font-semibold text-white transition hover:bg-[#6F9992] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {chargement ? "Vérification en cours..." : "Envoyer la demande"}
        </button>
      </form>

      {/* Liste des réservations */}
      <h2 className="mb-4 mt-10 text-2xl font-bold text-slate-800">
        Mes demandes de réservation
      </h2>

      {mesReservations.length === 0 ? (
        <p className="rounded-lg bg-white p-5 text-slate-500">
          Aucune demande pour le moment.
        </p>
      ) : (
        <div className="space-y-4">
          {mesReservations.map((reservation) => {
            const salle = salles.find(
              (s) => String(s.id) === String(reservation.salleId)
            );

            return (
              <div
                key={reservation.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-3 text-lg font-semibold text-slate-800">
                  {salle?.nom || `Salle ${reservation.salleId}`}
                </h3>

                <p className="mb-1 text-slate-600">
                  <strong>Date :</strong> {reservation.date}
                </p>

                <p className="mb-1 text-slate-600">
                  <strong>Horaire :</strong> {reservation.heureDebut} - {reservation.heureFin}
                </p>

                <p className="mb-3 text-slate-600">
                  <strong>Personnes :</strong> {reservation.nombrePersonnes}
                </p>

                <p className="text-slate-700">
                  <strong>Statut :</strong>{" "}
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                      reservation.statut === "Acceptée"
                        ? "bg-green-100 text-green-700"
                        : reservation.statut === "Refusée"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {reservation.statut}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);
}

export default ReservationsPage;
