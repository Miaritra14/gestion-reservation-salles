// Importer le type ReactNode pour accepter du contenu React
import type { ReactNode } from "react";

// Importer Navigate pour rediriger l'utilisateur
import { Navigate } from "react-router-dom";

// Définir les informations nécessaires pour protéger une page
interface RoleRouteProps {
  rolesAutorises: string[]; // Liste des rôles qui peuvent accéder à la page
  children: ReactNode; // Contenu de la page à afficher
}

function RoleRoute({
  rolesAutorises,
  children,
}: RoleRouteProps) {
  // Récupérer le rôle de l'utilisateur connecté depuis localStorage
  const role = localStorage.getItem("role");

  // Vérifier si l'utilisateur est connecté et si son rôle est autorisé
  if (!role || !rolesAutorises.includes(role)) {
    // Si le rôle n'est pas autorisé, rediriger vers la page d'accueil
    return <Navigate to="/" replace />;
  }

  // Si le rôle est autorisé, afficher la page demandée
  return <>{children}</>;
}

// Exporter le composant pour pouvoir l'utiliser dans App.tsx
export default RoleRoute;
