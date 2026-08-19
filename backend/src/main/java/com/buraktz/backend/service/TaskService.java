package com.buraktz.backend.service;

import com.buraktz.backend.entity.Task;
import com.buraktz.backend.entity.User;
import com.buraktz.backend.repository.TaskRepository;
import com.buraktz.backend.repository.UserRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<Task> getTasksForUser(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    public Task createTask(String text, String priority, String category, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Task task = new Task();
        task.setText(text);
        task.setUser(user);
        task.setPriority(priority);
        task.setCategory(category);

        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, String text, boolean completed, String priority, String category) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Görev bulunamadı"));

        task.setText(text);
        task.setCompleted(completed);
        task.setPriority(priority);
        task.setCategory(category);

        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}