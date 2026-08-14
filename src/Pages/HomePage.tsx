
import { useState } from "react"
import type { Todo } from "@/types/todo"



function HomePage() {
    const [todos, setTodos] = useState<Todo[]>([])

    return (
        <div>
            <h1>Görevlerim</h1>
        </div>
    )
}

export default HomePage