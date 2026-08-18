
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function LoginPage() {
    const navigate = useNavigate()
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
                <form>
                    <div className="flex flex-col gap-8">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
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
                            <Input id="password" type="password" required />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="button" className="w-full" onClick={() => navigate("/home")}>
                    Giriş Yap
                </Button>
            </CardFooter>
        </Card>
        </div>
    )
}
export default LoginPage