package com.example.proj2.Controllers;

import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.PersonalEvent;
import com.example.proj2.service.PersonalEventService;
import com.example.proj2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/personal-events")
public class PersonalEventController {

    @Autowired
    private PersonalEventService personalEventService;

    @Autowired
    private UserService userService; // Assuming you have a service to fetch user details from Authentication

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Map<String, String> payload) {
        try {
            int userId = Integer.parseInt(payload.get("userId"));
            AppUser user = userService.getUserByID(userId);

            if (user == null) {
                return ResponseEntity.status(403).body("User not authenticated");
            }

            PersonalEvent event = new PersonalEvent();
            event.setDay((String) payload.get("day"));
            event.setTitle((String) payload.get("title"));
            event.setDescription((String) payload.get("description"));
            event.setUser(user);

            PersonalEvent createdEvent = personalEventService.createPersonalEvent(event);
            return ResponseEntity.ok(createdEvent);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }





    @GetMapping("/{userId}")
    public ResponseEntity<?> getEvents(@PathVariable int userId) {
        try {
            // Fetch the user from the database using the userId
            AppUser user = userService.getUserByID(userId);

            if (user == null) {
                return ResponseEntity.status(403).body("User not found or not authenticated");
            }

            // Fetch the events for the user
            List<PersonalEvent> events = personalEventService.getPersonalEventsByUserId(userId);

            return ResponseEntity.ok(events);

        } catch (Exception e) {
            // Handle exceptions, e.g., if user is not found
            return ResponseEntity.status(403).body("Error: " + e.getMessage());
        }
    }

}
