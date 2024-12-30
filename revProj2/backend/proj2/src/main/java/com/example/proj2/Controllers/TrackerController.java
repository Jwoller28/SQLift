package com.example.proj2.Controllers;


import com.example.proj2.Services.TrackerService;
import com.example.proj2.entity.Tracker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class TrackerController {

    private final TrackerService trackerService;

    public TrackerController(TrackerService trackerService) {
        this.trackerService = trackerService;
    }
    private static final Logger logger = LoggerFactory.getLogger(TrackerController.class);

    @PostMapping("Tracker")
    public ResponseEntity<Tracker> createTracker(@RequestBody Tracker trackerDto) {
        try{
            logger.error("creating Tracker "+trackerDto);
        Tracker newTracker = trackerService.createTracker(trackerDto);

            return ResponseEntity.ok(newTracker);
        }
        catch (Exception e){
            logger.error("error creating Tracker "+trackerDto);
            return ResponseEntity.status(401).body(null);
        }
    }
    @GetMapping("Tracker/{userId}/{goalId}")
    public ResponseEntity<List<Tracker>> AllUsersTackers(@PathVariable Integer userId,
                                                         @PathVariable Integer goalId) {
        try{
        List<Tracker> trackerList = trackerService.displayAllbyUserIdAndGoalId(userId,goalId);

        return ResponseEntity.ok(trackerList);
        }catch(Exception e){

            return ResponseEntity.status(400).body(null);
        }



    }

    @PatchMapping("tracker/{trackerId}")
    public ResponseEntity<Integer> UpdateTickets(@PathVariable Integer trackerId, @RequestBody Tracker tracker) {
        logger.info("Attempting to update tracker with Date: {}",trackerId );  // Log ticket update attempt

        int confirmation = trackerService.UpdatedTrackerAllById(trackerId,tracker);
        if (confirmation == 1) {
            logger.info("Ticket ID: {} updated successfully", trackerId);  // Log successful ticket update
            return ResponseEntity.ok(confirmation);
        } else {
            logger.error("Failed to update ticket with ID: {}", trackerId);  // Log failed ticket update
            return ResponseEntity.status(400).body(null);
        }
    }



}
