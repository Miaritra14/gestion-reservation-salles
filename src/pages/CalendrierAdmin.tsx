
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import CalendarHeader from "../components/calendrier/CalendarHeader";
import CalendarGrid from "../components/calendrier/CalendarGrid";
import type { Reservation, Salle } from "../types";

// Les vues disponibles dans le calendrier.
type VueCalendrier = "jour" | "semaine" | "mois" | "annee";

const API_BASE = import.meta.env.VITE_API_URL;
const API_RESERVATIONS = `${API_BASE}/reservations`;
const API_SALLES = `${API_BASE}/salles`;

const HEURE_DEBUT = 8;
const HEURE_FIN = 18;
const HAUTEUR_HEURE = 56;

const heures = Array.from(
  { length: HEURE_FIN - HEURE_DEBUT },
  (_, index) => HEURE_DEBUT + index
);

// Transformer une date en AAAA-MM-JJ.
function formaterDateISO(date: Date): string {
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");

  return `${annee}-${mois}-${jour}`;
}

// Trouver le lundi de la semaine.
function obtenirDebutSemaine(date: Date): Date {
  const lundi = new Date(date);
  const jour = lundi.getDay();

  lundi.setDate(lundi.getDate() + (jour === 0 ? -6 : 1 - jour));
  lundi.setHours(0, 0, 0, 0);

  return lundi;
}

// Ajouter un nombre de jours à une date.
function ajouterJours(date: Date, nombre: number): Date {
  const resultat = new Date(date);
  resultat.setDate(resultat.getDate() + nombre);

  return resultat;
}

