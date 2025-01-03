package com.example.proj2.Controllers;


import com.example.proj2.Services.UserService;
import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Tracker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("userId/{userId}")
    public ResponseEntity<AppUser>getUserByID(@PathVariable Integer userId){
        try{
            AppUser user=userService.getUserByID(userId);
            return ResponseEntity.status(200).body(user);

          }catch (Exception e){
            logger.error("failed to get user",e);
            return ResponseEntity.status(409).body(null);
        }


    }
    @GetMapping("username/{username}")
    public ResponseEntity<AppUser>getUserByUsername(@PathVariable String username){
        try{
            AppUser user=userService.getUserByUsername(username);
            return ResponseEntity.status(200).body(user);

        }catch (Exception e){
            logger.error("failed to get user",e);
            return ResponseEntity.status(409).body(null);
        }


    }
    @PatchMapping("user/{userId}")
    public ResponseEntity<Integer> UpdateTickets(@PathVariable Integer userId, @RequestBody AppUser appUser) {
        logger.info("Attempting to update tracker with Date: {}",userId );  // Log ticket update attempt

        int confirmation = userService.updateUser(userId, appUser);
        if (confirmation == 1) {
            logger.info("Ticket ID: {} updated successfully", userId);  // Log successful ticket update
            return ResponseEntity.ok(confirmation);
        } else {
            logger.error("Failed to update ticket with ID: {}", userId);  // Log failed ticket update
            return ResponseEntity.status(400).body(null);
        }
    }

}
