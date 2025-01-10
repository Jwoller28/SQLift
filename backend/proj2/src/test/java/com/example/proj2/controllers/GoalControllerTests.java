package test.java.com.example.proj2.controllers;

import com.example.proj2.Services.GoalService;
import com.example.proj2.entity.Goal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

class GoalControllerTest {

    private GoalController goalController;
    private GoalService goalService;

    @BeforeEach
    void setUp() {
        goalService = Mockito.mock(GoalService.class);
        goalController = new GoalController(goalService);
    }

    @Test
    void createGoal_Success() {
        Goal goal = new Goal();
        when(goalService.createGoal(any(Goal.class))).thenReturn(goal);

        ResponseEntity<Goal> response = goalController.createGoal(goal);

        assertEquals(ResponseEntity.ok(goal), response);
        verify(goalService, times(1)).createGoal(any(Goal.class));
    }

    @Test
    void createGoal_Exception() {
        Goal goal = new Goal();
        when(goalService.createGoal(any(Goal.class))).thenThrow(new RuntimeException());

        ResponseEntity<Goal> response = goalController.createGoal(goal);

        assertEquals(ResponseEntity.status(401).body(null), response);
        verify(goalService, times(1)).createGoal(any(Goal.class));
    }

    @Test
    void getUsersGoal_Success() {
        Goal goal = new Goal();
        when(goalService.getUsersGoal(anyInt())).thenReturn(goal);

        ResponseEntity<Goal> response = goalController.getUsersGoal(1);

        assertEquals(ResponseEntity.ok(goal), response);
        verify(goalService, times(1)).getUsersGoal(anyInt());
    }

    @Test
    void getUsersGoal_Exception() {
        when(goalService.getUsersGoal(anyInt())).thenThrow(new RuntimeException());

        ResponseEntity<Goal> response = goalController.getUsersGoal(1);

        assertEquals(ResponseEntity.status(400).body(null), response);
        verify(goalService, times(1)).getUsersGoal(anyInt());
    }

    @Test
    void getUsersGoals_Success() {
        List<Goal> goals = new ArrayList<>();
        when(goalService.getAllGoalsbyUser(anyInt())).thenReturn(goals);

        ResponseEntity<List<Goal>> response = goalController.getUsersGoals(1);

        assertEquals(ResponseEntity.ok(goals), response);
        verify(goalService, times(1)).getAllGoalsbyUser(anyInt());
    }

    @Test
    void getUsersGoals_Exception() {
        when(goalService.getAllGoalsbyUser(anyInt())).thenThrow(new RuntimeException());

        ResponseEntity<List<Goal>> response = goalController.getUsersGoals(1);

        assertEquals(ResponseEntity.status(400).body(null), response);
        verify(goalService, times(1)).getAllGoalsbyUser(anyInt());
    }

    @Test
    void getGoalByGoalId_Success() {
        Goal goal = new Goal();
        when(goalService.getByGoalId(anyInt())).thenReturn(goal);

        ResponseEntity<Goal> response = goalController.getGoalByGoalId(1);

        assertEquals(ResponseEntity.ok(goal), response);
        verify(goalService, times(1)).getByGoalId(anyInt());
    }

    @Test
    void getGoalByGoalId_Exception() {
        when(goalService.getByGoalId(anyInt())).thenThrow(new RuntimeException());

        ResponseEntity<Goal> response = goalController.getGoalByGoalId(1);

        assertEquals(ResponseEntity.status(400).body(null), response);
        verify(goalService, times(1)).getByGoalId(anyInt());
    }

    @Test
    void UpdateGoal_Success() {
        when(goalService.UpdatedGoalAllById(anyInt(), any(Goal.class))).thenReturn(1);

        ResponseEntity<Integer> response = goalController.UpdateGoal(1, new Goal());

        assertEquals(ResponseEntity.ok(1), response);
        verify(goalService, times(1)).UpdatedGoalAllById(anyInt(), any(Goal.class));
    }

    @Test
    void UpdateGoal_Failure() {
        when(goalService.UpdatedGoalAllById(anyInt(), any(Goal.class))).thenReturn(0);

        ResponseEntity<Integer> response = goalController.UpdateGoal(1, new Goal());

        assertEquals(ResponseEntity.status(400).body(null), response);
        verify(goalService, times(1)).UpdatedGoalAllById(anyInt(), any(Goal.class));
    }

    @Test
    void deleteGoal_Success() {
        doNothing().when(goalService).deleteGoal(anyInt());

        ResponseEntity<Void> response = goalController.deleteGoal(1);

        assertEquals(ResponseEntity.ok().build(), response);
        verify(goalService, times(1)).deleteGoal(anyInt());
    }

    @Test
    void deleteGoal_Exception() {
        doThrow(new RuntimeException()).when(goalService).deleteGoal(anyInt());

        ResponseEntity<Void> response = goalController.deleteGoal(1);

        assertEquals(ResponseEntity.status(404).build(), response);
        verify(goalService, times(1)).deleteGoal(anyInt());
    }
}