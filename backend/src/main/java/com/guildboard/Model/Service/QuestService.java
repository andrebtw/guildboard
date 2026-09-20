package com.guildboard.Model.Service;

import com.guildboard.Model.dto.QuestCreateDto;
import com.guildboard.Model.dto.QuestResponseDto;
import com.guildboard.Model.entity.Quest;
import com.guildboard.Model.entity.QuestStatus;
import com.guildboard.Model.entity.Difficulty;
import com.guildboard.Model.exception.ResourceNotFoundException;
import com.guildboard.Model.exception.BusinessRuleException;
import com.guildboard.Model.repository.QuestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestService {

    private final QuestRepository questRepository;

    public QuestService(QuestRepository questRepository) {
        this.questRepository = questRepository;
    }

    public List<QuestResponseDto> getAll(QuestStatus status, Difficulty difficulty) {
        List<Quest> quests;

        if (status != null) {
            quests = questRepository.findByStatus(status);
        } else if (difficulty != null) {
            quests = questRepository.findByDifficulty(difficulty);
        } else {
            quests = questRepository.findAll();
        }

        return quests.stream()
            .map(this::toResponseDto)
            .toList();
    }

    public QuestResponseDto getById(Long id) {
        Quest quest = questRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Quest not found"));
        return toResponseDto(quest);
    }

    public QuestResponseDto create(QuestCreateDto dto) {
        Quest quest = new Quest(
            dto.title(),
            dto.description(),
            dto.difficulty(),
            dto.requiredLevel(),
            dto.goldReward(),
            dto.xpReward()
        );
        Quest saved = questRepository.save(quest);
        return toResponseDto(saved);
    }

    public QuestResponseDto update(Long id, QuestCreateDto dto) {
        Quest quest = questRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Quest not found"));

        if (quest.getStatus() != QuestStatus.AVAILABLE) {
            throw new BusinessRuleException("QUEST_NOT_EDITABLE",
                "Impossible de modifier une quête en cours ou terminée.");
        }

        quest.setTitle(dto.title());
        quest.setDescription(dto.description());
        quest.setDifficulty(dto.difficulty());
        quest.setRequiredLevel(dto.requiredLevel());
        quest.setGoldReward(dto.goldReward());
        quest.setXpReward(dto.xpReward());

        Quest saved = questRepository.save(quest);
        return toResponseDto(saved);
    }

    public void delete(Long id) {
        Quest quest = questRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Quest not found"));

        if (quest.getStatus() == QuestStatus.IN_PROGRESS) {
            throw new BusinessRuleException("QUEST_IN_PROGRESS",
                "Impossible de supprimer une quête en cours.");
        }

        questRepository.deleteById(id);
    }

    private QuestResponseDto toResponseDto(Quest quest) {
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