package com.example.proj2.Services;


import com.example.proj2.Dto.LoginUserDto;
import com.example.proj2.Dto.RegisterUserDto;
import com.example.proj2.entity.AppUser;
import com.example.proj2.repositories.AppUserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;


    public AuthenticationService(
            AppUserRepository appUserRepository,

            PasswordEncoder passwordEncoder
    ) {

        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser signup(RegisterUserDto input) {
        try {
            // Ensure all fields are set
            AppUser appUser = new AppUser();
            appUser.setUsername(input.getUsername());  // Ensure username is provided
            appUser.setEmail(input.getEmail());
            appUser.setFirst_name(input.getFirst_name());
            appUser.setLast_name(input.getLast_name());
            appUser.setPhoto_url(input.getPhoto_url());
            appUser.setPassword(passwordEncoder.encode(input.getPassword()));

            // Save user to the database
            return appUserRepository.save(appUser);
        } catch (Exception e) {
            // Log the error and handle it
            throw new RuntimeException("Error during user registration", e);
        }
    }


}
