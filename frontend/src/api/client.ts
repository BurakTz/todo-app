const API_URL = "http://localhost:8080/api"

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })
    if (!res.ok) {
        throw new Error(`API hatası: ${res.status}`)
    }
    if (res.status === 204 || res.headers.get("content-length") === "0") {
        return undefined as T
    }

    const contentType = res.headers.get("content-type") ?? ""
    if (contentType.includes("application/json")) {
        return res.json()
    }
    return res.text() as unknown as T   // JSON değilse, düz metin olarak oku
}