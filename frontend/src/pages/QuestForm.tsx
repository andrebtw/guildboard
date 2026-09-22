import { useId, useState } from "react";
import type { FormEvent } from "react";
import type { ApiError } from "../frontdto/ApiError";
import type { Difficulty } from "../frontdto/quest";
import ErrorMessage from "../component/ErrorMessage";
import questService from "../services/questService";
import { toApiError } from "./apiError";
import { DIFFICULTIES, DIFFICULTY_LABELS } from "./labels";
import "../component/Button.css";
import "./Form.css";

type QuestFormProps = {
  // Appelée après une création réussie (la page parente recharge la liste et ferme le formulaire)
  onCreated: () => void;
  // Appelée quand l'utilisateur clique sur "Annuler"
  onCancel: () => void;
};

type FieldName = "title" | "description" | "requiredLevel" | "goldReward" | "xpReward";
type FieldErrors = Partial<Record<FieldName, string>>;

// Convertit un texte saisi en entier ; renvoie null si le champ est vide ou n'est pas un entier
function parseInteger(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}

function QuestForm({ onCreated, onCancel }: QuestFormProps) {
  // Identifiant unique pour relier chaque <label> à son champ (htmlFor / id)
  const formId = useId();

  // Un useState par champ : chaque saisie met à jour la valeur, donc l'affichage (champs contrôlés)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  // Les <input type="number"> fournissent du texte : on garde des strings et on convertit à l'envoi
  const [requiredLevel, setRequiredLevel] = useState("1");
  const [goldReward, setGoldReward] = useState("0");
  const [xpReward, setXpReward] = useState("10");
  // Erreurs de validation côté client, une par champ fautif
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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

    // Validation basique côté client : mêmes bornes que le backend (@Size, @Positive)
    const errors: FieldErrors = {};
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const level = parseInteger(requiredLevel);
    const gold = parseInteger(goldReward);
    const xp = parseInteger(xpReward);

    if (trimmedTitle.length < 5 || trimmedTitle.length > 100) {
      errors.title = "Le titre doit contenir entre 5 et 100 caractères.";
    }
    if (trimmedDescription.length < 10 || trimmedDescription.length > 500) {
      errors.description = "La description doit contenir entre 10 et 500 caractères.";
    }
    if (level === null || level < 1) {
      errors.requiredLevel = "Le niveau requis doit être un entier supérieur ou égal à 1.";
    }
    if (gold === null || gold < 0) {
      errors.goldReward = "L'or doit être un entier supérieur ou égal à 0.";
    }
    if (xp === null || xp < 1) {
      errors.xpReward = "L'XP doit être un entier supérieur ou égal à 1.";
    }

    setFieldErrors(errors);
    setApiError(null);
    // Après ce test, TypeScript sait que level/gold/xp ne sont plus null
    if (Object.keys(errors).length > 0 || level === null || gold === null || xp === null) {
      return;
    }

    setSubmitting(true);
    try {
      await questService.create({
        title: trimmedTitle,
        description: trimmedDescription,
        difficulty,
        requiredLevel: level,
        goldReward: gold,
        xpReward: xp,
      });
      onCreated();
    } catch (error) {
      setApiError(toApiError(error));
      setSubmitting(false);
    }
  }

  // Petit utilitaire pour brancher aria-invalid / aria-describedby sur un champ
  function fieldProps(field: FieldName) {
    const message = fieldErrors[field];
    return {
      id: `${formId}-${field}`,
      "aria-invalid": message !== undefined,
      "aria-describedby": message ? `${formId}-${field}-error` : undefined,
    };
  }

  function renderError(field: FieldName) {
    const message = fieldErrors[field];
    if (!message) {
      return null;
    }
    return (
      <p id={`${formId}-${field}-error`} className="form-error" role="alert">
        {message}
      </p>
    );
  }

  return (
    // noValidate : on affiche nos propres messages plutôt que les bulles du navigateur
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor={`${formId}-title`}>Titre</label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          {...fieldProps("title")}
        />
        {renderError("title")}
      </div>

      <div className="form-field">
        <label htmlFor={`${formId}-description`}>Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          {...fieldProps("description")}
        />
        {renderError("description")}
      </div>

      <div className="form-field">
        <label htmlFor={`${formId}-difficulty`}>Difficulté</label>
        <select
          id={`${formId}-difficulty`}
          value={difficulty}
          onChange={(event) => {
            // find() renvoie la valeur typée Difficulty (ou undefined) sans avoir besoin d'un cast
            const selected = DIFFICULTIES.find((d) => d === event.target.value);
            if (selected) {
              setDifficulty(selected);
            }
          }}
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_LABELS[d]}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor={`${formId}-requiredLevel`}>Niveau requis</label>
          <input
            type="number"
            value={requiredLevel}
            onChange={(event) => setRequiredLevel(event.target.value)}
            {...fieldProps("requiredLevel")}
          />
          {renderError("requiredLevel")}
        </div>
        <div className="form-field">
          <label htmlFor={`${formId}-goldReward`}>Or</label>
          <input
            type="number"
            value={goldReward}
            onChange={(event) => setGoldReward(event.target.value)}
            {...fieldProps("goldReward")}
          />
          {renderError("goldReward")}
        </div>
        <div className="form-field">
          <label htmlFor={`${formId}-xpReward`}>XP</label>
          <input
            type="number"
            value={xpReward}
            onChange={(event) => setXpReward(event.target.value)}
            {...fieldProps("xpReward")}
          />
          {renderError("xpReward")}
        </div>
      </div>

      {apiError && <ErrorMessage error={apiError} />}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitting ? "Création..." : "Créer la quête"}
        </button>
        <button type="button" className="btn btn-neutral" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}

export default QuestForm;
