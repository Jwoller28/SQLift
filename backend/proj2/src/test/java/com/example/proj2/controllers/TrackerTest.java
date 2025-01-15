package com.example.proj2.controllers;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.proj2.Controllers.TrackerController;
import com.example.proj2.Services.TrackerService;
import com.example.proj2.entity.Tracker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.ArrayList;

class TrackerTest {

    @Mock
    private TrackerService trackerService;

    @InjectMocks
    private TrackerController trackerController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateTrackerSuccess() throws Exception {
        Tracker trackerDto = new Tracker();
        Tracker mockTracker = new Tracker();

        when(trackerService.createTracker(trackerDto)).thenReturn(mockTracker);

        ResponseEntity<Tracker> response = trackerController.createTracker(trackerDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockTracker, response.getBody());
    }

    @Test
    void testCreateTrackerFailure() throws Exception {
        Tracker trackerDto = new Tracker();

        when(trackerService.createTracker(trackerDto)).thenThrow(new RuntimeException("Error"));

        ResponseEntity<Tracker> response = trackerController.createTracker(trackerDto);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testAllUsersTrackersSuccess() {
        Integer userId = 1;
        Integer goalId = 2;
        List<Tracker> mockTrackers = new ArrayList<>();
        mockTrackers.add(new Tracker());

        when(trackerService.displayAllbyUserIdAndGoalId(userId, goalId)).thenReturn(mockTrackers);

        ResponseEntity<List<Tracker>> response = trackerController.AllUsersTrackers(userId, goalId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockTrackers, response.getBody());
    }

    @Test
    void testAllUsersTrackersFailure() {
        Integer userId = 1;
        Integer goalId = 2;

        when(trackerService.displayAllbyUserIdAndGoalId(userId, goalId)).thenThrow(new RuntimeException("Error"));

        ResponseEntity<List<Tracker>> response = trackerController.AllUsersTrackers(userId, goalId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testUpdateTicketsSuccess() {
        Integer trackerId = 1;
        Tracker tracker = new Tracker();

        when(trackerService.UpdatedTrackerAllById(trackerId, tracker)).thenReturn(1);

        ResponseEntity<Integer> response = trackerController.UpdateTickets(trackerId, tracker);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody());
    }

    @Test
    void testUpdateTicketsFailure() {
        Integer trackerId = 1;
        Tracker tracker = new Tracker();

        when(trackerService.UpdatedTrackerAllById(trackerId, tracker)).thenReturn(0);

        ResponseEntity<Integer> response = trackerController.UpdateTickets(trackerId, tracker);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
    }
}