export type Priority = "low" | "medium" | "high"

export interface Todo {
    id: string
    text: string
    completed: boolean
    duration?: number
    dueDate?: Date
    priority?: Priority
    subtasks?: Subtask[]
}

export interface Subtask {
    id: string
    text: string
    completed: boolean
}