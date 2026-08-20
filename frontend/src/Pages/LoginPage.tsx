
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

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
import { loginUser } from "@/api/authApi"
import { useAuth } from "@/context/AuthContext"

function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleLogin() {
        setError("")
        try {
            const token = await loginUser(email, password)
            login(token)
            navigate("/home")
        } catch (err) {
            setError("Email veya şifre yanlış")
        }
    }




    return(
        <div className="flex justify-center pt-25">
        <Card className="w-full max-w-sm">
            <CardHeader className="flex flex-col items-center">
                <img src="/todologo.jpg" alt="Logo" className="h-64 w-64 rounded-md mb-2" />
                <CardTitle>Giriş Yapın</CardTitle>
                <CardDescription>
                    Mailinizi ve şifrenizi giriniz.
                </CardDescription>
            </CardHeader>
            <CardContent>

                    <div className="flex flex-col gap-8">
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
                            <div className="flex items-center">
                                <Label htmlFor="password">Şifre</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >

                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>

            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="button" className="w-full" onClick={handleLogin}>
                    Giriş Yap
                </Button>
                <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => navigate("/register")}
                >
                    Hesabın yok mu? Kayıt ol
                </Button>
            </CardFooter>
        </Card>
        </div>
    )
}
export default LoginPage