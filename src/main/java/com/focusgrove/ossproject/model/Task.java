
package com.focusgrove.ossproject.model;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // 사용자의 ID

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate; // 작업 예정일

    @Column(nullable = false)
    private String content; // 작업 내용

    @Column(name = "is_completed", nullable = false)
    private boolean isCompleted = false; // 완료 여부

    @Column(name = "pomodoro_count", nullable = false)
    private int pomodoroCount = 0; // 이 작업에 사용된 뽀모도로 횟수
}
