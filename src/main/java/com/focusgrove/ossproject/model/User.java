package com.focusgrove.ossproject.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "User")
@Getter
@Setter
@NoArgsConstructor // JPA 사용에 필수
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // 암호화된 비밀번호 저장

    @Column(length = 50)
    private String nickname;

    @Column(name = "profile_img_url")
    private String profileImageUrl;



    // 이 외의 created_at 등은 추후 BaseEntity로 분리하거나 여기에 추가 가능
}