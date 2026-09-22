import type { Difficulty } from "../frontdto/quest";
import "./DifficultyBadge.css";

type DifficultyBadgeProps = {
  // Difficulté de la quête : détermine le texte et la couleur du badge
  difficulty: Difficulty;
};

function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const labels = {
    EASY: "facile",
    MEDIUM: "moyenne",
    HARD: "difficile",
    EPIC: "épique",
  };

  return (
    <span className={`difficulty-badge difficulty-${difficulty.toLowerCase()}`}>
      {labels[difficulty]}
    </span>
  );
}

export default DifficultyBadge;
