package com.focusgrove.ossproject.model;

import com.focusgrove.ossproject.model.Task;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "Session_Log")
@Getter
@Setter
@NoArgsConstructor
public class SessionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_sessionlog_to_user")) // 외래 키 매핑
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id") // Can be null if the session is not associated with a task
    private Task task;

    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes;

    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate; // 잔디밭 시각화의 기준 날짜
}