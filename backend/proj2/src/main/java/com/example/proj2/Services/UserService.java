package com.example.proj2.Services;


import com.example.proj2.entity.AppUser;
import com.example.proj2.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class UserService {
    @Autowired
    AppUserRepository appUserRepository;

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
}