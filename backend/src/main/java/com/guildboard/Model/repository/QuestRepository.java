package com.guildboard.Model.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.guildboard.Model.entity.Difficulty;
import com.guildboard.Model.entity.Quest;
import com.guildboard.Model.entity.QuestStatus;

public interface QuestRepository extends JpaRepository<Quest, Long> {

    Optional<Quest> findByTitle(String title);
    List<Quest> findByStatus(QuestStatus status);
    List<Quest> findByDifficulty(Difficulty difficulty);

}