package com.example.proj2.controllers;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.proj2.Configs.JwtUtil;
import com.example.proj2.Controllers.AuthenticationController;
import com.example.proj2.Dto.LoginUserDto;
import com.example.proj2.Dto.RegisterUserDto;
import com.example.proj2.Services.AuthenticationService;
import com.example.proj2.entity.AppUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;

class AuthTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private AuthenticationController authenticationController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterSuccess() {
        RegisterUserDto registerUserDto = new RegisterUserDto();
        AppUser mockUser = new AppUser();

        when(authenticationService.signup(registerUserDto)).thenReturn(mockUser);

        ResponseEntity<AppUser> response = authenticationController.register(registerUserDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockUser, response.getBody());
    }

    @Test
    void testRegisterFailure() {
        RegisterUserDto registerUserDto = new RegisterUserDto();

        when(authenticationService.signup(registerUserDto)).thenThrow(new RuntimeException("Error"));

        ResponseEntity<AppUser> response = authenticationController.register(registerUserDto);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testLoginSuccess() {
        LoginUserDto loginUserDto = new LoginUserDto();
        loginUserDto.setUsername("testUser");
        loginUserDto.setPassword("testPassword");

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken("testUser", "testPassword");
        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(authToken)).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testUser");
        when(jwtUtil.generateToken("testUser")).thenReturn("mockToken");

        ResponseEntity<String> response = authenticationController.login(loginUserDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("mockToken", response.getBody());
    }

    @Test
    void testLoginFailure() {
        LoginUserDto loginUserDto = new LoginUserDto();
        loginUserDto.setUsername("testUser");
        loginUserDto.setPassword("testPassword");

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken("testUser", "testPassword");

        when(authenticationManager.authenticate(authToken)).thenThrow(new RuntimeException("Error"));

        ResponseEntity<String> response = authenticationController.login(loginUserDto);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testGetAuthenticatedUserFromContextSuccess() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("testUser");

        SecurityContextHolder.setContext(securityContext);

        ResponseEntity<String> response = authenticationController.getAuthenticatedUserFromContext();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("testUser", response.getBody());
    }

    @Test
    void testGetAuthenticatedUserFromContextUnauthorized() {
        SecurityContext securityContext = mock(SecurityContext.class);

        when(securityContext.getAuthentication()).thenReturn(null);

        SecurityContextHolder.setContext(securityContext);

        ResponseEntity<String> response = authenticationController.getAuthenticatedUserFromContext();

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }
}
