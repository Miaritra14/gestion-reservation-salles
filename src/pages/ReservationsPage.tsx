
import { useEffect, useState } from "react";
import axios from "axios";
import type { FormEvent } from "react";

import type { Salle, Reservation } from "../types";

import ReservationForm from "../components/reservations/ReservationForm";
import ReservationList from "../components/reservations/ReservationList";
import Message from "../components/common/Message";

const API_SALLES = "http://localhost:3001/salles";
const API_RESERVATIONS = "http://localhost:3001/reservations";

function ReservationsPage() {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [salleId, setSalleId] = useState("");
  const [date, setDate] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [nombrePersonnes, setNombrePersonnes] = useState("1");

  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [erreurChargement, setErreurChargement] = useState("");

  const [chargement, setChargement] = useState(false);
  const [chargementDonnees, setChargementDonnees] = useState(true);

  const nomUtilisateur = localStorage.getItem("utilisateur") || "";

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
      } catch {
        setErreurChargement(
          "Impossible de charger les données. Vérifiez que le serveur fonctionne."
        );
      } finally {
        setChargementDonnees(false);
      }
    }

    chargerDonnees();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setErreur("");

    if (chargement) return;

    setChargement(true);

    try {
      if (!nomUtilisateur) {
        setErreur("Veuillez vous connecter avant de réserver.");
        return;
      }

      const salleChoisie = salles.find(
        (salle) => String(salle.id) === salleId
      );

      if (!salleChoisie) {
        setErreur("Veuillez choisir une salle.");
        return;
      }

      const maintenant = new Date();

      const dateAujourdhui = [
        maintenant.getFullYear(),
        String(maintenant.getMonth() + 1).padStart(2, "0"),
        String(maintenant.getDate()).padStart(2, "0"),
      ].join("-");

      if (!date || date < dateAujourdhui) {
        setErreur("Choisissez aujourd'hui ou une date future.");
        return;
      }

      if (
        !heureDebut ||
        !heureFin ||
        heureFin <= heureDebut
      ) {
        setErreur(
          "L'heure de fin doit être après l'heure de début."
        );
        return;
      }

      const nombre = Number(nombrePersonnes);

      if (!Number.isInteger(nombre) || nombre < 1) {
        setErreur("Saisissez un nombre de personnes valide.");
        return;
      }

      if (nombre > salleChoisie.capacite) {
        setErreur(
          `La capacité maximale de cette salle est de ${salleChoisie.capacite} personnes.`
        );
        return;
      }

      // Vérifier les réservations existantes avant l'envoi.
      const reponse = await axios.get<Reservation[]>(
        API_RESERVATIONS
      );

      const reservationsActuelles = reponse.data;
      setReservations(reservationsActuelles);

      const conflit = reservationsActuelles.some((reservation) => {
        const memeSalle =
          String(reservation.salleId) === salleId;

        const memeDate = reservation.date === date;

        const bloqueCreneau =
          reservation.statut !== "Refusée" &&
          reservation.statut !== "Annulée";

        const horairesSeChevauchent =
          heureDebut < reservation.heureFin &&
          heureFin > reservation.heureDebut;

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

      const nouvelleReservation = {
        salleId,
        nomUtilisateur,
        date,
        heureDebut,
        heureFin,
        nombrePersonnes: nombre,
        statut: "En attente" as const,
      };

      const reponseCreation = await axios.post<Reservation>(
        API_RESERVATIONS,
        nouvelleReservation
      );

      setReservations((anciennes) => [
        ...anciennes,
        reponseCreation.data,
      ]);

      setSalleId("");
      setDate("");
      setHeureDebut("");
      setHeureFin("");
      setNombrePersonnes("1");

      setMessage("Votre demande a été envoyée.");
    } catch {
      setErreur(
        "Une erreur est survenue. Vérifiez le serveur et réessayez."
      );
    } finally {
      setChargement(false);
    }
  }

  const mesReservations = reservations.filter(
    (reservation) =>
      reservation.nomUtilisateur === nomUtilisateur
  );

  return (
    <div className="min-h-screen bg-[#F1F5F4] px-3 py-5 sm:px-5">
      <div className="mx-auto max-w-4xl space-y-4">

        {/* En-tête */}
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
            <Message texte={erreurChargement} type="error" />

            {!erreurChargement && (
              <>
                {/* Formulaire */}
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

                {/* Réservations personnelles */}
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