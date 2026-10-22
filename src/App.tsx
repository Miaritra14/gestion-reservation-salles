import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Accueil from "./pages/Accueil";
import ReservationsPage from "./pages/ReservationsPage";
import DisponibilitesPage from "./pages/DisponibilitesPage";
import SallesPage from "./pages/SallesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CalendrierAdmin from "./pages/CalendrierAdmin";
import ValidationReservations from "./pages/ValidationReservations";

import MainLayout from "./components/layout/MainLayout";
import RoleRoute from "./components/auth/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pages nécessitant une connexion */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Accueil />} />

          <Route
            path="/reservations"
            element={<ReservationsPage />}
          />

          <Route
            path="/disponibilites"
            element={<DisponibilitesPage />}
          />

          {/* Administrateur uniquement */}
          <Route
            path="/salles"
            element={
              <RoleRoute rolesAutorises={["admin"]}>
                <SallesPage />
              </RoleRoute>
            }
          />

          {/* Administrateur et responsable */}
          <Route
            path="/calendrier"
            element={
              <RoleRoute
                rolesAutorises={[
                  "admin",
                  "responsable",
                  "responsable salle",
                ]}
              >
                <CalendrierAdmin />
              </RoleRoute>
            }
          />

          <Route
            path="/validation"
            element={
              <RoleRoute
                rolesAutorises={[
                  "admin",
                  "responsable",
                  "responsable salle",
                ]}
              >
                <ValidationReservations />
              </RoleRoute>
            }
          />

          {/* URL inconnue */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
