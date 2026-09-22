import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ApiError } from "../frontdto/ApiError";
import type { AdventurerResponseDto } from "../frontdto/adventurer";
import Avatar from "../component/Avatar";
import Button from "../component/Button";
import EmptyState from "../component/EmptyState";
import ErrorMessage from "../component/ErrorMessage";
import IconButton from "../component/IconButton";
import adventurerService from "../services/adventurerService";
import { toApiError } from "./apiError";
import AdventurerForm from "./AdventurerForm";
import { CLASS_LABELS } from "./labels";
import "./AdventurersPage.css";

function AdventurersPage() {
  // Aventuriers affichés (résultat de adventurerService.getAll)
  const [adventurers, setAdventurers] = useState<AdventurerResponseDto[]>([]);
  // true tant que la liste est en cours de chargement
  const [loading, setLoading] = useState(true);
  // Erreur de chargement de la liste (remplace la liste à l'écran)
  const [error, setError] = useState<ApiError | null>(null);
  // Erreur d'une suppression ; la liste reste affichée
  const [deleteError, setDeleteError] = useState<ApiError | null>(null);
  // Affiche ou masque le formulaire de création
  const [showForm, setShowForm] = useState(false);
  // Compteur qu'on incrémente pour forcer le useEffect à recharger la liste après une modification
  const [reloadKey, setReloadKey] = useState(0);

  // Charge la liste : au premier affichage, puis à chaque incrément de reloadKey (après création ou suppression)
  useEffect(() => {
    // Passe à true au démontage : une réponse tardive ne doit plus écrire dans le state
    let cancelled = false;

    async function loadAdventurers() {
      setLoading(true);
      setError(null);
      try {
        const data = await adventurerService.getAll();
        if (!cancelled) {
          setAdventurers(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(toApiError(e));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadAdventurers();
    // Fonction de nettoyage : React l'appelle avant de relancer l'effet ou au démontage
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  async function handleDelete(adventurer: AdventurerResponseDto) {
    // Suppression définitive : on demande confirmation
    if (!window.confirm(`Supprimer ${adventurer.name} ?`)) {
      return;
    }
    setDeleteError(null);
    try {
      await adventurerService.remove(adventurer.id);
      setReloadKey((key) => key + 1);
    } catch (e) {
      setDeleteError(toApiError(e));
    }
  }

  function handleCreated() {
    setShowForm(false);
    setReloadKey((key) => key + 1);
  }

  function renderList() {
    if (loading) {
      return <p role="status">Chargement des aventuriers...</p>;
    }
    if (error) {
      return <ErrorMessage error={error} />;
    }
    if (adventurers.length === 0) {
      return <EmptyState message="Aucun aventurier pour le moment." />;
    }

    return (
      <ul className="adventurer-list">
        {adventurers.map((adventurer) => (
          <li key={adventurer.id} className="adventurer-row">
            {/* Le lien couvre la ligne ; le bouton de suppression reste à côté (pas de bouton dans un lien) */}
            <Link className="adventurer-link" to={`/adventurers/${adventurer.id}`}>
              <Avatar name={adventurer.name} />
              <span className="adventurer-name">{adventurer.name}</span>
              <span>{CLASS_LABELS[adventurer.characterClass]}</span>
              <span className="adventurer-level">Niveau {adventurer.level}</span>
            </Link>
            <span className="adventurer-row-delete">
              <IconButton
                icon="×"
                label={`Supprimer ${adventurer.name}`}
                onClick={() => void handleDelete(adventurer)}
              />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Aventuriers</h1>
        <Button
          label={showForm ? "Fermer" : "+ Ajouter"}
          color="primary"
          onClick={() => setShowForm((visible) => !visible)}
        />
      </header>

      {showForm && <AdventurerForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />}

      {deleteError && <ErrorMessage error={deleteError} />}

      {renderList()}
    </div>
  );
}

export default AdventurersPage;
