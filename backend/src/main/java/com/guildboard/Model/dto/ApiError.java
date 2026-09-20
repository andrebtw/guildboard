package com.guildboard.Model.dto;

public record ApiError(
    int status,
    String code,
    String message
) {}