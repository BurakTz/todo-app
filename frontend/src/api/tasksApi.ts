// ==========================================
// 1. FRONTEND DÜNYASI (Bizim Arayüzümüz)
// ==========================================
// Uygulamamızın (React tarafının) beklediği temiz veri tiplerini içeri alıyoruz.
import type { Todo, Priority, Category } from "@/types/todo"
import { apiRequest } from "./client"

// ==========================================
// 2. BACKEND DÜNYASI (Sunucu / Veritabanı)
// ==========================================
// Sunucunun bize göndereceği "ham" verinin şablonunu çiziyoruz.
// Dikkat et: ID'ler "number" (sayı) ve boş değerler "null" olarak gelebiliyor.
interface ApiSubtask {
    id: number;
    text: string;
    completed: boolean
}

interface ApiTask {
    id: number;
    text: string;
    completed: boolean
    priority: string | null;
    category: string | null
    subtasks: ApiSubtask[] // Alt görevler dizisi
}

// ==========================================
// 3. GÜMRÜK MEMURU (ADAPTÖR KATMANI)
// ==========================================
// Backend verisini alır, React arayüzüne uygun (Todo) hale getirir.
function mapTask(apiTask: ApiTask): Todo {
    return {
        id: String(apiTask.id), // Sayı olan ID'yi, metne (string) çevirir.
        text: apiTask.text,
        completed: apiTask.completed,

        // "??" (Nullish Coalescing): Eğer öncelik veya kategori "null" gelirse,
        // bunu TypeScript'in daha çok sevdiği "undefined" (tanımsız) değere çevirir.
        priority: (apiTask.priority as Priority) ?? undefined,
        category: (apiTask.category as Category) ?? undefined,

        // Alt görevleri (subtasks) tek tek gezip (.map), onların ID'lerini de string'e çeviriyoruz.
        subtasks: apiTask.subtasks.map((s) => ({
            id: String(s.id),
            text: s.text,
            completed: s.completed
        })),
    }
}

// ==========================================
// 4. ANA GÖREV İŞLEMLERİ (CRUD)
// ==========================================

// GET: Verileri okuma (Listeleme)
export async function fetchTasks(): Promise<Todo[]> {
    const data = await apiRequest<ApiTask[]>(`/tasks`)
    return data.map(mapTask)
}

export async function createTask(data: {
    text: string; completed: boolean; priority?: Priority; category?: Category
}): Promise<Todo> {
    const result = await apiRequest<ApiTask>("/tasks", { method: "POST", body: JSON.stringify(data) })
    return mapTask(result)
}

export async function updateTask(id: string, data: {
    text: string; completed: boolean; priority?: Priority; category?: Category
}): Promise<Todo> {
    const result = await apiRequest<ApiTask>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) })
    return mapTask(result)
}

// DELETE: Veriyi silme
export function deleteTask(id: string): Promise<void> {
    // Sadece adresi (ID) verip DELETE metodunu çağırıyoruz.
    // Geriye veri dönmeyeceği için mapTask kullanmıyoruz ve <void> diyoruz.
    return apiRequest<void>(`/tasks/${id}`, { method: "DELETE" })
}

// ==========================================
// 5. ALT GÖREV (SUBTASK) İŞLEMLERİ
// ==========================================
// İç içe rotalar (Nested Routes) kullanılarak belirli bir görevin alt işlemi yapılır.

// Alt görev ekleme
export async function addSubtask(taskId: string, text: string): Promise<Todo> {
    // Örn: /tasks/15/subtasks
    const result = await apiRequest<ApiTask>(`/tasks/${taskId}/subtasks`, {
        method: "POST",
        body: JSON.stringify({ text }),
    })
    // Sunucu, alt görev eklenmiş GÜNCEL ANA GÖREVİ geri yolluyor, biz de UI'a veriyoruz.
    return mapTask(result)
}

// Alt görevi işaretleme (Tamamlandı/Tamamlanmadı)
export async function toggleSubtask(taskId: string, subtaskId: string): Promise<Todo> {
    // Hem ana görev ID'sini hem alt görev ID'sini URL'ye koyuyoruz. (Örn: /tasks/15/subtasks/3)
    const result = await apiRequest<ApiTask>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: "PUT"
    })
    return mapTask(result)
}

// Alt görevi silme
export async function deleteSubtask(taskId: string, subtaskId: string): Promise<Todo> {
    const result = await apiRequest<ApiTask>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: "DELETE"
    })
    return mapTask(result)
}