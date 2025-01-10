package test.java.com.example.proj2.controllers;
import com.example.proj2.Services.TrackerService;
import com.example.proj2.entity.Tracker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;


class TrackerControllerTest {

    private TrackerController trackerController;
    private TrackerService trackerService;

    @BeforeEach
    void setUp() {
        trackerService = Mockito.mock(TrackerService.class);
        trackerController = new TrackerController(trackerService);
    }

    @Test
    void createTracker_Success() {
        Tracker tracker = new Tracker();
        when(trackerService.createTracker(any(Tracker.class))).thenReturn(tracker);

        ResponseEntity<Tracker> response = trackerController.createTracker(tracker);

        assertEquals(ResponseEntity.ok(tracker), response);
        verify(trackerService, times(1)).createTracker(any(Tracker.class));
    }

    @Test
    void createTracker_Exception() {
        Tracker tracker = new Tracker();
        when(trackerService.createTracker(any(Tracker.class))).thenThrow(new RuntimeException());

        ResponseEntity<Tracker> response = trackerController.createTracker(tracker);

        assertEquals(ResponseEntity.status(401).body(null), response);
        verify(trackerService, times(1)).createTracker(any(Tracker.class));
    }

    @Test
    void AllUsersTrackers_Success() {
        List<Tracker> trackers = Arrays.asList(new Tracker(), new Tracker());
        when(trackerService.displayAllbyUserIdAndGoalId(anyInt(), anyInt())).thenReturn(trackers);

        ResponseEntity<List<Tracker>> response = trackerController.AllUsersTrackers(1, 1);

        assertEquals(ResponseEntity.ok(trackers), response);
        verify(trackerService, times(1)).displayAllbyUserIdAndGoalId(anyInt(), anyInt());
    }

    @Test
    void AllUsersTrackers_Exception() {
        when(trackerService.displayAllbyUserIdAndGoalId(anyInt(), anyInt())).thenThrow(new RuntimeException());

        ResponseEntity<List<Tracker>> response = trackerController.AllUsersTrackers(1, 1);

        assertEquals(ResponseEntity.status(400).body(null), response);
        verify(trackerService, times(1)).displayAllbyUserIdAndGoalId(anyInt(), anyInt());
    }

    @Test
    void UpdateTickets_Success() {
        when(trackerService.UpdatedTrackerAllById(anyInt(), any(Tracker.class))).thenReturn(1);

        ResponseEntity<Integer> response = trackerController.UpdateTickets(1, new Tracker());

        assertEquals(ResponseEntity.ok(1), response);
        verify(trackerService, times(1)).UpdatedTrackerAllById(anyInt(), any(Tracker.class));
    }

    @Test
    void UpdateTickets_Failure() {
        when(trackerService.UpdatedTrackerAllById(anyInt(), any(Tracker.class))).thenReturn(0);

        ResponseEntity<Integer> response = trackerController.UpdateTickets(1, new Tracker());

        assertEquals(ResponseEntity.status(400).body(null), response);
        verify(trackerService, times(1)).UpdatedTrackerAllById(anyInt(), any(Tracker.class));
    }
}