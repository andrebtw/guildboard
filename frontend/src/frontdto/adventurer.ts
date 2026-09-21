export type CharacterClass = "WARRIOR" | "MAGE" | "RANGER" | "CLERIC";

export interface AdventurerResponseDto {
  id: number;
  name: string;
  characterClass: CharacterClass;
  level: number;
  gold: number;
  xp: number;
}

export interface AdventurerCreateDto {
  name: string;
  characterClass: CharacterClass;
}