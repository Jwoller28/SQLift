package test.java.com.example.proj2.controllers;

import com.example.proj2.Configs.JwtUtil;
import com.example.proj2.Dto.LoginUserDto;
import com.example.proj2.Dto.RegisterUserDto;
import com.example.proj2.Services.AuthenticationService;
import com.example.proj2.entity.AppUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthenticationControllerTest {

    private AuthenticationController authenticationController;
    private AuthenticationManager authenticationManager;
    private JwtUtil jwtUtil;
    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        authenticationManager = Mockito.mock(AuthenticationManager.class);
        jwtUtil = Mockito.mock(JwtUtil.class);
        authenticationService = Mockito.mock(AuthenticationService.class);
        authenticationController = new AuthenticationController(authenticationManager, jwtUtil, authenticationService);
    }

    @Test
    void register_Success() {
        RegisterUserDto registerUserDto = new RegisterUserDto();
        AppUser appUser = new AppUser();
        when(authenticationService.signup(any(RegisterUserDto.class))).thenReturn(appUser);

        ResponseEntity<AppUser> response = authenticationController.register(registerUserDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(appUser, response.getBody());
    }

    @Test
    void register_Exception() {
        RegisterUserDto registerUserDto = new RegisterUserDto();
        when(authenticationService.signup(any(RegisterUserDto.class))).thenThrow(new RuntimeException());

        ResponseEntity<AppUser> response = authenticationController.register(registerUserDto);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void login_Success() {
        LoginUserDto loginUserDto = new LoginUserDto();
        loginUserDto.setUsername("testUser");
        loginUserDto.setPassword("password");

        Authentication authentication = Mockito.mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtil.generateToken(anyString())).thenReturn("token");

        ResponseEntity<String> response = authenticationController.login(loginUserDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("token", response.getBody());
    }

    @Test
    void login_Exception() {
        LoginUserDto loginUserDto = new LoginUserDto();
        loginUserDto.setUsername("testUser");
        loginUserDto.setPassword("password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenThrow(new RuntimeException());

        ResponseEntity<String> response = authenticationController.login(loginUserDto);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void getAuthenticatedUserFromContext_Authenticated() {
        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("testUser");
        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResponseEntity<String> response = authenticationController.getAuthenticatedUserFromContext();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("testUser", response.getBody());
    }

    @Test
    void getAuthenticatedUserFromContext_Unauthenticated() {
        SecurityContextHolder.getContext().setAuthentication(null);

        ResponseEntity<String> response = authenticationController.getAuthenticatedUserFromContext();

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }
}