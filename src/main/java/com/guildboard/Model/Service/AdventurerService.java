package com.guildboard.Model.Service;

import com.guildboard.Model.dto.AdventurerCreateDto;
import com.guildboard.Model.dto.AdventurerResponseDto;
import com.guildboard.Model.entity.Adventurer;
import com.guildboard.Model.exception.ResourceNotFoundException;
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
            .orElseThrow(() -> new ResourceNotFoundException("Adventurer not found"));
        return toResponseDto(adventurer);
    }

    public AdventurerResponseDto update(Long id, AdventurerCreateDto dto){
        Adventurer adventurer = adventurerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Adventurer not found"));
        adventurer.setName(dto.name());
        adventurer.setCharacterClass(dto.characterClass());
        Adventurer saved = adventurerRepository.save(adventurer);
        return toResponseDto(saved);
    }

    public void  delete(long id){
        adventurerRepository.deleteById(id);
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

    // public  List<AssignmentResponseDto> getHistory (Long id){
    //     // recuperer toute les assignement avec leur statut
    // }

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