package com.guildboard.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.guildboard.Model.entity.Quest;
import com.guildboard.Service.QuestService;


@RestController
public class QuestController {
    private final QuestService questService;

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @PostMapping("/new_quest")
    Quest newQuest(@RequestBody Quest newQuest){
        System.out.println("New quest received.");
        return questService.createQuestFromObj(newQuest);
        
    }

    @GetMapping("/quest/{id}")
    Quest one(@PathVariable int id) {
        return questService.findQuestById(id).orElseThrow(() -> new QuestNotFoundException(id));
    }
    
}
