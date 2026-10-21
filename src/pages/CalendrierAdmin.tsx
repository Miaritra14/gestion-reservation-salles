
import { useState, useEffect } from "react";
import axios from "axios";

// Informations d'une salle
interface Salle {
  id: string | number;
  nom: string;
}

// Informations d'une réservation
interface Reservation {
  id: string | number;
  salleId: string | number;
  nomUtilisateur: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  statut: "En attente" | "Acceptée" | "Refusée" | "Annulée";
}

const API_BASE = import.meta.env.VITE_API_URL;

const API_RESERVATIONS = `${API_BASE}/reservations`;
const API_SALLES = `${API_BASE}/salles`;

// Heures affichées dans l'agenda : de 08 h à 17 h
const HEURES = Array.from({ length: 10 }, (_, index) => index + 8);

// Hauteur d'une heure dans la grille
const HAUTEUR_HEURE = 56;

// Transformer une date en AAAA-MM-JJ
function formaterDateISO(date: Date): string {
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");

  return `${annee}-${mois}-${jour}`;
}

// Trouver le lundi de la semaine
function obtenirDebutSemaine(date: Date): Date {
  const lundi = new Date(date);
  const jourSemaine = lundi.getDay();

  // Dimanche = 0, lundi = 1
  const decalage = jourSemaine === 0 ? -6 : 1 - jourSemaine;

  lundi.setDate(lundi.getDate() + decalage);
  lundi.setHours(0, 0, 0, 0);

  return lundi;
}

// Convertir "09:30" en minutes
function convertirHeureEnMinutes(heure: string): number {
  const [heures, minutes] = heure.split(":").map(Number);
  return heures * 60 + minutes;
}

