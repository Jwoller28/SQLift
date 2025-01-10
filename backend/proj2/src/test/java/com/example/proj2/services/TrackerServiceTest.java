package test.java.com.example.proj2.services;

import com.example.proj2.entity.Tracker;
import com.example.proj2.repositories.TrackerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class TrackerServiceTest {

    @Mock
    private TrackerRepository trackerRepository;

    @InjectMocks
    private TrackerService trackerService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateTracker_Success() throws Exception {
        Tracker tracker = new Tracker();
        when(trackerRepository.save(tracker)).thenReturn(tracker);

        Tracker result = trackerService.createTracker(tracker);

        assertEquals(tracker, result);
    }

    @Test
    public void testCreateTracker_Exception() {
        Tracker tracker = new Tracker();
        when(trackerRepository.save(tracker)).thenThrow(new RuntimeException());

        Exception exception = assertThrows(Exception.class, () -> {
            trackerService.createTracker(tracker);
        });

        assertEquals(RuntimeException.class, exception.getClass());
    }

    @Test
    public void testDisplayAllbyUserIdAndGoalId_Success() {
        Tracker tracker = new Tracker();
        List<Tracker> trackers = Collections.singletonList(tracker);
        when(trackerRepository.findAllByAppUserIdAndGoalId(1, 1)).thenReturn(Optional.of(trackers));

        List<Tracker> result = trackerService.displayAllbyUserIdAndGoalId(1, 1);

        assertEquals(trackers, result);
    }

    @Test
    public void testDisplayAllbyUserIdAndGoalId_Exception() {
        when(trackerRepository.findAllByAppUserIdAndGoalId(1, 1)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            trackerService.displayAllbyUserIdAndGoalId(1, 1);
        });

        assertEquals(Exception.class, exception.getClass());
    }

    @Test
    public void testUpdatedTrackerAllById_Success() {
        Tracker tracker = new Tracker();
        when(trackerRepository.findById(1)).thenReturn(Optional.of(tracker));
        when(trackerRepository.save(tracker)).thenReturn(tracker);

        int result = trackerService.UpdatedTrackerAllById(1, tracker);

        assertEquals(1, result);
    }

    @Test
    public void testUpdatedTrackerAllById_Failure() {
        Tracker tracker = new Tracker();
        when(trackerRepository.findById(1)).thenReturn(Optional.empty());

        int result = trackerService.UpdatedTrackerAllById(1, tracker);

        assertEquals(0, result);
    }
}