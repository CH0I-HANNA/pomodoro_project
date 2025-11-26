package com.focusgrove.ossproject.log.repository;

import com.focusgrove.ossproject.log.dto.DailyFocusSummary;
import com.focusgrove.ossproject.model.SessionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SessionLogRepository extends JpaRepository<SessionLog, Long> {

    // This query seems to be for a different feature, leaving it as is.
    @Query(value = "SELECT s.session_date AS sessionDate, SUM(s.duration_minutes) AS totalDuration " +
            "FROM session_log s " +
            "WHERE s.user_id = :userId AND YEAR(s.session_date) = :year AND MONTH(s.session_date) = :month " +
            "GROUP BY s.session_date",
            nativeQuery = true)
    List<DailyFocusSummary> findDailySummariesByYearAndMonth(@Param("userId") Long userId, @Param("year") int year, @Param("month") int month);

    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM SessionLog s WHERE s.user.id = :userId")
    int sumTotalDurationByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM SessionLog s WHERE s.user.id = :userId AND s.sessionDate = :date")
    int sumTotalDurationByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);
}