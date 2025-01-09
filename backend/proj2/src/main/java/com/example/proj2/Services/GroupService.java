package com.example.proj2.Services;

import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Group;
import com.example.proj2.entity.GroupEvent;
import com.example.proj2.repositories.AppUserRepository;
import com.example.proj2.repositories.GroupRepository;
import com.example.proj2.repositories.GroupEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    private final GroupRepository groupRepo;
    private final GroupEventRepository eventRepo;
    private final AppUserRepository userRepo;

    public GroupService(GroupRepository groupRepo, GroupEventRepository eventRepo, AppUserRepository userRepo) {
        this.groupRepo = groupRepo;
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
    }

    // GET /groups
    public List<Group> getAllGroups() {
        return groupRepo.findAll();
    }

    // POST /groups
    public Group createGroup(String name) {
        Group g = new Group();
        g.setName(name);
        return groupRepo.save(g);
    }

    // user joins
    public void joinGroup(int groupId, int userId) throws Exception {
        Group g = groupRepo.findById(groupId).orElseThrow(() -> new Exception("Group not found"));
        AppUser u = userRepo.findById(userId).orElseThrow(() -> new Exception("User not found"));

        g.getMembers().add(u);
        u.getGroups().add(g);

        groupRepo.save(g);
        userRepo.save(u);
    }

    // user leaves
    public void leaveGroup(int groupId, int userId) throws Exception {
        Group g = groupRepo.findById(groupId).orElseThrow(() -> new Exception("Group not found"));
        AppUser u = userRepo.findById(userId).orElseThrow(() -> new Exception("User not found"));

        g.getMembers().remove(u);
        u.getGroups().remove(g);

        groupRepo.save(g);
        userRepo.save(u);
    }

    // create group event
    public GroupEvent createGroupEvent(int groupId, String title, String desc, String day) throws Exception {
        Group g = groupRepo.findById(groupId).orElseThrow(() -> new Exception("Group not found"));

        GroupEvent evt = new GroupEvent();
        evt.setTitle(title);
        evt.setDescription(desc);
        evt.setDay(day);
        evt.setGroup(g);
        return eventRepo.save(evt);
    }

    // list group events
    public List<GroupEvent> getGroupEvents(int groupId) throws Exception {
        return eventRepo.findAllByGroupId(groupId);
    }

    public List<GroupEvent> getGroupEventsForDay(int groupId, String day) throws Exception {
        return eventRepo.findAllByGroupIdAndDay(groupId, day);
    }
}
