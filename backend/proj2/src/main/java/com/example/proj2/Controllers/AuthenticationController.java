package com.example.proj2.Controllers;

import com.example.proj2.Configs.JwtUtil;
import com.example.proj2.Dto.LoginUserDto;
import com.example.proj2.Dto.RegisterUserDto;
import com.example.proj2.Services.AuthenticationService;
import com.example.proj2.entity.AppUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.slf4j.LoggerFactory;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuthenticationService authenticationService;
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    public AuthenticationController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,AuthenticationService authenticationService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.authenticationService=authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<AppUser> register(@RequestBody RegisterUserDto registerUserDto) {


        try {
            AppUser registeredAppUser = authenticationService.signup(registerUserDto);
            return ResponseEntity.ok(registeredAppUser);
        } catch (Exception e) {
            logger.error("Error during registration: ", e);
            return ResponseEntity.status(404).build();
        }
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginUserDto loginUserDto) {

        try {
            logger.info("Attempting to authenticate user: " + loginUserDto.getUsername());


            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(loginUserDto.getUsername(), loginUserDto.getPassword());
            logger.info("authenticationToken from user: " + loginUserDto.getUsername());

           Authentication authentication = authenticationManager.authenticate(authenticationToken);
           logger.info("generateToken " + authentication.getName());

            String token = jwtUtil.generateToken(authentication.getName());


            logger.info("Authentication successful for user: " + loginUserDto.getUsername());

            return ResponseEntity.ok(token);

        } catch (Exception e) {
            logger.error("Error during login: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/me")
    public ResponseEntity<String> getAuthenticatedUserFromContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = (String) authentication.getPrincipal();
            return ResponseEntity.ok(username);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
}
