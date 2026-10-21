
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import fond from "../assets/fond.avif";

function RegisterPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Créer un nouveau compte utilisateur
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setMessage("");

    try {
      // Vérifier si l'email existe déjà
      const reponse = await axios.get(
        "http://localhost:3001/users",
        { params: { email } }
      );

      if (reponse.data.length > 0) {
        setMessage("Cet email est déjà utilisé.");
        return;
      }

      // Enregistrer le nouvel utilisateur
      await axios.post("http://localhost:3001/users", {
        nom,
        email,
        password,
        role: "utilisateur",
      });

      setMessage("Compte créé avec succès !");
      navigate("/login");
    } catch {
      setMessage("Erreur lors de la création du compte.");
    }
  };

return (
  <div
    className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${fond})` }}
  >
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl sm:p-10">

      {/* Titre */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Créer un compte
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Inscrivez-vous pour réserver une salle facilement.
        </p>
      </div>

      {/* Formulaire d'inscription */}
      <form onSubmit={handleRegister} className="space-y-5">

        {/* Nom */}
        <div>
          <label
            htmlFor="nom"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Nom complet
          </label>

          <input
            id="nom"
            type="text"
            placeholder="Entrez votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-slate-800"
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
            placeholder="Choisissez un mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
          />
        </div>

        {/* Message */}
        {message && (
          <p
            role="status"
            className="rounded-lg bg-slate-50 p-3 text-center text-sm text-slate-700"
          >
            {message}
          </p>
        )}

        {/* Bouton d'inscription */}
        <button
          type="submit"
          className="w-full rounded-lg bg-[#83AEA7] py-3 font-semibold text-white shadow-md transition hover:bg-[#6F9992] focus:outline-none focus:ring-2 focus:ring-[#83AEA7] focus:ring-offset-2"
        >
          S'inscrire
        </button>
      </form>

      {/* Lien vers la connexion */}
      <div className="mt-7 border-t border-slate-200 pt-6 text-center">
        <p className="text-sm text-slate-600">
          Déjà un compte ?
        </p>

        <Link
          to="/login"
          className="mt-2 inline-block font-semibold text-[#83AEA7] transition hover:hover:text-blue-800 hover:underline"
        >
          Se connecter
        </Link>
      </div>

    </div>
  </div>
);
}

export default RegisterPage;
