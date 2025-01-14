package com.example.proj2.services;

import com.example.proj2.entity.AppUser;
import com.example.proj2.repositories.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import com.example.proj2.Services.UserService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private Authentication authentication;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetUserByID() throws Exception {
        AppUser user = new AppUser();
        user.setId(1);

        when(appUserRepository.findById(1)).thenReturn(Optional.of(user));

        AppUser result = userService.getUserByID(1);

        assertEquals(user, result);
        verify(appUserRepository, times(1)).findById(1);
    }

    @Test
    public void testGetUserByID_UserNotFound() {
        when(appUserRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> {
            userService.getUserByID(1);
        });

        verify(appUserRepository, times(1)).findById(1);
    }

    @Test
    public void testGetUserByUsername() throws Exception {
        AppUser user = new AppUser();
        user.setUsername("testuser");

        when(appUserRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        AppUser result = userService.getUserByUsername("testuser");

        assertEquals(user, result);
        verify(appUserRepository, times(1)).findByUsername("testuser");
    }

    @Test
    public void testGetUserByUsername_UserNotFound() {
        when(appUserRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> {
            userService.getUserByUsername("testuser");
        });

        verify(appUserRepository, times(1)).findByUsername("testuser");
    }

    @Test
    public void testGetUserFromAuthentication() {
        AppUser user = new AppUser();
        user.setUsername("testuser");

        when(authentication.getName()).thenReturn("testuser");
        when(appUserRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        AppUser result = userService.getUserFromAuthentication(authentication);

        assertEquals(user, result);
        verify(appUserRepository, times(1)).findByUsername("testuser");
    }

    @Test
    public void testGetUserFromAuthentication_UserNotFound() {
        when(authentication.getName()).thenReturn("testuser");
        when(appUserRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            userService.getUserFromAuthentication(authentication);
        });

        verify(appUserRepository, times(1)).findByUsername("testuser");
    }

    @Test
    public void testUpdateUser() {
        AppUser existingUser = new AppUser();
        existingUser.setId(1);
        existingUser.setFirst_name("Old First Name");

        AppUser updatedUser = new AppUser();
        updatedUser.setFirst_name("New First Name");

        when(appUserRepository.findById(1)).thenReturn(Optional.of(existingUser));

        int result = userService.updateUser(1, updatedUser);

        assertEquals(1, result);
        assertEquals("New First Name", existingUser.getFirst_name());
        verify(appUserRepository, times(1)).findById(1);
        verify(appUserRepository, times(1)).save(existingUser);
    }

    @Test
    public void testUpdateUser_UserNotFound() {
        AppUser updatedUser = new AppUser();
        updatedUser.setFirst_name("New First Name");

        when(appUserRepository.findById(1)).thenReturn(Optional.empty());

        int result = userService.updateUser(1, updatedUser);

        assertEquals(0, result);
        verify(appUserRepository, times(1)).findById(1);
        verify(appUserRepository, times(0)).save(any(AppUser.class));
    }
}