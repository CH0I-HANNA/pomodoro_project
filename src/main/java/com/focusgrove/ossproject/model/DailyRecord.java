package com.focusgrove.ossproject.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "Daily_Record", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "record_date"})
})
@Getter
@Setter
@NoArgsConstructor
public class DailyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_dailyrecord_to_user")) // 외래 키 매핑
    private User user;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Integer pomodoroCount = 0;
}