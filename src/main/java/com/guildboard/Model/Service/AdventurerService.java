package com.guildboard.Model.Service;

import com.guildboard.Model.dto.AdventurerCreateDto;
import com.guildboard.Model.dto.AdventurerResponseDto;
import com.guildboard.Model.entity.Adventurer;
import com.guildboard.Model.repository.AdventurerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdventurerService {

    private final AdventurerRepository adventurerRepository;

    public AdventurerService(AdventurerRepository adventurerRepository) {
        this.adventurerRepository = adventurerRepository;
    }

    public List<AdventurerResponseDto> getAll() {
        return adventurerRepository.findAll()
            .stream()
            .map(this::toResponseDto)
            .toList();
    }

    public AdventurerResponseDto getById(Long id) {
        Adventurer adventurer = adventurerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Adventurer not found"));
        return toResponseDto(adventurer);
    }

    public AdventurerResponseDto create(AdventurerCreateDto dto) {
        Adventurer adventurer = new Adventurer(
            dto.name(),
            dto.characterClass(),
            1,
            0,
            0
        );
        Adventurer saved = adventurerRepository.save(adventurer);
        return toResponseDto(saved);
    }

    private AdventurerResponseDto toResponseDto(Adventurer adventurer) {
        return new AdventurerResponseDto(
            adventurer.getId(),
            adventurer.getName(),
            adventurer.getCharacterClass(),
            adventurer.getLevel(),
            adventurer.getXp(),
            adventurer.getGold()
        );
    }
}