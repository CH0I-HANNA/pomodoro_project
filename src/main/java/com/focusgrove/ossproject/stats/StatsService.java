package com.focusgrove.ossproject.stats;

import com.focusgrove.ossproject.auth.repository.UserRepository;
import com.focusgrove.ossproject.model.User;
import com.focusgrove.ossproject.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<Integer> calculateWeeklyCompletion(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        List<TaskRepository.DailyTaskSummary> dailySummaries = taskRepository.findDailyTaskSummary(user.getUserId());

        return dailySummaries.stream()
                .map(summary -> {
                    if (summary.getTotalTasks() == 0) {
                        return 0;
                    }
                    double completionRate = ((double) summary.getCompletedTasks() / summary.getTotalTasks()) * 100;
                    return (int) completionRate;
                })
                .collect(Collectors.toList());
    }
}
