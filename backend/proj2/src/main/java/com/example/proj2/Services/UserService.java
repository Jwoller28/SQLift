package com.example.proj2.Services;

import com.example.proj2.entity.AppUser;
import com.example.proj2.repositories.AppUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

import com.example.proj2.entity.AppUser;
import com.example.proj2.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private AppUserRepository appUserRepository;

    public AppUser getUserByID(Integer userID) throws Exception {
        Optional<AppUser> user = appUserRepository.findById(userID);
        return user.orElseThrow(() -> new Exception("User not found with ID: " + userID));
    }

    public AppUser getUserByUsername(String username) throws Exception {
        Optional<AppUser> user = appUserRepository.findByUsername(username);
        return user.orElseThrow(() -> new Exception("User not found with username: " + username));
    }

    public AppUser getUserFromAuthentication(Authentication authentication) {
        String username = authentication.getName();
        Optional<AppUser> user = appUserRepository.findByUsername(username);
        return user.orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public int updateUser(Integer userId, AppUser appUser) {
        Optional<AppUser> existingAppUserOptional = appUserRepository.findById(userId);

        if (existingAppUserOptional.isPresent()) {
            AppUser existingAppUser = existingAppUserOptional.get();
            if (appUser.getFirst_name() != null && !appUser.getFirst_name().isEmpty())
                existingAppUser.setFirst_name(appUser.getFirst_name());
            if (appUser.getLast_name() != null && !appUser.getLast_name().isEmpty())
                existingAppUser.setLast_name(appUser.getLast_name());
            if (appUser.getPhoto_url() != null && !appUser.getPhoto_url().isEmpty())
                existingAppUser.setPhoto_url(appUser.getPhoto_url());
            /*if(appUser.getExerciseStartDate()!=null)
                existingAppUser.setExerciseStartDate(appUser.getExerciseStartDate());
            if (appUser.getNutritionStartDate() != null)
                existingAppUser.setNutritionStartDate(appUser.getNutritionStartDate());
            if (appUser.getWaterStartDate() != null)
                existingAppUser.setWaterStartDate(appUser.getWaterStartDate());
            if(appUser.getSleepStartDate()!=null)
                existingAppUser.setSleepStartDate(appUser.getSleepStartDate());*/
            if(appUser.getEmail()!="")
                existingAppUser.setEmail(appUser.getEmail());

            appUserRepository.save(existingAppUser);
            return 1;
        } else {
            logger.error("Unable to update: " + appUser);
            return 0;
        }
    }
}
