package com.guildboard.Model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "assignment")
public class Assignment {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "adventurer_id", nullable = false)
    private Adventurer adventurer;

    @ManyToOne
    @JoinColumn(name = "quest_id", nullable = false)
    private Quest quest;

    @Column
    private LocalDateTime assignedAt;

    @Column
    private LocalDateTime completedAt;


    public Assignment(){
        
    }

    public Assignment(Adventurer adventurer, Quest quest, LocalDateTime assignedAt) {
        this.adventurer = adventurer;
        this.quest = quest;
        this.assignedAt = assignedAt;
        this.completedAt = null;
    }

    public Long getId(){
        return this.id;
    }

    public Adventurer getAdventurer(){
        return this.adventurer;
    }

    public Quest getQuest(){
        return this.quest;
    }

    public LocalDateTime getAssignedAt(){
        return this.assignedAt;
    }

    public LocalDateTime getCompletedAt(){
        return this.completedAt;
    }

    public void setId(Long id){
        this.id = id;
    }

    public void setAdventurerId(Adventurer adventurer){
        this.adventurer = adventurer;
    }

    public void setQuestId(Quest quest){
        this.quest = quest;
    }

    public void setAssignedAt(LocalDateTime datetime){
        this.assignedAt = datetime;
    }

    public void setCompletedAt(LocalDateTime datetime){
        this.completedAt = datetime;
    }
}
