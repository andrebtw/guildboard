package com.guildboard.Model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "adventurer")
public class Adventurer {

    @Id
    @GeneratedValue
    private int id;

    @Column
    private String name;

    @Column
    private String characterClass;

    @Column
    private int level;

    @Column
    private int xp;

    @Column
    private int gold;

    public Adventurer(){

    }

    public Adventurer(String name, String characterClass, int level, int xp, int gold) {
        this.name = name;
        this.characterClass = characterClass;
        this.level = level;
        this.xp = xp;
        this.gold = gold;
    }

    public int getId(){
        return this.id;
    }

    public String getName(){
        return this.name;
    }

    public String getCharacterClass(){
        return this.characterClass;
    }

    public int getLevel(){
        return this.level;
    }

    public int getXp(){
        return this.xp;
    }

    public int getGold(){
        return this.gold;
    }

    public void setId(int id){
        this.id = id;
    }

    public void setName(String name){
        this.name = name;
    }

    public void setCharacterClass(String characterClass){
        this.characterClass = characterClass;
    }

    public void setLevel(int lvl){
        this.level = lvl;
    }

    public void setXp(int xp){
        this.xp = xp;
    }

    public void setGold(int gold){
        this.gold = gold;
    }
}
