package com.example.proj2.controllers;

import com.example.proj2.Controllers.PersonalEventController;
import com.example.proj2.Services.PersonalEventService;
import com.example.proj2.Services.UserService;
import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.PersonalEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class PersonalEventControllerTest {

    @InjectMocks
    private PersonalEventController personalEventController;

    @Mock
    private PersonalEventService personalEventService;

    @Mock
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateEvent() throws Exception{
        Map<String, String> payload = new HashMap<>();
        payload.put("userId", "1");
        payload.put("day", "2023-01-01");
        payload.put("title", "Test Event");
        payload.put("description", "Event Description");

        AppUser user = new AppUser();
        user.setId(1);

        PersonalEvent event = new PersonalEvent();
        event.setDay("2023-01-01");
        event.setTitle("Test Event");
        event.setDescription("Event Description");
        event.setUser(user);

        when(userService.getUserByID(1)).thenReturn(user);
        when(personalEventService.createPersonalEvent(any(PersonalEvent.class))).thenReturn(event);

        ResponseEntity<?> response = personalEventController.createEvent(payload);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(event, response.getBody());
        verify(userService, times(1)).getUserByID(1);
        verify(personalEventService, times(1)).createPersonalEvent(any(PersonalEvent.class));
    }

    @Test
    public void testGetEvents() throws Exception{
        AppUser user = new AppUser();
        user.setId(1);

        PersonalEvent event1 = new PersonalEvent();
        event1.setId(1);
        event1.setTitle("Event 1");

        PersonalEvent event2 = new PersonalEvent();
        event2.setId(2);
        event2.setTitle("Event 2");

        List<PersonalEvent> events = Arrays.asList(event1, event2);

        when(userService.getUserByID(1)).thenReturn(user);
        when(personalEventService.getPersonalEventsByUserId(1)).thenReturn(events);

        ResponseEntity<?> response = personalEventController.getEvents(1);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(events, response.getBody());
        verify(userService, times(1)).getUserByID(1);
        verify(personalEventService, times(1)).getPersonalEventsByUserId(1);
    }
}
