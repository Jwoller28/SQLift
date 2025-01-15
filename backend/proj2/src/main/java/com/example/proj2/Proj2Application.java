package com.example.proj2;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.amazonaws.services.dynamodbv2.xspec.M;

@SpringBootApplication
public class Proj2Application{
	public static void main(String[] args) {
		SpringApplication.run(Proj2Application.class, args);
	}
	// @Bean
	// public WebMvcConfigurer corsConfigurer() {
	// 	return new WebMvcConfigurer() {
	// 		@Override
	// 		public void addCorsMappings(CorsRegistry registry) {
	// 			registry.addMapping("/posts")
	// 			.allowedOrigins("*")
    //         .allowedMethods("POST")
    //         .allowedHeaders("Content-Type", "Authorization")
    //         .allowCredentials(false);
	// 		}
	// 	};
	// }
}
