package com.guildboard.Model.Service;

import com.guildboard.Model.dto.AdventurerCreateDto;
import com.guildboard.Model.dto.AdventurerResponseDto;
import com.guildboard.Model.dto.AssignmentResponseDto;
import com.guildboard.Model.entity.Adventurer;
import com.guildboard.Model.entity.Assignment;
import com.guildboard.Model.exception.ResourceNotFoundException;
import com.guildboard.Model.repository.AdventurerRepository;
import com.guildboard.Model.repository.AssignmentRepository;


import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdventurerService {

    private final AdventurerRepository adventurerRepository;
    private final AssignmentRepository assignmentRepository ;

    public AdventurerService(AdventurerRepository adventurerRepository, AssignmentRepository assignmentRepository) {
        this.adventurerRepository = adventurerRepository;
        this.assignmentRepository = assignmentRepository;
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

    public List<AssignmentResponseDto> getHistory(Long id) {
        Adventurer adventurer = adventurerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Adventurer not found"));

        return assignmentRepository.findByAdventurerId(adventurer.getId())
            .stream()
            .map(this::toAssignmentResponseDto)
            .toList();
    }

    private AssignmentResponseDto toAssignmentResponseDto(Assignment assignment) {
        return new AssignmentResponseDto(
            assignment.getId(),
            assignment.getAdventurer().getId(),
            assignment.getQuest().getId(),
            assignment.getAssignedAt(),
            assignment.getCompletedAt()
        );
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