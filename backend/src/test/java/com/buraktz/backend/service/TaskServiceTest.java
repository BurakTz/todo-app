package com.buraktz.backend.service;

import com.buraktz.backend.entity.Subtask;
import com.buraktz.backend.entity.Task;
import com.buraktz.backend.entity.User;
import com.buraktz.backend.repository.TaskRepository;
import com.buraktz.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * TaskService icin unit testler.
 * TaskRepository ve UserRepository mock'lanir (gercek DB'ye hic dokunulmaz),
 * boylece sadece TaskService'in kendi mantigi (business logic) test edilir.
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private User owner;      // task'in gercek sahibi (id=1)
    private User intruder;   // baskasinin task'ina erismeye calisan kullanici (id=2)

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1L);
        owner.setEmail("owner@example.com");

        intruder = new User();
        intruder.setId(2L);
        intruder.setEmail("intruder@example.com");
    }

    // Yardimci metod: verilen sahibe ait, verilen id'de bir Task nesnesi uretir.
    // Her testte ayni 4-5 satiri tekrar yazmamak icin.
    private Task buildTask(Long taskId, User taskOwner) {
        Task task = new Task();
        task.setId(taskId);
        task.setUser(taskOwner);
        task.setText("orijinal metin");
        task.setCompleted(false);
        task.setPriority("medium");
        task.setCategory("genel");
        return task;
    }

    // ---------------------------------------------------------------
    // getTasksForUser
    // ---------------------------------------------------------------

    @Test
    void getTasksForUser_kullaninTasklariniDondurur() {
        // given: repository, owner'a ait 2 task dondursun
        Task t1 = buildTask(1L, owner);
        Task t2 = buildTask(2L, owner);
        when(taskRepository.findByUserId(1L)).thenReturn(List.of(t1, t2));

        // when
        List<Task> result = taskService.getTasksForUser(1L);

        // then
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(t1, t2);
    }

    @Test
    void getTasksForUser_hicTaskYoksaBosListeDoner() {
        // given: repository bos liste dondursun
        when(taskRepository.findByUserId(99L)).thenReturn(List.of());

        // when
        List<Task> result = taskService.getTasksForUser(99L);

        // then
        assertThat(result).isEmpty();
    }

    // ---------------------------------------------------------------
    // createTask
    // ---------------------------------------------------------------

    @Test
    void createTask_kullaniciVarsa_taskiOlusturupKaydeder() {
        // given: userRepository "1L" id'li kullaniciyi bulabiliyor
        when(userRepository.findById(1L)).thenReturn(Optional.of(owner));

        // save cagrildiginda verilen nesneyi aynen geri dondur (gercek DB'nin
        // "id atama" davranisini simule etmiyoruz, o ayri bir seviye)
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        Task result = taskService.createTask("Sut al", "high", "ev", 1L);

        // then
        assertThat(result.getText()).isEqualTo("Sut al");
        assertThat(result.getPriority()).isEqualTo("high");
        assertThat(result.getCategory()).isEqualTo("ev");
        assertThat(result.getUser()).isEqualTo(owner);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void createTask_kullaniciYoksa_exceptionFirlatirVeKaydetmez() {
        // given: userRepository kullaniciyi bulamiyor
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // when + then
        assertThatThrownBy(() ->
                taskService.createTask("Sut al", "high", "ev", 999L)
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Kullanıcı bulunamadı");

        // kullanici bulunamadiginda save() hic cagrilmamali
        verify(taskRepository, never()).save(any(Task.class));
    }

    // ---------------------------------------------------------------
    // updateTask
    // ---------------------------------------------------------------

    @Test
    void updateTask_sahibiIseGuncellenir() {
        // given: task, owner'a ait
        Task existingTask = buildTask(10L, owner);
        when(taskRepository.findById(10L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when: owner kendi task'ini guncelliyor
        Task updated = taskService.updateTask(10L, "yeni metin", true, "low", "is", 1L);

        // then
        assertThat(updated.getText()).isEqualTo("yeni metin");
        assertThat(updated.isCompleted()).isTrue();
        assertThat(updated.getPriority()).isEqualTo("low");
        assertThat(updated.getCategory()).isEqualTo("is");
    }

    @Test
    void updateTask_baskasininTaskiysa_exceptionFirlatirVeKaydetmez() {
        // given: task'in sahibi owner (id=1), ama istek intruder'dan (id=2) geliyor
        Task existingTask = buildTask(10L, owner);
        when(taskRepository.findById(10L)).thenReturn(Optional.of(existingTask));

        // when + then
        assertThatThrownBy(() ->
                taskService.updateTask(10L, "yeni metin", true, "low", "is", intruder.getId())
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Bu görev sana ait değil");

        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void updateTask_taskBulunamazsa_exceptionFirlatir() {
        // given: repository, bu id'de bir task bulamiyor
        when(taskRepository.findById(404L)).thenReturn(Optional.empty());

        // when + then
        assertThatThrownBy(() ->
                taskService.updateTask(404L, "x", false, "low", "genel", 1L)
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Görev bulunamadı");

        verify(taskRepository, never()).save(any(Task.class));
    }

    // ---------------------------------------------------------------
    // deleteTask
    // ---------------------------------------------------------------

    @Test
    void deleteTask_sahibiIseSiler() {
        // given
        Task existingTask = buildTask(10L, owner);
        when(taskRepository.findById(10L)).thenReturn(Optional.of(existingTask));

        // when
        taskService.deleteTask(10L, 1L);

        // then: repository'nin deleteById metodu dogru id ile cagrilmis mi
        verify(taskRepository, times(1)).deleteById(10L);
    }

    @Test
    void deleteTask_baskasininTaskiysa_exceptionFirlatirVeSilmez() {
        // given
        Task existingTask = buildTask(10L, owner);
        when(taskRepository.findById(10L)).thenReturn(Optional.of(existingTask));

        // when + then
        assertThatThrownBy(() ->
                taskService.deleteTask(10L, intruder.getId())
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Bu görev sana ait değil");

        // yetkisiz durumda deleteById hic cagrilmamali
        verify(taskRepository, never()).deleteById(anyLong());
    }

    @Test
    void deleteTask_taskBulunamazsa_exceptionFirlatir() {
        when(taskRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                taskService.deleteTask(404L, 1L)
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Görev bulunamadı");

        verify(taskRepository, never()).deleteById(anyLong());
    }

    // ---------------------------------------------------------------
    // addSubtask
    // ---------------------------------------------------------------

    @Test
    void addSubtask_sahibiIseSubtaskEklenir() {
        // given
        Task existingTask = buildTask(10L, owner);
        when(taskRepository.findById(10L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        Task result = taskService.addSubtask(10L, "alt gorev metni", 1L);

        // then: subtasks listesine tek bir eleman eklenmis olmali
        assertThat(result.getSubtasks()).hasSize(1);
        assertThat(result.getSubtasks().get(0).getText()).isEqualTo("alt gorev metni");
        assertThat(result.getSubtasks().get(0).getTask()).isEqualTo(existingTask);
    }

    @Test
    void addSubtask_baskasininTaskiysa_exceptionFirlatir() {
        Task existingTask = buildTask(10L, owner);
        when(taskRepository.findById(10L)).thenReturn(Optional.of(existingTask));

        assertThatThrownBy(() ->
                taskService.addSubtask(10L, "alt gorev", intruder.getId())
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Bu görev sana ait değil");

        verify(taskRepository, never()).save(any(Task.class));
    }

    // ---------------------------------------------------------------
    // toggleSubtask
    // ---------------------------------------------------------------

    @Test
    void toggleSubtask_sahibiIseTamamlanmaDurumunuDegistirir() {
        // given: task'in icinde, id=5 olan tamamlanmamis bir subtask var
        Task existingTask = buildTask(10L, owner);
        Subtask subtask = new Subtask();
        subtask.setId(5L);
        subtask.setText("alt gorev");
        subtask.setCompleted(false);
        subtask.setTask(existingTask);
        existingTask.getSubtasks().add(subtask);

        when(taskRepository.findById(10L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        Task result = taskService.toggleSubtask(10L, 5L, 1L);

        // then: completed false'dan true'ya donmus olmali
        assertThat(result.getSubtasks().get(0).isCompleted()).isTrue();
    }

    @Test
    void toggleSubtask_subtaskBulunamazsa_exceptionFirlatir() {
        // given: task var ama icinde subtask yok
        Task existingTask = buildTask(10L, owner);
        when(taskRepository.findById(10L)).thenReturn(Optional.of(existingTask));

        // when + then
        assertThatThrownBy(() ->
                taskService.toggleSubtask(10L, 999L, 1L)
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Alt görev bulunamadı");
    }

    @Test
    void toggleSubtask_baskasininTaskiysa_exceptionFirlatir() {
        Task existingTask = buildTask(10L, owner);
        when(taskRepository.findById(10L)).thenReturn(Optional.of(existingTask));

        assertThatThrownBy(() ->
                taskService.toggleSubtask(10L, 5L, intruder.getId())
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Bu görev sana ait değil");
    }

    // ---------------------------------------------------------------
    // deleteSubtask
    // ---------------------------------------------------------------

    @Test
    void deleteSubtask_sahibiIseSubtaskiSiler() {
        // given: task'in icinde id=5 olan bir subtask var
        Task existingTask = buildTask(10L, owner);
        Subtask subtask = new Subtask();
        subtask.setId(5L);
        subtask.setText("silinecek alt gorev");
        subtask.setTask(existingTask);
        existingTask.getSubtasks().add(subtask);

        when(taskRepository.findById(10L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        Task result = taskService.deleteSubtask(10L, 5L, 1L);

        // then: subtasks listesi artik bos olmali
        assertThat(result.getSubtasks()).isEmpty();
    }

    @Test
    void deleteSubtask_baskasininTaskiysa_exceptionFirlatir() {
        Task existingTask = buildTask(10L, owner);
        when(taskRepository.findById(10L)).thenReturn(Optional.of(existingTask));

        assertThatThrownBy(() ->
                taskService.deleteSubtask(10L, 5L, intruder.getId())
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Bu görev sana ait değil");

        verify(taskRepository, never()).save(any(Task.class));
    }
}