package com.guildboard.Model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.guildboard.Model.entity.Assignment;
import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByAdventurerId(Long adventurerId);

    Optional<Assignment> findByQuestId(Long questId);

}
