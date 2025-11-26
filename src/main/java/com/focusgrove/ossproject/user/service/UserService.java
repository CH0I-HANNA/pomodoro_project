package com.focusgrove.ossproject.user.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.focusgrove.ossproject.model.User;
import com.focusgrove.ossproject.auth.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;
import com.focusgrove.ossproject.user.dto.UserProfileResponse;
import com.focusgrove.ossproject.user.dto.UserProfileUpdateRequest;
import com.focusgrove.ossproject.user.service.FileStorageService;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Value("${app.base-url}")
    private String baseUrl;

    public UserProfileResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        // Placeholder implementation:
        return new UserProfileResponse(user.getNickname(), user.getEmail(), user.getProfileImageUrl());
    }

    @Transactional
    public void updateUserProfile(String email, UserProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        userRepository.save(user);
    }

    @Transactional
    public String uploadProfileImage(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        String fileName = fileStorageService.storeFile(file);
        String imageUrl = baseUrl + "/uploads/" + fileName;
        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);
        return imageUrl;
    }
}
