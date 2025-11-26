package com.focusgrove.ossproject.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileUpdateRequest {
    private String nickname;
    private String email;
}
