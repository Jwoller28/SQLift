package test.java.com.example.proj2.controllers;

    import com.example.proj2.Services.UserService;
    import com.example.proj2.entity.AppUser;
    import org.junit.jupiter.api.BeforeEach;
    import org.junit.jupiter.api.Test;
    import org.mockito.InjectMocks;
    import org.mockito.Mock;
    import org.mockito.MockitoAnnotations;
    import org.springframework.http.ResponseEntity;
    
    import static org.junit.jupiter.api.Assertions.assertEquals;
    import static org.mockito.Mockito.when;
    
    public class UserControllerTest {
    
        @Mock
        private UserService userService;
    
        @InjectMocks
        private UserController userController;
    
        @BeforeEach
        public void setUp() {
            MockitoAnnotations.openMocks(this);
        }
    
        @Test
        public void testGetUserByID_Success() {
            AppUser user = new AppUser();
            user.setId(1);
            when(userService.getUserByID(1)).thenReturn(user);
    
            ResponseEntity<AppUser> response = userController.getUserByID(1);
    
            assertEquals(200, response.getStatusCodeValue());
            assertEquals(user, response.getBody());
        }
    
        @Test
        public void testGetUserByID_Exception() {
            when(userService.getUserByID(1)).thenThrow(new RuntimeException());
    
            ResponseEntity<AppUser> response = userController.getUserByID(1);
    
            assertEquals(409, response.getStatusCodeValue());
            assertEquals(null, response.getBody());
        }
    
        @Test
        public void testGetUserByUsername_Success() {
            AppUser user = new AppUser();
            user.setUsername("testuser");
            when(userService.getUserByUsername("testuser")).thenReturn(user);
    
            ResponseEntity<AppUser> response = userController.getUserByUsername("testuser");
    
            assertEquals(200, response.getStatusCodeValue());
            assertEquals(user, response.getBody());
        }
    
        @Test
        public void testGetUserByUsername_Exception() {
            when(userService.getUserByUsername("testuser")).thenThrow(new RuntimeException());
    
            ResponseEntity<AppUser> response = userController.getUserByUsername("testuser");
    
            assertEquals(409, response.getStatusCodeValue());
            assertEquals(null, response.getBody());
        }
    }