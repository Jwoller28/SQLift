package com.example.proj2.Controllers;

import com.example.proj2.Dto.LoginUserDto;
import com.example.proj2.Dto.RegisterUserDto;
import com.example.proj2.Response.LoginResponse;
import com.example.proj2.Services.AuthenticationService;
import com.example.proj2.Services.JwtService;
import com.example.proj2.entity.AppUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AppUser> register(@RequestBody RegisterUserDto registerUserDto) {
        AppUser registeredAppUser = authenticationService.signup(registerUserDto);

        return ResponseEntity.ok(registeredAppUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        AppUser authenticatedAppUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken((UserDetails) authenticatedAppUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }
}