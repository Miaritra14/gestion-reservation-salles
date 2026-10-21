
import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import Sidebar from "./Sidebar";

function MainLayout() {
  const [utilisateur, setUtilisateur] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);

  const navigate = useNavigate();

  // Récupérer les informations de connexion
  useEffect(() => {
    setUtilisateur(localStorage.getItem("utilisateur"));
    setRole(localStorage.getItem("role"));
    setChargement(false);
  }, []);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("utilisateur");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setUtilisateur(null);
    setRole(null);

    navigate("/login", { replace: true });
  };

  if (chargement) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        Chargement...
      </div>
    );
  }

  // Vérifier que l'utilisateur est connecté
  if (!utilisateur || !role) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        utilisateur={utilisateur}
        role={role}
        onLogout={handleLogout}
      />

      {/* Contenu de la page */}
      <main className="min-h-screen p-4 md:ml-[220px] md:p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
