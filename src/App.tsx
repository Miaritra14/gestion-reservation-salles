
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";

// Import des pages
import Accueil from "./pages/Accueil";
import ReservationsPage from "./pages/ReservationsPage";
import DisponibilitesPage from "./pages/DisponibilitesPage";
import SallesPage from "./pages/SallesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CalendrierAdmin from "./pages/CalendrierAdmin";
import ValidationReservations from "./pages/ValidationReservations";

// Application principale
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages accessibles sans connexion */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pages nécessitant une connexion */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

// Menu, rôles et navigation
function MainLayout() {
  const [utilisateur, setUtilisateur] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);

  const navigate = useNavigate();

  // Récupérer les informations enregistrées après la connexion
  useEffect(() => {
    const nom = localStorage.getItem("utilisateur");
    const roleEnregistre = localStorage.getItem("role");

    setUtilisateur(nom);
    setRole(roleEnregistre);
    setChargement(false);
  }, []);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("utilisateur");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setUtilisateur(null);
    setRole(null);

    navigate("/login");
  };

  // Vérifier le chargement
  if (chargement) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        Chargement...
      </div>
    );
  }

  // Vérifier la connexion
  if (!utilisateur) {
    return <Navigate to="/login" replace />;
  }

  // Définir les permissions selon le rôle
  const estAdmin = role === "admin";

  const estResponsable =
    role === "responsable" || role === "responsable salle";

  const peutValider = estAdmin || estResponsable;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* MENU LATÉRAL */}
      <aside className="fixed left-0 top-0 z-10 flex h-screen w-[220px] flex-col overflow-y-auto bg-[#83AEA7] py-5 text-white shadow-md">
        <h2 className="mb-8 px-3 text-center text-xl font-bold">
          Gestion Salles
        </h2>

        <nav className="flex flex-col gap-1 px-3">
          {/* Accueil : tous les rôles connectés */}
          <Link
            to="/"
            className="rounded-lg px-4 py-3 transition hover:bg-[#CCCCFF]/20"
          >
            Accueil
          </Link>

          {/* Gestion des salles : administrateur uniquement */}
          {estAdmin && (
            <Link
              to="/salles"
              className="rounded-lg px-4 py-3 transition hover:bg-[#CCCCFF]/20"
            >
              Gestion des salles
            </Link>
          )}

          {/* Réservations : tous les rôles connectés */}
          <Link
            to="/reservations"
            className="rounded-lg px-4 py-3 transition hover:bg-[#CCCCFF]/20"
          >
            Réserver une salle
          </Link>

          {/* Disponibilités : tous les rôles connectés */}
          <Link
            to="/disponibilites"
            className="rounded-lg px-4 py-3 transition hover:bg-[#CCCCFF]/20"
          >
            Disponibilités
          </Link>

          {/* Calendrier : administrateur et responsable */}
          {peutValider && (
            <Link
              to="/calendrier"
              className="rounded-lg px-4 py-3 transition hover:bg-[#CCCCFF]/20"
            >
              Calendrier des réservations
            </Link>
          )}

          {/* Validation : administrateur et responsable */}
          {/* {peutValider && (
            <Link
              to="/validation"
              className="rounded-lg px-4 py-3 transition hover:bg-[#CCCCFF]/20"
            >
              Validation des réservations
            </Link>
          )} */}
        </nav>

        {/* Informations sur l'utilisateur connecté */}
        <div className="mt-auto break-words px-5 pt-8">
          <div className="mb-4 rounded-lg bg-white/15 p-3">
            <p className="mb-2 text-sm">
              Connecté : <strong>{utilisateur}</strong>
            </p>

            <p className="text-sm">
              Rôle : <strong>{role}</strong>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-white px-4 py-2 font-semibold text-[#527E77] transition hover:bg-slate-100"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="ml-[220px] min-h-screen p-6">
        <Routes>
          {/* Accueil : tous les rôles connectés */}
          <Route path="/" element={<Accueil />} />

          {/* Réservations : tous les rôles connectés */}
          <Route
            path="/reservations"
            element={<ReservationsPage />}
          />

          {/* Gestion des salles : administrateur uniquement */}
          <Route
            path="/salles"
            element={
              estAdmin ? (
                <SallesPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Disponibilités : tous les rôles connectés */}
          <Route
            path="/disponibilites"
            element={<DisponibilitesPage />}
          />

          {/* Calendrier : administrateur et responsable */}
          <Route
            path="/calendrier"
            element={
              peutValider ? (
                <CalendrierAdmin />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Validation : administrateur et responsable */}
          <Route
            path="/validation"
            element={
              peutValider ? (
                <ValidationReservations />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Rediriger les pages inconnues */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
