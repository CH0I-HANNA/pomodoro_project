package com.focusgrove.ossproject.log.service;

import com.focusgrove.ossproject.auth.repository.UserRepository;
import com.focusgrove.ossproject.log.dto.DailyFocusSummary;
import com.focusgrove.ossproject.log.dto.DailyRecordRequest;
import com.focusgrove.ossproject.log.dto.DailyRecordResponse;
import com.focusgrove.ossproject.log.dto.SessionLogRequest;
import com.focusgrove.ossproject.log.dto.StatsResponse;
import com.focusgrove.ossproject.log.repository.DailyRecordRepository;
import com.focusgrove.ossproject.log.repository.SessionLogRepository;
import com.focusgrove.ossproject.model.DailyRecord;
import com.focusgrove.ossproject.model.SessionLog;
import com.focusgrove.ossproject.model.Task;
import com.focusgrove.ossproject.model.User;
import com.focusgrove.ossproject.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;
import java.util.Comparator;
import java.util.stream.Collectors;
import com.focusgrove.ossproject.log.dto.GrassDataResponse;

@Service
@RequiredArgsConstructor
public class LogService {

    private final SessionLogRepository sessionLogRepository;
    private final DailyRecordRepository dailyRecordRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    @Transactional
    public void logSession(SessionLogRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        SessionLog sessionLog = new SessionLog();
        sessionLog.setUser(user);
        sessionLog.setDurationMinutes(request.getDurationMinutes());
        sessionLog.setSessionDate(request.getSessionDate());

        if (request.getTaskId() != null) {
            Task task = taskRepository.findById(request.getTaskId())
                    .orElseThrow(() -> new RuntimeException("Task not found"));
            sessionLog.setTask(task);
        }

        sessionLogRepository.save(sessionLog);
    }

