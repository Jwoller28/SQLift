// package com.example.proj2.controllers;

// import com.example.proj2.Controllers.TrackerController;
// import com.example.proj2.Services.TrackerService;
// import com.example.proj2.entity.Tracker;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.http.ResponseEntity;

// import java.util.Arrays;
// import java.util.List;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.mockito.Mockito.*;

// public class TrackerControllerTest {

//     @InjectMocks
//     private TrackerController trackerController;

//     @Mock
//     private TrackerService trackerService;

//     @BeforeEach
//     public void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     public void testCreateTracker() throws Exception{
//         Tracker tracker = new Tracker();
//         tracker.setId(1L);

//         when(trackerService.createTracker(any(Tracker.class))).thenReturn(tracker);

//         ResponseEntity<Tracker> response = trackerController.createTracker(tracker);

//         assertEquals(200, response.getStatusCodeValue());
//         assertEquals(tracker, response.getBody());
//         verify(trackerService, times(1)).createTracker(any(Tracker.class));
//     }

//     @Test
//     public void testAllUsersTrackers() {
//         Tracker tracker1 = new Tracker();
//         tracker1.setId(1L);

//         Tracker tracker2 = new Tracker();
//         tracker2.setId(2L);

//         List<Tracker> trackers = Arrays.asList(tracker1, tracker2);
//         when(trackerService.displayAllbyUserIdAndGoalId(1, 1)).thenReturn(trackers);

//         ResponseEntity<List<Tracker>> response = trackerController.AllUsersTrackers(1, 1);

//         assertEquals(200, response.getStatusCodeValue());
//         assertEquals(trackers, response.getBody());
//         verify(trackerService, times(1)).displayAllbyUserIdAndGoalId(1, 1);
//     }

//     @Test
//     public void testUpdateTickets() {
//         Tracker tracker = new Tracker();
//         tracker.setId(1L);

//         when(trackerService.UpdatedTrackerAllById(1, tracker)).thenReturn(1);

//         ResponseEntity<Integer> response = trackerController.UpdateTickets(1, tracker);

//         assertEquals(200, response.getStatusCodeValue());
//         assertEquals(1, response.getBody());
//         verify(trackerService, times(1)).UpdatedTrackerAllById(1, tracker);
//     }
// }