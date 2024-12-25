package com.example.proj2.controllers;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType; // from spring-boot-starter-web
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Example integration test for user login.
 * Assumes we have a controller endpoint: POST /api/auth/login
 */
@SpringBootTest
@AutoConfigureMockMvc
class LoginControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Should log in user successfully")
    void loginUser_Success() throws Exception {
        // Example JSON: adjust "username" and "password" to match our real DTO
        String requestBody = """
        {
          "username": "testUser",
          "password": "test123"
        }
        """;

        // Suppose the controller returns status 200 and a token (e.g., JWT) in the response
        mockMvc.perform(
                post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
            )
            .andExpect(status().isOk())
            // If the response body includes a token or success message, check it here
            .andExpect(content().string(containsString("token")));
    }

    @Test
    @DisplayName("Should fail if credentials are invalid")
    void loginUser_Failure_InvalidCredentials() throws Exception {
        String requestBody = """
        {
          "username": "wrongUser",
          "password": "wrongPass"
        }
        """;

        // Suppose your controller returns 401 Unauthorized or 400 Bad Request on invalid login
        mockMvc.perform(
                post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
            )
            .andExpect(status().isUnauthorized()) // or .isBadRequest()
            .andExpect(content().string(containsString("Invalid credentials")));
    }
}
