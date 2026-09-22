import type { CharacterClass } from "../frontdto/adventurer";
import type { Difficulty } from "../frontdto/quest";

export const CHARACTER_CLASSES: CharacterClass[] = ["WARRIOR", "MAGE", "RANGER", "CLERIC"];

export const CLASS_LABELS: Record<CharacterClass, string> = {
  WARRIOR: "Guerrier",
  MAGE: "Mage",
  RANGER: "Rôdeur",
  CLERIC: "Clerc",
};

export const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD", "EPIC"];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  EASY: "Facile",
  MEDIUM: "Moyenne",
  HARD: "Difficile",
  EPIC: "Épique",
};
