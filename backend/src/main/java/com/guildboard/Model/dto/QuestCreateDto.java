package com.guildboard.Model.dto;

import com.guildboard.Model.entity.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record QuestCreateDto(

    @NotBlank
    @Size(min = 5, max = 100)
    String title,

    @NotBlank
    @Size(min = 10, max = 500)
    String description,

    @NotNull
    Difficulty difficulty,

    @NotNull
    int requiredLevel,

    @NotNull
    int goldReward,

    @Positive
    int xpReward

) {}