package com.guildboard.Model.Service;

import com.guildboard.Model.dto.AssignmentCreateDto;
import com.guildboard.Model.dto.AssignmentResponseDto;
import com.guildboard.Model.dto.QuestResponseDto;
import com.guildboard.Model.entity.Adventurer;
import com.guildboard.Model.entity.Assignment;
import com.guildboard.Model.entity.Quest;
import com.guildboard.Model.entity.QuestStatus;
import com.guildboard.Model.repository.AdventurerRepository;
import com.guildboard.Model.repository.AssignmentRepository;
import com.guildboard.Model.repository.QuestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AdventurerRepository adventurerRepository;
    private final QuestRepository questRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                              AdventurerRepository adventurerRepository,
                              QuestRepository questRepository) {
        this.assignmentRepository = assignmentRepository;
        this.adventurerRepository = adventurerRepository;
        this.questRepository = questRepository;
    }

    public AssignmentResponseDto assign(Long questId, AssignmentCreateDto dto) {

        Quest quest = questRepository.findById(questId)
            .orElseThrow(() -> new RuntimeException("Quest not found"));

        Adventurer adventurer = adventurerRepository.findById(dto.adventurerId())
            .orElseThrow(() -> new RuntimeException("Adventurer not found"));

        // RG1 
        if (adventurer.getLevel() < quest.getRequiredLevel()) {
            throw new RuntimeException(
                adventurer.getName() + " (niveau " + adventurer.getLevel() +
                ") ne peut pas prendre une quête de niveau " + quest.getRequiredLevel()
            );
        }

        // RG2 
        if (quest.getStatus() != QuestStatus.AVAILABLE) {
            throw new RuntimeException("Cette quête n'est plus disponible.");
        }

        boolean hasOngoingQuest = assignmentRepository.findByAdventurerId(adventurer.getId())
            .stream()
            .anyMatch(a -> a.getCompletedAt() == null);

        if (hasOngoingQuest) {
            throw new RuntimeException(adventurer.getName() + " a déjà une quête en cours.");
        }

        quest.setStatus(QuestStatus.IN_PROGRESS);
        questRepository.save(quest);

        Assignment assignment = new Assignment(adventurer, quest, LocalDateTime.now());
        Assignment saved = assignmentRepository.save(assignment);

        return toResponseDto(saved);
    }

    public QuestResponseDto complete(Long questId) {

        Quest quest = questRepository.findById(questId)
            .orElseThrow(() -> new RuntimeException("Quest not found"));

        Assignment assignment = assignmentRepository.findByQuestId(questId)
            .orElseThrow(() -> new RuntimeException("No assignment found for this quest"));

        Adventurer adventurer = assignment.getAdventurer();

        
        adventurer.setGold(adventurer.getGold() + quest.getGoldReward());
        adventurer.setXp(adventurer.getXp() + quest.getxpReward());

        
        while (adventurer.getXp() >= adventurer.getLevel() * 100) {
            adventurer.setXp(adventurer.getXp() - adventurer.getLevel() * 100);
            adventurer.setLevel(adventurer.getLevel() + 1);
        }

        
        quest.setStatus(QuestStatus.COMPLETED);
        assignment.setCompletedAt(LocalDateTime.now());

        adventurerRepository.save(adventurer);
        questRepository.save(quest);
        assignmentRepository.save(assignment);

        return toQuestResponseDto(quest);
    }

    private QuestResponseDto toQuestResponseDto(Quest quest) {
        return new QuestResponseDto(
            quest.getId(),
            quest.getTitle(),
            quest.getDescription(),
            quest.getDifficulty(),
            quest.getRequiredLevel(),
            quest.getGoldReward(),
            quest.getxpReward(),
            quest.getStatus()
        );
    }

    private AssignmentResponseDto toResponseDto(Assignment assignment) {
        return new AssignmentResponseDto(
            assignment.getId(),
            assignment.getAdventurer().getId(),
            assignment.getQuest().getId(),
            assignment.getAssignedAt(),
            assignment.getCompletedAt()
        );
    }
}