import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "@/Pages/LoginPage"
import HomePage from "@/Pages/HomePage"
import StatsPage from "@/Pages/StatsPage"
import SettingsPage from "@/Pages/SettingsPage"
import AppLayout from "@/components/app-layout"
import type { Todo } from "@/types/todo"
import { ThemeProvider } from "@/components/theme-provider"

function App() {
    const [todos, setTodos] = useState<Todo[]>([
        { id: "1", text: "Matematik ödevini bitir", completed: false, priority: "high" },
        { id: "2", text: "Spor salonuna git", completed: true },
        { id: "3", text: "Proje sunumunu hazırla", completed: false, priority: "medium" },
    ])

    return (
        <ThemeProvider defaultTheme="system" storageKey="todo-app-theme">
         <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<LoginPage />} />

                <Route element={<AppLayout />}>
                    <Route path="/home" element={<HomePage todos={todos} setTodos={setTodos} />} />
                    <Route path="/stats" element={<StatsPage todos={todos} />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
         </BrowserRouter>
        </ThemeProvider>
    )
}

export default App