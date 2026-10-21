
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import axios from "axios";

import type { Salle } from "../types";
import SalleForm from "../components/salles/SalleForm";
import SalleList from "../components/salles/SalleList";

// Adresse de l'API JSON Server
const API_URL = "http://localhost:3001/salles";

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

  // Stocker les messages d'erreur et de succès
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");

  // Indiquer si les salles sont en cours de chargement
  const [chargement, setChargement] = useState(true);

  // Charger les salles depuis JSON Server
  async function chargerSalles() {
    setErreur("");

    try {
      const reponse = await axios.get<Salle[]>(API_URL);
      setSalles(reponse.data);
    } catch {
      setErreur("Impossible de charger les salles.");
    } finally {
      setChargement(false);
    }
  }

  // Charger les salles au premier affichage de la page
  useEffect(() => {
    chargerSalles();
  }, []);

  // Vider le formulaire et quitter le mode modification
  function viderFormulaire() {
    setNom("");
    setCapacite("");
    setEmplacement("");
    setEquipements("");
    setDescription("");
    setEditingId(null);
  }

  // Ajouter ou modifier une salle
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErreur("");
    setMessage("");

    // Vérifier que la capacité est un nombre entier positif
    const capaciteNombre = Number(capacite);

    if (!Number.isInteger(capaciteNombre) || capaciteNombre < 1) {
      setErreur("La capacité doit être un nombre entier supérieur à 0.");
      return;
    }

    // Préparer les données de la salle
    const salle = {
      nom: nom.trim(),
      capacite: capaciteNombre,
      emplacement: emplacement.trim(),
      equipements: equipements.trim(),
      description: description.trim(),
    };

    // Vérifier que les champs obligatoires ne sont pas vides
    if (!salle.nom || !salle.emplacement) {
      setErreur("Le nom et l'emplacement sont obligatoires.");
      return;
    }

    try {
      if (editingId !== null) {
        // Modifier une salle existante
        await axios.put(`${API_URL}/${editingId}`, salle);
        setMessage("Salle modifiée avec succès !");
      } else {
        // Ajouter une nouvelle salle
        await axios.post(API_URL, salle);
        setMessage("Salle ajoutée avec succès !");
      }

      // Vider le formulaire après la réussite de l'opération
      viderFormulaire();

      // Actualiser la liste des salles
      await chargerSalles();
    } catch {
      setErreur("Erreur lors de l'enregistrement de la salle.");
    }
  }

  // Préparer le formulaire pour modifier une salle
  function handleEdit(salle: Salle) {
    setEditingId(salle.id);
    setNom(salle.nom);
    setCapacite(String(salle.capacite));
    setEmplacement(salle.emplacement);

    // Convertir les équipements en texte pour le champ du formulaire
    setEquipements(
      Array.isArray(salle.equipements)
        ? salle.equipements.join(", ")
        : salle.equipements
    );

    setDescription(salle.description);
    setErreur("");
    setMessage("");
  }

  // Supprimer une salle après confirmation
  async function handleDelete(id: string | number) {
    const confirmer = window.confirm(
      "Voulez-vous vraiment supprimer cette salle ?"
    );

    if (!confirmer) return;

    setErreur("");
    setMessage("");

    try {
      await axios.delete(`${API_URL}/${id}`);

      // Quitter le mode modification si la salle supprimée était sélectionnée
      if (editingId === id) {
        viderFormulaire();
      }

      setMessage("Salle supprimée avec succès !");

      // Actualiser la liste après la suppression
      await chargerSalles();
    } catch {
      setErreur("Erreur lors de la suppression de la salle.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl">
        {/* Titre principal de la page */}
        <h2 className="mb-6 text-3xl font-bold text-slate-800">
          Gestion des salles
        </h2>

        {/* Afficher le formulaire d'ajout ou de modification */}
        <SalleForm
          salleEnCours={
            editingId === null
              ? null
              : salles.find((salle) => salle.id === editingId) ?? null
          }
          onSubmit={handleSubmit}
          onAnnuler={viderFormulaire}
          nom={nom}
          setNom={setNom}
          capacite={capacite}
          setCapacite={setCapacite}
          emplacement={emplacement}
          setEmplacement={setEmplacement}
          equipements={equipements}
          setEquipements={setEquipements}
          description={description}
          setDescription={setDescription}
        />

        {/* Afficher les messages de succès et d'erreur */}
        {erreur && (
          <p role="alert" className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {erreur}
          </p>
        )}

        {message && (
          <p role="status" className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
            {message}
          </p>
        )}

        {/* Afficher la liste des salles */}
        {chargement ? (
          <p className="rounded-lg bg-white p-4 text-slate-500">
            Chargement des salles...
          </p>
        ) : (
          <SalleList
            salles={salles}
            onModifier={handleEdit}
            onSupprimer={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default SallesPage;
