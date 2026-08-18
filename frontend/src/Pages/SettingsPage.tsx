import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"

function SettingsPage() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="max-w-2xl mx-auto pt-10 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Ayarlar</h1>

            <div className="flex flex-col gap-2">
                <span className="font-medium">Tema</span>
                <div className="flex gap-2">
                    <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
                        <Sun className="h-4 w-4 mr-2" /> Açık
                    </Button>
                    <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
                        <Moon className="h-4 w-4 mr-2" /> Koyu
                    </Button>
                    <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")}>
                        <Monitor className="h-4 w-4 mr-2" /> Sistem
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage