package com.guildboard.Model.controller;

import com.guildboard.Model.Service.AssignmentService;
import com.guildboard.Model.Service.QuestService;
import com.guildboard.Model.dto.AssignmentCreateDto;
import com.guildboard.Model.dto.AssignmentResponseDto;
import com.guildboard.Model.dto.QuestCreateDto;
import com.guildboard.Model.dto.QuestResponseDto;
import com.guildboard.Model.entity.Difficulty;
import com.guildboard.Model.entity.QuestStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/quests")
public class QuestController {

    private final QuestService questService;
    private final AssignmentService assignmentService;

    public QuestController(QuestService questService, AssignmentService assignmentService) {
        this.questService = questService;
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public List<QuestResponseDto> getAll(
        @RequestParam(required = false) QuestStatus status,
        @RequestParam(required = false) Difficulty difficulty
    ) {
        return questService.getAll(status, difficulty);
    }

    @GetMapping("/{id}")
    public QuestResponseDto getById(@PathVariable Long id) {
        return questService.getById(id);
    }

    @PostMapping
    public QuestResponseDto create(@Valid @RequestBody QuestCreateDto dto) {
        return questService.create(dto);
    }

    @PutMapping("/{id}")
    public QuestResponseDto update(@PathVariable Long id,@Valid  @RequestBody QuestCreateDto dto) {
        return questService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        questService.delete(id);
    }

    @PostMapping("/{id}/assignment")
    public AssignmentResponseDto assign(@PathVariable Long id, @RequestBody AssignmentCreateDto dto) {
        return assignmentService.assign(id, dto);
    }

    @PostMapping("/{id}/completion")
    public QuestResponseDto complete(@PathVariable Long id) {
        return assignmentService.complete(id);
    }

}