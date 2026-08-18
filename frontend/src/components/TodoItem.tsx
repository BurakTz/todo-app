import type { Todo, Priority, Category } from "@/types/todo"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Dışarıdan (HomePage) gelecek veri ve fonksiyonlar
interface TodoItemProps {
    todo: Todo
    onToggle: (id: string) => void
    onDelete: (id: string) => void
    onEdit: (id: string, text: string, priority?: Priority, category?: Category) => void
    onAddSubtask: (todoId: string, text: string) => void
    onToggleSubtask: (todoId: string, subtaskId: string) => void
    onDeleteSubtask: (todoId: string, subtaskId: string) => void
}
import { X } from "lucide-react"

function TodoItem({
                      todo,
                      onToggle,
                      onDelete,
                      onEdit,
                      onAddSubtask,
                      onToggleSubtask,
                      onDeleteSubtask,
                  }: TodoItemProps) {
    // Detay Dialog'unun açık/kapalı durumu
    const [open, setOpen] = useState(false)

    // Alt görev formundaki geçici (henüz kaydedilmemiş) metin
    const [newSubtaskText, setNewSubtaskText] = useState("")
    const [editText, setEditText] = useState(todo.text)
    const [editPriority, setEditPriority] = useState<Priority | undefined>(todo.priority)
    const [editCategory, setEditCategory] = useState<Category | undefined>(todo.category)

    return (
        // open state'i ile kontrollü Dialog - kartın tamamı tetikleyici
        <Dialog open={open} onOpenChange={setOpen}>
            <Card onClick={() => setOpen(true)} className="cursor-pointer">
                <CardContent className="flex items-center gap-3">
                    {/* Tıklanınca kendi id'siyle onToggle'ı çağırır.
                        stopPropagation: tıklama karta sızıp yanlışlıkla Dialog açmasın diye */}
                    <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => onToggle(todo.id)}
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Tamamlandıysa üstü çizili göster */}
                    <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
                        {todo.text}
                    </span>

                    {/* priority opsiyonel, yoksa hiç render etme */}
                    {todo.priority && (
                        <Badge
                            variant={
                                todo.priority === "high"
                                    ? "destructive"
                                    : todo.priority === "medium"
                                        ? "default"
                                        : "secondary"
                            }
                        >
                            {todo.priority}
                        </Badge>
                    )}

                    {/* category opsiyonel, yoksa hiç render etme */}
                    {todo.category && (
                        <Badge variant="outline">{todo.category}</Badge>
                    )}

                    {/* subtask varsa tamamlanma oranını göster (örn. 4/5) */}
                    {todo.subtasks && todo.subtasks.length > 0 && (
                        <Badge variant="outline">
                            {todo.subtasks.filter((sub) => sub.completed).length}/{todo.subtasks.length}
                        </Badge>
                    )}

                    {/* Sağa yaslı durum/süre rozeti */}
                    {/* Sağa yaslı durum rozeti */}
                    <Badge variant={todo.completed ? "secondary" : "outline"} className="ml-auto">
                        {todo.completed ? "Bitti" : "Aktif"}
                    </Badge>

                    {/* Silme onay penceresi - stopPropagation burada da Dialog'u tetiklemesin diye */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Emin misin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    "{todo.text}" görevi kalıcı olarak silinecek. Bu işlem geri alınamaz.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                                {/* Sadece burada, gerçek "Sil" butonunda onDelete çağrılıyor */}
                                <AlertDialogAction onClick={() => onDelete(todo.id)}>
                                    Sil
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>

            {/* Karta tıklanınca açılan detay penceresi */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Görevi Düzenle</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />

                    <div className="flex gap-2">
                        {(["low", "medium", "high"] as Priority[]).map((p) => (
                            <Button
                                key={p}
                                type="button"
                                variant={editPriority === p ? "default" : "outline"}
                                onClick={() => setEditPriority(p)}
                            >
                                {p}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            key={editCategory ?? "empty"}
                            value={editCategory}
                            onValueChange={(value) => setEditCategory(value as Category)}
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

                        {editCategory && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditCategory(undefined)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <Button
                        type="button"
                        size="sm"
                        className="mx-auto bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                            if (editText.trim() === "") return
                            onEdit(todo.id, editText, editPriority, editCategory)
                        }}
                    >
                        Kaydet
                    </Button>
                </div>

                {/* Mevcut alt görevlerin listesi */}
                <div className="flex flex-col gap-2">
                    {todo.subtasks?.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2">
                            <Checkbox
                                checked={sub.completed}
                                onCheckedChange={() => onToggleSubtask(todo.id, sub.id)}
                            />
                            <span className={sub.completed ? "line-through text-muted-foreground flex-1" : "flex-1"}>
                                {sub.text}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDeleteSubtask(todo.id, sub.id)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Yeni alt görev ekleme formu */}
                <div className="flex gap-2">
                    <Input
                        value={newSubtaskText}
                        onChange={(e) => setNewSubtaskText(e.target.value)}
                        placeholder="Alt görev ekle"
                    />
                    <Button
                        type="button"
                        onClick={() => {
                            if (newSubtaskText.trim() === "") return
                            onAddSubtask(todo.id, newSubtaskText)
                            setNewSubtaskText("")
                        }}
                    >
                        Ekle
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TodoItem