function CalendrierAdmin() {
  const navigate = useNavigate();

  // Gérer la date, la vue et les filtres.
  const [date, setDate] = useState(new Date());
  const [vue, setVue] = useState<VueCalendrier>("semaine");
  const [recherche, setRecherche] = useState("");
  const [rechercheActive, setRechercheActive] = useState("");
  const [salleFiltre, setSalleFiltre] = useState("");

  // Stocker les données reçues du serveur.
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  // Charger les salles et les réservations.
  useEffect(() => {
    async function chargerDonnees() {
      try {
        setErreur("");

        const [repReservations, repSalles] = await Promise.all([
          axios.get<Reservation[]>(API_RESERVATIONS),
          axios.get<Salle[]>(API_SALLES),
        ]);

        setReservations(repReservations.data);
        setSalles(repSalles.data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
        setErreur(
          "Impossible de charger les réservations et les salles."
        );
      } finally {
        setChargement(false);
      }
    }

    chargerDonnees();
  }, []);

  // Filtrer les réservations selon la recherche et la salle.
  const reservationsFiltrees = reservations.filter((reservation) => {
    if (
      reservation.statut === "Refusée" ||
      reservation.statut === "Annulée"
    ) {
      return false;
    }

    const salle = salles.find(
      (element) => String(element.id) === String(reservation.salleId)
    );

    const texte = [
      salle?.nom ?? "Salle inconnue",
      reservation.nomUtilisateur,
      reservation.statut,
    ]
      .join(" ")
      .toLocaleLowerCase("fr");

    const correspondRecherche = texte.includes(
      rechercheActive.trim().toLocaleLowerCase("fr")
    );

    const correspondSalle =
      !salleFiltre || String(reservation.salleId) === salleFiltre;

    return correspondRecherche && correspondSalle;
  });

  // Préparer les sept jours de la semaine.
  const debutSemaine = obtenirDebutSemaine(date);

  const joursSemaine = Array.from({ length: 7 }, (_, index) =>
    ajouterJours(debutSemaine, index)
  );

  // Afficher la période correspondant à la vue.
  const titre =
    vue === "jour"
      ? date.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : vue === "semaine"
        ? `${joursSemaine[0].toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
          })} – ${joursSemaine[6].toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`
        : vue === "mois"
          ? date.toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })
          : String(date.getFullYear());

  // Naviguer vers la période précédente ou suivante.
  function naviguer(sens: -1 | 1) {
    setDate((ancienneDate) => {
      const nouvelleDate = new Date(ancienneDate);

      if (vue === "jour") {
        nouvelleDate.setDate(nouvelleDate.getDate() + sens);
      } else if (vue === "semaine") {
        nouvelleDate.setDate(nouvelleDate.getDate() + sens * 7);
      } else if (vue === "mois") {
        nouvelleDate.setDate(1);
        nouvelleDate.setMonth(nouvelleDate.getMonth() + sens);
      } else {
        nouvelleDate.setFullYear(
          nouvelleDate.getFullYear() + sens
        );
      }

      return nouvelleDate;
    });
  }

  // Choisir la couleur selon le statut.
  function obtenirCouleur(statut: Reservation["statut"]) {
    return statut === "Acceptée"
      ? "border-[#83AEA7] bg-[#E8F0EE] text-[#426F67]"
      : "border-amber-400 bg-amber-50 text-amber-800";
  }

  // Préparer les dates de la vue mensuelle.
  const premierJourMois = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );

  const decalageMois =
    premierJourMois.getDay() === 0
      ? 6
      : premierJourMois.getDay() - 1;

  const joursMois = Array.from(
    {
      length:
        Math.ceil(
          (
            decalageMois +
            new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              0
            ).getDate()
          ) / 7
        ) * 7,
    },
    (_, index) =>
      ajouterJours(premierJourMois, index - decalageMois)
  );

  // Afficher les douze mois de l'année.
  function afficherAnnee() {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }, (_, index) => {
          const mois = new Date(date.getFullYear(), index, 1);

          const nombreReservations = reservationsFiltrees.filter(
            (reservation) => {
              const dateReservation = new Date(
                `${reservation.date}T12:00:00`
              );

              return (
                dateReservation.getFullYear() === date.getFullYear() &&
                dateReservation.getMonth() === index
              );
            }
          ).length;

          return (
            <button
              type="button"
              key={index}
              onClick={() => {
                setDate(mois);
                setVue("mois");
              }}
              className="rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-[#83AEA7] hover:bg-[#F5F9F7]"
            >
              <p className="font-semibold capitalize text-gray-800">
                {mois.toLocaleDateString("fr-FR", {
                  month: "long",
                })}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {nombreReservations} réservation(s)
              </p>
            </button>
          );
        })}
      </div>
    );
  }

  // Afficher le calendrier mensuel.
  function afficherMois() {
    const aujourdhui = formaterDateISO(new Date());

    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <div className="grid min-w-[700px] grid-cols-7">
            {/* En-tête des jours */}
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
              (nom) => (
                <div
                  key={nom}
                  className="border-b border-r border-gray-200 bg-[#F1F5F4] px-2 py-3 text-center text-xs font-semibold uppercase text-[#527D75] last:border-r-0"
                >
                  {nom}
                </div>
              )
            )}

            {/* Cases du calendrier */}
            {joursMois.map((jour) => {
              const dateJour = formaterDateISO(jour);

              const elements = reservationsFiltrees.filter(
                (reservation) => reservation.date === dateJour
              );

              const dansMois = jour.getMonth() === date.getMonth();
              const estAujourdhui = dateJour === aujourdhui;

              return (
                <button
                  type="button"
                  key={dateJour}
                  onClick={() => {
                    setDate(jour);
                    setVue("jour");
                  }}
                  aria-label={`${jour.toLocaleDateString("fr-FR")}, ${elements.length} réservation(s)`}
                  className={`group min-h-28 border-b border-r border-gray-200 p-2 text-left transition hover:bg-[#F5F9F7] ${
                    dansMois ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between gap-1">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${
                        estAujourdhui
                          ? "bg-[#83AEA7] font-bold text-white"
                          : dansMois
                            ? "font-medium text-gray-700 group-hover:bg-[#E8F0EE]"
                            : "text-gray-400"
                      }`}
                    >
                      {jour.getDate()}
                    </span>

                    {elements.length > 0 && (
                      <span className="rounded-full bg-[#E8F0EE] px-2 py-0.5 text-xs font-medium text-[#527D75]">
                        {elements.length}
                      </span>
                    )}
                  </div>

                  {/* Afficher les deux premières réservations */}
                  <div className="space-y-1">
                    {elements.slice(0, 2).map((reservation) => {
                      const salle = salles.find(
                        (item) =>
                          String(item.id) === String(reservation.salleId)
                      );

                      return (
                        <div
                          key={reservation.id}
                          title={`${reservation.heureDebut} - ${reservation.heureFin}`}
                          className={`overflow-hidden rounded border-l-[3px] px-1.5 py-1 text-[10px] leading-4 ${obtenirCouleur(
                            reservation.statut
                          )}`}
                        >
                          <p className="truncate font-semibold">
                            {reservation.heureDebut} {salle?.nom ?? "Salle inconnue"}
                          </p>
                        </div>
                      );
                    })}

                    {elements.length > 2 && (
                      <p className="px-1 text-[10px] font-medium text-[#527D75]">
                        +{elements.length - 2} autre(s)
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1F5F4] p-3 sm:p-5">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* En-tête, navigation, recherche et filtre */}
        <CalendarHeader
          titreSemaine={titre}
          vue={vue}
          recherche={recherche}
          salleId={salleFiltre}
          salles={salles}
          onChangerVue={setVue}
          onChangerRecherche={setRecherche}
          onChangerSalle={setSalleFiltre}
          onRechercher={() => setRechercheActive(recherche)}
          onPrecedent={() => naviguer(-1)}
          onSuivant={() => naviguer(1)}
          onAujourdhui={() => setDate(new Date())}
          onReserver={() => navigate("/reservations")}
        />

        {/* Légende des statuts */}
        <div className="flex flex-wrap gap-4 px-1 text-xs text-gray-600">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            En attente
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#83AEA7]" />
            Acceptée
          </span>
        </div>

        {/* Afficher les erreurs */}
        {erreur && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {erreur}
          </p>
        )}

        {/* Afficher la vue sélectionnée */}
        {chargement ? (
          <p className="rounded-lg border border-gray-200 bg-white p-5 text-center text-sm text-gray-500">
            Chargement du calendrier...
          </p>
        ) : (
          <>
            {vue === "jour" && (
              <CalendarGrid
                jours={[date]}
                reservations={reservationsFiltrees}
                salles={salles}
                heures={heures}
                hauteurHeure={HAUTEUR_HEURE}
              />
            )}

            {vue === "semaine" && (
              <CalendarGrid
                jours={joursSemaine}
                reservations={reservationsFiltrees}
                salles={salles}
                heures={heures}
                hauteurHeure={HAUTEUR_HEURE}
              />
            )}

            {vue === "mois" && afficherMois()}

            {vue === "annee" && afficherAnnee()}

            <p className="px-1 text-xs text-gray-500">
              Les réservations refusées ou annulées ne sont pas affichées.
              La recherche porte sur le nom de la salle, l'utilisateur et le statut.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default CalendrierAdmin;
