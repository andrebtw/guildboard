package com.guildboard.Model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.guildboard.Model.entity.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {
    
}
