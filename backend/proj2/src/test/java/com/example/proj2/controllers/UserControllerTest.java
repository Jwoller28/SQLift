// package com.example.proj2.controllers;

// import com.example.proj2.Controllers.UserController;
// import com.example.proj2.Services.UserService;
// import com.example.proj2.entity.AppUser;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.http.ResponseEntity;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.mockito.Mockito.*;

// public class UserControllerTest {

//     @InjectMocks
//     private UserController userController;

//     @Mock
//     private UserService userService;

//     @BeforeEach
//     public void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     public void testGetUserByID() throws Exception{
//         AppUser user = new AppUser();
//         user.setId(1);

//         when(userService.getUserByID(1)).thenReturn(user);

//         ResponseEntity<AppUser> response = userController.getUserByID(1);

//         assertEquals(200, response.getStatusCodeValue());
//         assertEquals(user, response.getBody());
//         verify(userService, times(1)).getUserByID(1);
//     }

//     @Test
//     public void testGetUserByUsername() throws Exception {
//         AppUser user = new AppUser();
//         user.setUsername("testuser");

//         when(userService.getUserByUsername("testuser")).thenReturn(user);

//         ResponseEntity<AppUser> response = userController.getUserByUsername("testuser");

//         assertEquals(200, response.getStatusCodeValue());
//         assertEquals(user, response.getBody());
//         verify(userService, times(1)).getUserByUsername("testuser");
//     }

//     @Test
//     public void testUpdateUser() {
//         AppUser user = new AppUser();
//         user.setId(1);

//         when(userService.updateUser(1, user)).thenReturn(1);

//         ResponseEntity<Integer> response = userController.UpdateTickets(1, user);

//         assertEquals(200, response.getStatusCodeValue());
//         assertEquals(1, response.getBody());
//         verify(userService, times(1)).updateUser(1, user);
//     }
// }