package com.example.proj2.Integration;
import com.example.proj2.entity.Goal;
import com.example.proj2.entity.AppUser;
import com.example.proj2.repositories.GoalRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@Transactional
@SpringBootTest
public class GoalTest {

    @MockBean
    private GoalRepository goalRepository;

    @Autowired
    private GoalRepository testGoalRepository;

    private Goal testGoal;

    @BeforeEach
    public void setUp() {
        // Initialize the AppUser object to avoid NullPointerException (if needed)
        AppUser user = new AppUser();
        user.setId(1);

        // Initialize Goal object with valid AppUser
        testGoal = new Goal();
        testGoal.setId(1L);
        testGoal.setUser(user);  // Set the AppUser ID


        // You can also set other fields of the Goal if needed
    }

    @Test
    public void testSaveGoal() {
        // Mock the save method of the goalRepository
        when(goalRepository.save(testGoal)).thenReturn(testGoal);

        // Save the goal
        Goal savedGoal = goalRepository.save(testGoal);

        // Verify the result
        assertNotNull(savedGoal);
        assertEquals(testGoal.getId(), savedGoal.getId());
        assertEquals(testGoal.getUser().getId(), savedGoal.getUser().getId());

    }

    @Test
    public void testFindById() {
        // Mock the findById method of the goalRepository
        when(goalRepository.findById(1)).thenReturn(Optional.of(testGoal));

        // Find the goal by ID
        Optional<Goal> foundGoal = goalRepository.findById(1);

        // Verify the result
        assertTrue(foundGoal.isPresent());
        assertEquals(testGoal.getId(), foundGoal.get().getId());

    }

    @Test
    public void testFindByAppUserId() {
        // Mock the findByAppUserId method of the goalRepository
        when(goalRepository.findByAppUserId(1)).thenReturn(Optional.of(testGoal));

        // Find the goal by app user ID
        Optional<Goal> foundGoal = goalRepository.findByAppUserId(1);

        // Verify the result
        assertTrue(foundGoal.isPresent());
        assertEquals(testGoal.getUser().getId(), foundGoal.get().getUser().getId());
    }
}
