/**package com.example.proj2.services;

import com.example.proj2.models.User;
import com.example.proj2.repositories.UserRepository;
import com.example.proj2.exceptions.UserAlreadyExistsException; 
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;


class UserServiceTest {

    private UserService userService;
    private UserRepository userRepository = Mockito.mock(UserRepository.class);

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository);
    }

    @Test
    void registerNewUser_Success() {
        User user = new User();
        user.setUsername("testUser");
        user.setEmail("test@example.com");
        user.setPassword("plaintext");

        // Mock: user does not exist
        Mockito.when(userRepository.existsByUsername("testUser")).thenReturn(false);
        // Mock: saving user returns the same object with an assigned ID
        Mockito.when(userRepository.save(Mockito.any(User.class)))
               .thenAnswer(invocation -> {
                   User saved = invocation.getArgument(0);
                   saved.setId(1); // Simulate auto-generated ID
                   return saved;
               });

        User savedUser = userService.registerNewUser(user);
        assertNotNull(savedUser, "User should be saved successfully");
        assertEquals("testUser", savedUser.getUsername());
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals(1L, savedUser.getId());
    }

    @Test
    void registerNewUser_AlreadyExists() {
        User user = new User();
        user.setUsername("testUser");

        // Mock: user does exist
        Mockito.when(userRepository.existsByUsername("testUser")).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.registerNewUser(user);
        });
    }

}
*/