// package com.example.proj2.services;

// import com.example.proj2.entity.AppUser;
// import com.example.proj2.entity.Group;
// import com.example.proj2.entity.GroupEvent;
// import com.example.proj2.repositories.AppUserRepository;
// import com.example.proj2.repositories.GroupEventRepository;
// import com.example.proj2.repositories.GroupRepository;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import com.example.proj2.Services.GroupService;

// import java.util.Arrays;
// import java.util.List;
// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertThrows;
// import static org.mockito.Mockito.*;

// public class GroupServiceTest {

//     @InjectMocks
//     private GroupService groupService;

//     @Mock
//     private GroupRepository groupRepo;

//     @Mock
//     private GroupEventRepository eventRepo;

//     @Mock
//     private AppUserRepository userRepo;

//     @BeforeEach
//     public void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     public void testGetAllGroups() {
//         Group group1 = new Group();
//         group1.setId(1);
//         group1.setName("Group 1");

//         Group group2 = new Group();
//         group2.setId(2);
//         group2.setName("Group 2");

//         List<Group> groups = Arrays.asList(group1, group2);
//         when(groupRepo.findAll()).thenReturn(groups);

//         List<Group> result = groupService.getAllGroups();

//         assertEquals(2, result.size());
//         verify(groupRepo, times(1)).findAll();
//     }

//     @Test
//     public void testCreateGroup() {
//         Group group = new Group();
//         group.setName("New Group");

//         when(groupRepo.save(any(Group.class))).thenReturn(group);

//         Group result = groupService.createGroup("New Group");

//         assertEquals("New Group", result.getName());
//         verify(groupRepo, times(1)).save(any(Group.class));
//     }

//     @Test
//     public void testJoinGroup() throws Exception {
//         Group group = new Group();
//         group.setId(1);

//         AppUser user = new AppUser();
//         user.setId(1);

//         when(groupRepo.findById(1)).thenReturn(Optional.of(group));
//         when(userRepo.findById(1)).thenReturn(Optional.of(user));

//         groupService.joinGroup(1, 1);

//         verify(groupRepo, times(1)).findById(1);
//         verify(userRepo, times(1)).findById(1);
//         verify(groupRepo, times(1)).save(group);
//         verify(userRepo, times(1)).save(user);
//     }

//     @Test
//     public void testLeaveGroup() throws Exception {
//         Group group = new Group();
//         group.setId(1);

//         AppUser user = new AppUser();
//         user.setId(1);

//         when(groupRepo.findById(1)).thenReturn(Optional.of(group));
//         when(userRepo.findById(1)).thenReturn(Optional.of(user));

//         groupService.leaveGroup(1, 1);

//         verify(groupRepo, times(1)).findById(1);
//         verify(userRepo, times(1)).findById(1);
//         verify(groupRepo, times(1)).save(group);
//         verify(userRepo, times(1)).save(user);
//     }

//     @Test
//     public void testCreateGroupEvent() throws Exception {
//         Group group = new Group();
//         group.setId(1);

//         GroupEvent event = new GroupEvent();
//         event.setTitle("New Event");
//         event.setDescription("Event Description");
//         event.setDay("2023-01-01");
//         event.setGroup(group);

//         when(groupRepo.findById(1)).thenReturn(Optional.of(group));
//         when(eventRepo.save(any(GroupEvent.class))).thenReturn(event);

//         GroupEvent result = groupService.createGroupEvent(1, "New Event", "Event Description", "2023-01-01");

//         assertEquals("New Event", result.getTitle());
//         verify(groupRepo, times(1)).findById(1);
//         verify(eventRepo, times(1)).save(any(GroupEvent.class));
//     }

//     @Test
//     public void testGetGroupEvents() throws Exception {
//         GroupEvent event1 = new GroupEvent();
//         event1.setId(1);
//         event1.setTitle("Event 1");

//         GroupEvent event2 = new GroupEvent();
//         event2.setId(2);
//         event2.setTitle("Event 2");

//         List<GroupEvent> events = Arrays.asList(event1, event2);
//         when(eventRepo.findAllByGroupId(1)).thenReturn(events);

//         List<GroupEvent> result = groupService.getGroupEvents(1);

//         assertEquals(2, result.size());
//         verify(eventRepo, times(1)).findAllByGroupId(1);
//     }

//     @Test
//     public void testGetGroupEventsForDay() throws Exception {
//         GroupEvent event1 = new GroupEvent();
//         event1.setId(1);
//         event1.setTitle("Event 1");

//         GroupEvent event2 = new GroupEvent();
//         event2.setId(2);
//         event2.setTitle("Event 2");

//         List<GroupEvent> events = Arrays.asList(event1, event2);
//         when(eventRepo.findAllByGroupIdAndDay(1, "2023-01-01")).thenReturn(events);

//         List<GroupEvent> result = groupService.getGroupEventsForDay(1, "2023-01-01");

//         assertEquals(2, result.size());
//         verify(eventRepo, times(1)).findAllByGroupIdAndDay(1, "2023-01-01");
//     }
// }