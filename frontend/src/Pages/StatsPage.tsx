import type { Todo } from "@/types/todo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface StatsPageProps {
    todos: Todo[]
}

function StatsPage({ todos }: StatsPageProps) {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    const remaining = total - completed
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)

    return (
        <div className="max-w-2xl mx-auto pt-10 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">İstatistikler</h1>

            <div className="grid grid-cols-3 gap-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{total}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">Toplam</CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{completed}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">Tamamlanan</CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{remaining}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">Kalan</CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tamamlanma Oranı</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                    <Progress value={completionRate} className="flex-1" />
                    <span className="text-sm font-medium">%{completionRate}</span>
                </CardContent>
            </Card>
        </div>
    )
}

export default StatsPage