    public List<DailyFocusSummary> getMonthlySummary(String userEmail, int year, int month) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        return sessionLogRepository.findDailySummariesByYearAndMonth(user.getUserId(), year, month);
    }

    @Transactional
    public DailyRecord saveOrUpdateDailyRecord(Long userId, DailyRecordRequest request) {
        Optional<DailyRecord> existingRecord =
                dailyRecordRepository.findByUser_UserIdAndRecordDate(userId, request.getRecordDate());

        DailyRecord record;

        if (existingRecord.isPresent()) {
            record = existingRecord.get();
            record.setContent(request.getContent());
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            record = new DailyRecord();
            record.setUser(user);
            record.setRecordDate(request.getRecordDate());
            record.setContent(request.getContent());
        }

        return dailyRecordRepository.save(record);
    }

    public boolean recordExists(Long userId, LocalDate date) {
        return dailyRecordRepository.findByUser_UserIdAndRecordDate(userId, date).isPresent();
    }

    public Optional<DailyRecordResponse> getDailyRecord(String userEmail, LocalDate date) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        int taskPomodoroCount = taskRepository.sumPomodoroCountByUserIdAndRecordDate(user.getUserId(), date);
        Optional<DailyRecord> recordOpt = dailyRecordRepository.findByUser_UserIdAndRecordDate(user.getUserId(), date);
        int dailyPomodoroCount = recordOpt.map(DailyRecord::getPomodoroCount).orElse(0);


        DailyRecordResponse.DailyRecordResponseBuilder builder = DailyRecordResponse.builder()
                .recordDate(date)
                .pomodoroCount(taskPomodoroCount + dailyPomodoroCount);

        recordOpt.ifPresent(record -> builder.content(record.getContent()));

        return Optional.of(builder.build());
    }

    @Transactional
    public void incrementDailyPomodoro(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        LocalDate today = LocalDate.now();
        DailyRecord dailyRecord = dailyRecordRepository.findByUser_UserIdAndRecordDate(user.getUserId(), today)
                .orElseGet(() -> {
                    DailyRecord newRecord = new DailyRecord();
                    newRecord.setUser(user);
                    newRecord.setRecordDate(today);
                    newRecord.setContent(""); // Default empty content
                    return newRecord;
                });
        dailyRecord.setPomodoroCount(dailyRecord.getPomodoroCount() + 1);
        dailyRecordRepository.save(dailyRecord);
    }

    public Integer getDailyPomodoro(String userEmail, LocalDate date) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        return dailyRecordRepository.findByUser_UserIdAndRecordDate(user.getUserId(), date)
                .map(DailyRecord::getPomodoroCount)
                .orElse(0);
    }


    public List<GrassDataResponse> getAnnualSummary(String userEmail, int year) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Map<LocalDate, String> quoteMap = dailyRecordRepository.findAnnualSummaryByUserId(user.getUserId(), year)
                .stream()
                .collect(Collectors.toMap(GrassDataResponse::getDate, GrassDataResponse::getQuote, (quote1, quote2) -> quote1));

        Map<LocalDate, Integer> taskPomodoroMap = taskRepository.findAnnualPomodoroSummary(user.getUserId(), year)
                .stream()
                .collect(Collectors.toMap(TaskRepository.PomodoroSummary::getRecordDate, TaskRepository.PomodoroSummary::getCount));

        Map<LocalDate, Integer> dailyPomodoroMap = dailyRecordRepository.findAnnualDailyPomodoroSummary(user.getUserId(), year)
                .stream()
                .collect(Collectors.toMap(DailyRecordRepository.DailyPomodoroSummary::getRecordDate, DailyRecordRepository.DailyPomodoroSummary::getCount));


        Set<LocalDate> allDates = new HashSet<>(quoteMap.keySet());
        allDates.addAll(taskPomodoroMap.keySet());
        allDates.addAll(dailyPomodoroMap.keySet());


        List<GrassDataResponse> result = allDates.stream()
                .map(date -> {
                    int taskCount = taskPomodoroMap.getOrDefault(date, 0);
                    int dailyCount = dailyPomodoroMap.getOrDefault(date, 0);
                    String quote = quoteMap.getOrDefault(date, "");
                    return new GrassDataResponse(date, taskCount + dailyCount, quote);
                })
                .collect(Collectors.toList());

        result.sort(Comparator.comparing(GrassDataResponse::getDate));
        return result;
    }

    public StatsResponse getStats(String name) {
        User user = userRepository.findByEmail(name)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + name));

        int totalPomodoros = taskRepository.sumTotalPomodorosByUserId(user.getUserId()) + dailyRecordRepository.sumTotalPomodorosByUserId(user.getUserId());
        int tasksDone = taskRepository.countCompletedTasksByUserId(user.getUserId());
        int totalFocusMinutes = sessionLogRepository.sumTotalDurationByUserId(user.getUserId());
        String focusTime = String.format("%dh %dm", totalFocusMinutes / 60, totalFocusMinutes % 60);
        int dayStreak = calculateDayStreak(user.getUserId());

        return new StatsResponse(totalPomodoros, tasksDone, focusTime, dayStreak);
    }

    private int calculateDayStreak(Long userId) {
        List<LocalDate> dates = dailyRecordRepository.findActiveDatesByUserId(userId);
        if (dates.isEmpty()) {
            return 0;
        }

        int streak = 0;
        LocalDate today = LocalDate.now();
        if (dates.contains(today)) {
            streak++;
            for (int i = 1; i < dates.size(); i++) {
                if (dates.contains(today.minusDays(i))) {
                    streak++;
                } else {
                    break;
                }
            }
        }
        return streak;
    }

    public StatsResponse getTodayStats(String name) {
        User user = userRepository.findByEmail(name)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + name));
        LocalDate today = LocalDate.now();

        int todayPomodoros = taskRepository.sumPomodoroCountByUserIdAndRecordDate(user.getUserId(), today) +
                dailyRecordRepository.findByUser_UserIdAndRecordDate(user.getUserId(), today).map(DailyRecord::getPomodoroCount).orElse(0);

        int todayTasksDone = taskRepository.countCompletedTasksByUserIdAndDate(user.getUserId(), today);
        int todayFocusMinutes = sessionLogRepository.sumTotalDurationByUserIdAndDate(user.getUserId(), today);
        String focusTime = String.format("%dh %dm", todayFocusMinutes / 60, todayFocusMinutes % 60);
        int dayStreak = calculateDayStreak(user.getUserId());

        return new StatsResponse(todayPomodoros, todayTasksDone, focusTime, dayStreak);
    }
}
