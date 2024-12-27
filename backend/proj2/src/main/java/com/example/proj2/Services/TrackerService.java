package com.example.proj2.Services;


import com.example.proj2.Controllers.TrackerController;
import com.example.proj2.Dto.TrackerDto;
import com.example.proj2.entity.Tracker;
import com.example.proj2.entity.type.Exercise;
import com.example.proj2.entity.type.Nutrition;
import com.example.proj2.repositories.TrackerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TrackerService {
    @Autowired
    TrackerRepository trackerRepository;
    private static final Logger logger = LoggerFactory.getLogger(TrackerService.class);

    public TrackerService(TrackerRepository trackerRepository) {
        this.trackerRepository = trackerRepository;
    }
    public Tracker createTracker(Tracker tracker) throws Exception {
        logger.error("attempting to save "+tracker);
        return trackerRepository.save(tracker);
    }


    public List<Tracker> displayAllbyUserIdAndGoalId(Integer userId,Integer goalId){
       Optional<List<Tracker>> ticketsOptional=trackerRepository.findAllByAppUserIdAndGoalId(userId,goalId);
        return ticketsOptional.orElseThrow(null);


    }
    public int UpdatedTrackerAllById(Integer trackerID,Tracker tracker) {

        logger.info("Finding existing tracker with data: " + tracker);

        Optional<Tracker> existingTrackerOptional = trackerRepository.findById(trackerID);

        if (existingTrackerOptional.isPresent()) {
            Tracker existingTracker = existingTrackerOptional.get();

            // Update Nutrition fields if Nutrition is present
            if (tracker.getNutrition() != null)


            {
                if (existingTracker.getNutrition() == null) {
                    logger.warn("Initializing Nutrition for tracker ID: " + trackerID);
                    existingTracker.setNutrition(new Nutrition());
                }
                Nutrition newNutrition = tracker.getNutrition();
                Nutrition existingNutrition = existingTracker.getNutrition();

                if (existingNutrition != null) {
                    if (newNutrition.getKal() > 0.01) existingNutrition.setKal(newNutrition.getKal());
                    if (newNutrition.getCarb() > 0.01) existingNutrition.setCarb(newNutrition.getCarb());
                    if (newNutrition.getFat() > 0.01) existingNutrition.setFat(newNutrition.getFat());
                    if (newNutrition.getWeight() > 0.01) existingNutrition.setWeight(newNutrition.getWeight());
                    if (newNutrition.getProtein() > 0.01) existingNutrition.setProtein(newNutrition.getProtein());
                } else {
                    logger.warn("Nutrition is null for tracker ID: " + trackerID);
                }
            }

            // Update Exercise fields if Exercise is present
            if (tracker.getExercise() != null) {
                if (existingTracker.getExercise() == null) {
                    logger.warn("Initializing Nutrition for tracker ID: " + trackerID);
                    existingTracker.setExercise(new Exercise());
                }
                Exercise newExercise = tracker.getExercise();
                Exercise existingExercise = existingTracker.getExercise();

                if (existingExercise != null) {
                    if (newExercise.getCaloriesBurned() > 0.01)
                        existingExercise.setCaloriesBurned(newExercise.getCaloriesBurned());
                    if (newExercise.getDuration() > 0.01)
                        existingExercise.setDuration(newExercise.getDuration());
                    if (newExercise.getVolume() > 0.01)
                        existingExercise.setVolume(newExercise.getVolume());
                } else {
                    logger.warn("Exercise is null for tracker ID: " + trackerID);
                }
            }

            // Update other fields
            if (tracker.getSleep() > 0.01) existingTracker.setSleep(tracker.getSleep());
            if (tracker.getWater() > 0.01) existingTracker.setWater(tracker.getWater());

            // Save the updated tracker
            trackerRepository.save(existingTracker);
            return 1; // Indicate success
        } else {
            logger.warn("Tracker not found for ID: " + trackerID);
            return 0; // Tracker not found
        }}
}

