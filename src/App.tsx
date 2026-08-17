import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "@/Pages/LoginPage"
import HomePage from "@/Pages/HomePage"
import StatsPage from "@/Pages/StatsPage"
import SettingsPage from "@/Pages/SettingsPage"
import AppLayout from "@/components/app-layout"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<LoginPage />} />

                <Route element={<AppLayout />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App