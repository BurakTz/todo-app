import { apiRequest } from "./client"

interface AuthResponse {
    id: number
    email: string
}

export function registerUser(email: string, password: string) {
    return apiRequest<AuthResponse>("/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    })
}

export function loginUser(email: string, password: string): Promise<string> {
    return apiRequest<string>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    })
}