
package com.focusgrove.ossproject.task.repository;

import com.focusgrove.ossproject.model.Task;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserIdAndRecordDate(Long userId, LocalDate recordDate);

    @Query("SELECT COALESCE(SUM(t.pomodoroCount), 0) FROM Task t WHERE t.userId = :userId AND t.recordDate = :recordDate")
    int sumPomodoroCountByUserIdAndRecordDate(@Param("userId") Long userId, @Param("recordDate") LocalDate recordDate);

    // Projection for annual summary
    interface PomodoroSummary {
        LocalDate getRecordDate();
        Integer getCount();
    }

    @Query("SELECT t.recordDate AS recordDate, SUM(t.pomodoroCount) AS count " +
           "FROM Task t " +
           "WHERE t.userId = :userId AND YEAR(t.recordDate) = :year " +
           "GROUP BY t.recordDate")
    List<PomodoroSummary> findAnnualPomodoroSummary(@Param("userId") Long userId, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(t.pomodoroCount), 0) FROM Task t WHERE t.userId = :userId")
    int sumTotalPomodorosByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.userId = :userId AND t.isCompleted = true")
    int countCompletedTasksByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.userId = :userId AND t.isCompleted = true AND t.recordDate = :recordDate")
    int countCompletedTasksByUserIdAndDate(@Param("userId") Long userId, @Param("recordDate") LocalDate recordDate);

    // Projection for daily task summary
    interface DailyTaskSummary {
        LocalDate getDate();
        Integer getTotalTasks();
        Integer getCompletedTasks();
    }

    @Query(value = "SELECT " +
            "  d.date AS date, " +
            "  COALESCE(COUNT(t.id), 0) AS totalTasks, " +
            "  COALESCE(SUM(CASE WHEN t.is_completed = true THEN 1 ELSE 0 END), 0) AS completedTasks " +
            "FROM " +
            "  (SELECT CURDATE() - INTERVAL n.num DAY AS date " +
            "   FROM (SELECT 0 AS num UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6) n) d " +
            "LEFT JOIN " +
            "  task t ON d.date = t.record_date AND t.user_id = :userId " +
            "GROUP BY " +
            "  d.date " +
            "ORDER BY " +
            "  d.date ASC",
            nativeQuery = true)
    List<DailyTaskSummary> findDailyTaskSummary(@Param("userId") Long userId);
}
