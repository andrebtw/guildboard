package com.guildboard.Model.dto;

import com.guildboard.Model.entity.Difficulty;
import com.guildboard.Model.entity.QuestStatus;

public record QuestResponseDto(
    Long id,
    String title,
    String description,
    Difficulty difficulty,
    int requiredLevel,
    int goldReward,
    int xpReward,
    QuestStatus status
) {}