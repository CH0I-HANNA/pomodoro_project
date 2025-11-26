package com.focusgrove.ossproject.auth.controller;

import com.focusgrove.ossproject.auth.dto.LoginRequest;
import com.focusgrove.ossproject.auth.dto.LoginResponse;
import com.focusgrove.ossproject.auth.dto.RegisterRequest;
import com.focusgrove.ossproject.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // 기본 경로 설정
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            authService.registerUser(request);
            return ResponseEntity.ok("Registration successful!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
       try {
           String token = authService.login(request);
           return ResponseEntity.ok(new LoginResponse(token));
       } catch (Exception e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
    }
}