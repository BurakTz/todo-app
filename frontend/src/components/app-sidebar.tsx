import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader
} from "@/components/ui/sidebar"
import { Home, BarChart2, Settings } from "lucide-react"
import { Link } from "react-router-dom"

const items = [
    { title: "Ana Sayfa", url: "/home", icon: Home },
    { title: "İstatistikler", url: "/stats", icon: BarChart2 },
    { title: "Ayarlar", url: "/settings", icon: Settings },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-2 ">
                    <img src="/todologo.jpg" alt="Logo" className="h-8 w-8 rounded-md" />
                    <span className="text-2xl font-medium tracking-tighter text-[#111111] text-foreground">
  monotask
</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menü</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}