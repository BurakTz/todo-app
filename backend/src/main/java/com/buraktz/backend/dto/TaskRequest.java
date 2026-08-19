package com.buraktz.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequest {
    private String text;
    private boolean completed;
    private String priority;
    private String category;
    private Long userId;
}