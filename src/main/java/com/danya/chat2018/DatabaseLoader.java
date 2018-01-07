package com.danya.chat2018;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Component
@EnableJpaRepositories(basePackages="com.danya.chat2018")
public class DatabaseLoader implements CommandLineRunner {

	private final MessageRepository messageRepository;

	@Autowired
	public DatabaseLoader(MessageRepository messageRepository) {
		this.messageRepository = messageRepository;
	}

	@Override
	public void run(String... strings) throws Exception {
		this.messageRepository.save(new Message("frombetelgeuse", "Hello, World!"));
	}
}