function CalendrierAdmin() {
  // Date utilisée pour afficher la semaine
  const [date, setDate] = useState(new Date());

  // Données récupérées depuis JSON Server
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);

  // Gestion du chargement et des erreurs
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  // Charger les salles et les réservations
  useEffect(() => {
    async function chargerDonnees() {
      try {
        const [repReservations, repSalles] = await Promise.all([
          axios.get<Reservation[]>(API_RESERVATIONS),
          axios.get<Salle[]>(API_SALLES),
        ]);

        setReservations(repReservations.data);
        setSalles(repSalles.data);
      } catch {
        setErreur("Impossible de charger les données. Vérifiez JSON Server.");
      } finally {
        setChargement(false);
      }
    }

    chargerDonnees();
  }, []);

  // Calculer les sept jours de la semaine affichée
  const debutSemaine = obtenirDebutSemaine(date);

  const jours = Array.from({ length: 7 }, (_, index) => {
    const jour = new Date(debutSemaine);
    jour.setDate(debutSemaine.getDate() + index);
    return jour;
  });

  // Préparer le titre de la semaine
  const debut = jours[0];
  const fin = jours[6];

  const memeMois =
    debut.getMonth() === fin.getMonth() &&
    debut.getFullYear() === fin.getFullYear();

  const plageSemaine = memeMois
    ? `${debut.getDate()} – ${fin.getDate()} ${fin.toLocaleDateString(
        "fr-FR",
        { month: "long", year: "numeric" }
      )}`
    : `${debut.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      })} – ${fin.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;

  // Afficher uniquement les demandes actives
  const reservationsActives = reservations.filter(
    (reservation) =>
      reservation.statut !== "Refusée" &&
      reservation.statut !== "Annulée"
  );

  // Changer de semaine
  function changerSemaine(nombreJours: number) {
    setDate((ancienneDate) => {
      const nouvelleDate = new Date(ancienneDate);
      nouvelleDate.setDate(nouvelleDate.getDate() + nombreJours);
      return nouvelleDate;
    });
  }

  // Couleur selon le statut
  function obtenirCouleur(statut: Reservation["statut"]) {
    if (statut === "Acceptée") {
      return "border-[#83AEA7] bg-[#E8F0EE] text-[#527D75]";
    }

    return "border-amber-400 bg-amber-50 text-amber-800";
  }

  return (
    <div className="min-h-screen bg-[#F1F5F4] p-3 sm:p-5">
      <div className="mx-auto max-w-7xl space-y-4">

        {/* Titre */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Agenda des réservations
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Consultez les réservations par jour et par horaire.
          </p>
        </div>

        {/* Navigation de la semaine */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDate(new Date())}
              className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Aujourd'hui
            </button>

            <button
              type="button"
              onClick={() => changerSemaine(-7)}
              aria-label="Semaine précédente"
              className="rounded border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => changerSemaine(7)}
              aria-label="Semaine suivante"
              className="rounded border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              →
            </button>
          </div>

          <h2 className="text-base font-semibold text-gray-800">
            {plageSemaine}
          </h2>
        </div>

        {/* Erreur de chargement */}
        {erreur && (
          <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {erreur}
          </p>
        )}

        {/* Légende des statuts */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-amber-400 bg-amber-50" />
            En attente
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-[#83AEA7] bg-[#E8F0EE]" />
            Acceptée
          </div>
        </div>

        {/* Agenda hebdomadaire */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          {chargement ? (
            <p className="p-6 text-center text-sm text-gray-500">
              Chargement de l'agenda...
            </p>
          ) : (
            <div className="min-w-[850px]">

              {/* En-tête des jours */}
              <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] border-b border-gray-200">
                <div className="border-r border-gray-200 p-2" />

                {jours.map((jour) => {
                  const aujourdHui =
                    formaterDateISO(jour) === formaterDateISO(new Date());

                  return (
                    <div
                      key={formaterDateISO(jour)}
                      className={`border-r border-gray-100 px-1 py-3 text-center ${
                        aujourdHui ? "bg-[#F1F5F4]" : ""
                      }`}
                    >
                      <p className="text-xs capitalize text-gray-500">
                        {jour.toLocaleDateString("fr-FR", {
                          weekday: "short",
                        }).replace(".", "")}
                      </p>

                      <p
                        className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          aujourdHui
                            ? "bg-[#83AEA7] text-white"
                            : "text-gray-800"
                        }`}
                      >
                        {jour.getDate()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Lignes horaires */}
              {HEURES.map((heure) => (
                <div
                  key={heure}
                  className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))]"
                >
                  {/* Heure à gauche */}
                  <div className="h-14 border-r border-b border-gray-200 px-2 pt-1 text-xs text-gray-500">
                    {String(heure).padStart(2, "0")}:00
                  </div>

                  {/* Une case par jour */}
                  {jours.map((jour) => {
                    const dateJour = formaterDateISO(jour);

                    // Réservations qui commencent pendant cette heure
                    const reservationsHeure = reservationsActives.filter(
                      (reservation) => {
                        if (reservation.date !== dateJour) {
                          return false;
                        }

                        const debutMinutes = convertirHeureEnMinutes(
                          reservation.heureDebut
                        );

                        return Math.floor(debutMinutes / 60) === heure;
                      }
                    );

                    return (
                      <div
                        key={dateJour}
                        className="relative h-14 border-r border-b border-gray-100"
                      >
                        {reservationsHeure.map((reservation) => {
                          const salle = salles.find(
                            (element) =>
                              String(element.id) ===
                              String(reservation.salleId)
                          );

                          const debutMinutes = convertirHeureEnMinutes(
                            reservation.heureDebut
                          );

                          const finMinutes = convertirHeureEnMinutes(
                            reservation.heureFin
                          );

                          // Position verticale dans la case horaire
                          const decalage =
                            (debutMinutes % 60) * HAUTEUR_HEURE / 60;

                          // Hauteur selon la durée de la réservation
                          const dureeVisible = Math.max(
                            15,
                            Math.min(finMinutes, 18 * 60) - debutMinutes
                          );

                          const hauteur =
                            dureeVisible * HAUTEUR_HEURE / 60 - 3;

                          return (
                            <div
                              key={reservation.id}
                              title={`${salle?.nom ?? "Salle inconnue"} : ${reservation.heureDebut} - ${reservation.heureFin} | ${reservation.nomUtilisateur} | ${reservation.statut}`}
                              className={`absolute left-0.5 right-0.5 z-10 overflow-hidden rounded border-l-[3px] p-1 text-[10px] leading-tight sm:text-xs ${obtenirCouleur(reservation.statut)}`}
                              style={{
                                top: `${decalage}px`,
                                height: `${Math.max(hauteur, 22)}px`,
                              }}
                            >
                              <p className="truncate font-semibold">
                                {salle?.nom ?? "Salle inconnue"}
                              </p>

                              <p className="truncate">
                                {reservation.heureDebut}–{reservation.heureFin}
                              </p>

                              <p className="truncate">
                                {reservation.statut}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Heure de fermeture */}
              <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))]">
                <div className="px-2 pt-1 text-xs text-gray-500">
                  18:00
                </div>
                {jours.map((jour) => (
                  <div
                    key={formaterDateISO(jour)}
                    className="h-6 border-r border-gray-100"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500">
          Les demandes en attente et les réservations acceptées sont affichées.
          Les demandes refusées ou annulées ne sont pas affichées.
        </p>
      </div>
    </div>
  );
}

export default CalendrierAdmin;
