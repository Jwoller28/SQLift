package com.example.proj2.Controllers;

import java.util.List;
import com.example.proj2.Services.GoalService;
import com.example.proj2.entity.Goal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.proj2.Services.UserService;



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
    public ResponseEntity<Goal> getUsersGoal(@PathVariable Integer userId) {
        try{
            logger.error("attempting to get newGoal with Id of "+userId);
            Goal newGoal = goalService.getUsersGoal(userId);

            return ResponseEntity.ok(newGoal);
        }catch(Exception e){

            return ResponseEntity.status(400).body(null);
        }}

    @GetMapping("goalsUser/{userId}")
    public ResponseEntity<List<Goal>> getUsersGoals(@PathVariable Integer userId) {
    	try{
            logger.error("attempting to get all goals with Id of "+userId);
            List<Goal> allGoals = goalService.getAllGoalsbyUser(userId);

            return ResponseEntity.ok(allGoals);
        }
	catch(Exception e){

            return ResponseEntity.status(400).body(null);
        }
    }

        @GetMapping("goalId/{goalId}")
        public ResponseEntity<Goal> getGoalByGoalId(@PathVariable Integer goalId) {
            try{
                Goal newGoal = goalService.getByGoalId(goalId);

                return ResponseEntity.ok(newGoal);
            }catch(Exception e){

                return ResponseEntity.status(400).body(null);
            }



    }

    @PatchMapping("goal/{userId}")
    public ResponseEntity<Integer> UpdateGoal(@PathVariable Integer userId,@RequestBody Goal goal) {
        logger.info("Attempting to update goal with Date: {}",userId );  // Log ticket update attempt

        int confirmation = goalService.UpdatedGoalAllById(userId,goal);
        if (confirmation == 1) {
            logger.info("Ticket ID: {} updated successfully", userId);  // Log successful ticket update
            return ResponseEntity.ok(confirmation);
        } else {
            logger.error("Failed to update ticket with ID: {}", userId);  // Log failed ticket update
            return ResponseEntity.status(400).body(null);
        }
    }



    @DeleteMapping("goal/{goalId}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Integer goalId) {
        logger.info("Attempting to delete goal with ID: {}", goalId);
        try {
            goalService.deleteGoal(goalId);
            logger.info("Goal with ID: {} deleted successfully", goalId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Failed to delete goal with ID: {}", goalId, e);
            return ResponseEntity.status(404).build();
        }
    }


    @PostMapping("/resetGoals/{userId}")
    public ResponseEntity<String> resetUserGoals(@PathVariable Integer userId) {
        boolean success = goalService.resetGoalsForUser(userId);
        if (success) {
            return ResponseEntity.ok("Goals reset successfully!");
        }
        return ResponseEntity.status(404).body("User goals not found or reset failed.");
    }

}

