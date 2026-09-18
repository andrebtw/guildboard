package com.guildboard.Model.dto;

import java.time.LocalDateTime;

public record AssignmentResponseDto(
    Long id,
    Long adventurerId,
    Long questId,
    LocalDateTime assignedAt,
    LocalDateTime completedAt
) {}