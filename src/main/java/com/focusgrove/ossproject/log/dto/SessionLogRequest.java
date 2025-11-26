package com.focusgrove.ossproject.log.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SessionLogRequest {
    private int durationMinutes;
    private LocalDate sessionDate;
    private Long taskId;
}