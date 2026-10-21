
import type { ReactNode } from "react";
// Définir les propriétés du composant Button
interface ButtonProps {
  // Contenu du bouton
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  // Définir les couleurs selon le type de bouton
  const couleurs = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 transition-colors
        disabled:cursor-not-allowed disabled:opacity-50
        ${couleurs[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
