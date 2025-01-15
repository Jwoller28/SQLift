// package com.example.proj2.controllers;

// import static org.mockito.Mockito.*;
// import static org.junit.jupiter.api.Assertions.*;

// import com.example.proj2.Controllers.UserController;
// import com.example.proj2.Services.UserService;
// import com.example.proj2.entity.AppUser;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.http.ResponseEntity;
// import org.springframework.http.HttpStatus;

// class UserTest {

//     @Mock
//     private UserService userService;

//     @InjectMocks
//     private UserController userController;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     void testGetUserByIdSuccess() throws Exception {
//         Integer userId = 1;
//         AppUser mockUser = new AppUser();

//         when(userService.getUserByID(userId)).thenReturn(mockUser);

//         ResponseEntity<AppUser> response = userController.getUserByID(userId);

//         assertEquals(HttpStatus.OK, response.getStatusCode());
//         assertEquals(mockUser, response.getBody());
//     }

//     @Test
//     void testGetUserByIdFailure() throws Exception {
//         Integer userId = 1;

//         when(userService.getUserByID(userId)).thenThrow(new RuntimeException("Error"));

//         ResponseEntity<AppUser> response = userController.getUserByID(userId);

//         assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
//         assertNull(response.getBody());
//     }

//     @Test
//     void testGetUserByUsernameSuccess() throws Exception {
//         String username = "testUser";
//         AppUser mockUser = new AppUser();

//         when(userService.getUserByUsername(username)).thenReturn(mockUser);

//         ResponseEntity<AppUser> response = userController.getUserByUsername(username);

//         assertEquals(HttpStatus.OK, response.getStatusCode());
//         assertEquals(mockUser, response.getBody());
//     }

//     @Test
//     void testGetUserByUsernameFailure() throws Exception {
//         String username = "testUser";

//         when(userService.getUserByUsername(username)).thenThrow(new RuntimeException("Error"));

//         ResponseEntity<AppUser> response = userController.getUserByUsername(username);

//         assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
//         assertNull(response.getBody());
//     }
// }

