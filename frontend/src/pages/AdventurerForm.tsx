import { useId, useState } from "react";
import type { FormEvent } from "react";
import type { ApiError } from "../frontdto/ApiError";
import type { CharacterClass } from "../frontdto/adventurer";
import ErrorMessage from "../component/ErrorMessage";
import adventurerService from "../services/adventurerService";
import { toApiError } from "./apiError";
import { CHARACTER_CLASSES, CLASS_LABELS } from "./labels";
import "../component/Button.css";
import "./Form.css";

type AdventurerFormProps = {
  // Appelée après une création réussie (la page parente recharge la liste et ferme le formulaire)
  onCreated: () => void;
  // Appelée quand l'utilisateur clique sur "Annuler"
  onCancel: () => void;
};

function AdventurerForm({ onCreated, onCancel }: AdventurerFormProps) {
  // Identifiant unique pour relier chaque <label> à son champ (htmlFor / id)
  const formId = useId();

  // Valeur saisie dans le champ "nom" (un champ contrôlé : React est la source de vérité)
  const [name, setName] = useState("");
  // Classe choisie dans le select
  const [characterClass, setCharacterClass] = useState<CharacterClass>("WARRIOR");
  // Message d'erreur de validation côté client pour le champ nom (null = pas d'erreur)
  const [nameError, setNameError] = useState<string | null>(null);
  // true pendant l'appel POST, pour empêcher un double envoi
  const [submitting, setSubmitting] = useState(false);
  // Erreur renvoyée par l'API (ex: 400 VALIDATION_ERROR), affichée avec ErrorMessage
  const [apiError, setApiError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Empêche le rechargement de la page, comportement par défaut d'un <form> HTML
    event.preventDefault();
    if (submitting) {
      return;
    }

    // Validation basique côté client : mêmes règles que le backend (2 à 50 caractères)
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 50) {
      setNameError("Le nom doit contenir entre 2 et 50 caractères.");
      return;
    }
    setNameError(null);
    setApiError(null);
    setSubmitting(true);

    try {
      await adventurerService.create({ name: trimmed, characterClass });
      onCreated();
    } catch (error) {
      setApiError(toApiError(error));
      setSubmitting(false);
    }
  }

  return (
    // noValidate : on affiche nos propres messages plutôt que les bulles du navigateur
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor={`${formId}-name`}>Nom</label>
        <input
          id={`${formId}-name`}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={nameError !== null}
          aria-describedby={nameError ? `${formId}-name-error` : undefined}
        />
        {nameError && (
          <p id={`${formId}-name-error`} className="form-error" role="alert">
            {nameError}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor={`${formId}-class`}>Classe</label>
        <select
          id={`${formId}-class`}
          value={characterClass}
          onChange={(event) => {
            // find() renvoie la valeur typée CharacterClass (ou undefined) sans avoir besoin d'un cast
            const selected = CHARACTER_CLASSES.find((c) => c === event.target.value);
            if (selected) {
              setCharacterClass(selected);
            }
          }}
        >
          {CHARACTER_CLASSES.map((c) => (
            <option key={c} value={c}>
              {CLASS_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      {apiError && <ErrorMessage error={apiError} />}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitting ? "Ajout..." : "Ajouter"}
        </button>
        <button type="button" className="btn btn-neutral" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}

export default AdventurerForm;
