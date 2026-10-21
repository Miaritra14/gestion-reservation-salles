import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import fond from "../assets/fond.avif";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Vérifier les identifiants
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const user = await login(email, password);

      if (user) {
        // Enregistrer les informations de connexion
        localStorage.setItem("utilisateur", user.nom);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role);

        // Vérifier le rôle avant de rediriger
        if (
          user.role === "admin" ||
          user.role === "responsable" ||
          user.role === "responsable salle" ||
          user.role === "utilisateur"
        ) {
          navigate("/");
        } else {
          localStorage.removeItem("utilisateur");
          localStorage.removeItem("email");
          localStorage.removeItem("role");
          setMessage("Rôle non reconnu.");
        }
      } else {
        setMessage("Email ou mot de passe incorrect.");
      }
    } catch {
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${fond})` }}>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl sm:p-10">

        {/* Logo et titre */}
        <div className="mb-8 text-center">


          <h1 className="text-3xl font-bold text-slate-800">
            Bienvenue !
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Connectez-vous à votre espace de réservation.
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Adresse email
            </label>

            <input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
            />
          </div>

          {/* Message d'erreur */}
          {message && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {message}
            </p>
          )}

          {/* Bouton */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#83AEA7] py-3 font-semibold text-white shadow-md transition hover:bg-[#CCCCFF] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Se connecter
          </button>
        </form>

        {/* Inscription */}
        <div className="mt-7 border-t border-slate-200 pt-6 text-center">
          <p className="text-sm text-slate-600">
            Pas encore de compte ?
          </p>

          <Link
            to="/register"
            className="mt-2 inline-block font-semibold text-[#83AEA7]  transition hover:text-blue-800 hover:underline"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;