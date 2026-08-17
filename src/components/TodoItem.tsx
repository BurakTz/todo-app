import type { Todo } from "@/types/todo"
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

// Dışarıdan (HomePage) gelecek veri ve fonksiyonlar
interface TodoItemProps {
    todo: Todo
    onToggle: (id: string) => void
    onDelete: (id: string) => void
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    // Detay Dialog'unun açık/kapalı durumu
    const [open, setOpen] = useState(false)

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

                    {/* Sağa yaslı durum/süre rozeti */}
                    <Badge variant={todo.completed ? "secondary" : "outline"} className="ml-auto">
                        {todo.completed ? "Bitti" : `${todo.duration ?? "-"} dk`}
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
                    <DialogTitle>{todo.text}</DialogTitle>
                </DialogHeader>

                {/* alt görev listesi buraya gelecek */}
            </DialogContent>
        </Dialog>
    )
}

export default TodoItem