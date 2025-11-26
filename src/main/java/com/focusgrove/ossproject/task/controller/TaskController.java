
package com.focusgrove.ossproject.task.controller;

import com.focusgrove.ossproject.auth.repository.UserRepository;
import com.focusgrove.ossproject.model.Task;
import com.focusgrove.ossproject.model.User;
import com.focusgrove.ossproject.task.dto.TaskCreateRequest;
import com.focusgrove.ossproject.task.dto.TaskResponse;
import com.focusgrove.ossproject.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    private Long getUserId(Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getUserId();
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskCreateRequest request, Principal principal) {
        Long userId = getUserId(principal);
        Task task = taskService.createTask(request, userId);
        return new ResponseEntity<>(TaskResponse.from(task), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasksByDate(@RequestParam("date") LocalDate date, Principal principal) {
        Long userId = getUserId(principal);
        List<Task> tasks = taskService.findTasksByDate(userId, date);
        List<TaskResponse> response = tasks.stream().map(TaskResponse::from).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{taskId}/pomodoro")
    public ResponseEntity<TaskResponse> incrementPomodoro(@PathVariable Long taskId, Principal principal) {
        Long userId = getUserId(principal);
        Task updatedTask = taskService.incrementPomodoroCount(taskId, userId);
        return ResponseEntity.ok(TaskResponse.from(updatedTask));
    }

    @PatchMapping("/{taskId}/complete")
    public ResponseEntity<TaskResponse> toggleCompletion(@PathVariable Long taskId, Principal principal) {
        Long userId = getUserId(principal);
        Task updatedTask = taskService.toggleTaskCompletion(taskId, userId);
        return ResponseEntity.ok(TaskResponse.from(updatedTask));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId, Principal principal) {
        Long userId = getUserId(principal);
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.noContent().build();
    }
}
