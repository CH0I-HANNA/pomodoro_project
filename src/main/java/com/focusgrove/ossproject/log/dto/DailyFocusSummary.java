package com.focusgrove.ossproject.log.dto;

import java.time.LocalDate;

public interface DailyFocusSummary {
    // 💡 쿼리의 별칭 'sessionDate'와 'totalDuration'에 맞춥니다.
    // getSessionDate()는 DB의 sessionDate 필드를 가져옴
    LocalDate getSessionDate();
    // getTotalDuration()은 쿼리의 SUM() 결과인 totalDuration 별칭을 가져옴
    int getTotalDuration();
}