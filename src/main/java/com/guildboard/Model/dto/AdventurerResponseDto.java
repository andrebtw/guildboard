package com.guildboard.Model.dto;

import com.guildboard.Model.entity.CharacterClass;

public record AdventurerResponseDto(
    Long id,
    String name,
    CharacterClass characterClass,
    int level,
    int xp,
    int gold
) {}