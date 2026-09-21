export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "EPIC";

export type QuestStatus = "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";


export interface QuestResponseDto {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  requiredLevel: number;
  goldReward: number;
  xpReward: number;
  status: QuestStatus;
}

export interface QuestCreateDto {
  title: string;
  description: string;
  difficulty: Difficulty;
  requiredLevel: number;
  goldReward: number;
  xpReward: number;
}