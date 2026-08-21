import { useState } from "react"
import type { Todo, Priority, Category } from "@/types/todo"
import TodoItem from "@/components/TodoItem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger, SheetClose,
} from "@/components/ui/sheet"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"

// tasksApi.ts'teki fonksiyonları içe aktarıyoruz.
// HomePage'in KENDİ İÇİNDE de "addSubtask" gibi isimler kullanacağız (aşağıda),
// isim çakışmasını önlemek için import ederken "as ...Api" diye takma ad veriyoruz
import {
    createTask, updateTask, deleteTask as deleteTaskApi,
    addSubtask as addSubtaskApi, toggleSubtask as toggleSubtaskApi, deleteSubtask as deleteSubtaskApi,
} from "@/api/tasksApi"

// App.tsx'ten gelen prop'ların tipi: todo listesi + onu güncelleyen fonksiyon
interface HomePageProps {
    todos: Todo[]
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

function HomePage({ todos, setTodos }: HomePageProps) {
    // Kategori filtresi - "all" seçiliyse hepsini göster, değilse sadece o kategoriyi
    const [filterCategory, setFilterCategory] = useState<Category | "all">("all")
    const filteredTodos = filterCategory === "all"
        ? todos
        : todos.filter((todo) => todo.category === filterCategory)

    // Yeni görev formundaki geçici (henüz kaydedilmemiş) değerler
    const [newText, setNewText] = useState("")
    const [newPriority, setNewPriority] = useState<Priority>("medium")
    const [newCategory, setNewCategory] = useState<Category | undefined>(undefined)

    // Checkbox'a tıklanınca çalışır: mevcut todo'yu bulur, completed'i tersine çevirip
    // backend'e günceller, backend'in döndürdüğü GÜNCEL veriyle state'i tazeler
    async function toggleTodo(id: string) {
        const todo = todos.find((t) => t.id === id)
        if (!todo) return
        try {
            const updated = await updateTask(id, {
                text: todo.text,
                completed: !todo.completed,
                priority: todo.priority,
                category: todo.category,
            })
            setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
        } catch (err) {
            console.error(err)
        }
    }

    // Silme onaylanınca çalışır: backend'e DELETE isteği atar, başarılıysa
    // local listeden de o todo'yu çıkarır
    async function deleteTodo(id: string) {
        try {
            await deleteTaskApi(id)
            setTodos((prev) => prev.filter((t) => t.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    // TodoItem içindeki "Kaydet" butonuna basılınca çalışır: yeni text/priority/category
    // ile backend'e PUT atar, completed değerini mevcut todo'dan (değişmeden) alır
    async function editTodo(id: string, text: string, priority?: Priority, category?: Category) {
        const todo = todos.find((t) => t.id === id)
        if (!todo) return
        try {
            const updated = await updateTask(id, {
                text,
                completed: todo.completed,
                priority,
                category,
            })
            setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
        } catch (err) {
            console.error(err)
        }
    }

    // Alt görev eklendiğinde çalışır: backend yeni subtask'ı ekleyip GÜNCEL task'ı
    // (tüm subtasks listesiyle birlikte) döndürüyor, o güncel task'ı state'e koyuyoruz
    async function addSubtask(todoId: string, text: string) {
        try {
            const updated = await addSubtaskApi(todoId, text)
            setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)))
        } catch (err) {
            console.error(err)
        }
    }

    // Alt görev checkbox'ına tıklanınca çalışır - aynı mantık: backend'e sor, cevabı state'e koy
    async function toggleSubtask(todoId: string, subtaskId: string) {
        try {
            const updated = await toggleSubtaskApi(todoId, subtaskId)
            setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)))
        } catch (err) {
            console.error(err)
        }
    }

    // Alt görev silinince çalışır - aynı mantık
    async function deleteSubtask(todoId: string, subtaskId: string) {
        try {
            const updated = await deleteSubtaskApi(todoId, subtaskId)
            setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)))
        } catch (err) {
            console.error(err)
        }
    }

    // "Ekle" butonuna basılınca çalışır: boşsa hiçbir şey yapma, doluysa backend'e
    // yeni görev oluşturma isteği at, dönen (id'si atanmış, gerçek) todo'yu listeye ekle,
    // sonra formu sıfırla
    async function addTodo() {
        if (newText.trim() === "") return
        try {
            const newTodo = await createTask({
                text: newText,
                completed: false,
                priority: newPriority,
                category: newCategory,
            })
            setTodos((prev) => [...prev, newTodo])
            setNewText("")
            setNewPriority("medium")
            setNewCategory(undefined)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="max-w-2xl mx-auto pt-10 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">Görevlerim</h1>

                <div className="flex items-center gap-2">
                    {/* Kategori filtresi dropdown'ı */}
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
                                        {/* key={newCategory ?? "empty"}: kategori değişince Select'i
                                            sıfırdan kurup görsel state'in eski değeri göstermesini engelliyoruz */}
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
                                        {/* Kategori seçiliyse yanında bir "temizle" (X) butonu göster */}
                                        {newCategory && (
                                            <Button type="button" variant="ghost" size="icon" onClick={() => setNewCategory(undefined)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <Label>Öncelik</Label>
                                    <div className="flex gap-2">
                                        {/* low/medium/high için 3 buton üretiyoruz, seçili olan dolu görünüyor */}
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
            </div>

            {/* Filtrelenmiş listeyi kart kart basıyoruz.
                key={todo.id} React'in her kartı ayırt etmesi için zorunlu.
                Yukarıda tanımladığımız fonksiyonları (artık backend'e bağlı) TodoItem'a prop olarak veriyoruz */}
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