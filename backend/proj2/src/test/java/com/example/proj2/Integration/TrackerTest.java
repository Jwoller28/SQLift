package com.example.proj2.Integration;
import com.example.proj2.entity.Tracker;
import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Goal;
import com.example.proj2.repositories.TrackerRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@Transactional
@SpringBootTest
public class TrackerTest {

    @MockBean
    private TrackerRepository trackerRepository;

    @Autowired
    private TrackerRepository testTrackerRepository;

    private Tracker testTracker;
    private List<Tracker> trackerList;

    @BeforeEach
    public void setUp() {
        // Initialize the AppUser and Goal objects to avoid NullPointerException
        AppUser user = new AppUser();
        user.setId(1);

        Goal goal = new Goal();
        goal.setId(1L);

        // Initialize Tracker object with valid User and Goal
        testTracker = new Tracker();
        testTracker.setId(1L);
        testTracker.setUser(user);  // Set the User object
        testTracker.setGoal(goal);  // Set the Goal object

        // Initialize the list with the test tracker
        trackerList = new ArrayList<>();
        trackerList.add(testTracker);
    }

    @Test
    public void testSaveTracker() {
        // Mock the save method of the trackerRepository
        when(trackerRepository.save(testTracker)).thenReturn(testTracker);

        // Save the tracker
        Tracker savedTracker = trackerRepository.save(testTracker);

        // Verify the result
        assertNotNull(savedTracker);
        assertEquals(testTracker.getId(), savedTracker.getId());
        assertEquals(testTracker.getUser().getId(), savedTracker.getUser().getId());
        assertEquals(testTracker.getGoal().getId(), savedTracker.getGoal().getId());
    }

    @Test
    public void testFindById() {
        // Mock the findById method of the trackerRepository
        when(trackerRepository.findById(1)).thenReturn(Optional.of(testTracker));

        // Find the tracker by ID
        Optional<Tracker> foundTracker = trackerRepository.findById(1);

        // Verify the result
        assertTrue(foundTracker.isPresent());
        assertEquals(testTracker.getId(), foundTracker.get().getId());
    }

    @Test
    public void testFindAllByAppUserIdAndGoalId() {
        // Mock the findAllByAppUserIdAndGoalId method of the trackerRepository
        when(trackerRepository.findAllByAppUserIdAndGoalId(1, 1)).thenReturn(Optional.of(trackerList));

        // Find all trackers by user ID and goal ID
        Optional<List<Tracker>> foundTrackers = trackerRepository.findAllByAppUserIdAndGoalId(1, 1);

        // Verify the result
        assertTrue(foundTrackers.isPresent());
        assertEquals(trackerList.size(), foundTrackers.get().size());
    }
}