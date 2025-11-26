package com.focusgrove.ossproject.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserProfileResponse {
    private String nickname;
    private String email;
    private String profileImageUrl;
}
