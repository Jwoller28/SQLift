// package com.example.proj2.Integration;

// import com.example.proj2.entity.AppUser;
// import com.example.proj2.repositories.AppUserRepository;
// import jakarta.transaction.Transactional;
// import org.junit.jupiter.api.AfterEach;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.runner.RunWith;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.test.context.junit4.SpringRunner;

// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.*;

// // AppUserRepositoryTest.java
// @SpringBootTest
// @Transactional
// public class AppUserTest {

//     @Autowired
//     private AppUserRepository appUserRepository;

//     @BeforeEach
//     public void setUp() {
//         // Clean up the database before each test
//         appUserRepository.deleteAll();
//     }

//     @Test
//     public void testFindById_Success() {
//         // Given
//         AppUser appUser = new AppUser("john_doe", "john.doe@example.com", "John", "Doe", "http://example.com/photo.jpg", "password123");
//         appUserRepository.save(appUser); // Save the user to the repository

//         // When
//         Optional<AppUser> retrievedUser = appUserRepository.findById(appUser.getId());

//         // Then
//         assertTrue(retrievedUser.isPresent());
//         assertEquals(appUser.getUsername(), retrievedUser.get().getUsername());
//         assertEquals(appUser.getEmail(), retrievedUser.get().getEmail());
//     }

//     @Test
//     public void testFindByUsername_Success() {
//         // Given
//         String username = "john_doe";
//         AppUser appUser = new AppUser(username, "john.doe@example.com", "John", "Doe", "http://example.com/photo.jpg", "password123");
//         appUserRepository.save(appUser); // Save the user to the repository

//         // When
//         Optional<AppUser> retrievedUser = appUserRepository.findByUsername(username);

//         // Then
//         assertTrue(retrievedUser.isPresent());
//         assertEquals(username, retrievedUser.get().getUsername());
//         assertEquals(appUser.getEmail(), retrievedUser.get().getEmail());
//     }

//     @Test
//     public void testFindById_NotFound() {
//         // Given
//         Integer nonExistentUserId = 999;

//         // When
//         Optional<AppUser> retrievedUser = appUserRepository.findById(nonExistentUserId);

//         // Then
//         assertFalse(retrievedUser.isPresent()); // No user should be found
//     }

//     @Test
//     public void testFindByUsername_NotFound() {
//         // Given
//         String nonExistentUsername = "non_existent_user";

//         // When
//         Optional<AppUser> retrievedUser = appUserRepository.findByUsername(nonExistentUsername);

//         // Then
//         assertFalse(retrievedUser.isPresent()); // No user should be found
//     }

//     @AfterEach
//     public void tearDown() {
//         // Clean up the database after each test
//         appUserRepository.deleteAll();
//     }
// }
