package com.guildboard.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class QuestNotFoundException extends RuntimeException {

    public QuestNotFoundException(int id) {
        super("Could not find quest " + id);
    }
}
