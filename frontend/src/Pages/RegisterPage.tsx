import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function RegisterPage() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    function handleRegister() {
        if (password !== confirmPassword) {
            alert("Şifreler eşleşmiyor")
            return
        }
        // Backend hazır olunca burada gerçek API çağrısı olacak
        navigate("/login")
    }

    return (
        <div className="flex justify-center pt-25">
            <Card className="w-full max-w-sm">
                <CardHeader className="flex flex-col items-center">
                    <img src="/todologo.jpg" alt="Logo" className="h-16 w-16 rounded-md mb-2" />
                    <CardTitle>Kayıt Ol</CardTitle>
                    <CardDescription>
                        Yeni bir hesap oluşturun.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Şifre (Tekrar)</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="button" className="w-full" onClick={handleRegister}>
                        Kayıt Ol
                    </Button>
                    <Button
                        type="button"
                        variant="link"
                        className="w-full"
                        onClick={() => navigate("/login")}
                    >
                        Zaten hesabın var mı? Giriş yap
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default RegisterPage