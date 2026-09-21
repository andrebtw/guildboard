export interface AssignmentResponseDto {
  id: number;
  adventurerId: number;
  questId: number;
  assignedAt: string;
  completedAt: string | null;
}


export interface AssignmentCreateDto {
  adventurerId: number;
}