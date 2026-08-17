import { useState } from "react"
import type { Todo, Priority } from "@/types/todo"
import TodoItem from "@/components/TodoItem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet"

function HomePage() {
    // todos: state'in şu anki değeri, setTodos: değeri güncelleyen fonksiyon
    const [todos, setTodos] = useState<Todo[]>([
        { id: "1", text: "Matematik ödevini bitir", completed: false, duration: 60, priority: "high" },
        { id: "2", text: "Spor salonuna git", completed: true, duration: 45 },
        { id: "3", text: "Proje sunumunu hazırla", completed: false, duration: 120, priority: "medium" },
    ])

    // Yeni görev formundaki geçici (henüz kaydedilmemiş) değerler
    const [newText, setNewText] = useState("")
    const [newPriority, setNewPriority] = useState<Priority>("medium")

    // id'si eşleşen todo'nun completed'ini tersine çevirir, diğerlerine dokunmaz
    function toggleTodo(id: string) {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        )
    }

    // id'si eşleşeni diziden çıkarır
    function deleteTodo(id: string) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id))
    }

    // Formdaki değerlerden yeni bir todo oluşturup listeye ekler
    function addTodo() {
        if (newText.trim() === "") return // boş görev eklenmesin

        const newTodo: Todo = {
            id: crypto.randomUUID(), // benzersiz id üretir (backend gelince kaldırılacak)
            text: newText,
            completed: false,
            priority: newPriority,
        }

        setTodos((prev) => [...prev, newTodo])

        // formu sıfırla, bir sonraki açılışta boş başlasın
        setNewText("")
        setNewPriority("medium")
    }

    return (
        <div className="max-w-2xl mx-auto pt-10 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">Görevlerim</h1>

                {/* Yeni görev ekleme paneli - sağdan kayan Sheet */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>Yeni Görev</Button>
                    </SheetTrigger>

                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Yeni Görev Ekle</SheetTitle>
                        </SheetHeader>

                        <div className="flex flex-col gap-4 px-4">
                            {/* Controlled input: değeri tamamen newText state'inden geliyor */}
                            <div className="grid gap-2">
                                <Label htmlFor="text">Görev</Label>
                                <Input
                                    id="text"
                                    value={newText}
                                    onChange={(e) => setNewText(e.target.value)}
                                    placeholder="Örn. Ödevi bitir"
                                />
                            </div>

                            {/* Üç öncelik seçeneği butonlarla üretiliyor, seçili olan dolu görünür */}
                            <div className="grid gap-2">
                                <Label>Öncelik</Label>
                                <div className="flex gap-2">
                                    {(["low", "medium", "high"] as Priority[]).map((p) => (
                                        <Button
                                            key={p}
                                            type="button"
                                            variant={newPriority === p ? "default" : "outline"}
                                            onClick={() => setNewPriority(p)}
                                        >
                                            {p}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <SheetFooter>
                            {/* SheetClose sayesinde tıklanınca hem addTodo çalışır hem panel kapanır */}
                            <SheetClose asChild>
                                <Button onClick={addTodo}>Ekle</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Her todo için bir kart üretir, key React'in ayırt etmesi için zorunlu */}
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                />
            ))}
        </div>
    )
}

export default HomePage