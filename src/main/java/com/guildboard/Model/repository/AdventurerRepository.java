package com.guildboard.Model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.guildboard.Model.entity.Adventurer;

public interface AdventurerRepository extends JpaRepository<Adventurer, Integer> {
    
}
