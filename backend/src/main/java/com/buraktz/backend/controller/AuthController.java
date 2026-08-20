package com.buraktz.backend.controller;

import com.buraktz.backend.dto.LoginRequest;
import com.buraktz.backend.dto.RegisterRequest;
import com.buraktz.backend.dto.UserResponse;
import com.buraktz.backend.entity.User;
import com.buraktz.backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        User user =  authService.register(request.getEmail(), request.getPassword());
        return new UserResponse(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.login(request.getEmail(), request.getPassword());
    }
}