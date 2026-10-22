
import { useEffect, useState } from "react";
import axios from "axios";
import type { FormEvent } from "react";
import { reservationSchema } from "../schemas/reservationSchema";

import type { Salle, Reservation } from "../types";

import ReservationForm from "../components/reservations/ReservationForm";
import ReservationList from "../components/reservations/ReservationList";
import Message from "../components/common/Message";

const API_SALLES = "http://localhost:3001/salles";
const API_RESERVATIONS = "http://localhost:3001/reservations";

function ReservationsPage() {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Valeurs saisies dans le formulaire
  const [salleId, setSalleId] = useState("");
  const [date, setDate] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [nombrePersonnes, setNombrePersonnes] = useState("1");

  // Messages affichés à l'utilisateur
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [erreurChargement, setErreurChargement] = useState("");

  // États pour gérer les chargements
  const [chargement, setChargement] = useState(false);
  const [chargementDonnees, setChargementDonnees] = useState(true);

  const nomUtilisateur = localStorage.getItem("utilisateur") || "";

  // Charger les salles et les réservations au démarrage
  useEffect(() => {
    async function chargerDonnees() {
      try {
        const [reponseSalles, reponseReservations] =
          await Promise.all([
            axios.get<Salle[]>(API_SALLES),
            axios.get<Reservation[]>(API_RESERVATIONS),
          ]);

        setSalles(reponseSalles.data);
        setReservations(reponseReservations.data);
      } catch (error) {
        // Afficher un message si le serveur ne répond pas
        console.error("Erreur de chargement :", error);

        setErreurChargement(
          "Impossible de charger les données. Vérifiez que le serveur fonctionne."
        );
      } finally {
        // Arrêter le chargement, même en cas d'erreur
        setChargementDonnees(false);
      }
    }

    chargerDonnees();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setErreur("");

    // Éviter plusieurs envois en même temps
    if (chargement) return;

    setChargement(true);

    try {
      // Vérifier que l'utilisateur est connecté
      if (!nomUtilisateur) {
        setErreur("Veuillez vous connecter avant de réserver.");
        return;
      }

      // Zod vérifie les champs et les horaires du formulaire
      const resultat = reservationSchema.safeParse({
        salleId,
        date,
        heureDebut,
        heureFin,
        nombrePersonnes: Number(nombrePersonnes),
      });

      // Si les données sont invalides, afficher la première erreur
      if (!resultat.success) {
        setErreur(
          resultat.error.issues[0]?.message ??
            "Veuillez vérifier les champs du formulaire."
        );
        return;
      }

      // Récupérer les données validées par Zod
      const donneesValidees = resultat.data;
      const nombre = donneesValidees.nombrePersonnes;

      // Vérifier que la salle choisie existe
      const salleChoisie = salles.find(
        (salle) => String(salle.id) === donneesValidees.salleId
      );

      if (!salleChoisie) {
        setErreur("Veuillez choisir une salle valide.");
        return;
      }

      // Construire la date d'aujourd'hui au format AAAA-MM-JJ
      const maintenant = new Date();

      const dateAujourdhui = [
        maintenant.getFullYear(),
        String(maintenant.getMonth() + 1).padStart(2, "0"),
        String(maintenant.getDate()).padStart(2, "0"),
      ].join("-");

      // Interdire les réservations dans le passé
      if (donneesValidees.date < dateAujourdhui) {
        setErreur("Choisissez aujourd'hui ou une date future.");
        return;
      }

      // Vérifier la capacité de la salle
      if (nombre > salleChoisie.capacite) {
        setErreur(
          `La capacité maximale de cette salle est de ${salleChoisie.capacite} personnes.`
        );
        return;
      }

      // Recharger les réservations pour vérifier les conflits récents
      const reponse = await axios.get<Reservation[]>(
        API_RESERVATIONS
      );

      const reservationsActuelles = reponse.data;
      setReservations(reservationsActuelles);

      // Vérifier si une réservation bloque déjà ce créneau
      const conflit = reservationsActuelles.some((reservation) => {
        const memeSalle =
          String(reservation.salleId) === donneesValidees.salleId;

        const memeDate = reservation.date === donneesValidees.date;

        const bloqueCreneau =
          reservation.statut !== "Refusée" &&
          reservation.statut !== "Annulée";

        const horairesSeChevauchent =
          donneesValidees.heureDebut < reservation.heureFin &&
          donneesValidees.heureFin > reservation.heureDebut;

        return (
          memeSalle &&
          memeDate &&
          bloqueCreneau &&
          horairesSeChevauchent
        );
      });

      if (conflit) {
        setErreur(
          `La salle ${salleChoisie.nom} est déjà demandée ou réservée sur ce créneau.`
        );
        return;
      }

      // Préparer la réservation à envoyer au serveur
      const nouvelleReservation = {
        salleId: donneesValidees.salleId,
        nomUtilisateur,
        date: donneesValidees.date,
        heureDebut: donneesValidees.heureDebut,
        heureFin: donneesValidees.heureFin,
        nombrePersonnes: nombre,
        statut: "En attente" as const,
      };

      // Enregistrer la réservation dans JSON Server
      const reponseCreation = await axios.post<Reservation>(
        API_RESERVATIONS,
        nouvelleReservation
      );

      // Ajouter la nouvelle réservation à la liste affichée
      setReservations((anciennes) => [
        ...anciennes,
        reponseCreation.data,
      ]);

      // Vider le formulaire après l'enregistrement
      setSalleId("");
      setDate("");
      setHeureDebut("");
      setHeureFin("");
      setNombrePersonnes("1");

      setMessage("Votre demande a été envoyée.");
    } catch (error) {
      // Gérer les erreurs de communication avec le serveur
      console.error("Erreur lors de la réservation :", error);

      setErreur(
        "Une erreur est survenue. Vérifiez le serveur et réessayez."
      );
    } finally {
      // Arrêter le chargement, même si une erreur survient
      setChargement(false);
    }
  }

  // Afficher uniquement les réservations de l'utilisateur connecté
  const mesReservations = reservations.filter(
    (reservation) =>
      reservation.nomUtilisateur === nomUtilisateur
  );

  return (
    <div className="min-h-screen bg-[#F1F5F4] px-3 py-5 sm:px-5">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* En-tête de la page */}
        <div className="border-b border-gray-200 pb-3">
          <h1 className="text-xl font-semibold text-gray-800">
            Réserver une salle
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Effectuez une réservation et suivez son statut.
          </p>
        </div>

        {chargementDonnees ? (
          <p className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-500">
            Chargement des données...
          </p>
        ) : (
          <>
            {/* Afficher une erreur si le chargement échoue */}
            <Message texte={erreurChargement} type="error" />

            {!erreurChargement && (
              <>
                {/* Formulaire de réservation */}
                <section className="rounded-md border border-gray-200 bg-white p-4 sm:p-5">
                  <h2 className="mb-4 text-base font-semibold text-gray-800">
                    Informations de réservation
                  </h2>

                  <ReservationForm
                    nomUtilisateur={nomUtilisateur}
                    salles={salles}
                    salleId={salleId}
                    setSalleId={setSalleId}
                    date={date}
                    setDate={setDate}
                    heureDebut={heureDebut}
                    setHeureDebut={setHeureDebut}
                    heureFin={heureFin}
                    setHeureFin={setHeureFin}
                    nombrePersonnes={nombrePersonnes}
                    setNombrePersonnes={setNombrePersonnes}
                    chargement={chargement}
                    erreur={erreur}
                    message={message}
                    onSubmit={handleSubmit}
                  />
                </section>

                {/* Liste des réservations personnelles */}
                <section className="rounded-md border border-gray-200 bg-white p-4 sm:p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <h2 className="text-base font-semibold text-gray-800">
                      Mes réservations
                    </h2>

                    <span className="rounded bg-[#E8F0EE] px-2 py-1 text-xs font-medium text-[#527D75]">
                      {mesReservations.length} réservation(s)
                    </span>
                  </div>

                  <ReservationList
                    reservations={mesReservations}
                    salles={salles}
                  />
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ReservationsPage;
