package com.focusgrove.ossproject.log.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class GrassDataResponse {
    private LocalDate date;
    private Integer count;
    private String quote;
}
