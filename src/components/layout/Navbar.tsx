
import Button from "../common/Button";

interface NavbarProps {
  utilisateur: string;
  role: string;
  onLogout: () => void;
}

function Navbar({ utilisateur, role, onLogout }: NavbarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9E3E1] bg-white px-6 py-4 shadow-sm">
      {/* Nom du projet */}
      <div>
        <h1 className="text-xl font-bold text-[#6F9992]">
          Gestion de réservation de salles
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Réservation et disponibilité des salles
        </p>
      </div>

      {/* Informations de l'utilisateur */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-slate-800">
            {utilisateur}
          </p>

          <p className="text-sm text-slate-500">
            {role}
          </p>
        </div>

        {/* Bouton de déconnexion */}
        <Button variant="danger" onClick={onLogout}>
          Déconnexion
        </Button>
      </div>
    </header>
  );
}

export default Navbar;
