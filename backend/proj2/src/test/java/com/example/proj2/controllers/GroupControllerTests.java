package test.java.com.example.proj2.controllers;
import com.example.proj2.Dto.CreateGroupDto;
import com.example.proj2.Services.GroupService;
import com.example.proj2.entity.Group;
import com.example.proj2.entity.GroupEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;




class GroupControllerTest {

    private GroupController groupController;
    private GroupService groupService;

    @BeforeEach
    void setUp() {
        groupService = Mockito.mock(GroupService.class);
        groupController = new GroupController(groupService);
    }

    @Test
    void getAllGroups_Success() {
        List<Group> groups = new ArrayList<>();
        Group group = new Group();
        group.setId(1);
        group.setName("Test Group");
        groups.add(group);

        when(groupService.getAllGroups()).thenReturn(groups);

        ResponseEntity<?> response = groupController.getAllGroups(1);

        assertEquals(ResponseEntity.ok().build().getStatusCode(), response.getStatusCode());
        List<Map<String, Object>> responseBody = (List<Map<String, Object>>) response.getBody();
        assertNotNull(responseBody);
        assertEquals(1, responseBody.size());
        assertEquals("Test Group", responseBody.get(0).get("name"));
    }

    @Test
    void createNewGroup_Success() {
        CreateGroupDto dto = new CreateGroupDto();
        dto.setName("New Group");

        Group group = new Group();
        group.setName("New Group");

        when(groupService.createGroup(anyString())).thenReturn(group);

        Group response = groupController.createNewGroup(dto);

        assertNotNull(response);
        assertEquals("New Group", response.getName());
    }

    @Test
    void joinGroup_Success() {
        doNothing().when(groupService).joinGroup(anyInt(), anyInt());

        ResponseEntity<?> response = groupController.joinGroup(1, 1);

        assertEquals(ResponseEntity.ok("User joined group successfully.").getStatusCode(), response.getStatusCode());
        verify(groupService, times(1)).joinGroup(anyInt(), anyInt());
    }

    @Test
    void joinGroup_Exception() {
        doThrow(new RuntimeException("Join group failed")).when(groupService).joinGroup(anyInt(), anyInt());

        ResponseEntity<?> response = groupController.joinGroup(1, 1);

        assertEquals(ResponseEntity.badRequest().body("Join group failed").getStatusCode(), response.getStatusCode());
        verify(groupService, times(1)).joinGroup(anyInt(), anyInt());
    }

    @Test
    void leaveGroup_Success() {
        doNothing().when(groupService).leaveGroup(anyInt(), anyInt());

        ResponseEntity<?> response = groupController.leaveGroup(1, 1);

        assertEquals(ResponseEntity.ok("User left group successfully.").getStatusCode(), response.getStatusCode());
        verify(groupService, times(1)).leaveGroup(anyInt(), anyInt());
    }

    @Test
    void leaveGroup_Exception() {
        doThrow(new RuntimeException("Leave group failed")).when(groupService).leaveGroup(anyInt(), anyInt());

        ResponseEntity<?> response = groupController.leaveGroup(1, 1);

        assertEquals(ResponseEntity.badRequest().body("Leave group failed").getStatusCode(), response.getStatusCode());
        verify(groupService, times(1)).leaveGroup(anyInt(), anyInt());
    }

    @Test
    void listGroupEvents_Success() {
        List<GroupEvent> events = new ArrayList<>();
        GroupEvent event = new GroupEvent();
        event.setTitle("Test Event");
        events.add(event);

        when(groupService.getGroupEvents(anyInt())).thenReturn(events);

        ResponseEntity<?> response = groupController.listGroupEvents(1);

        assertEquals(ResponseEntity.ok().build().getStatusCode(), response.getStatusCode());
        List<GroupEvent> responseBody = (List<GroupEvent>) response.getBody();
        assertNotNull(responseBody);
        assertEquals(1, responseBody.size());
        assertEquals("Test Event", responseBody.get(0).getTitle());
    }

    @Test
    void listGroupEvents_Exception() {
        doThrow(new RuntimeException("List events failed")).when(groupService).getGroupEvents(anyInt());

        ResponseEntity<?> response = groupController.listGroupEvents(1);

        assertEquals(ResponseEntity.badRequest().body("List events failed").getStatusCode(), response.getStatusCode());
        verify(groupService, times(1)).getGroupEvents(anyInt());
    }

    @Test
    void createEvent_Success() {
        GroupEvent event = new GroupEvent();
        event.setTitle("New Event");

        when(groupService.createGroupEvent(anyInt(), anyString(), anyString(), anyString())).thenReturn(event);

        ResponseEntity<?> response = groupController.createEvent(1, "New Event", "Description", "Day");

        assertEquals(ResponseEntity.ok().build().getStatusCode(), response.getStatusCode());
        GroupEvent responseBody = (GroupEvent) response.getBody();
        assertNotNull(responseBody);
        assertEquals("New Event", responseBody.getTitle());
    }

    @Test
    void createEvent_Exception() {
        doThrow(new RuntimeException("Create event failed")).when(groupService).createGroupEvent(anyInt(), anyString(), anyString(), anyString());

        ResponseEntity<?> response = groupController.createEvent(1, "New Event", "Description", "Day");

        assertEquals(ResponseEntity.badRequest().body("Create event failed").getStatusCode(), response.getStatusCode());
        verify(groupService, times(1)).createGroupEvent(anyInt(), anyString(), anyString(), anyString());
    }
}
