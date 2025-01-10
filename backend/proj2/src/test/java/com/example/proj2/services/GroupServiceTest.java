package test.java.com.example.proj2.services;

import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Group;
import com.example.proj2.repositories.AppUserRepository;
import com.example.proj2.repositories.GroupEventRepository;
import com.example.proj2.repositories.GroupRepository;
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

public class GroupServiceTest {

    @Mock
    private GroupRepository groupRepo;

    @Mock
    private GroupEventRepository eventRepo;

    @Mock
    private AppUserRepository userRepo;

    @InjectMocks
    private GroupService groupService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllGroups_Success() {
        Group group = new Group();
        List<Group> groups = Collections.singletonList(group);
        when(groupRepo.findAll()).thenReturn(groups);

        List<Group> result = groupService.getAllGroups();

        assertEquals(groups, result);
    }

    @Test
    public void testCreateGroup_Success() {
        Group group = new Group();
        group.setName("Test Group");
        when(groupRepo.save(group)).thenReturn(group);

        Group result = groupService.createGroup("Test Group");

        assertEquals(group, result);
    }

    @Test
    public void testJoinGroup_Success() throws Exception {
        Group group = new Group();
        AppUser user = new AppUser();
        when(groupRepo.findById(1)).thenReturn(Optional.of(group));
        when(userRepo.findById(1)).thenReturn(Optional.of(user));

        groupService.joinGroup(1, 1);

        // No exception means success
    }

    @Test
    public void testJoinGroup_GroupNotFound() {
        when(groupRepo.findById(1)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            groupService.joinGroup(1, 1);
        });

        assertEquals("Group not found", exception.getMessage());
    }

    @Test
    public void testJoinGroup_UserNotFound() {
        Group group = new Group();
        when(groupRepo.findById(1)).thenReturn(Optional.of(group));
        when(userRepo.findById(1)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            groupService.joinGroup(1, 1);
        });

        assertEquals("User not found", exception.getMessage());
    }
}
