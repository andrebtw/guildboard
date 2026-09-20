package com.guildboard.Model.dto;

import com.guildboard.Model.entity.CharacterClass;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdventurerCreateDto(

    @NotBlank
    @Size(min = 2, max = 50)
    String name,

    @NotNull
    CharacterClass characterClass

) {}