import axios from "axios";

const isServer = typeof window === "undefined"

const api = axios.create({
 baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + "/api",
    
  headers : {"Content-Type" : "application/json"},                   
  withCredentials: true,
 
});

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any) => {
  failedQueue.forEach(p => p.reject(error))
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Access token expiré
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((_, reject) => {
          failedQueue.push({ reject })
        })
      }

      isRefreshing = true

      try {
        // 🔁 Appel refresh (cookie refreshToken auto-envoyé)
        await api.post("/auth/refresh")

        isRefreshing = false
        return api(originalRequest) // 🔁 rejouer la requête
      } catch (err) {
        processQueue(err)
        isRefreshing = false

        // refresh échoué → logout forcé
        window.location.href = "/admin/auth/login"
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default api;
