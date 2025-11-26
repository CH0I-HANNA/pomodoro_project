package com.focusgrove.ossproject.stats;

import com.focusgrove.ossproject.model.User;
import com.focusgrove.ossproject.model.WeeklyCompletionResponse;
import com.focusgrove.ossproject.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;
    private final UserRepository userRepository;

    @GetMapping("/weekly-completion")
    public WeeklyCompletionResponse getWeeklyCompletion(Principal principal) {
        String email = principal.getName();
        
        List<Integer> completionRates = statsService.calculateWeeklyCompletion(email);
        List<String> labels = Arrays.asList("D-6", "D-5", "D-4", "D-3", "D-2", "D-1", "Today");

        return new WeeklyCompletionResponse(labels, completionRates);
    }
}
