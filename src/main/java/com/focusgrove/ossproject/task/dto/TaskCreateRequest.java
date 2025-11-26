
package com.focusgrove.ossproject.task.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TaskCreateRequest {
    private String content;
    private LocalDate recordDate;
}
