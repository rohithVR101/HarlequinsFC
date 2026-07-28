package com.road.quinsfc.membersservice;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableDiscoveryClient
public class MembersServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MembersServiceApplication.class, args);
	}

	@Bean
	public BCryptPasswordEncoder initBCryptPasswordEncoder () {
		return new BCryptPasswordEncoder();
	}
	@Bean
	public ModelMapper initModelMapper () {
		return new ModelMapper();
	}
}
