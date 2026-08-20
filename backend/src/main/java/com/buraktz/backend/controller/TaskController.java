package com.buraktz.backend.controller;

import com.buraktz.backend.dto.SubtaskRequest;
import com.buraktz.backend.dto.TaskRequest;
import com.buraktz.backend.dto.TaskResponse;
import com.buraktz.backend.entity.Task;
import com.buraktz.backend.service.TaskService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> getTasks(@AuthenticationPrincipal Long userId) {
        return taskService.getTasksForUser(userId).stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    public TaskResponse createTask(@AuthenticationPrincipal Long userId, @RequestBody TaskRequest request) {
        Task task = taskService.createTask(
                request.getText(), request.getPriority(), request.getCategory(), userId
        );
        return new TaskResponse(task);
    }

    @PutMapping("/{id}")
    public TaskResponse updateTask(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id,
            @RequestBody TaskRequest request
    ) {
        Task task = taskService.updateTask(
                id, request.getText(), request.isCompleted(),
                request.getPriority(), request.getCategory(), userId
        );
        return new TaskResponse(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        taskService.deleteTask(id, userId);
    }

    @PostMapping("/{id}/subtasks")
    public TaskResponse addSubtask(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id,
            @RequestBody SubtaskRequest request
    ) {
        Task task = taskService.addSubtask(id, request.getText(), userId);
        return new TaskResponse(task);
    }

    @PutMapping("/{id}/subtasks/{subtaskId}")
    public TaskResponse toggleSubtask(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id,
            @PathVariable Long subtaskId
    ) {
        Task task = taskService.toggleSubtask(id, subtaskId, userId);
        return new TaskResponse(task);
    }

    @DeleteMapping("/{id}/subtasks/{subtaskId}")
    public TaskResponse deleteSubtask(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id,
            @PathVariable Long subtaskId
    ) {
        Task task = taskService.deleteSubtask(id, subtaskId, userId);
        return new TaskResponse(task);
    }
}