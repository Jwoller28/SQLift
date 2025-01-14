// package com.example.proj2.services;

// import com.example.proj2.exceptions.InvalidCredentialsException;
// import com.example.proj2.models.User;
// import com.example.proj2.repositories.UserRepository;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.Mockito;

// import static org.junit.jupiter.api.Assertions.*;

// /**
//  * Unit tests for the login logic, e.g., verifying username/password
//  */

// class AuthServiceTest {
//     private AuthService authService;
//     private UserRepository userRepository = Mockito.mock(UserRepository.class);

//     @BeforeEach
//     void setUp() {
//         authService = new AuthService(userRepository);
//     }

//     @Test
//     void loginUser_Success() {
//         // Mock a user in DB with a certain username, password
//         User existingUser = new User();
//         existingUser.setUsername("testUser");
//         existingUser.setPassword("password");

//         // When we search for the user by username, we return existingUser
//         Mockito.when(userRepository.findByUsername("testUser")).thenReturn(existingUser);

//         // Suppose AuthService login method returns a token or some object
//         String token = authService.loginUser("testUser", "test123");
//         assertNotNull(token);
//         // Additional checks if needed
//     }

//     @Test
//     void loginUser_Failure_UserNotFound() {
//         // Suppose no user found
//         Mockito.when(userRepository.findByUsername("nonExistent")).thenReturn(null);

//         assertThrows(InvalidCredentialsException.class, () -> {
//             authService.loginUser("nonExistent", "somePass");
//         });
//     }

//     @Test
//     void loginUser_Failure_WrongPassword() {
//         // Suppose user is found but password doesn't match
//         User existingUser = new User();
//         existingUser.setUsername("testUser");
//         existingUser.setPassword("hashedPassword");

//         Mockito.when(userRepository.findByUsername("testUser")).thenReturn(existingUser);

//         Now your service might check if the raw password matches the hashed password
//         If it doesn't match, it should throw an exception or return an error
//         assertThrows(InvalidCredentialsException.class, () -> {
//             authService.loginUser("testUser", "wrongPass");
//         });
//     }


// }
