package com.example.proj2.controllers;

import com.example.proj2.Controllers.GroupController;
import com.example.proj2.Dto.CreateGroupDto;
import com.example.proj2.Services.GroupService;
import com.example.proj2.entity.Group;
import com.example.proj2.entity.GroupEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;


import java.util.*;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


public class GroupControllerTest {


    @InjectMocks
    private GroupController groupController;

    @Mock
    private GroupService groupService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllGroups() {
        Group group1 = new Group();
        group1.setId(1);
        group1.setName("Group 1");

        Group group2 = new Group();
        group2.setId(2);
        group2.setName("Group 2");

        List<Group> groups = Arrays.asList(group1, group2);
        when(groupService.getAllGroups()).thenReturn(groups);

        ResponseEntity<?> response = groupController.getAllGroups(1);

        assertEquals(200, response.getStatusCodeValue());
        List<Map<String, Object>> responseBody = (List<Map<String, Object>>) response.getBody();
        assertEquals(2, responseBody.size());
        verify(groupService, times(1)).getAllGroups();
    }

    @Test
    public void testCreateNewGroup() {
        CreateGroupDto dto = new CreateGroupDto();
        dto.setName("New Group");

        Group group = new Group();
        group.setId(1);
        group.setName("New Group");

        when(groupService.createGroup("New Group")).thenReturn(group);
        when(groupService.createGroup("New Group")).thenReturn(group);

        Group response = groupController.createNewGroup(dto);
        Group response = groupController.createNewGroup(dto);

        assertEquals("New Group", response.getName());
        verify(groupService, times(1)).createGroup("New Group");
        assertEquals("New Group", response.getName());
        verify(groupService, times(1)).createGroup("New Group");
    }

    @Test
    public void testJoinGroup() throws Exception {
        doNothing().when(groupService).joinGroup(1, 1);
    @Test
    public void testJoinGroup() throws Exception {
        doNothing().when(groupService).joinGroup(1, 1);

        ResponseEntity<?> response = groupController.joinGroup(1, 1);
        ResponseEntity<?> response = groupController.joinGroup(1, 1);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("User joined group successfully.", response.getBody());
        verify(groupService, times(1)).joinGroup(1, 1);
    }
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("User joined group successfully.", response.getBody());
        verify(groupService, times(1)).joinGroup(1, 1);
    }

    @Test
    public void testLeaveGroup()  throws Exception{
        doNothing().when(groupService).leaveGroup(1, 1);
    @Test
    public void testLeaveGroup()  throws Exception{
        doNothing().when(groupService).leaveGroup(1, 1);

        ResponseEntity<?> response = groupController.leaveGroup(1, 1);
        ResponseEntity<?> response = groupController.leaveGroup(1, 1);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("User left group successfully.", response.getBody());
        verify(groupService, times(1)).leaveGroup(1, 1);
    }
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("User left group successfully.", response.getBody());
        verify(groupService, times(1)).leaveGroup(1, 1);
    }

    @Test
    public void testListGroupEvents() throws Exception {
        GroupEvent event1 = new GroupEvent();
        event1.setId(1);
        event1.setTitle("Event 1");
    @Test
    public void testListGroupEvents() throws Exception {
        GroupEvent event1 = new GroupEvent();
        event1.setId(1);
        event1.setTitle("Event 1");

        GroupEvent event2 = new GroupEvent();
        event2.setId(2);
        event2.setTitle("Event 2");
        GroupEvent event2 = new GroupEvent();
        event2.setId(2);
        event2.setTitle("Event 2");

        List<GroupEvent> events = Arrays.asList(event1, event2);
        when(groupService.getGroupEvents(1)).thenReturn(events);
        List<GroupEvent> events = Arrays.asList(event1, event2);
        when(groupService.getGroupEvents(1)).thenReturn(events);

        ResponseEntity<?> response = groupController.listGroupEvents(1);
        ResponseEntity<?> response = groupController.listGroupEvents(1);

        assertEquals(200, response.getStatusCodeValue());
        List<GroupEvent> responseBody = (List<GroupEvent>) response.getBody();
        assertEquals(2, responseBody.size());
        verify(groupService, times(1)).getGroupEvents(1);
    }
        assertEquals(200, response.getStatusCodeValue());
        List<GroupEvent> responseBody = (List<GroupEvent>) response.getBody();
        assertEquals(2, responseBody.size());
        verify(groupService, times(1)).getGroupEvents(1);
    }

    @Test
    public void testCreateGroupEvent() throws Exception {
        Map<String, String> eventData = new HashMap<>();
        eventData.put("title", "New Event");
        eventData.put("description", "Event Description");
        eventData.put("day", "2023-01-01");
    @Test
    public void testCreateGroupEvent() throws Exception {
        Map<String, String> eventData = new HashMap<>();
        eventData.put("title", "New Event");
        eventData.put("description", "Event Description");
        eventData.put("day", "2023-01-01");

        GroupEvent event = new GroupEvent();
        event.setId(1);
        event.setTitle("New Event");
        GroupEvent event = new GroupEvent();
        event.setId(1);
        event.setTitle("New Event");

        when(groupService.createGroupEvent(1, "New Event", "Event Description", "2023-01-01")).thenReturn(event);
        when(groupService.createGroupEvent(1, "New Event", "Event Description", "2023-01-01")).thenReturn(event);

        ResponseEntity<?> response = groupController.createGroupEvent(1, eventData);
        ResponseEntity<?> response = groupController.createGroupEvent(1, eventData);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(event, response.getBody());
        verify(groupService, times(1)).createGroupEvent(1, "New Event", "Event Description", "2023-01-01");
    }
}
