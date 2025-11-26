package com.focusgrove.ossproject.log.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class StatsResponse {
    private int pomodoros;
    private int tasksDone;
    private String focusTime;
    private int dayStreak;
}
