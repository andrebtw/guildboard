package com.guildboard.Model.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.guildboard.Model.entity.Quest;

public interface QuestRepository extends JpaRepository<Quest, Long> {

    Optional<Quest> findByTitle(String title);

}