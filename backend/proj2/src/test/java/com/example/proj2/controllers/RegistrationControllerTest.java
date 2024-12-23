package com.example.proj2.controllers;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for user registration.
 * Assumes we have a controller endpoint: POST /api/auth/register
 */
@SpringBootTest
@AutoConfigureMockMvc
class RegistrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Should register new user successfully")
    void registerUser_Success() throws Exception {
        // Example JSON: adjust "username", "email", and "password" to match our real DTO
        String requestBody = """
        {
          "username": "testUser",
          "email": "test@example.com",
          "password": "test123"
        }
        """;

        mockMvc.perform(
                post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
            )
            .andExpect(status().isOk())  
            .andExpect(content().string(containsString("User registered successfully")));
    }

    @Test
    @DisplayName("Should fail if user already exists")
    void registerUser_Failure_UserAlreadyExists() throws Exception {
        // Suppose "testUser" is already in DB
        String requestBody = """
        {
          "username": "testUser",
          "email": "test@example.com",
          "password": "test123"
        }
        """;

        mockMvc.perform(
                post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
            )
            .andExpect(status().isBadRequest())
            .andExpect(content().string(containsString("Username is already taken")));
    }
}
