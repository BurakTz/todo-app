export type Priority = "low" | "medium" | "high"
export type Category = "İş" | "Kişisel" | "Sağlık" | "Eğitim"

export interface Todo {
    id: string
    text: string
    completed: boolean
    duration?: number
    dueDate?: Date
    priority?: Priority
    subtasks?: Subtask[]
    category?: Category   // yeni eklenen, opsiyonel
}

export interface Subtask {
    id: string
    text: string
    completed: boolean
}