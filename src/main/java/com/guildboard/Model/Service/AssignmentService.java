package com.guildboard.Model.Service;

import com.guildboard.Model.dto.AssignmentCreateDto;
import com.guildboard.Model.dto.AssignmentResponseDto;
import com.guildboard.Model.dto.QuestResponseDto;
import com.guildboard.Model.entity.Adventurer;
import com.guildboard.Model.entity.Assignment;
import com.guildboard.Model.entity.Quest;
import com.guildboard.Model.entity.QuestStatus;
import com.guildboard.Model.exception.BusinessRuleException;
import com.guildboard.Model.exception.ResourceNotFoundException;
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
            .orElseThrow(() -> new ResourceNotFoundException("Quest not found"));

        Adventurer adventurer = adventurerRepository.findById(dto.adventurerId())
            .orElseThrow(() -> new ResourceNotFoundException("Adventurer not found"));

        // RG1 : niveau requis
        if (adventurer.getLevel() < quest.getRequiredLevel()) {
            throw new BusinessRuleException("LEVEL_TOO_LOW",
                adventurer.getName() + " (niveau " + adventurer.getLevel() +
                ") ne peut pas prendre une quête de niveau " + quest.getRequiredLevel());
        }

        // RG2 : la quête doit être disponible
        if (quest.getStatus() != QuestStatus.AVAILABLE) {
            throw new BusinessRuleException("QUEST_NOT_AVAILABLE", "Cette quête n'est plus disponible.");
        }

        // RG2 : l'aventurier ne doit pas déjà avoir une quête en cours
        boolean hasOngoingQuest = assignmentRepository.findByAdventurerId(adventurer.getId())
            .stream()
            .anyMatch(a -> a.getCompletedAt() == null);

        if (hasOngoingQuest) {
            throw new BusinessRuleException("ADVENTURER_BUSY", adventurer.getName() + " a déjà une quête en cours.");
        }

        quest.setStatus(QuestStatus.IN_PROGRESS);
        questRepository.save(quest);

        Assignment assignment = new Assignment(adventurer, quest, LocalDateTime.now());
        Assignment saved = assignmentRepository.save(assignment);

        return toAssignmentResponseDto(saved);
    }

    public QuestResponseDto complete(Long questId) {

        Quest quest = questRepository.findById(questId)
            .orElseThrow(() -> new ResourceNotFoundException("Quest not found"));

        Assignment assignment = assignmentRepository.findByQuestId(questId)
            .orElseThrow(() -> new ResourceNotFoundException("No assignment found for this quest"));

        Adventurer adventurer = assignment.getAdventurer();

        // Crédit de l'or et de l'xp
        adventurer.setGold(adventurer.getGold() + quest.getGoldReward());
        adventurer.setXp(adventurer.getXp() + quest.getxpReward());

        // Montée de niveau automatique
        while (adventurer.getXp() >= adventurer.getLevel() * 100) {
            adventurer.setXp(adventurer.getXp() - adventurer.getLevel() * 100);
            adventurer.setLevel(adventurer.getLevel() + 1);
        }

        // Complétion de la quête et de l'assignment
        quest.setStatus(QuestStatus.COMPLETED);
        assignment.setCompletedAt(LocalDateTime.now());

        adventurerRepository.save(adventurer);
        questRepository.save(quest);
        assignmentRepository.save(assignment);

        return toQuestResponseDto(quest);
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
}