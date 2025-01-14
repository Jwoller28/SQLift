package com.example.proj2.services;

import com.example.proj2.entity.PersonalEvent;
import com.example.proj2.repositories.PersonalEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.example.proj2.Services.PersonalEventService;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class PersonalEventServiceTest {

    @InjectMocks
    private PersonalEventService personalEventService;

    @Mock
    private PersonalEventRepository personalEventRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreatePersonalEvent() {
        PersonalEvent event = new PersonalEvent();
        event.setTitle("Test Event");

        when(personalEventRepository.save(any(PersonalEvent.class))).thenReturn(event);

        PersonalEvent result = personalEventService.createPersonalEvent(event);

        assertEquals("Test Event", result.getTitle());
        verify(personalEventRepository, times(1)).save(any(PersonalEvent.class));
    }

    @Test
    public void testGetPersonalEventsByUserId() {
        PersonalEvent event1 = new PersonalEvent();
        event1.setId(1);
        event1.setTitle("Event 1");

        PersonalEvent event2 = new PersonalEvent();
        event2.setId(2);
        event2.setTitle("Event 2");

        List<PersonalEvent> events = Arrays.asList(event1, event2);
        when(personalEventRepository.findByUserId(1)).thenReturn(events);

        List<PersonalEvent> result = personalEventService.getPersonalEventsByUserId(1);

        assertEquals(2, result.size());
        verify(personalEventRepository, times(1)).findByUserId(1);
    }
}