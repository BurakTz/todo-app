package com.buraktz.backend.service;

import com.buraktz.backend.entity.Task;
import com.buraktz.backend.entity.User;
import com.buraktz.backend.repository.TaskRepository;
import com.buraktz.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.buraktz.backend.entity.Subtask;

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

    public Task addSubtask(Long taskId, String text) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Görev bulunamadı"));

        Subtask subtask = new Subtask();
        subtask.setText(text);
        subtask.setTask(task);

        task.getSubtasks().add(subtask);
        return taskRepository.save(task);
    }

    public Task toggleSubtask(Long taskId, Long subtaskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Görev bulunamadı"));

        Subtask subtask = task.getSubtasks().stream()
                .filter(s -> s.getId().equals(subtaskId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Alt görev bulunamadı"));

        subtask.setCompleted(!subtask.isCompleted());
        return taskRepository.save(task);
    }

    public Task deleteSubtask(Long taskId, Long subtaskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Görev bulunamadı"));

        task.getSubtasks().removeIf(s -> s.getId().equals(subtaskId));
        return taskRepository.save(task);
    }
}