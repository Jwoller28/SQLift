package test.java.com.example.proj2.services;

import com.example.proj2.entity.AppUser;
import com.example.proj2.repositories.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class UserServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetUserByID_Success() throws Exception {
        AppUser user = new AppUser();
        when(appUserRepository.findById(1)).thenReturn(Optional.of(user));

        AppUser result = userService.getUserByID(1);

        assertEquals(user, result);
    }

    @Test
    public void testGetUserByID_Exception() {
        when(appUserRepository.findById(1)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            userService.getUserByID(1);
        });

        assertEquals(Exception.class, exception.getClass());
    }

    @Test
    public void testGetUserByUsername_Success() throws Exception {
        AppUser user = new AppUser();
        when(appUserRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        AppUser result = userService.getUserByUsername("testuser");

        assertEquals(user, result);
    }

    @Test
    public void testGetUserByUsername_Exception() {
        when(appUserRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            userService.getUserByUsername("testuser");
        });

        assertEquals(Exception.class, exception.getClass());
    }

    @Test
    public void testUpdateUser_Success() {
        AppUser existingUser = new AppUser();
        existingUser.setFirst_name("OldFirstName");
        existingUser.setLast_name("OldLastName");

        AppUser updatedUser = new AppUser();
        updatedUser.setFirst_name("NewFirstName");
        updatedUser.setLast_name("NewLastName");

        when(appUserRepository.findById(1)).thenReturn(Optional.of(existingUser));
        when(appUserRepository.save(existingUser)).thenReturn(existingUser);

        int result = userService.updateUser(1, updatedUser);

        assertEquals(1, result);
        assertEquals("NewFirstName", existingUser.getFirst_name());
        assertEquals("NewLastName", existingUser.getLast_name());
    }

    @Test
    public void testUpdateUser_Failure() {
        AppUser updatedUser = new AppUser();

        when(appUserRepository.findById(1)).thenReturn(Optional.empty());

        int result = userService.updateUser(1, updatedUser);

        assertEquals(0, result);
    }
}