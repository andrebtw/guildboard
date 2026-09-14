package com.guildboard.Model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.guildboard.Model.entity.Quest;

public interface QuestRepository extends JpaRepository<Quest, Long> {

    Quest findById(int id);
    Quest findBytitle(String title);

}
