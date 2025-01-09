package com.example.proj2.Services;


import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Tracker;
import com.example.proj2.repositories.AppUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class UserService {
    @Autowired
    AppUserRepository appUserRepository;
    private static final Logger logger = LoggerFactory.getLogger(TrackerService.class);

    public UserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public AppUser getUserByID(Integer userID) throws Exception {
        Optional<AppUser> user = appUserRepository.findById(userID);

        if (user.isPresent())
            return user.get();
        else
            throw new Exception();
    }

    public AppUser getUserByUsername(String username) throws Exception {
        Optional<AppUser> user = appUserRepository.findByUsername(username);

        if (user.isPresent())
            return user.get();
        else
            throw new Exception();
    }
    public int updateUser(Integer userId, AppUser appUser){
        Optional<AppUser> existingAppUserOptional = appUserRepository.findById(userId);

        if(existingAppUserOptional.isPresent()){
            AppUser existingAppUser=existingAppUserOptional.get();
            if(appUser.getFirst_name()!="")
                existingAppUser.setFirst_name(appUser.getFirst_name());
            if(appUser.getLast_name()!="")
                existingAppUser.setLast_name(appUser.getLast_name());
            if(appUser.getPhoto_url()!="")
                existingAppUser.setPhoto_url(appUser.getPhoto_url());
            if(appUser.getExerciseStartDate()!=null)
                existingAppUser.setExerciseStartDate(appUser.getExerciseStartDate());
            if(appUser.getNutritionStartDate()!=null)
                existingAppUser.setNutritionStartDate(appUser.getNutritionStartDate());
            if(appUser.getWaterStartDate()!=null)
                existingAppUser.setWaterStartDate(appUser.getWaterStartDate());
            if(appUser.getSleepStartDate()!=null)
                existingAppUser.setSleepStartDate(appUser.getSleepStartDate());
            if(appUser.getEmail()!="")
                existingAppUser.setEmail(appUser.getEmail());

            appUserRepository.save(existingAppUser);

            return 1;


        }
        else{
            logger.error("unable to update "+appUser);
            return 0;
        }

    }
}
