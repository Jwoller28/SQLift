package com.example.proj2.Controllers;

import com.example.proj2.Services.GoalService;
import com.example.proj2.Services.TrackerService;
import com.example.proj2.entity.Goal;
import com.example.proj2.entity.Tracker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }
    private static final Logger logger = LoggerFactory.getLogger(GoalController.class);

    @PostMapping("goal")
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal) {
        try{
            logger.error("creating Tracker "+goal);
            Goal newGoal = goalService.createGoal(goal);


            return ResponseEntity.ok(newGoal);
        }
        catch (Exception e){
            logger.error("error creating Tracker "+goal);
            return ResponseEntity.status(401).body(null);
        }
    }
    @GetMapping("goalUser/{userId}")
    public ResponseEntity<Goal> getUsersGoal(@PathVariable Integer goalId) {
        try{
            Goal newGoal = goalService.getUsersGoal(goalId);

            return ResponseEntity.ok(newGoal);
        }catch(Exception e){

            return ResponseEntity.status(400).body(null);
        }}

        @GetMapping("goalId/{goalId}")
        public ResponseEntity<Goal> getGoalByGoalId(@PathVariable Integer goalId) {
            try{
                Goal newGoal = goalService.getUsersGoal(goalId);

                return ResponseEntity.ok(newGoal);
            }catch(Exception e){

                return ResponseEntity.status(400).body(null);
            }



    }

    @PatchMapping("goal/{userId}")
    public ResponseEntity<Integer> UpdateGoal(@PathVariable Integer goalId,Goal goal) {
        logger.info("Attempting to update tracker with Date: {}",goalId );  // Log ticket update attempt

        int confirmation = goalService.UpdatedGoalAllById(goalId,goal);
        if (confirmation == 1) {
            logger.info("Ticket ID: {} updated successfully", goalId);  // Log successful ticket update
            return ResponseEntity.ok(confirmation);
        } else {
            logger.error("Failed to update ticket with ID: {}", goalId);  // Log failed ticket update
            return ResponseEntity.status(400).body(null);
        }
    }



}

