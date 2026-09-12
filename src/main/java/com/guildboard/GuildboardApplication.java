package com.guildboard;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.guildboard.Model.repository.QuestRepository;
import com.guildboard.Service.QuestService;

@SpringBootApplication
public class GuildboardApplication {

	public static void main(String[] args) {
		SpringApplication.run(GuildboardApplication.class, args);
	}

	// @Bean CommandLineRunner testQuestCreate(QuestService questService, QuestRepository QuestRepository){
	// 	return (args) -> {
	// 		questService.createQuest("test", "desc", Difficulty.EASY, 1, 2, 3);
	// 	};
	// }

	@Bean
	public CommandLineRunner testQuestRemoval(QuestService questService, QuestRepository questRepository) {
		return (args) -> {
			String title = "test";

			questService.removeQuest(title);
			System.out.println("Removed quest, still found: " + (questRepository.findBytitle(title) != null));
		};
	}
}
