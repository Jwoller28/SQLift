package com.example.proj2.services;

import com.example.proj2.entity.Tracker;
import com.example.proj2.entity.type.Exercise;
import com.example.proj2.entity.type.Nutrition;
import com.example.proj2.repositories.TrackerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.example.proj2.Services.TrackerService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class TrackerServiceTest {

    @InjectMocks
    private TrackerService trackerService;

    @Mock
    private TrackerRepository trackerRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateTracker() throws Exception {
        Tracker tracker = new Tracker();
        tracker.setId(1L);

        when(trackerRepository.save(any(Tracker.class))).thenReturn(tracker);

        Tracker result = trackerService.createTracker(tracker);

        assertEquals(tracker, result);
        verify(trackerRepository, times(1)).save(any(Tracker.class));
    }

    @Test
    public void testDisplayAllbyUserIdAndGoalId() {
        Tracker tracker1 = new Tracker();
        tracker1.setId(1L);

        Tracker tracker2 = new Tracker();
        tracker2.setId(2L);

        List<Tracker> trackers = Arrays.asList(tracker1, tracker2);
        when(trackerRepository.findAllByAppUserIdAndGoalId(1, 1)).thenReturn(Optional.of(trackers));

        List<Tracker> result = trackerService.displayAllbyUserIdAndGoalId(1, 1);

        assertEquals(2, result.size());
        verify(trackerRepository, times(1)).findAllByAppUserIdAndGoalId(1, 1);
    }

    @Test
    public void testUpdatedTrackerAllById() {
        Tracker existingTracker = new Tracker();
        existingTracker.setId(1L);
        existingTracker.setNutrition(new Nutrition());
        existingTracker.setExercise(new Exercise());

        Tracker updatedTracker = new Tracker();
        updatedTracker.setNutrition(new Nutrition());
        updatedTracker.setExercise(new Exercise());

        when(trackerRepository.findById(1)).thenReturn(Optional.of(existingTracker));

        int result = trackerService.UpdatedTrackerAllById(1, updatedTracker);

        assertEquals(1, result);
        verify(trackerRepository, times(1)).findById(1);
        verify(trackerRepository, times(1)).save(existingTracker);
    }
}