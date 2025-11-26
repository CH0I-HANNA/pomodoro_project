package com.focusgrove.ossproject.log.repository;

import com.focusgrove.ossproject.log.dto.GrassDataResponse;
import com.focusgrove.ossproject.model.DailyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyRecordRepository extends JpaRepository<DailyRecord, Long> {
    // 특정 사용자의 특정 날짜 기록을 조회 (User ID와 날짜 기준)
    Optional<DailyRecord> findByUser_UserIdAndRecordDate(Long userId, LocalDate date);

    // 잔디 그래프를 위한 연간 데이터 조회
    @Query("SELECT new com.focusgrove.ossproject.log.dto.GrassDataResponse(dr.recordDate, dr.pomodoroCount, dr.content) " +
           "FROM DailyRecord dr " +
           "WHERE dr.user.userId = :userId AND YEAR(dr.recordDate) = :year " +
           "ORDER BY dr.recordDate ASC")
    List<GrassDataResponse> findAnnualSummaryByUserId(@Param("userId") Long userId, @Param("year") int year);

    interface DailyPomodoroSummary {
        LocalDate getRecordDate();
        Integer getCount();
    }

    @Query("SELECT dr.recordDate as recordDate, dr.pomodoroCount as count " +
            "FROM DailyRecord dr " +
            "WHERE dr.user.userId = :userId AND YEAR(dr.recordDate) = :year")
    List<DailyPomodoroSummary> findAnnualDailyPomodoroSummary(@Param("userId") Long userId, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(dr.pomodoroCount), 0) FROM DailyRecord dr WHERE dr.user.userId = :userId")
    int sumTotalPomodorosByUserId(@Param("userId") Long userId);

    @Query("SELECT dr.recordDate FROM DailyRecord dr WHERE dr.user.userId = :userId ORDER BY dr.recordDate DESC")
    List<LocalDate> findActiveDatesByUserId(@Param("userId") Long userId);
}