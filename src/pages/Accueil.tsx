import { Link } from "react-router-dom";

function Accueil() {
  // Récupérer le nom et le rôle de l'utilisateur connecté
  const utilisateur = localStorage.getItem("utilisateur") || "Utilisateur";
  const role = localStorage.getItem("role") || "";

  // Préparer les liens selon le rôle
  const liens =
    role === "admin"
      ? [
          {
            titre: "Gérer les salles",
            description: "Ajouter, modifier et supprimer les salles.",
            lien: "/salles",
          },
          {
            titre: "Valider les réservations",
            description: "Consulter et traiter les demandes.",
            lien: "/validation",
          },
          {
            titre: "Calendrier",
            description: "Visualiser les réservations par jour et par heure.",
            lien: "/calendrier",
          },
        ]
      : role === "responsable" || role === "responsable salle"
      ? [
          {
            titre: "Valider les réservations",
            description: "Accepter ou refuser les demandes.",
            lien: "/validation",
          },
          {
            titre: "Calendrier",
            description: "Consulter les créneaux réservés.",
            lien: "/calendrier",
          },
        ]
      : [
          {
            titre: "Disponibilités",
            description: "Trouver une salle libre selon la date et l'heure.",
            lien: "/disponibilites",
          },
          {
            titre: "Mes réservations",
            description: "Réserver une salle et suivre mes demandes.",
            lien: "/reservations",
          },
        ];

  // Afficher le nom du rôle
  const nomRole =
    role === "admin"
      ? "Administrateur"
      : role === "responsable" || role === "responsable salle"
      ? "Responsable"
      : "Utilisateur";

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* En-tête de bienvenue */}
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-block rounded-full bg-[#83AEA7]/20 px-3 py-1 text-sm font-medium text-[#426F67]">
            Espace {nomRole}
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">
            Bienvenue, {utilisateur} !
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Bienvenue sur votre espace de gestion de réservation de salles.
            Retrouvez rapidement les fonctionnalités dont vous avez besoin.
          </p>
        </section>

        {/* Accès aux fonctionnalités */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">
              Que souhaitez-vous faire ?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choisissez une fonctionnalité pour continuer.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {liens.map((item) => (
              <Link
                key={item.lien}
                to={item.lien}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#83AEA7] hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-[#426F67]">
                  {item.titre}
                </h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#426F67]">
                  Accéder
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Petit rappel */}
        <section className="rounded-2xl border border-[#83AEA7]/40 bg-[#83AEA7]/10 p-5">
          <h2 className="font-semibold text-slate-800">
            À propos de votre espace
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Les fonctionnalités affichées dépendent de votre rôle dans
            l'application. Si vous avez besoin d'une autre fonctionnalité,
            contactez l'administrateur.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Accueil;