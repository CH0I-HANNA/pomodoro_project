package com.focusgrove.ossproject.user.controller;

import com.focusgrove.ossproject.user.dto.UserProfileResponse;
import com.focusgrove.ossproject.user.dto.UserProfileUpdateRequest;
import com.focusgrove.ossproject.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(Principal principal) {
        UserProfileResponse userProfile = userService.getUserProfile(principal.getName());
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping("/profile")
    public ResponseEntity<Void> updateUserProfile(@RequestBody UserProfileUpdateRequest request, Principal principal) {
        userService.updateUserProfile(principal.getName(), request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/profile/image")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file, Principal principal) {
        String imageUrl = userService.uploadProfileImage(principal.getName(), file);
        return ResponseEntity.ok(imageUrl);
    }
}
