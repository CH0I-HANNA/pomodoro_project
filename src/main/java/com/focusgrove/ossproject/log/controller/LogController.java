package com.focusgrove.ossproject.log.controller;

import com.focusgrove.ossproject.auth.repository.UserRepository;
import com.focusgrove.ossproject.log.dto.DailyFocusSummary;
import com.focusgrove.ossproject.log.dto.DailyRecordRequest;
import com.focusgrove.ossproject.log.dto.DailyRecordResponse;
import com.focusgrove.ossproject.log.dto.GrassDataResponse;
import com.focusgrove.ossproject.log.dto.SessionLogRequest;
import com.focusgrove.ossproject.log.dto.StatsResponse;
import com.focusgrove.ossproject.log.service.LogService;
import com.focusgrove.ossproject.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/log")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;
    private final UserRepository userRepository; // 사용자 조회를 위해 추가

    @PostMapping("/session")
    public ResponseEntity<String> logSession(@RequestBody SessionLogRequest request, Principal principal) {
        try {
            logService.logSession(request, principal.getName());
            return ResponseEntity.ok("Session logged successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/summary/monthly")
    public ResponseEntity<List<DailyFocusSummary>> getMonthlySummary(@RequestParam int year, @RequestParam int month, Principal principal) {
        try {
            List<DailyFocusSummary> summary = logService.getMonthlySummary(principal.getName(), year, month);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/grass")
    public ResponseEntity<List<GrassDataResponse>> getGrassData(@RequestParam int year, Principal principal) {
        try {
            List<GrassDataResponse> grassData = logService.getAnnualSummary(principal.getName(), year);
            return ResponseEntity.ok(grassData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/daily")
    public ResponseEntity<DailyRecordResponse> getDailyRecord(Principal principal) {
        try {
            Optional<DailyRecordResponse> record = logService.getDailyRecord(principal.getName(), LocalDate.now());
            return record.map(ResponseEntity::ok)
                         .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/daily")
    public ResponseEntity<String> saveOrUpdateDailyRecord(@RequestBody DailyRecordRequest request, Principal principal) {
        try {
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            boolean isUpdate = logService.recordExists(user.getUserId(), request.getRecordDate());
            
            logService.saveOrUpdateDailyRecord(user.getUserId(), request);
            
            if (isUpdate) {
                return ResponseEntity.ok("Daily record updated successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.CREATED).body("Daily record created successfully!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/daily-records/pomodoro")
    public ResponseEntity<Void> incrementDailyPomodoro(Principal principal) {
        logService.incrementDailyPomodoro(principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/daily-pomodoro")
    public ResponseEntity<Integer> getDailyPomodoro(@RequestParam String date, Principal principal) {
        LocalDate recordDate = LocalDate.parse(date);
        Integer pomodoros = logService.getDailyPomodoro(principal.getName(), recordDate);
        return ResponseEntity.ok(pomodoros);
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats(Principal principal) {
        StatsResponse stats = logService.getStats(principal.getName());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/today")
    public ResponseEntity<StatsResponse> getTodayStats(Principal principal) {
        StatsResponse stats = logService.getTodayStats(principal.getName());
        return ResponseEntity.ok(stats);
    }
}