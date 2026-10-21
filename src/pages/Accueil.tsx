import { Link } from "react-router-dom";

function Accueil() {
  const utilisateur = localStorage.getItem("utilisateur") || "";
  const role = localStorage.getItem("role") || "";

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-md">

        <h1 className="mb-2 text-3xl font-bold text-slate-800">
          Bienvenue {utilisateur} !
        </h1>

        <p className="mb-6 text-slate-500">
          Gestion de réservation de salles
        </p>

        {role === "utilisateur" && (
          <>
            <h2 className="mb-4 text-xl font-semibold text-slate-700">
              Mon espace utilisateur
            </h2>

            <div className="space-y-3">
              <Link className="block rounded-lg bg-[#83AEA7] p-3 text-center text-white hover:bg-[#6F9992]" to="/disponibilites">
                Voir les disponibilités
              </Link>

              <Link className="block rounded-lg bg-[#83AEA7] p-3 text-center text-white hover:bg-[#6F9992]" to="/reservations">
                Réserver une salle et voir mes demandes
              </Link>
            </div>
          </>
        )}

        {(role === "responsable" || role === "responsable salle") && (
          <>
            <h2 className="mb-4 text-xl font-semibold text-slate-700">
              Mon espace responsable
            </h2>

            <div className="space-y-3">
              <Link className="block rounded-lg bg-[#83AEA7] p-3 text-center text-white hover:bg-[#6F9992]" to="/validation">
                Valider les réservations
              </Link>

              <Link className="block rounded-lg bg-[#83AEA7] p-3 text-center text-white hover:bg-[#6F9992]" to="/calendrier">
                Voir le calendrier
              </Link>
            </div>
          </>
        )}

        {role === "admin" && (
          <>
            <h2 className="mb-4 text-xl font-semibold text-slate-700">
              Mon espace administrateur
            </h2>

            <div className="space-y-3">
              <Link className="block rounded-lg bg-[#83AEA7] p-3 text-center text-white hover:bg-[#6F9992]" to="/salles">
                Gérer les salles
              </Link>

              <Link className="block rounded-lg bg-[#83AEA7] p-3 text-center text-white hover:bg-[#6F9992]" to="/validation">
                Gérer les réservations
              </Link>

              <Link className="block rounded-lg bg-[#83AEA7] p-3 text-center text-white hover:bg-[#6F9992]" to="/calendrier">
                Voir le calendrier
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Accueil;