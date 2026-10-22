
import { NavLink } from "react-router-dom";

interface SidebarProps {
  utilisateur: string;
  role: string;
  onLogout: () => void;
}

function Sidebar({ utilisateur, role, onLogout }: SidebarProps) {
  const estAdmin = role === "admin";

  const estResponsable =
    role === "responsable" || role === "responsable salle";

  const peutValider = estAdmin || estResponsable;

  const liens = [
    { chemin: "/", texte: "Accueil", visible: true },
    {
      chemin: "/salles",
      texte: "Gestion des salles",
      visible: estAdmin,
    },
    {
      chemin: "/reservations",
      texte: "Réserver une salle",
      visible: true,
    },
    {
      chemin: "/disponibilites",
      texte: "Disponibilités",
      visible: true,
    },
    {
      chemin: "/calendrier",
      texte: "Calendrier des réservations",
      visible: peutValider,
    },
    {
      chemin: "/validation",
      texte: "Validation des réservations",
      visible: peutValider,
    },
  ];

  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#83AEA7] py-5 text-white shadow-md md:fixed md:left-0 md:top-0 md:h-screen md:w-[220px] md:overflow-y-auto">
      {/* Nom du projet */}
      <h2 className="mb-8 px-3 text-center text-xl font-bold">
        Gestion Salles
      </h2>

      {/* Liens du menu */}
      <nav className="flex flex-col gap-1 px-3">
        {liens
          .filter((lien) => lien.visible)
          .map((lien) => (
            <NavLink
              key={lien.chemin}
              to={lien.chemin}
              end={lien.chemin === "/"}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-white/20 font-bold text-black"
                    : "text-white hover:bg-[#83AEA7]/20"
                }`
              }
            >
              {lien.texte}
            </NavLink>
          ))}
      </nav>

      {/* Informations utilisateur et déconnexion */}
      <div className="mt-6 break-words px-5 md:mt-auto md:pt-8">
        <div className="mb-4 rounded-lg bg-white/15 p-3">
          <p className="mb-2 text-sm">
            Connecté : <strong>{utilisateur}</strong>
          </p>

          <p className="text-sm">
            Rôle : <strong>{role}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-lg bg-white px-4 py-2 font-semibold text-[#527E77] transition hover:bg-slate-100"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
