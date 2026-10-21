
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001/salles";

//Type d'une salle
interface Salle {
  id: string | number;
  nom: string;
  capacite: number;
  emplacement: string;
  equipements: string;
  description: string;
}


function SallesPage() {
  // Stocker la liste des salles
  const [salles, setSalles] = useState<Salle[]>([]);

  // Stocker les informations saisies dans le formulaire
  const [nom, setNom] = useState("");
  const [capacite, setCapacite] = useState("");
  const [emplacement, setEmplacement] = useState("");
  const [equipements, setEquipements] = useState("");
  const [description, setDescription] = useState("");
  // Identifier la salle à modifier, ou null pour un nouvel ajout
  const [editingId, setEditingId] = useState<string | number | null>(null);
  // Stocker un éventuel message d'erreur
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");

  //  Charger les salles
  async function chargerSalles() {
    try {
      const reponse = await axios.get<Salle[]>(API_URL);
      setSalles(reponse.data);
    } catch {
      setErreur("Impossible de charger les salles.");
    }
  }

  useEffect(() => {
    chargerSalles();
  }, []);

  // Vider le formulaire
  function viderFormulaire() {
    setNom("");
    setCapacite("");
    setEmplacement("");
    setEquipements("");
    setDescription("");
    setEditingId(null);
  }

  //  Ajouter ou modifier une salle
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");

    const salle = {
      nom,
      capacite: Number(capacite),
      emplacement,
      equipements,
      description,
    };

    setMessage("");
    setMessage(
      editingId !== null
        ? "Salle modifiée avec succès !"
        : "Salle ajoutée avec succès !"
    );

    try {
      if (editingId !== null) {
        // Modifier une salle existante
        await axios.put(`${API_URL}/${editingId}`, salle);
      } else {
        // Ajouter une nouvelle salle
        await axios.post(API_URL, salle);
      }
      { message && <p style={{ color: "green" }}>{message}</p> }
      viderFormulaire();
      await chargerSalles();
    } catch {
      setErreur("Erreur lors de l'enregistrement de la salle.");
    }
  }

  //  Préparer la modification
  function handleEdit(salle: Salle) {
    setEditingId(salle.id);
    setNom(salle.nom);
    setCapacite(String(salle.capacite));
    setEmplacement(salle.emplacement);
    setEquipements(salle.equipements);
    setDescription(salle.description);
  }

  // Supprimer une salle
  async function handleDelete(id: string | number) {
    const confirmer = window.confirm(
      "Voulez-vous vraiment supprimer cette salle ?"
    );

    if (!confirmer) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage("Salle supprimée avec succès !");
      setErreur("");
      await chargerSalles();
    } catch {
      setErreur("Erreur lors de la suppression de la salle.");
    }
  }

  return (
  <div className="min-h-screen bg-slate-100 p-6">
    <div className="mx-auto max-w-3xl">

      <h2 className="mb-6 text-3xl font-bold text-slate-800">
        Gestion des salles
      </h2>

      {/* Formulaire */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
        <h3 className="mb-4 text-xl font-semibold text-slate-700">
          {editingId !== null ? "Modifier une salle" : "Ajouter une salle"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-1 block text-sm font-medium">Nom de la salle</label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              placeholder="Salle de réunion A"
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Capacité</label>
            <input
              type="number"
              min="1"
              value={capacite}
              onChange={(e) => setCapacite(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Emplacement</label>
            <input
              value={emplacement}
              onChange={(e) => setEmplacement(e.target.value)}
              required
              placeholder="Ex. : 1er étage"
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Équipements</label>
            <input
              value={equipements}
              onChange={(e) => setEquipements(e.target.value)}
              placeholder="Projecteur, tableau"
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Description de la salle..."
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[#83AEA7] focus:ring-2 focus:ring-[#83AEA7]/30"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#83AEA7] p-3 font-semibold text-white hover:bg-[#6F9992]"
          >
            {editingId !== null ? "Enregistrer les modifications" : "Ajouter la salle"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={viderFormulaire}
              className="w-full rounded-lg bg-slate-200 p-3 font-medium text-slate-700 hover:bg-slate-300"
            >
              Annuler la modification
            </button>
          )}
        </form>
      </div>

      {/* Erreur */}
      {erreur && (
        <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {erreur}
        </p>
      )}

      {/* Liste des salles */}
      <h3 className="mb-4 text-xl font-semibold text-slate-800">
        Liste des salles ({salles.length})
      </h3>

      {salles.length === 0 ? (
        <p className="rounded-lg bg-white p-4 text-slate-500">
          Aucune salle enregistrée.
        </p>
      ) : (
        <div className="space-y-4">
          {salles.map((salle) => (
            <div
              key={salle.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h4 className="mb-2 text-lg font-bold text-slate-800">
                {salle.nom}
              </h4>

              <p className="text-slate-600">
                Capacité : {salle.capacite} personnes
              </p>
              <p className="text-slate-600">
                Emplacement : {salle.emplacement}
              </p>
              <p className="text-slate-600">
                Équipements : {salle.equipements || "Non précisés"}
              </p>
              <p className="mb-4 text-slate-600">
                Description : {salle.description || "Aucune description"}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleEdit(salle)}
                  className="rounded-lg bg-[#83AEA7] px-4 py-2 text-white hover:bg-[#6F9992]"
                >
                  Modifier
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(salle.id)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  </div>
);
}
export default SallesPage;
