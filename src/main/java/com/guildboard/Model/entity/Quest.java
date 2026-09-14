package com.guildboard.Model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "quest")
public class Quest {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private String title;

    @Column
    private String description;

    @Enumerated 
    @Column
    private Difficulty difficulty;

    @Column
    private int requiredLevel;

    @Column
    private int goldReward;

    @Column
    private int xpReward;

    @Enumerated 
    @Column
    private QuestStatus status;

    public Quest() {
    }

    public Quest(String title, String desc, Difficulty diff, int requiredLvl, int goldReward, int xpReward) {
        this.title = title;
        this.description = desc;
        this.difficulty = diff;
        this.requiredLevel = requiredLvl;
        this.xpReward = xpReward;
        this.goldReward = goldReward;
        this.status = QuestStatus.AVAILABLE;
    }

    public Long getId(){
        return this.id;
    }

    public String getTitle(){
        return this.title;
    }

    public String getDescription(){
        return this.description;
    }

    public Difficulty getDifficulty(){
        return this.difficulty;
    }

    public int getRequiredLevel(){
        return this.requiredLevel;
    }

    public int getGoldReward(){
        return this.goldReward;
    }

    public int getxpReward(){
        return this.xpReward;
    }

    public QuestStatus getStatus(){
        return this.status;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public void setDescription(String desc){
        this.description = desc;
    }

    public void setDifficulty(Difficulty diff)
    {
        this.difficulty = diff;
    }

    public void setRequiredLevel(int level)
    {
        this.requiredLevel = level;
    }

    public void setGoldReward(int goldReward)
    {
        this.goldReward = goldReward;
    }

    public void setXpReward(int xp)
    {
        this.xpReward = xp;
    }

    public void setStatus(QuestStatus status)
    {
        this.status = status;
    }
}
