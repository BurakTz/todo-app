package com.buraktz.backend.dto;

import com.buraktz.backend.entity.Subtask;
import lombok.Getter;

@Getter
public class SubtaskResponse {
    private final Long id;
    private final String text;
    private final boolean completed;

    public SubtaskResponse(Subtask subtask) {
        this.id = subtask.getId();
        this.text = subtask.getText();
        this.completed = subtask.isCompleted();
    }
}