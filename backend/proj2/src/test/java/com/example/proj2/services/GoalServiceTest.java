package test.java.com.example.proj2.services;

import com.example.proj2.entity.Goal;
import com.example.proj2.repositories.GoalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class GoalServiceTest {

    @Mock
    private GoalRepository goalRepository;

    @InjectMocks
    private GoalService goalService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateGoal_Success() throws Exception {
        Goal goal = new Goal();
        when(goalRepository.save(goal)).thenReturn(goal);

        Goal result = goalService.createGoal(goal);

        assertEquals(goal, result);
    }

    @Test
    public void testGetUsersGoal_Success() throws Exception {
        Goal goal = new Goal();
        when(goalRepository.findByAppUserId(1)).thenReturn(Optional.of(goal));

        Goal result = goalService.getUsersGoal(1);

        assertEquals(goal, result);
    }

    @Test
    public void testGetUsersGoal_Exception() {
        when(goalRepository.findByAppUserId(1)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            goalService.getUsersGoal(1);
        });

        assertEquals(Exception.class, exception.getClass());
    }

    @Test
    public void testGetByGoalId_Success() throws Exception {
        Goal goal = new Goal();
        when(goalRepository.findById(1)).thenReturn(Optional.of(goal));

        Goal result = goalService.getByGoalId(1);

        assertEquals(goal, result);
    }

    @Test
    public void testGetByGoalId_Exception() {
        when(goalRepository.findById(1)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            goalService.getByGoalId(1);
        });

        assertEquals(Exception.class, exception.getClass());
    }
}