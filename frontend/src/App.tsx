import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "@/Pages/LoginPage"
import RegisterPage from "@/Pages/RegisterPage"
import HomePage from "@/Pages/HomePage"
import StatsPage from "@/Pages/StatsPage"
import SettingsPage from "@/Pages/SettingsPage"
import AppLayout from "@/components/app-layout"
import type { Todo } from "@/types/todo"
import { ThemeProvider } from "@/components/theme-provider"
import { fetchTasks } from "@/api/tasksApi"
import { AuthProvider, useAuth } from "@/context/AuthContext"

function AppRoutes() {
    const [todos, setTodos] = useState<Todo[]>([])
    const { token } = useAuth()

    useEffect(() => {
        if (!token) {
            setTodos([])
            return
        }
        fetchTasks().then(setTodos).catch((err) => console.error(err))
    }, [token])

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<LoginPage />} />

            <Route element={<AppLayout />}>
                <Route path="/home" element={<HomePage todos={todos} setTodos={setTodos} />} />
                <Route path="/stats" element={<StatsPage todos={todos} />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    )
}

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="todo-app-theme">
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App