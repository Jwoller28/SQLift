package com.example.proj2.controllers;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.proj2.Controllers.GoalController;
import com.example.proj2.service.GoalService;
import com.example.proj2.entity.Goal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

class GoalTest {

    @Mock
    private GoalService goalService;

    @InjectMocks
    private GoalController goalController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateGoalSuccess() throws Exception {
        Goal goal = new Goal();
        Goal mockGoal = new Goal();

        when(goalService.createGoal(goal)).thenReturn(mockGoal);

        ResponseEntity<Goal> response = goalController.createGoal(goal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockGoal, response.getBody());
    }

    @Test
    void testCreateGoalFailure() throws Exception {
        Goal goal = new Goal();

        when(goalService.createGoal(goal)).thenThrow(new RuntimeException("Error"));

        ResponseEntity<Goal> response = goalController.createGoal(goal);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testGetUsersGoalSuccess() throws Exception {
        Integer userId = 1;
        Goal mockGoal = new Goal();

        when(goalService.getUsersGoal(userId)).thenReturn(mockGoal);

        ResponseEntity<Goal> response = goalController.getUsersGoal(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockGoal, response.getBody());
    }

    @Test
    void testGetUsersGoalFailure() throws Exception {
        Integer userId = 1;

        when(goalService.getUsersGoal(userId)).thenThrow(new RuntimeException("Error"));

        ResponseEntity<Goal> response = goalController.getUsersGoal(userId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testGetGoalByGoalIdSuccess() throws Exception {
        Integer goalId = 1;
        Goal mockGoal = new Goal();

        when(goalService.getByGoalId(goalId)).thenReturn(mockGoal);

        ResponseEntity<Goal> response = goalController.getGoalByGoalId(goalId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockGoal, response.getBody());
    }

    @Test
    void testGetGoalByGoalIdFailure() throws Exception {
        Integer goalId = 1;

        when(goalService.getByGoalId(goalId)).thenThrow(new RuntimeException("Error"));

        ResponseEntity<Goal> response = goalController.getGoalByGoalId(goalId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testUpdateGoalSuccess() {
        Integer userId = 1;
        Goal goal = new Goal();

        when(goalService.UpdatedGoalAllById(userId, goal)).thenReturn(1);

        ResponseEntity<Integer> response = goalController.UpdateGoal(userId, goal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody());
    }

    @Test
    void testUpdateGoalFailure() {
        Integer userId = 1;
        Goal goal = new Goal();

        when(goalService.UpdatedGoalAllById(userId, goal)).thenReturn(0);

        ResponseEntity<Integer> response = goalController.UpdateGoal(userId, goal);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
    }
}
