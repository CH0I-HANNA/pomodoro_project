package com.focusgrove.ossproject.log.dto;

import com.focusgrove.ossproject.model.DailyRecord;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyRecordResponse {
    private String content;
    private LocalDate recordDate;
    private int pomodoroCount;

    public DailyRecordResponse(DailyRecord record) {
        if (record != null) {
            this.content = record.getContent();
            this.recordDate = record.getRecordDate();
        }
    }
}
