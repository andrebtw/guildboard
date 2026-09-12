package com.guildboard.Service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.guildboard.Model.entity.Difficulty;
import com.guildboard.Model.entity.Quest;
import com.guildboard.Model.repository.QuestRepository;


@Service
public class QuestService {
    private final QuestRepository questRepository;

    public QuestService(QuestRepository questRepository){
        this.questRepository = questRepository;
    }

    public Optional<Quest> findQuestById(int id){
        return Optional.ofNullable(this.questRepository.findById(id));
    }

    public Quest createQuest(String title, String desc, Difficulty diff, int requiredLvl, int goldReward, int xpReward){
        Quest quest = new Quest(title, desc, diff, requiredLvl, goldReward, xpReward);
        questRepository.save(quest);
        return quest;

    }

    public Quest createQuestFromObj(Quest newQuest){
        return questRepository.save(newQuest);
    }

    public void removeQuest(String title){
        Quest quest = questRepository.findBytitle(title);
        if (quest != null) {
            questRepository.delete(quest);
        }
    }

    public void removeQuestById(int id){
        Quest quest = questRepository.findById(id);
        if (quest != null) {
            questRepository.delete(quest);
        }
    }
}
