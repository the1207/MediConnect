package com.Mediconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MediconnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(MediconnectApplication.class, args);
	}

}