package com.guildboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "quest")
public class Quest {

    @Id
    @GeneratedValue
    private int id;

    @Column
    private String title;

    @Column
    private String description;

    @Column
    private String difficulty;

    @Column
    private int requiredLevel;

    @Column
    private int goldReward;

    @Column
    private int xpReward;

    @Column
    private String status;

    public Quest(String title, String desc, String diff, int requiredLvl, int goldReward, int xpReward) {
        this.title = title;
        this.description = desc;
        this.difficulty = diff;
        this.xpReward = xpReward;
        this.goldReward = goldReward;
        this.status = "todo";
    }

    public int getId(){
        return this.id;
    }

    public String getTitle(){
        return this.title;
    }

    public String getDifficulty(){
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

    public String getStatus(){
        return this.status;
    }

    public void setId(int id)
    {
        this.id = id;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public void setDifficulty(String diff)
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

    public void setStatus(String status)
    {
        this.status = status;
    }
}
