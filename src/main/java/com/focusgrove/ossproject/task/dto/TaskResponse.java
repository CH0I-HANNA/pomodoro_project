
package com.focusgrove.ossproject.task.dto;

import com.focusgrove.ossproject.model.Task;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TaskResponse {
    private Long id;
    private Long userId;
    private LocalDate recordDate;
    private String content;
    private boolean isCompleted;
    private int pomodoroCount;

    public static TaskResponse from(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setUserId(task.getUserId());
        response.setRecordDate(task.getRecordDate());
        response.setContent(task.getContent());
        response.setCompleted(task.isCompleted());
        response.setPomodoroCount(task.getPomodoroCount());
        return response;
    }
}
