import { useState } from "react"
import type { Todo, Priority, Category } from "@/types/todo"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"


interface HomePageProps {
    todos: Todo[]
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

function HomePage({ todos, setTodos }: HomePageProps) {

    const [filterCategory, setFilterCategory] = useState<Category | "all">("all")
    const filteredTodos = filterCategory === "all"
        ? todos
        : todos.filter((todo) => todo.category === filterCategory)

    // Yeni görev formundaki geçici (henüz kaydedilmemiş) değerler
    const [newText, setNewText] = useState("")
    const [newPriority, setNewPriority] = useState<Priority>("medium")
    const [newCategory, setNewCategory] = useState<Category | undefined>(undefined)

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

    function editTodo(id: string, text: string, priority?: Priority, category?: Category) {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, text, priority, category } : todo
            )
        )
    }

    function addSubtask(todoId: string, text: string) {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === todoId
                    ? {
                        ...todo,
                        subtasks: [
                            ...(todo.subtasks ?? []),
                            { id: crypto.randomUUID(), text, completed: false },
                        ],
                    }
                    : todo
            )
        )
    }

    function toggleSubtask(todoId: string, subtaskId: string) {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === todoId
                    ? {
                        ...todo,
                        subtasks: todo.subtasks?.map((sub) =>
                            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
                        ),
                    }
                    : todo
            )
        )
    }

    function deleteSubtask(todoId: string, subtaskId: string) {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === todoId
                    ? { ...todo, subtasks: todo.subtasks?.filter((sub) => sub.id !== subtaskId) }
                    : todo
            )
        )
    }

    // Formdaki değerlerden yeni bir todo oluşturup listeye ekler
    function addTodo() {
        if (newText.trim() === "") return // boş görev eklenmesin

        const newTodo: Todo = {
            id: crypto.randomUUID(), // benzersiz id üretir (backend gelince kaldırılacak)
            text: newText,
            completed: false,
            priority: newPriority,
            category: newCategory,
        }

        setTodos((prev) => [...prev, newTodo])

        // formu sıfırla, bir sonraki açılışta boş başlasın
        setNewText("")
        setNewPriority("medium")
        setNewCategory(undefined)
    }

    return (
        <div className="max-w-2xl mx-auto pt-10 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">Görevlerim</h1>

                <div className="flex items-center gap-2">
                    {/* Kategoriye göre filtreleme */}
                    <Select
                        value={filterCategory}
                        onValueChange={(value) => setFilterCategory(value as Category | "all")}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            <SelectItem value="İş">İş</SelectItem>
                            <SelectItem value="Kişisel">Kişisel</SelectItem>
                            <SelectItem value="Sağlık">Sağlık</SelectItem>
                            <SelectItem value="Eğitim">Eğitim</SelectItem>
                        </SelectContent>
                    </Select>

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
                                <div className="grid gap-2">
                                    <Label htmlFor="text">Görev</Label>
                                    <Input
                                        id="text"
                                        value={newText}
                                        onChange={(e) => setNewText(e.target.value)}
                                        placeholder="Örn. Ödevi bitir"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2">
                                        <Select
                                            key={newCategory ?? "empty"}
                                            value={newCategory}
                                            onValueChange={(value) => setNewCategory(value as Category)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Kategori seç (opsiyonel)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="İş">İş</SelectItem>
                                                <SelectItem value="Kişisel">Kişisel</SelectItem>
                                                <SelectItem value="Sağlık">Sağlık</SelectItem>
                                                <SelectItem value="Eğitim">Eğitim</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {newCategory && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setNewCategory(undefined)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
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
                                <SheetClose asChild>
                                    <Button onClick={addTodo}>Ekle</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Her todo için bir kart üretir, key React'in ayırt etmesi için zorunlu */}
            {filteredTodos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                    onAddSubtask={addSubtask}
                    onToggleSubtask={toggleSubtask}
                    onDeleteSubtask={deleteSubtask}
                />
            ))}
        </div>
    )
}

export default HomePage