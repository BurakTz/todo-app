package com.buraktz.backend.dto;

import com.buraktz.backend.entity.Subtask;
import com.buraktz.backend.entity.Task;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class TaskResponse {
    private final Long id;
    private final String text;
    private final boolean completed;
    private final String priority;
    private final String category;
    private final List<SubtaskResponse> subtasks;

    public TaskResponse(Task task) {
        this.id = task.getId();
        this.text = task.getText();
        this.completed = task.isCompleted();
        this.priority = task.getPriority();
        this.category = task.getCategory();
        this.subtasks = task.getSubtasks().stream()
                .map(SubtaskResponse::new)
                .collect(Collectors.toList());
    }
}