package com.example.proj2.Services;


import com.example.proj2.Dto.LoginUserDto;
import com.example.proj2.Dto.RegisterUserDto;
import com.example.proj2.entity.AppUser;
import com.example.proj2.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser signup(RegisterUserDto input) {
        AppUser appUser = new AppUser();
        appUser.setEmail(input.getEmail());
        appUser.setFirst_name(input.getFirst_name());
        appUser.setLast_name(input.getLast_name());
        appUser.setPhoto_url(input.getPhoto_url());
        appUser.setPassword(passwordEncoder.encode(input.getPassword()));


        return userRepository.save(appUser);
    }

    public AppUser authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getUsername(),
                        input.getPassword()
                )
        );

        return userRepository.findByUsername(input.getUsername())
                .orElseThrow();
    }
}
