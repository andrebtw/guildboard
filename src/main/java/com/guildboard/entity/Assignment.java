package com.guildboard.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "assignment")
public class Assignment {

    @Id
    @GeneratedValue
    private int id;

    @Column
    private int adventurerId;

    @Column
    private int questId;

    @Column
    private LocalDateTime assignedAt;

    @Column
    private LocalDateTime completedAt;


    public Assignment(int adventurerId, int questId, LocalDateTime assignedAt) {
        this.adventurerId = adventurerId;
        this.questId = questId;
        this.assignedAt = assignedAt;
        this.completedAt = null;
    }

    public int getId(){
        return this.id;
    }

    public int getAdventurerId(){
        return this.adventurerId;
    }

    public int getQuestId(){
        return this.questId;
    }

    public LocalDateTime getAssignedAt(){
        return this.assignedAt;
    }

    public LocalDateTime getCompletedAt(){
        return this.completedAt;
    }

    public void setId(int id){
        this.id = id;
    }

    public void setAdventurerId(int id){
        this.adventurerId = id;
    }

    public void setQuestId(int id){
        this.questId = id;
    }

    public void setAssignedAt(LocalDateTime datetime){
        this.assignedAt = datetime;
    }

    public void setCompletedAt(LocalDateTime datetime){
        this.completedAt = datetime;
    }
}
