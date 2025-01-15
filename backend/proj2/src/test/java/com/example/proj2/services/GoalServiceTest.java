package com.example.proj2.services;

import com.example.proj2.entity.Goal;
import com.example.proj2.entity.type.Exercise;
import com.example.proj2.entity.type.Nutrition;
import com.example.proj2.repositories.GoalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.example.proj2.Services.GoalService;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class GoalServiceTest {

    @InjectMocks
    private GoalService goalService;

    @Mock
    private GoalRepository goalRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateGoal() throws Exception {
        Goal goal = new Goal();
        goal.setId(1L);

        when(goalRepository.save(any(Goal.class))).thenReturn(goal);

        Goal result = goalService.createGoal(goal);

        assertEquals(goal, result);
        verify(goalRepository, times(1)).save(any(Goal.class));
    }

    @Test
    public void testGetUsersGoal() throws Exception {
        Goal goal = new Goal();
        goal.setId(1L);

        when(goalRepository.findMostRecent(1)).thenReturn(Optional.of(goal));

        Goal result = goalService.getUsersGoal(1);

        assertEquals(goal, result);
        verify(goalRepository, times(1)).findMostRecent(1);
    }

    @Test
    public void testGetByGoalId() throws Exception {
        Goal goal = new Goal();
        goal.setId(1L);

        when(goalRepository.findById(1)).thenReturn(Optional.of(goal));

        Goal result = goalService.getByGoalId(1);

        assertEquals(goal, result);
        verify(goalRepository, times(1)).findById(1);
    }

    @Test
    public void testGetAllGoalsbyUser() {
        Goal goal1 = new Goal();
        goal1.setId(1L);

        Goal goal2 = new Goal();
        goal2.setId(2L);

        List<Goal> goals = Arrays.asList(goal1, goal2);
        when(goalRepository.findAllByAppUserId(1)).thenReturn(Optional.of(goals));

        List<Goal> result = goalService.getAllGoalsbyUser(1);

        assertEquals(2, result.size());
        verify(goalRepository, times(1)).findAllByAppUserId(1);
    }

    @Test
    public void testUpdatedGoalAllById() {
        Goal existingGoal = new Goal();
        existingGoal.setId(1L);
        existingGoal.setNutrition(new Nutrition());
        existingGoal.setExercise(new Exercise());

        Goal updatedGoal = new Goal();
        updatedGoal.setNutrition(new Nutrition());
        updatedGoal.setExercise(new Exercise());

        when(goalRepository.findMostRecent(1)).thenReturn(Optional.of(existingGoal));

        int result = goalService.UpdatedGoalAllById(1, updatedGoal);

        assertEquals(1, result);
        verify(goalRepository, times(1)).findMostRecent(1);
        verify(goalRepository, times(1)).save(existingGoal);
    }

    @Test
    public void testDeleteGoal() throws Exception {
        Goal goal = new Goal();
        goal.setId(1L);

        when(goalRepository.findById(1)).thenReturn(Optional.of(goal));

        goalService.deleteGoal(1);

        verify(goalRepository, times(1)).findById(1);
        verify(goalRepository, times(1)).deleteById(1);
    }

    @Test
    public void testDeleteGoalNotFound() {
        when(goalRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> goalService.deleteGoal(1));

        verify(goalRepository, times(1)).findById(1);
        verify(goalRepository, times(0)).deleteById(1);
    }
}