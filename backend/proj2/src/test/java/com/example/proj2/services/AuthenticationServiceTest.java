package test.java.com.example.proj2.services;

import com.example.proj2.Dto.RegisterUserDto;
import com.example.proj2.entity.AppUser;
import com.example.proj2.repositories.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class AuthenticationServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthenticationService authenticationService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSignup_Success() {
        RegisterUserDto input = new RegisterUserDto();
        input.setUsername("testuser");
        input.setPassword("password");
        input.setEmail("test@example.com");
        input.setFirst_name("Test");
        input.setLast_name("User");
        input.setPhoto_url("http://example.com/photo.jpg");

        AppUser user = new AppUser();
        user.setUsername("testuser");

        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(appUserRepository.save(user)).thenReturn(user);

        AppUser result = authenticationService.signup(input);

        assertEquals("testuser", result.getUsername());
    }

    @Test
    public void testSignup_InvalidUsername() {
        RegisterUserDto input = new RegisterUserDto();
        input.setUsername("usr");
        input.setPassword("password");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            authenticationService.signup(input);
        });

        assertEquals("invalid username", exception.getMessage());
    }

    @Test
    public void testSignup_InvalidPassword() {
        RegisterUserDto input = new RegisterUserDto();
        input.setUsername("testuser");
        input.setPassword("pwd");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            authenticationService.signup(input);
        });

        assertEquals("invalid password", exception.getMessage());
    }

    @Test
    public void testSignup_Exception() {
        RegisterUserDto input = new RegisterUserDto();
        input.setUsername("testuser");
        input.setPassword("password");

        when(passwordEncoder.encode("password")).thenThrow(new RuntimeException());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            authenticationService.signup(input);
        });

        assertEquals("java.lang.RuntimeException", exception.getClass().getName());
    }
}