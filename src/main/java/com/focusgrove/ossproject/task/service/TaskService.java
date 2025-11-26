
package com.focusgrove.ossproject.task.service;

import com.focusgrove.ossproject.auth.repository.UserRepository;
import com.focusgrove.ossproject.log.dto.SessionLogRequest;
import com.focusgrove.ossproject.log.service.LogService;
import com.focusgrove.ossproject.model.Task;
import com.focusgrove.ossproject.model.User;
import com.focusgrove.ossproject.task.dto.TaskCreateRequest;
import com.focusgrove.ossproject.task.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final LogService logService;
    private final UserRepository userRepository;

    @Transactional
    public Task createTask(TaskCreateRequest request, Long userId) {
        Task task = new Task();
        task.setUserId(userId);
        task.setContent(request.getContent());
        task.setRecordDate(request.getRecordDate());
        task.setCompleted(false);
        task.setPomodoroCount(0);
        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public List<Task> findTasksByDate(Long userId, LocalDate date) {
        return taskRepository.findByUserIdAndRecordDate(userId, date);
    }

    @Transactional
    public Task incrementPomodoroCount(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found."));

        if (!task.getUserId().equals(userId)) {
            throw new AccessDeniedException("Unauthorized access to Task.");
        }

        task.setPomodoroCount(task.getPomodoroCount() + 1);
        Task savedTask = taskRepository.save(task);

        // 세션 로그 남기기
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found."));
        
        SessionLogRequest sessionLogRequest = new SessionLogRequest();
        sessionLogRequest.setDurationMinutes(25); // 기본 뽀모도로 시간
        sessionLogRequest.setSessionDate(task.getRecordDate());
        sessionLogRequest.setTaskId(taskId);
        
        logService.logSession(sessionLogRequest, user.getEmail());

        return savedTask;
    }

    @Transactional
    public Task toggleTaskCompletion(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found."));

        if (!task.getUserId().equals(userId)) {
            throw new AccessDeniedException("Unauthorized access to Task.");
        }

        task.setCompleted(!task.isCompleted());
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));

        if (!task.getUserId().equals(userId)) {
            throw new AccessDeniedException("User does not have permission to delete this task");
        }

        taskRepository.delete(task);
    }
}
