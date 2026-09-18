package com.guildboard.Model.controller;

import java.util.List;

import com.guildboard.Model.Service.AdventurerService;
import com.guildboard.Model.dto.AdventurerCreateDto;
import com.guildboard.Model.dto.AdventurerCreateDto;
import com.guildboard.Model.dto.AdventurerResponseDto;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/adventurers")
public class AdventurerController {
    
    private final AdventurerService adventurerService;

    public AdventurerController (AdventurerService adventurerService){
        this.adventurerService = adventurerService;
    }

    @GetMapping 
    public List<AdventurerResponseDto> getAll(){
        return adventurerService.getAll();
    }

    @GetMapping("/{id}")
    public AdventurerResponseDto getById (@PathVariable Long id){
        return adventurerService.getById(id);
    }


    @PostMapping 
    public AdventurerResponseDto create(@RequestBody AdventurerCreateDto dto){
        return adventurerService.create(dto);
    }

    @PutMapping ("/{id}")
    public AdventurerResponseDto update(@PathVariable Long id,@RequestBody  AdventurerCreateDto dto){
        return  adventurerService.update(id, dto);
    }


    @DeleteMapping ("/{id}")
    public void delete(@PathVariable long id){
        adventurerService.delete(id);
    }
}
