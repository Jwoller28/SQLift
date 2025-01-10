package com.example.proj2.Controllers;
import com.example.proj2.Dto.CreateGroupDto;
import com.example.proj2.service.GroupService;
import com.example.proj2.entity.Group;
import com.example.proj2.entity.GroupEvent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;


import java.util.List;

@RestController
@RequestMapping("/groups")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    // GET /groups
    @GetMapping
    public ResponseEntity<?> getAllGroups(@RequestParam int userId) {
        List<Group> groups = groupService.getAllGroups();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Group group : groups) {
            Map<String, Object> groupInfo = new HashMap<>();
            groupInfo.put("id", group.getId());
            groupInfo.put("name", group.getName());
            groupInfo.put("isMember", group.getMembers().stream().anyMatch(member -> member.getId() == userId));
            response.add(groupInfo);
        }

        return ResponseEntity.ok(response);
    }


    // POST /groups  (body is just a string or a JSON with "name")
    @PostMapping
    public Group createNewGroup(@RequestBody CreateGroupDto dto) {
        return groupService.createGroup(dto.getName());
    }


    // user joins => /groups/{groupId}/join?userId=123
    @PostMapping("/{groupId}/join")
    public ResponseEntity<?> joinGroup(@PathVariable int groupId,
                                       @RequestParam int userId) {
        try {
            groupService.joinGroup(groupId, userId);
            return ResponseEntity.ok("User joined group successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // user leaves => /groups/{groupId}/leave?userId=123
    @PostMapping("/{groupId}/leave")
    public ResponseEntity<?> leaveGroup(@PathVariable int groupId,
                                        @RequestParam int userId) {
        try {
            groupService.leaveGroup(groupId, userId);
            return ResponseEntity.ok("User left group successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /groups/{groupId}/events => list events
    @GetMapping("/{groupId}/events")
    public ResponseEntity<?> listGroupEvents(@PathVariable int groupId) {
        try {
            List<GroupEvent> evts = groupService.getGroupEvents(groupId);
            return ResponseEntity.ok(evts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST /groups/{groupId}/events => create event
    @PostMapping("/{groupId}/events")
    public ResponseEntity<?> createGroupEvent(
        @PathVariable int groupId,
        @RequestBody Map<String, String> eventData
    ) {
        try {
            String title = eventData.get("title");
            String description = eventData.get("description");
            String day = eventData.get("day");
            GroupEvent event = groupService.createGroupEvent(groupId, title, description, day);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

